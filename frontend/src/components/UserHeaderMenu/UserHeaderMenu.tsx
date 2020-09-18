import React, { useContext, useRef } from 'react';
import { useClickOutside } from '../../lib/useClickOutside';
import { AppContext } from '../AppContext/AppContext';

const UserHeaderMenu: React.FC = () => {
    const {
        currentUser, logoutUser, userMenuVisible, toggleUserMenu,
    } = useContext(AppContext);

    const userNav = useRef(null);
    useClickOutside(userNav, userMenuVisible, toggleUserMenu);

    return (
        <ul className="user-menu" ref={userNav}>
            <li>
                <button
                    type="button"
                    className="link-button"
                    onClick={(e) => {
                        e.preventDefault();
                        toggleUserMenu();
                    }}
                    onKeyDown={(e) => {
                        e.preventDefault();
                        if (e.keyCode === 13 || e.keyCode === 32) {
                            toggleUserMenu();
                        }
                    }}
                >
                    {`${currentUser.name} `}
                    {' '}
                    <i className="arrow down" />
                </button>
                <ul className="child-list" style={userMenuVisible ? { display: 'block' } : { display: 'none' }}>
                    <li>
                        <a
                            href="/account/profile"
                            onClick={() => {
                                toggleUserMenu();
                            }}
                        >
                            Account
                        </a>
                    </li>

                    <li>
                        <button type="button" onClick={logoutUser} className="link-button">Logout</button>
                    </li>
                </ul>
            </li>
        </ul>
    );
};

export { UserHeaderMenu };
