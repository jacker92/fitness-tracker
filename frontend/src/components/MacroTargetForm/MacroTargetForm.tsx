import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import { MacroTargetFormProps } from '../../lib/types/MacroTargetFormProps';

import './MacroTargetForm.css';

const MacroTargetForm = (props: MacroTargetFormProps) => {
    const {
        mode,
        enableProtein,
        proteinTarget,
        proteinGrams,
        enableCarbs,
        carbsTarget,
        carbGrams,
        enableFat,
        fatTarget,
        fatGrams,
        onEnableProteinChange,
        onProteinChange,
        onEnableCarbsChange,
        onCarbsChange,
        onEnableFatChange,
        onFatChange,
        error,
    } = props;

    const [errorMessage, setErrorMessage] = useState(error);
    const [enableProteinTarget, setEnableProteinTarget] = useState(enableProtein);
    const [enableCarbsTarget, setEnableCarbsTarget] = useState(enableCarbs);
    const [enableFatTarget, setEnableFatTarget] = useState(enableFat);

    useEffect(() => {
        setErrorMessage(error);
        setEnableProteinTarget(enableProtein);
        setEnableCarbsTarget(enableCarbs);
        setEnableFatTarget(enableFat);
    }, [enableProtein, enableCarbs, enableFat, error]);

    return (
        <div className="macro-form">
            <fieldset>
                <legend>Macro Targets</legend>

                <div className="macro-field">
                    <label htmlFor={`enableprotein_${mode}`}>
                        <input
                            type="checkbox"
                            name={`enableprotein_${mode}`}
                            data-testid={`enableprotein_${mode}`}
                            id={`enableprotein_${mode}`}
                            onChange={(e) => {
                                onEnableProteinChange(e);
                            }}
                            checked={enableProteinTarget}
                        />

                        <div className="macro-name">{mode === 'PERCENT' ? 'Protein (%)' : 'Protein (g)'}</div>

                        <input
                            type="text"
                            name={`protein_${mode}`}
                            id={`protein_${mode}`}
                            data-testid={`protein_${mode}`}
                            value={proteinTarget}
                            style={enableProteinTarget ? { display: 'inline-block' } : { display: 'none' }}
                            onChange={(e) => {
                                onProteinChange(e);
                            }}
                        />
                    </label>

                    <div
                        className="macro-target"
                        style={(mode === 'PERCENT' && enableProteinTarget) ? { display: 'inline-block' } : { display: 'none' }}
                    >
                        {`( ${proteinGrams}g )`}
                    </div>
                </div>

                <div className="macro-field">
                    <label htmlFor={`enablecarbs_${mode}`}>
                        <input
                            type="checkbox"
                            name={`enablecarbs_${mode}`}
                            data-testid={`enablecarbs_${mode}`}
                            id={`enablecarbs_${mode}`}
                            onChange={(e) => {
                                onEnableCarbsChange(e);
                            }}
                            checked={enableCarbsTarget}
                        />

                        <div className="macro-name">{mode === 'PERCENT' ? 'Carbohydrates (%)' : 'Carbohydrates (g)'}</div>

                        <input
                            type="text"
                            name={`carbs_${mode}`}
                            id={`carbs_${mode}`}
                            data-testid={`carbs_${mode}`}
                            value={carbsTarget}
                            style={enableCarbsTarget ? { display: 'inline-block' } : { display: 'none' }}
                            onChange={(e) => {
                                onCarbsChange(e);
                            }}
                        />
                    </label>

                    <div
                        className="macro-target"
                        style={(mode === 'PERCENT' && enableCarbsTarget) ? { display: 'inline-block' } : { display: 'none' }}
                    >
                        {`( ${carbGrams}g )`}
                    </div>
                </div>

                <div className="macro-field">
                    <label htmlFor={`enablefat_${mode}`}>
                        <input
                            type="checkbox"
                            name={`enablefat_${mode}`}
                            data-testid={`enablefat_${mode}`}
                            id={`enablefat_${mode}`}
                            onChange={(e) => {
                                onEnableFatChange(e);
                            }}
                            checked={enableFatTarget}
                        />

                        <div className="macro-name">{mode === 'PERCENT' ? 'Fat (%)' : 'Fat (g)'}</div>

                        <input
                            type="text"
                            name={`fat_${mode}`}
                            id={`fat_${mode}`}
                            data-testid={`fat_${mode}`}
                            value={fatTarget}
                            style={enableFatTarget ? { display: 'inline-block' } : { display: 'none' }}
                            onChange={(e) => {
                                onFatChange(e);
                            }}
                        />
                    </label>

                    <div
                        className="macro-target"
                        style={(mode === 'PERCENT' && enableFatTarget) ? { display: 'inline-block' } : { display: 'none' }}
                    >
                        {`( ${fatGrams}g )`}
                    </div>
                </div>

                <div className="error-text" style={errorMessage !== '' ? { display: 'block' } : { display: 'none' }}>
                    {errorMessage}
                </div>
            </fieldset>
        </div>
    );
};

MacroTargetForm.defaultProps = {
    error: '',
    proteinGrams: 0,
    carbGrams: 0,
    fatGrams: 0,
};

MacroTargetForm.propTypes = {
    mode: PropTypes.oneOf(['PERCENT', 'MANUAL']).isRequired,
    enableProtein: PropTypes.bool.isRequired,
    proteinTarget: PropTypes.number.isRequired,
    enableCarbs: PropTypes.bool.isRequired,
    carbsTarget: PropTypes.number.isRequired,
    enableFat: PropTypes.bool.isRequired,
    fatTarget: PropTypes.number.isRequired,
    onEnableProteinChange: PropTypes.func.isRequired,
    onProteinChange: PropTypes.func.isRequired,
    onEnableCarbsChange: PropTypes.func.isRequired,
    onCarbsChange: PropTypes.func.isRequired,
    onEnableFatChange: PropTypes.func.isRequired,
    onFatChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    proteinGrams: PropTypes.number,
    carbGrams: PropTypes.number,
    fatGrams: PropTypes.number,
};

export { MacroTargetForm };
