import React from 'react';
import { Route } from 'react-router';
import { ApplicationPaths, LoginActions, LogoutActions } from './ApiAuthorizationConstants';

function loginAction(name: string) {
  return (
    <div>
      Login
      {' '}
      {name}
    </div>
  );
  // return (<Login action={name} />);
}

function logoutAction(name: string) {
  return (
    <div>
      Logged Out
      {' '}
      {name}
    </div>
  );
  // return (<Logout action={name} />);
}

const AuthorizationRoutes = () => (
  <>
    <Route path={ApplicationPaths.Login} render={() => loginAction(LoginActions.Login)} />
    <Route path={ApplicationPaths.LoginFailed} render={() => loginAction(LoginActions.LoginFailed)} />
    <Route path={ApplicationPaths.LoginCallback} render={() => loginAction(LoginActions.LoginCallback)} />
    <Route path={ApplicationPaths.Profile} render={() => loginAction(LoginActions.Profile)} />
    <Route path={ApplicationPaths.Register} render={() => loginAction(LoginActions.Register)} />
    <Route path={ApplicationPaths.LogOut} render={() => logoutAction(LogoutActions.Logout)} />
    <Route path={ApplicationPaths.LogOutCallback} render={() => logoutAction(LogoutActions.LogoutCallback)} />
    <Route path={ApplicationPaths.LoggedOut} render={() => logoutAction(LogoutActions.LoggedOut)} />
  </>
);

export { AuthorizationRoutes };
