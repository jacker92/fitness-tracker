import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextBoxProps } from '../../types/TextBoxProps';
import { FormValidator } from '../../lib/FormValidator';

const TextBox: React.FC<TextBoxProps> = (props) => {
    const {
        error,
        success,
        value,
        type,
        label,
        disabled,
        readonly,
        name, id,
        onChange,
        validate,
        validationRule,
        validationArgs,
        showErrorMessage,
        showSuccessMessage,
        doesErrorContainHtml,
        onErrorChange,
        autocomplete = 'off',
    } = props;

    const [errorMessage, setErrorMessage] = useState(error);
    const [successMessage, setSuccessMessage] = useState(success);
    const [fieldValue, setFieldValue] = useState(value);

    useEffect(() => {
        setFieldValue(value);
        setErrorMessage(error);
        setSuccessMessage(success);
    }, [value, error, success]);

    const validateField = (val: string, rule: string, args: {min: number, max: number}) => {
        let validationResult = { valid: true, message: '' };
        let validationError = '';

        switch (rule.toLowerCase()) {
            case 'email':
                if (!FormValidator.validateEmail(val)) {
                    validationError = 'Valid email address required';
                }
                break;

            case 'notempty':
                if (!FormValidator.validateNotEmpty(val)) {
                    validationError = `${label} is required`;
                }
                break;

            case 'setlength':
                validationResult = FormValidator.validateSetLength(val, label, args.min, args.max);
                validationError = validationResult.message;
                break;

            case 'numeric':
                if (!FormValidator.validateNumeric(val)) {
                    validationError = `${label} must be numeric`;
                }
                break;

            case 'requirednumeric':
                if (!FormValidator.validateRequiredNumeric(val)) {
                    validationError = `${label} is required`;
                }
                break;

            case 'requiredgreaterzero':
                if (!FormValidator.validateRequiredNumericGreaterThanZero(val)) {
                    validationError = `${label} must be numeric and greater than zero`;
                }
                break;

            default:
                break;
        }

        if (onErrorChange) {
            onErrorChange(validationError);
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
                autoComplete={autocomplete}
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
                disabled={disabled}
                readOnly={readonly}
            />

            {doesErrorContainHtml ? (
                <div
                    className="error-text"
                    style={showErrorMessage && errorMessage !== '' ? { display: 'block' } : {}}
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: errorMessage }}
                />
            ) : (
                <div className="error-text" style={showErrorMessage && errorMessage !== '' ? { display: 'block' } : { display: 'none' }}>
                    {errorMessage}
                </div>
            )}

            <div className="success-text" style={showSuccessMessage && successMessage !== '' ? { display: 'block' } : { display: 'none' }}>
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
    validationArgs: { min: 0, max: 0 },
    value: '',
    onErrorChange: null,
    disabled: false,
    readonly: false,
    autocomplete: 'off',
};

TextBox.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    id: PropTypes.string.isRequired,
    error: PropTypes.string,
    success: PropTypes.string,
    onChange: PropTypes.func,
    validationRule: PropTypes.string,
    validate: PropTypes.func,
    validationArgs: PropTypes.exact({
        min: PropTypes.number,
        max: PropTypes.number,
    }),
    showErrorMessage: PropTypes.bool,
    doesErrorContainHtml: PropTypes.bool,
    showSuccessMessage: PropTypes.bool,
    onErrorChange: PropTypes.func,
    autocomplete: PropTypes.string,
};

export { TextBox };
