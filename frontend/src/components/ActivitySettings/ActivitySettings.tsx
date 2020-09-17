import React from 'react';
import { AuthGateway } from '../AuthGateway/AuthGateway';
import { AccountSidebar } from '../AccountSidebar/AccountSidebar';
import { EditActivitySettingsForm } from '../EditActivitySettingsForm/EditActivitySettingsForm';

import '../../styles/account.css';

const ActivitySettings = () => (
    <AuthGateway redirectUrl="/account/activity">
        <div className="account-page">
            <div className="sidebar">
                <AccountSidebar activePage="activity" />
            </div>
            <div className="content">
                <h1>Activity Settings</h1>
                <EditActivitySettingsForm />
            </div>
        </div>
    </AuthGateway>
);

export { ActivitySettings };
