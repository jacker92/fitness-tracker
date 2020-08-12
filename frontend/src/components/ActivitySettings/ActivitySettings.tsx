import React from 'react';
import { AccountSidebar } from '../AccountSidebar/AccountSidebar';
import { AccountPage } from '../Styles/AccountPage';

const ActivitySettings = () => (
    <AccountPage>
        <div className="sidebar">
            <AccountSidebar activePage="activity" />
        </div>
        <div className="content">
            <h1>Activity Settings</h1>
        </div>
    </AccountPage>
);

export { ActivitySettings };
