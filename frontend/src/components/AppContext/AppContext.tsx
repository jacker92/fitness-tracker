import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AppContext = (props: { children: any; }) => {
  const Context = React.createContext({ loggedInUser: null });

  // eslint-disable-next-line no-unused-vars
  const [currentUser, setCurrentUser] = useState(null);

  const { children } = props;

  return (
    <Context.Provider value={{ loggedInUser: currentUser }}>
      {children}
    </Context.Provider>
  );
};

AppContext.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AppContext };
