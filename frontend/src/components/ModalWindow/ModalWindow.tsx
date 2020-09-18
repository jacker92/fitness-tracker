import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ModalWindowProps } from '../../types/ModalWindowProps';

const ModalWindow: React.FC<ModalWindowProps> = (props) => {
    const {
        visible, width, height, children,
    } = props;

    const [isVisible, setIsVisible] = useState(visible);

    useEffect(() => {
        setIsVisible(visible);
    }, [visible]);

    return (
        <div className="overlay" style={isVisible ? { display: 'block' } : { display: 'none' }}>
            <div
                className="modal-window"
                style={{
                    width: `${width}px`,
                    height: (height === 'auto' ? 'auto' : `${height}px`),
                    display: (isVisible ? 'block' : 'none'),
                    marginLeft: `-${width / 2}px`,
                }}
            >
                {children}
            </div>
        </div>
    );
};

ModalWindow.defaultProps = {
    width: 500,
    height: 'auto',
};

ModalWindow.propTypes = {
    width: PropTypes.number,
    height: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    visible: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
};

export { ModalWindow };
