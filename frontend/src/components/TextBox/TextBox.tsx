import React, { useState, useEffect } from 'react';
import PropTypes, { number } from 'prop-types';
import { FormValidator } from '../../lib/FormValidator';

// eslint-disable-next-line max-len
const TextBox = (props: {name: string, label: string, type: string, value: any, id: string, error: string, success: string, onChange: Function, validationRule: string, validate: Function, validationArgs: { min: number, max: number }, showErrorMessage: boolean, doesErrorContainHtml: boolean, showSuccessMessage: boolean}) => {
    const {
        error,
        success,
        value,
        type,
        label,
        name, id,
        onChange,
        validate,
        validationRule,
        validationArgs,
        showErrorMessage,
        showSuccessMessage,
        doesErrorContainHtml,
    } = props;

    const [errorMessage, setErrorMessage] = useState(error);
    const [successMessage, setSuccessMessage] = useState(success);
    const [fieldValue, setFieldValue] = useState(value);

    useEffect(() => {
        setErrorMessage(props.error);
        setSuccessMessage(props.success);
        setFieldValue(props.value);
    }, [props]);

    const validateField = (val: string, rule: string, args: {min: number, max: number}) => {
        let validationResult = { valid: true, message: '' };

        switch (rule.toLowerCase()) {
            case 'email':
                if (FormValidator.validateEmail(val)) {
                    setErrorMessage('');
                } else {
                    setErrorMessage('Valid email address required');
                }
                break;

            case 'notempty':
                if (FormValidator.validateNotEmpty(val)) {
                    setErrorMessage('');
                } else {
                    setErrorMessage(`${label}  is required`);
                }
                break;

            case 'setlength':
                validationResult = FormValidator.validateSetLength(val, label, args.min, args.max);
                setErrorMessage(validationResult.message);
                break;

            case 'numeric':
                if (FormValidator.validateNumeric(val)) {
                    setErrorMessage('');
                } else {
                    setErrorMessage(`${label} must be numeric`);
                }
                break;

            case 'requirednumeric':
                if (FormValidator.validateRequiredNumeric(val)) {
                    setErrorMessage('');
                } else {
                    setErrorMessage(`${label}  is required`);
                }
                break;

            default:
                setErrorMessage('');
                break;
        }
    };

    return (
        <label htmlFor={name} className={errorMessage !== '' ? 'errored' : ''}>
            {label}
            <input
                type={type}
                id={name}
                name={name}
                data-testid={id}
                value={fieldValue}
                onChange={(e) => {
                    if (onChange) {
                        onChange(e);
                    }
                }}
                onBlur={(e) => {
                    if (validate) {
                        validate(e);
                    } else if (props.validationRule) {
                        e.preventDefault();
                        validateField(e.target.value, validationRule, validationArgs);
                    }
                }}
            />

            {doesErrorContainHtml ? (
                <div
                    className="error-text"
                    style={showErrorMessage && errorMessage !== '' ? { display: 'block' } : {}}
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: errorMessage }}
                />
            ) : (
                <div className="error-text" style={showErrorMessage && errorMessage !== '' ? { display: 'block' } : {}}>
                    {errorMessage}
                </div>
            )}

            <div className="success-text" style={showSuccessMessage && successMessage !== '' ? { display: 'block' } : {}}>
                {successMessage}
            </div>
        </label>
    );
};

TextBox.defaultProps = {
    showErrorMessage: true,
    showSuccessMessage: true,
    type: 'text',
    error: '',
    success: '',
    doesErrorContainHtml: false,
    onChange: null,
    validationRule: '',
    validate: null,
    validationArgs: {},
    value: '',
};

TextBox.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    id: PropTypes.string.isRequired,
    error: PropTypes.string,
    success: PropTypes.string,
    onChange: PropTypes.func,
    validationRule: PropTypes.string,
    validate: PropTypes.func,
    validationArgs: PropTypes.shape({
        min: number,
        max: number,
    }),
    showErrorMessage: PropTypes.bool,
    doesErrorContainHtml: PropTypes.bool,
    showSuccessMessage: PropTypes.bool,
};

export { TextBox };
