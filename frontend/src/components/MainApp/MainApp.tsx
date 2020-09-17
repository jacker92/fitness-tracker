import React, { useState } from 'react';
import PropTypes from 'prop-types';
import jwt from 'jsonwebtoken';
import { JwtToken } from '../../types/JwtToken';
import { AppContext } from '../AppContext/AppContext';
import { Overlay } from '../Overlay/Overlay';

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

    const [currentUser, setCurrentUser] = useState(user);
    const [userMenuVisible, setUserMenuVisible] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [showOverlaySpinner, setShowOverlaySpinner] = useState(false);

    const { children } = props;

    const loginUser = (userToken: any) => {
        window.localStorage.setItem('__fittracker_token__', userToken);

        jwt.verify(token, process.env.REACT_APP_FT_JWT_SECRET, (err, decoded) => {
            if (err) {
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
        window.location.assign('/');
    };

    const toggleUserMenu = () => {
        setUserMenuVisible(!userMenuVisible);
    };

    const setOverlayVisibility = (visible: boolean, spinner: boolean) => {
        setShowOverlaySpinner(spinner);
        setOverlayVisible(visible);
    };

    return (
        <AppContext.Provider value={{
            currentUser,
            loginUser,
            logoutUser,
            toggleUserMenu,
            userMenuVisible,
            setOverlayVisibility,
            overlayVisible,
        }}
        >
            <Overlay visible={overlayVisible} showSpinner={showOverlaySpinner} />
            {children}
        </AppContext.Provider>
    );
};

MainApp.propTypes = {
    children: PropTypes.node.isRequired,
};

export { MainApp };
