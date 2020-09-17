import React from 'react';
import PropTypes from 'prop-types';

import './SuccessMessage.css';

const SuccessMessage: React.FC<{ message: string }> = (props) => {
    const { message } = props;

    return (
        <div className="success-bar" style={message !== '' && message !== null ? { display: 'block' } : {}}>{message}</div>
    );
};

SuccessMessage.defaultProps = {
    message: '',
};

SuccessMessage.propTypes = {
    message: PropTypes.string,
};

export { SuccessMessage };
