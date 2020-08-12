import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext/AppContext';

const StyledHeader = styled.header`
background-color: hsl(0, 0%, 19%);
height: 60px;
line-height: 60px;
color: hsl(0,0%,100%);

.title {
    font-size: 24px;
    margin: 0 15px;
    float: left;
}

.menu {
    float: right;
    text-align: right;

    ul {
        margin: 0;
        padding: 0;

        li {
            display: inline;
            padding: 0 15px;
            list-style-type: none;

            a, a:visited, a:active {
                color: hsl(0,0%,100%);
                text-decoration: none;
            }

            button.link-button {
                border:none;
                background: transparent;
                font-size: 1rem;
                color: hsl(0,0%,100%);
                text-decoration: none;
                cursor:pointer;
            }
        }
    }
}
`;

const Header = () => {
    const { currentUser, logoutUser } = useContext(AppContext);

    return (
        <StyledHeader>
            <div className="title">Fitness Tracker</div>
            <div className="menu">
                <ul>
                    {currentUser !== null && (
                        <>
                            <li>
                                {currentUser.name}
                            </li>
                            <li><button type="button" onClick={logoutUser} className="link-button">Logout</button></li>
                        </>
                    )}
                    {currentUser === null && (
                        <>
                            <li><a href="/login">Login</a></li>
                            <li><a href="/register">Register</a></li>

                        </>
                    )}
                </ul>
            </div>
        </StyledHeader>
    );
};

export { Header };