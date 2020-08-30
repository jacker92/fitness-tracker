import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SidebarList = styled.ul`
    list-style-type: none;
    margin:0 0 0 0;
    padding:25px 0 0 0;

    li {
        padding: 12px 0 12px 10px;
        font-size: 1.1rem;
        border-bottom: 1px solid hsl(0, 0%, 19%);

        &.active {
            font-weight: bold;
            background: hsl(0, 0%, 19%);
            color: hsl(0, 0%, 100%);
        }

        &:hover {
            background: hsl(0, 0%, 19%);
            color: hsl(0, 0%, 100%);

            a {
                color: hsl(0, 0%, 100%);
            }
        }

        a {
            color: hsl(0, 0%, 19%);
            text-decoration: none;
        }

        &:first-child {
            border-top: 1px solid hsl(0, 0%, 19%);
        }
    }
`;

const AccountSidebar = (props: { activePage: string }) => {
    const { activePage } = props;

    return (
        <SidebarList>
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
            <li className={activePage === 'activities' ? 'active' : ''}>
                {activePage === 'activities' ? (
                    <>Custom Activities</>
                ) : (
                    <a href="/account/activities">Custom Activities</a>
                )}
            </li>
            <li className={activePage === 'gear' ? 'active' : ''}>
                {activePage === 'activitgearies' ? (
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
        </SidebarList>
    );
};

AccountSidebar.propTypes = {
    activePage: PropTypes.string.isRequired,
};

export { AccountSidebar };
