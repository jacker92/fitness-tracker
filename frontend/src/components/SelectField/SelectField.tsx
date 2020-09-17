import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SelectFieldProps } from '../../types/SelectFieldProps';

// eslint-disable-next-line max-len
const SelectField: React.FC<SelectFieldProps> = (props) => {
    const {
        error,
        success,
        value,
        label,
        name, id,
        onChange,
        requiredField,
        valueList,
        showErrorMessage,
        showSuccessMessage,
        doesErrorContainHtml,
        includeBlank,
    } = props;

    const [errorMessage, setErrorMessage] = useState(error);
    const [successMessage, setSuccessMessage] = useState(success);
    const [fieldValue, setFieldValue] = useState(value);

    useEffect(() => {
        setErrorMessage(props.error);
        setSuccessMessage(props.success);
        setFieldValue(props.value);
    }, [props]);

    return (
        <label htmlFor={name} className={errorMessage !== '' ? 'errored' : ''}>
            {label}
            <select
                id={name}
                name={name}
                data-testid={id}
                onChange={(e) => {
                    if (onChange) {
                        onChange(e);
                    }
                }}
                onBlur={(e) => {
                    if (requiredField && e.target.value === '') {
                        setErrorMessage(`${label}  is required`);
                    } else {
                        setErrorMessage('');
                    }
                }}
                value={fieldValue}
            >
                {includeBlank && (<option value="">&nbsp;</option>)}
                {valueList.map((item: { value: number | string, text: string}) => (
                    <option key={item.value} value={item.value}>{item.text}</option>
                ))}
            </select>

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

SelectField.defaultProps = {
    showErrorMessage: true,
    showSuccessMessage: true,
    error: '',
    success: '',
    doesErrorContainHtml: false,
    onChange: null,
    requiredField: false,
    value: '',
    includeBlank: true,
};

SelectField.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    valueList: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        text: PropTypes.string,
    })).isRequired,
    id: PropTypes.string.isRequired,
    error: PropTypes.string,
    success: PropTypes.string,
    onChange: PropTypes.func,
    requiredField: PropTypes.bool,
    showErrorMessage: PropTypes.bool,
    doesErrorContainHtml: PropTypes.bool,
    showSuccessMessage: PropTypes.bool,
    includeBlank: PropTypes.bool,
};

export { SelectField };
