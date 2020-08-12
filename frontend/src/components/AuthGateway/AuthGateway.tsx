import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '../AppContext/AppContext';
import { Login } from '../Login/Login';

const AuthGateway = (props: { redirectUrl: string, children: any }) => {
    const { redirectUrl = '/', children } = props;

    const { currentUser } = useContext(AppContext);

    if (currentUser === null) {
        return (
            <div>
                <Login redirectUrl={redirectUrl} message="Please sign in to continue" messageColor="hsl(140, 100%, 15%)" />
            </div>
        );
    }

    return children;
};

AuthGateway.defaultProps = {
    redirectUrl: '/',
};

AuthGateway.propTypes = {
    redirectUrl: PropTypes.string,
    children: PropTypes.node,
};

export { AuthGateway };
