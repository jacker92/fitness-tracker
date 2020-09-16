import React from 'react';
import { AccountSidebar } from '../AccountSidebar/AccountSidebar';
import { AccountPage } from '../Styles/AccountPage';
import { CustomActivitiesGrid } from '../CustomActivitiesGrid/CustomActivitiesGrid';

const CustomActivities = () => (
    <AccountPage>
        <div className="sidebar">
            <AccountSidebar activePage="custom-activities" />
        </div>
        <div className="content">
            <h1>Custom Activities</h1>
            <CustomActivitiesGrid />
        </div>
    </AccountPage>
);

export { CustomActivities };
