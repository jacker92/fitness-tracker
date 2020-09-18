import React, { useContext } from 'react';
import { AppContext } from '../AppContext/AppContext';
import { UserHeaderMenu } from '../UserHeaderMenu/UserHeaderMenu';

const Header: React.FC = () => {
    const { currentUser } = useContext(AppContext);

    return (
        <header>
            <div className="title">Fitness Tracker</div>
            <div className="menu">
                {currentUser !== null && (
                    <UserHeaderMenu />
                )}
                {currentUser === null && (
                    <ul>
                        <li><a href="/login">Login</a></li>
                        <li><a href="/register">Register</a></li>

                    </ul>
                )}
            </div>
        </header>
    );
};

export { Header };
