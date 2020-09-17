import React from 'react';
import PropTypes from 'prop-types';

import './ErrorMessage.css';

const ErrorMessage = (props: { error: string }) => {
    const { error } = props;

    return (
        <div className="error-bar" style={error !== '' && error !== null ? { display: 'block' } : {}}>{error}</div>
    );
};

ErrorMessage.defaultProps = {
    error: '',
};

ErrorMessage.propTypes = {
    error: PropTypes.string,
};

export { ErrorMessage };
