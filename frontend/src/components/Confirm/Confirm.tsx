import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import { ConfirmProps } from '../../lib/types/ConfirmProps';
import { ModalWindow } from '../ModalWindow/ModalWindow';

import './Confirm.css';

const Confirm = (props: ConfirmProps) => {
    const {
        visible, width, height, text, yesButtonText, noButtonText, onConfirm, onCancel,
    } = props;

    const [isVisible, setIsVisible] = useState(visible);
    const [confirmText, setConfirmText] = useState(text);

    useEffect(() => {
        setIsVisible(visible);
    }, [visible]);

    useEffect(() => {
        setConfirmText(text);
    }, [text]);

    return (
        <ModalWindow width={width} height={height} visible={isVisible}>
            <div className="confirm">
                <p>{confirmText}</p>
                <div className="buttons">
                    <button
                        className="green"
                        type="button"
                        onClick={(e: any) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                    >
                        {yesButtonText}
                    </button>
                    <button
                        className="red"
                        type="button"
                        onClick={(e: any) => {
                            e.preventDefault();
                            onCancel();
                        }}
                    >
                        {noButtonText}
                    </button>
                </div>
            </div>
        </ModalWindow>
    );
};

Confirm.defaultProps = {
    yesButtonText: 'Yes',
    noButtonText: 'No',
    width: 400,
    height: 'auto',
};

Confirm.propTypes = {
    visible: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    yesButtonText: PropTypes.string,
    noButtonText: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export { Confirm };