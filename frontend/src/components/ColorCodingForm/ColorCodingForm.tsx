import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ColorCodingFormProps } from '../../types/ColorCodingFormProps';
import { Utilities } from '../../lib/Utilities';
import { SelectField } from '../SelectField/SelectField';

import './ColorCodingForm.css';

const ColorCodingForm: React.FC<ColorCodingFormProps> = (props) => {
    const {
        mode,
        error,
        yellowStart,
        greenStart,
        greenEnd,
        yellowEnd,
        onYellowStartChange,
        onYellowEndChange,
        onGreenStartChange,
        onGreenEndChange,
    } = props;

    const [errorMessage, setErrorMessage] = useState(error);

    useEffect(() => {
        setErrorMessage(error);
    }, [error]);

    return (
        <div className="color-codes-form">
            <fieldset>
                <legend>{mode}</legend>

                <div className="color-controls">
                    <div className="red-start"><div className="color-block" /></div>
                    <div className="yellow-start"><div className="color-block" /></div>
                    <div className="yellow-start-control">
                        <SelectField
                            id={`${mode.toUpperCase()}_yellowstart`}
                            name={`${mode.toUpperCase()}_yellowstart`}
                            label="Yellow Start"
                            hideLabel
                            value={yellowStart}
                            valueList={Utilities.ColorCodeRangeValues}
                            includeBlank={false}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                onYellowStartChange(e);
                            }}
                        />
                    </div>
                    <div className="green-start"><div className="color-block" /></div>
                    <div className="green-start-control">
                        <SelectField
                            id={`${mode.toUpperCase()}_greenstart`}
                            name={`${mode.toUpperCase()}_greenstart`}
                            label="Green Start"
                            hideLabel
                            value={greenStart}
                            valueList={Utilities.ColorCodeRangeValues}
                            includeBlank={false}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                onGreenStartChange(e);
                            }}
                        />
                    </div>
                    <div className="green-end-control">
                        <SelectField
                            id={`${mode.toUpperCase()}_greenend`}
                            name={`${mode.toUpperCase()}_greenend`}
                            label="Green End"
                            hideLabel
                            value={greenEnd}
                            valueList={Utilities.ColorCodeRangeValues}
                            includeBlank={false}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                onGreenEndChange(e);
                            }}
                        />
                    </div>
                    <div className="green-end"><div className="color-block" /></div>
                    <div className="yellow-end-control">
                        <SelectField
                            id={`${mode.toUpperCase()}_yellowend`}
                            name={`${mode.toUpperCase()}_yellowend`}
                            label="Yellow End"
                            hideLabel
                            value={yellowEnd}
                            valueList={Utilities.ColorCodeRangeValues}
                            includeBlank={false}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                onYellowEndChange(e);
                            }}
                        />
                    </div>
                    <div className="yellow-end"><div className="color-block" /></div>
                    <div className="red-end"><div className="color-block" /></div>
                </div>

                <div className="error-text" style={errorMessage !== '' ? { display: 'block' } : { display: 'none' }}>
                    {errorMessage}
                </div>
            </fieldset>
        </div>
    );
};

ColorCodingForm.defaultProps = {
    error: '',
};

ColorCodingForm.propTypes = {
    mode: PropTypes.oneOf(['Calories', 'Protein', 'Carbohydrates', 'Fat']).isRequired,
    error: PropTypes.string,
    yellowStart: PropTypes.number.isRequired,
    greenStart: PropTypes.number.isRequired,
    greenEnd: PropTypes.number.isRequired,
    yellowEnd: PropTypes.number.isRequired,
    onYellowStartChange: PropTypes.func.isRequired,
    onYellowEndChange: PropTypes.func.isRequired,
    onGreenStartChange: PropTypes.func.isRequired,
    onGreenEndChange: PropTypes.func.isRequired,
};

export { ColorCodingForm };
