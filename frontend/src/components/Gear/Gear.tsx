import React from 'react';
import { AuthGateway } from '../AuthGateway/AuthGateway';
import { AccountSidebar } from '../AccountSidebar/AccountSidebar';
import { GearGrid } from '../GearGrid/GearGrid';

import '../../styles/account.css';

const Gear: React.FC = () => (
    <AuthGateway redirectUrl="/account/gear">
        <div className="account-page">
            <div className="sidebar">
                <AccountSidebar activePage="gear" />
            </div>
            <div className="content">
                <h1>Gear</h1>
                <GearGrid />
            </div>
        </div>
    </AuthGateway>
);

export { Gear };
