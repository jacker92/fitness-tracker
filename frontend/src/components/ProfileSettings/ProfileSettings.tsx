import React from 'react';
import { AuthGateway } from '../AuthGateway/AuthGateway';
import { AccountSidebar } from '../AccountSidebar/AccountSidebar';
import { AccountPage } from '../Styles/AccountPage';
import { EditProfileForm } from '../EditProfileForm/EditProfileForm';

const ProfileSettings = () => (
    <AuthGateway redirectUrl="/account/profile">
        <AccountPage>
            <div className="sidebar">
                <AccountSidebar activePage="profile" />
            </div>
            <div className="content">
                <h1>Edit Profile</h1>
                <EditProfileForm />
            </div>
        </AccountPage>
    </AuthGateway>
);

export { ProfileSettings };
