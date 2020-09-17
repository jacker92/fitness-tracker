import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Overlay: React.FC<{ visible: boolean, showSpinner: boolean }> = (props) => {
    const { visible, showSpinner } = props;

    const [isVisible, setIsVisible] = useState(visible);
    const [isSpinnerVisible, setIsSpinnerVisible] = useState(showSpinner);

    useEffect(() => {
        setIsVisible(visible);
    }, [visible]);

    useEffect(() => {
        setIsSpinnerVisible(showSpinner);
    }, [showSpinner]);

    return (
        <div className="overlay" style={isVisible ? { display: 'block' } : { display: 'none' }}>
            {isSpinnerVisible && (
                <div className="loading-box">
                    <div className="spinner" />
                </div>
            )}
        </div>
    );
};

Overlay.propTypes = {
    visible: PropTypes.bool.isRequired,
    showSpinner: PropTypes.bool.isRequired,
};

export { Overlay };
