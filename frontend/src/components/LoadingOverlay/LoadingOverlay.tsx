import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Overlay = styled.div`
    background: hsla(0, 0%, 71%, 0.5);
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0px;
    left: 0px;
    z-index: 5;

    .box {
        margin: 20px auto;
        font-size: 0.9rem;
        text-align: center;
        font-size: 1.4rem;
        width: 100px;

        .spinner {
            height: 48px;
            width: 48px;
            border: 5px solid hsla(0, 0%, 59%, 0.2);
            border-radius: 50%;
            border-top-color: hsl(0, 0%, 59%);
            animation: rotate 1s 0s infinite linear normal;
            margin: -24px auto;
            top: 50%;
            position: absolute;

            @keyframes rotate {
                0% {
                    transform: rotate(0);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
        }
    }
`;

const LoadingOverlay = (props: { visible: boolean }) => {
    const { visible } = props;

    const [isVisible, setIsVisible] = useState(visible);

    useEffect(() => {
        setIsVisible(visible);
    }, [visible]);

    return (
        <Overlay style={isVisible ? { display: 'block' } : { display: 'none' }}>
            <div className="box">
                <div className="spinner" />
            </div>
        </Overlay>
    );
};

LoadingOverlay.propTypes = {
    visible: PropTypes.bool.isRequired,
};

export { LoadingOverlay };
