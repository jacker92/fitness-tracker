import React, { useState, useEffect, useContext } from 'react';
import { client } from '../../lib/client';
import { FormValidator } from '../../lib/FormValidator';
import { Form } from '../Styles/Form';
import { TextBox } from '../TextBox/TextBox';
import { SelectField } from '../SelectField/SelectField';
import { Checkbox } from '../Checkbox/Checkbox';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { SuccessMessage } from '../SuccessMessage/SuccessMessage';
import { AppContext } from '../AppContext/AppContext';
import { LoadingBox } from '../LoadingBox/LoadingBox';
import { MacroTargetForm } from '../MacroTargetForm/MacroTargetForm';

const EditDietSettingsForm = () => {
    const [status, setStatus] = useState('initialized');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [macroTargetMode, setMacroTargetMode] = useState(0);
    const [enableCaloriesTarget, setEnableCaloriesTarget] = useState(false);
    const [caloriesTarget, setCaloriesTarget] = useState(0);
    const [caloriesTargetError, setCaloriesTargetError] = useState('');
    const [enableProteinPercentage, setEnableProteinPercentage] = useState(false);
    const [proteinPercentage, setProteinPercentage] = useState(35);
    const [proteinPercentageError, setProteinPercentageError] = useState('');
    const [enableCarbsPercentage, setEnableCarbsPercentage] = useState(false);
    const [carbsPercentage, setCarbsPercentage] = useState(35);
    const [carbsPercentageError, setCarbsPercentageError] = useState('');
    const [enableFatPercentage, setEnableFatPercentage] = useState(false);
    const [fatPercentage, setFatPercentage] = useState(30);
    const [fatPercentageError, setFatPercentageError] = useState('');
    const [saveDisabled, setSaveDisabled] = useState(false);

    const { currentUser } = useContext(AppContext);

    useEffect(() => {
        client('users/getuser').then(
            (data) => {
                if (data.successful) {
                    setMacroTargetMode(data.user.DailyTarget.MacroTargetMode);
                    setStatus('loaded');
                } else {
                    setErrorMessage(data.error);
                    setStatus('errored');
                }
            },
            (error) => {
                if (typeof error === 'string') {
                    setErrorMessage(error);
                } else if (typeof error.message === 'string') {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage('An error has occurred');
                }
                setStatus('errored');
            },
        );
    }, [currentUser.id]);

    return (
        <>
            <ErrorMessage error={errorMessage} />
            <SuccessMessage message={successMessage} />

            {status === 'initialized' && <LoadingBox />}

            {(status === 'loaded' || status === 'saving') && (
                <Form
                    className="autowidth"
                    method="POST"
                    onSubmit={async (e) => {
                        e.preventDefault();
                    }}
                >
                    <fieldset>
                        <div className="form-field">
                            <SelectField
                                id="macrotargetmode"
                                name="macrotargetmode"
                                label="Macro Target Mode"
                                value={macroTargetMode}
                                valueList={[
                                    { value: 0, text: 'Off' },
                                    { value: 1, text: 'Based Off Percentages' },
                                    { value: 2, text: 'Manually Entered' },
                                ]}
                                requiredField
                                includeBlank={false}
                                onChange={(e: any) => {
                                    setMacroTargetMode(parseInt(e.target.value, 10));
                                }}
                            />
                        </div>

                        <div className="form-field">
                            <Checkbox
                                id="enablecaloriestarget"
                                name="enablecaloriestarget"
                                label="Enable Calories Target"
                                value={1}
                                isChecked={enableCaloriesTarget}
                                onChange={(e: any) => {
                                    setEnableCaloriesTarget(e.target.checked);
                                }}
                            />
                        </div>

                        <div
                            className="form-field"
                            data-testid="caloriestarget-div"
                            style={enableCaloriesTarget ? { display: 'block' } : { display: 'none' }}
                        >
                            <TextBox
                                id="caloriestarget"
                                name="caloriestarget"
                                label="Calories Target"
                                value={caloriesTarget}
                                error={caloriesTargetError}
                                validationRule="numeric"
                                onChange={(e: any) => {
                                    if (e.target.value !== '') {
                                        if (!Number.isNaN(e.target.value)) {
                                            setCaloriesTarget(parseInt(e.target.value, 10));
                                        }
                                    } else {
                                        setCaloriesTarget(0);
                                    }
                                }}
                                onErrorChange={(error: string) => {
                                    setCaloriesTargetError(error);
                                }}
                            />
                        </div>

                        <div
                            data-testid="macrosfields-div"
                            style={macroTargetMode !== 0 ? { display: 'block' } : { display: 'none' }}
                        >
                            <div
                                className="form-field"
                                data-testid="percentagefields-div"
                                style={macroTargetMode === 1 ? { display: 'block' } : { display: 'none' }}
                            >
                                <MacroTargetForm
                                    mode="PERCENT"
                                    enableProtein={enableProteinPercentage}
                                    proteinTarget={proteinPercentage}
                                    enableCarbs={enableCarbsPercentage}
                                    carbsTarget={carbsPercentage}
                                    enableFat={enableFatPercentage}
                                    fatTarget={fatPercentage}
                                    onEnableProteinChange={(e: any) => {
                                        setEnableProteinPercentage(e.target.checked);
                                    }}
                                    onProteinChange={(e: any) => {
                                        if (e.target.value !== '') {
                                            if (!Number.isNaN(e.target.value)) {
                                                setProteinPercentage(parseInt(e.target.value, 10));
                                            }
                                        } else {
                                            setProteinPercentage(0);
                                        }
                                    }}
                                    onEnableCarbsChange={(e: any) => {
                                        setEnableCarbsPercentage(e.target.checked);
                                    }}
                                    onCarbsChange={(e: any) => {
                                        if (e.target.value !== '') {
                                            if (!Number.isNaN(e.target.value)) {
                                                setCarbsPercentage(parseInt(e.target.value, 10));
                                            }
                                        } else {
                                            setCarbsPercentage(0);
                                        }
                                    }}
                                    onEnableFatChange={(e: any) => {
                                        setEnableFatPercentage(e.target.checked);
                                    }}
                                    onFatChange={(e: any) => {
                                        if (e.target.value !== '') {
                                            if (!Number.isNaN(e.target.value)) {
                                                setFatPercentage(parseInt(e.target.value, 10));
                                            }
                                        } else {
                                            setFatPercentage(0);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-field">
                            <button type="submit" disabled={saveDisabled} aria-disabled={saveDisabled}>
                                Save Changes
                            </button>
                        </div>
                    </fieldset>
                </Form>
            )}
        </>
    );
};

export { EditDietSettingsForm };
