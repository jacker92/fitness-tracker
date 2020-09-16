import React, { useContext, useRef } from 'react';
import styled from 'styled-components';
import { useClickOutside } from '../../lib/useClickOutside';
import { AppContext } from '../AppContext/AppContext';

const UserMenu = styled.ul`
    list-style-type: none;

    li {
        button.link-button {
            border:none;
            background-color: transparent;
            font-size: 1rem;
            color: hsl(0,0%,100%);
            text-decoration: none;
            cursor:pointer;
        }

        ul.child-list {
            display: none;
            background: hsl(240, 20%, 98%);
            position: absolute;
            z-index: 12;
            top: 60px;
            right: 15px;
            padding: 0;
            width: 200px;
            box-shadow: 0 12px 24px 0 hsla(0, 0%, 0%, 0.2);
            height: auto;
            float:none;
            text-align: left;

            li {
                display: block;
                float: none;
                margin: 0;
                padding: 10px;
                line-height: 1;

                a, a:visited, a:active {
                    display: block;
                    color: hsl(0, 0%, 19%);
                    float: none;
                    border: none;
                    line-height: 1;

                }

                button.link-button {
                    border:none;
                    background-color: transparent;
                    font-size: 1rem;
                    color: hsl(0, 0%, 19%);
                    text-decoration: none;
                    cursor:pointer;
                    align-items: normal;
                    border-style: none;
                    box-sizing: content-box;
                    display: inline;
                    font: inherit;
                    padding: 0;
                    perspective-origin: 0 0;
                    text-align: start;
                    text-decoration: none;
                    transform-origin: 0 0;
                    -moz-appearance: none;
                    -webkit-logical-height: 1em; /* Chrome ignores auto, so we have to use this hack to set the correct height  */
                    -webkit-logical-width: auto; /* Chrome ignores auto, but here for completeness */
                }

                &:hover {
                    background: hsl(0, 0%, 19%);

                    a, button.link-button {
                        color: hsl(0,0%,100%);
                    }
                }
            }
        }
    }
`;

const UserHeaderMenu = () => {
    const {
        currentUser, logoutUser, userMenuVisible, toggleUserMenu,
    } = useContext(AppContext);

    const userNav = useRef(null);
    useClickOutside(userNav, userMenuVisible, toggleUserMenu);

    return (
        <UserMenu ref={userNav}>
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
        </UserMenu>
    );
};

export { UserHeaderMenu };
