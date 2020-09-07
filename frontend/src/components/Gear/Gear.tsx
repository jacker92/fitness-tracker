import React from 'react';
import { AccountSidebar } from '../AccountSidebar/AccountSidebar';
import { AccountPage } from '../Styles/AccountPage';
import { GearGrid } from '../GearGrid/GearGrid';

const Gear = () => (
    <AccountPage>
        <div className="sidebar">
            <AccountSidebar activePage="gear" />
        </div>
        <div className="content">
            <h1>Gear</h1>
            <GearGrid />
        </div>
    </AccountPage>
);

export { Gear };
