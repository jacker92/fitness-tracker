import React from 'react';
import { AccountSidebar } from '../AccountSidebar/AccountSidebar';
import { AccountPage } from '../Styles/AccountPage';
import { MetricsGrid } from '../MetricsGrid/MetricsGrid';

const Metrics = () => (
    <AccountPage>
        <div className="sidebar">
            <AccountSidebar activePage="metrics" />
        </div>
        <div className="content">
            <h1>Metrics</h1>
            <MetricsGrid />
        </div>
    </AccountPage>
);

export { Metrics };
