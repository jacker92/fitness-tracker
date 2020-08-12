import React from 'react';
import { AccountSidebar } from '../AccountSidebar/AccountSidebar';
import { AccountPage } from '../Styles/AccountPage';

const DietSettings = () => (
    <AccountPage>
        <div className="sidebar">
            <AccountSidebar activePage="diet" />
        </div>
        <div className="content">
            <h1>Diet Settings</h1>
        </div>
    </AccountPage>
);

export { DietSettings };
