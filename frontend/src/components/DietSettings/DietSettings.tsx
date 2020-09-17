import React from 'react';
import { AuthGateway } from '../AuthGateway/AuthGateway';
import { AccountSidebar } from '../AccountSidebar/AccountSidebar';
import { EditDietSettingsForm } from '../EditDietSettingsForm/EditDietSettingsForm';

import '../../styles/account.css';

const DietSettings: React.FC = () => (
    <AuthGateway redirectUrl="/account/diet">
        <div className="account-page">
            <div className="sidebar">
                <AccountSidebar activePage="diet" />
            </div>
            <div className="content">
                <h1>Diet Settings</h1>
                <EditDietSettingsForm />
            </div>
        </div>
    </AuthGateway>
);

export { DietSettings };
