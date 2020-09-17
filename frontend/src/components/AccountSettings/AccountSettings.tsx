import React from 'react';
import { AuthGateway } from '../AuthGateway/AuthGateway';
import { AccountSidebar } from '../AccountSidebar/AccountSidebar';
import { ChangePasswordForm } from '../ChangePasswordForm/ChangePasswordForm';

import '../../styles/account.css';

const AccountSettings = () => (
    <AuthGateway redirectUrl="/account/settings">
        <div className="account-page">
            <div className="sidebar">
                <AccountSidebar activePage="account" />
            </div>
            <div className="content">
                <h1>Account Settings</h1>
                <ChangePasswordForm />
            </div>
        </div>
    </AuthGateway>
);

export { AccountSettings };
