import React, { useState } from 'react';
import PropTypes from 'prop-types';
import jwt from 'jsonwebtoken';
// eslint-disable-next-line no-unused-vars
import { JwtToken } from '../../lib/JwtToken';
import { AppContext } from '../AppContext/AppContext';

const MainApp = (props: { children: any; }) => {
    const token = window.localStorage.getItem('__fittracker_token__');

    let user = null;
    if (token !== null) {
        jwt.verify(token, process.env.REACT_APP_FT_JWT_SECRET, (err, decoded) => {
            if (err) {
                user = null;
                return;
            }

            const { id, name, email } = decoded as JwtToken;
            user = { id, name, email };
        });
    }

    // eslint-disable-next-line no-unused-vars
    const [currentUser, setCurrentUser] = useState(user);

    const { children } = props;

    const loginUser = (userToken: any) => {
        window.localStorage.setItem('__fittracker_token__', userToken);

        jwt.verify(token, process.env.REACT_APP_FT_JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log({ err });
                setCurrentUser(null);
                return;
            }

            const { id, name, email } = decoded as JwtToken;
            const newUser = { id, name, email };
            setCurrentUser(newUser);
        });
    };

    const logoutUser = () => {
        window.localStorage.removeItem('__fittracker_token__');
        setCurrentUser(null);
    };

    return (
        <AppContext.Provider value={{ currentUser, loginUser, logoutUser }}>
            {children}
        </AppContext.Provider>
    );
};

MainApp.propTypes = {
    children: PropTypes.node.isRequired,
};

export { MainApp };
