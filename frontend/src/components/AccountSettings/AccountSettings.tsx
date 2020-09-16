import React from 'react';
import { AccountSidebar } from '../AccountSidebar/AccountSidebar';
import { AccountPage } from '../Styles/AccountPage';
import { ChangePasswordForm } from '../ChangePasswordForm/ChangePasswordForm';

const AccountSettings = () => (
    <AccountPage>
        <div className="sidebar">
            <AccountSidebar activePage="account" />
        </div>
        <div className="content">
            <h1>Account Settings</h1>
            <ChangePasswordForm />
        </div>
    </AccountPage>
);

export { AccountSettings };
