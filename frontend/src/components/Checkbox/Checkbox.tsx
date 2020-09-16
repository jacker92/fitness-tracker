import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = (props: { isChecked: boolean, label: string, name: string, id: string, onChange: Function, value: any}) => {
    const {
        isChecked,
        label,
        name,
        id,
        onChange,
        value,
    } = props;

    return (
        <label htmlFor={name}>
            <input
                type="checkbox"
                name={name}
                data-testid={id}
                id={id}
                value={value}
                onChange={(e) => {
                    if (onChange) {
                        onChange(e);
                    }
                }}
                checked={isChecked}
            />
            {label}
        </label>
    );
};

Checkbox.defaultProps = {
    isChecked: false,
    onChange: null,
    value: '',
};

Checkbox.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    isChecked: PropTypes.bool,
};

export { Checkbox };
