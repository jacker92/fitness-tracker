import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { AppContext } from '../AppContext/AppContext';

const Popup = styled.div`
    position:fixed;
    z-index: 10;
    background: hsl(0,0%,100%);
    box-shadow: 0 12px 24px 0 hsla(0, 0%, 0%, 0.2);
    border-radius: 4px;
    top: 50%;
    left: 50%;
`;

const ModalWindow = (props: { visible: boolean, width: number, height: number, children: React.ReactNode }) => {
    const {
        visible, width, height, children,
    } = props;

    // const marginTop: number = (height / 2) * -1;
    // const marginLeft: number = (height / 2) * -1;

    const { setOverlayVisibility } = useContext(AppContext);

    const [isVisible, setIsVisible] = useState(visible);

    useEffect(() => {
        if (visible) {
            setOverlayVisibility(true, false);
            setIsVisible(visible);
        } else {
            setOverlayVisibility(false, false);
            setIsVisible(visible);
        }
    }, [visible, setOverlayVisibility]);

    return (
        <Popup
            style={{
                width: `${width}px`, height: `${height}px`, display: (isVisible ? 'block' : 'none'), marginTop: `-${height / 2}px`, marginLeft: `-${width / 2}px`,
            }}
        >
            {children}
        </Popup>
    );
};

ModalWindow.defaultProps = {
    width: 500,
    height: 400,
};

ModalWindow.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    visible: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
};

export { ModalWindow };
