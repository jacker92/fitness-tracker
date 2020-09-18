import React from 'react';
import { AuthGateway } from '../AuthGateway/AuthGateway';
import { AccountSidebar } from '../AccountSidebar/AccountSidebar';
import { MetricsGrid } from '../MetricsGrid/MetricsGrid';

import '../../styles/account.css';

const Metrics: React.FC = () => (
    <AuthGateway redirectUrl="/account/metrics">
        <div className="account-page">
            <div className="sidebar">
                <AccountSidebar activePage="metrics" />
            </div>
            <div className="content">
                <h1>Metrics</h1>
                <MetricsGrid />
            </div>
        </div>
    </AuthGateway>
);

export { Metrics };
