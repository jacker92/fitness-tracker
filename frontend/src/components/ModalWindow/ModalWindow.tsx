import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '../AppContext/AppContext';

const ModalWindow = (props: { visible: boolean, width: number, height: number | string, children: React.ReactNode }) => {
    const {
        visible, width, height, children,
    } = props;

    const { setOverlayVisibility } = useContext(AppContext);

    const [isVisible, setIsVisible] = useState(visible);

    useEffect(() => {
        setIsVisible(visible);
        if (visible) {
            setOverlayVisibility(true, false);
        } else {
            setOverlayVisibility(false, false);
        }
    }, [visible, setOverlayVisibility]);

    return (
        <div
            className="modal-window"
            style={{
                width: `${width}px`, height: (height === 'auto' ? 'auto' : `${height}px`), display: (isVisible ? 'block' : 'none'), marginLeft: `-${width / 2}px`,
            }}
        >
            {children}
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
