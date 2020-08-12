import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SidebarList = styled.ul`
    list-style-type: none;
    margin-top:50px;

    li {
        margin: 12px 0;
        font-size: 1.1rem;

        &.active {
            font-weight: bold;
            color: hsl(0, 0%, 0%);
        }

        a {
            color: hsl(0, 0%, 19%);
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
            <li className={activePage === 'account' ? 'active' : ''}>
                {activePage === 'account' ? (
                    <>Account Settings</>
                ) : (
                    <a href="/account/settings">Account Settings</a>
                )}
            </li>
        </SidebarList>
    );
};

AccountSidebar.propTypes = {
    activePage: PropTypes.string.isRequired,
};

export { AccountSidebar };
