import React from 'react';
import PropTypes from 'prop-types';

import './AccountSidebar.css';

const AccountSidebar = (props: { activePage: string }) => {
    const { activePage } = props;

    return (
        <ul className="admin-sidebar">
            <li className={activePage === 'profile' ? 'active' : ''}>
                {activePage === 'profile' ? (
                    <>Profile</>
                ) : (
                    <a href="/account/profile">Profile</a>
                )}
            </li>
            <li className={activePage === 'account' ? 'active' : ''}>
                {activePage === 'account' ? (
                    <>Account Settings</>
                ) : (
                    <a href="/account/settings">Account Settings</a>
                )}
            </li>
            <li className={activePage === 'activity' ? 'active' : ''}>
                {activePage === 'activity' ? (
                    <>Activity Settings</>
                ) : (
                    <a href="/account/activity">Activity Settings</a>
                )}
            </li>
            <li className={activePage === 'diet' ? 'active' : ''}>
                {activePage === 'diet' ? (
                    <>Diet Settings</>
                ) : (
                    <a href="/account/diet">Diet Settings</a>
                )}
            </li>
            <li className={activePage === 'metrics' ? 'active' : ''}>
                {activePage === 'metrics' ? (
                    <>Metrics</>
                ) : (
                    <a href="/account/metrics">Metrics</a>
                )}
            </li>
            <li className={activePage === 'custom-activities' ? 'active' : ''}>
                {activePage === 'custom-activities' ? (
                    <>Custom Activities</>
                ) : (
                    <a href="/account/custom-activities">Custom Activities</a>
                )}
            </li>
            <li className={activePage === 'gear' ? 'active' : ''}>
                {activePage === 'gear' ? (
                    <>Gear</>
                ) : (
                    <a href="/account/gear">Gear</a>
                )}
            </li>
            <li className={activePage === 'downloaddata' ? 'active' : ''}>
                {activePage === 'downloaddata' ? (
                    <>Download Your Data</>
                ) : (
                    <a href="/account/download">Download Your Data</a>
                )}
            </li>
            <li className={activePage === 'deleteaccount' ? 'active' : ''}>
                {activePage === 'deleteaccount' ? (
                    <>Delete Account</>
                ) : (
                    <a href="/account/delete-account">Delete Account</a>
                )}
            </li>
        </ul>
    );
};

AccountSidebar.propTypes = {
    activePage: PropTypes.string.isRequired,
};

export { AccountSidebar };
