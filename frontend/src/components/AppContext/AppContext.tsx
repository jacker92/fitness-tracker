import React from 'react';

const AppContext = React.createContext({ currentUser: null, loginUser: null, logoutUser: null });

export { AppContext };
