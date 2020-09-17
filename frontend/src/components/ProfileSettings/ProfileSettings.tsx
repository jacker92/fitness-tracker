import React from 'react';
import { AuthGateway } from '../AuthGateway/AuthGateway';
import { AccountSidebar } from '../AccountSidebar/AccountSidebar';
import { EditProfileForm } from '../EditProfileForm/EditProfileForm';

import '../../styles/account.css';

const ProfileSettings: React.FC = () => (
    <AuthGateway redirectUrl="/account/profile">
        <div className="account-page">
            <div className="sidebar">
                <AccountSidebar activePage="profile" />
            </div>
            <div className="content">
                <h1>Edit Profile</h1>
                <EditProfileForm />
            </div>
        </div>
    </AuthGateway>
);

export { ProfileSettings };
