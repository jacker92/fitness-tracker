import React from 'react';
import { AccountSidebar } from '../AccountSidebar/AccountSidebar';
import { AccountPage } from '../Styles/AccountPage';
import { EditDietSettingsForm } from '../EditDietSettingsForm/EditDietSettingsForm';

const DietSettings = () => (
    <AccountPage>
        <div className="sidebar">
            <AccountSidebar activePage="diet" />
        </div>
        <div className="content">
            <h1>Diet Settings</h1>
            <EditDietSettingsForm />
        </div>
    </AccountPage>
);

export { DietSettings };
