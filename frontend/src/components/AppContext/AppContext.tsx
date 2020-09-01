import React from 'react';

const AppContext = React.createContext({
    currentUser: null,
    loginUser: null,
    logoutUser: null,
    toggleUserMenu: null,
    userMenuVisible: false,
    setOverlayVisibility: null,
    overlayVisible: false,
});

export { AppContext };
