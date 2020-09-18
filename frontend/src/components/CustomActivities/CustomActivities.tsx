import React from 'react';
import { AuthGateway } from '../AuthGateway/AuthGateway';
import { AccountSidebar } from '../AccountSidebar/AccountSidebar';
import { CustomActivitiesGrid } from '../CustomActivitiesGrid/CustomActivitiesGrid';

import '../../styles/account.css';

const CustomActivities: React.FC = () => (
    <AuthGateway redirectUrl="/account/custom-activities">
        <div className="account-page">
            <div className="sidebar">
                <AccountSidebar activePage="custom-activities" />
            </div>
            <div className="content">
                <h1>Custom Activities</h1>
                <CustomActivitiesGrid />
            </div>
        </div>
    </AuthGateway>
);

export { CustomActivities };
