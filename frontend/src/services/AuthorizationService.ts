import { UserManager, WebStorageStateStore } from 'oidc-client';
import { ApplicationPaths, ApplicationName } from '../lib/ApiAuthorizationConstants';

const AuthenticationResultStatus = {
  Redirect: 'redirect',
  Success: 'success',
  Fail: 'fail',
};

class AuthorizationService {
  callbacks: { callback: any, subscription: any }[] = [];

  nextSubscriptionId: number = 0;

  user: { profile: any; } = null;

  isUserAuthenticated: boolean = false;

  popUpDisabled: boolean = true;

  userManager: UserManager = null;

  async isAuthenticated() {
    const user = await this.getUser();
    return !!user;
  }

  async getUser() {
    if (this.user && this.user.profile) {
      return this.user.profile;
    }

    await this.ensureUserManagerInitialized();
    const user = await this.userManager.getUser();
    return user && user.profile;
  }

  async getAccessToken() {
    await this.ensureUserManagerInitialized();
    const user = await this.userManager.getUser();
    return user && user.access_token;
  }

  // We try to authenticate the user in three different ways:
  // 1) We try to see if we can authenticate the user silently. This happens
  //    when the user is already logged in on the IdP and is done using a hidden iframe
  //    on the client.
  // 2) We try to authenticate the user using a PopUp Window. This might fail if there is a
  //    Pop-Up blocker or the user has disabled PopUps.
  // 3) If the two methods above fail, we redirect the browser to the IdP to perform a traditional
  //    redirect flow.
  async signIn(state: any) {
    await this.ensureUserManagerInitialized();
    try {
      const silentUser = await this.userManager.signinSilent(this.createArguments({}));
      this.updateState(silentUser);
      return this.success(state);
    } catch (silentError) {
      // User might not be authenticated, fallback to popup authentication
      console.log('Silent authentication error: ', silentError);

      try {
        if (this.popUpDisabled) {
          throw new Error('Popup disabled. Change \'AuthorizeService.js:AuthorizeService.popUpDisabled\' to false to enable it.');
        }

        const popUpUser = await this.userManager.signinPopup(this.createArguments({}));
        this.updateState(popUpUser);
        return this.success(state);
      } catch (popUpError) {
        if (popUpError.message === 'Popup window closed') {
          // The user explicitly cancelled the login action by closing an opened popup.
          return this.error('The user closed the window.');
        } if (!this.popUpDisabled) {
          console.log('Popup authentication error: ', popUpError);
        }

        // PopUps might be blocked by the user, fallback to redirect
        try {
          await this.userManager.signinRedirect(this.createArguments(state));
          return this.redirect();
        } catch (redirectError) {
          console.log('Redirect authentication error: ', redirectError);
          return this.error(redirectError);
        }
      }
    }
  }

  async completeSignIn(url: any) {
    try {
      await this.ensureUserManagerInitialized();
      const user = await this.userManager.signinCallback(url);
      this.updateState(user);
      return this.success(user && user.state);
    } catch (error) {
      console.log('There was an error signing in: ', error);
      return this.error('There was an error signing in.');
    }
  }

  // We try to sign out the user in two different ways:
  // 1) We try to do a sign-out using a PopUp Window. This might fail if there is a
  //    Pop-Up blocker or the user has disabled PopUps.
  // 2) If the method above fails, we redirect the browser to the IdP to perform a traditional
  //    post logout redirect flow.
  async signOut(state: any) {
    await this.ensureUserManagerInitialized();
    try {
      if (this.popUpDisabled) {
        throw new Error('Popup disabled. Change \'AuthorizeService.js:AuthorizeService.popUpDisabled\' to false to enable it.');
      }

      await this.userManager.signoutPopup(this.createArguments({}));
      this.updateState(undefined);
      return this.success(state);
    } catch (popupSignOutError) {
      console.log('Popup signout error: ', popupSignOutError);
      try {
        await this.userManager.signoutRedirect(this.createArguments(state));
        return this.redirect();
      } catch (redirectSignOutError) {
        console.log('Redirect signout error: ', redirectSignOutError);
        return this.error(redirectSignOutError);
      }
    }
  }

  async completeSignOut(url: any) {
    await this.ensureUserManagerInitialized();
    try {
      const response = await this.userManager.signoutCallback(url);
      this.updateState(null);
      return this.success(response);// && response.data);
    } catch (error) {
      console.log(`There was an error trying to log out '${error}'.`);
      return this.error(error);
    }
  }

  updateState(user: any) {
    this.user = user;
    this.isUserAuthenticated = !!this.user;
    this.notifySubscribers();
  }

  subscribe(callback: any) {
    this.callbacks.push({ callback, subscription: this.nextSubscriptionId += 1 });
    return this.nextSubscriptionId - 1;
  }

  unsubscribe(subscriptionId: any) {
    const subscriptionIndex = this.callbacks
      .map((element, index) => (element.subscription === subscriptionId ? { found: true, index } : { found: false }))
      .filter((element) => element.found === true);
    if (subscriptionIndex.length !== 1) {
      throw new Error(`Found an invalid number of subscriptions ${subscriptionIndex.length}`);
    }

    this.callbacks.splice(subscriptionIndex[0].index, 1);
  }

  notifySubscribers() {
    for (let i = 0; i < this.callbacks.length; i += 1) {
      const { callback } = this.callbacks[i];
      callback();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  createArguments(state: any) {
    return { useReplaceToNavigate: true, data: state };
  }

  // eslint-disable-next-line class-methods-use-this
  error(message: string) {
    return { status: AuthenticationResultStatus.Fail, message };
  }

  // eslint-disable-next-line class-methods-use-this
  success(state: any) {
    return { status: AuthenticationResultStatus.Success, state };
  }

  // eslint-disable-next-line class-methods-use-this
  redirect() {
    return { status: AuthenticationResultStatus.Redirect };
  }

  async ensureUserManagerInitialized() {
    if (this.userManager !== undefined && this.userManager !== null) {
      return;
    }

    const response = await fetch(ApplicationPaths.ApiAuthorizationClientConfigurationUrl);
    if (!response.ok) {
      throw new Error(`Could not load settings for '${ApplicationName}'`);
    }

    const settings = await response.json();
    settings.automaticSilentRenew = true;
    settings.includeIdTokenInSilentRenew = true;
    settings.userStore = new WebStorageStateStore({
      prefix: ApplicationName,
    });

    this.userManager = new UserManager(settings);

    this.userManager.events.addUserSignedOut(async () => {
      await this.userManager.removeUser();
      this.updateState(undefined);
    });
  }

  // eslint-disable-next-line no-use-before-define
  static get instance() { return authService; }
}

const authService = new AuthorizationService();

export { AuthorizationService, authService, AuthenticationResultStatus };
