import React, {
    useState, useEffect, useContext, useCallback,
} from 'react';
import { client } from '../../lib/client';
// import { FormValidator } from '../../lib/FormValidator';
import { Utilities } from '../../lib/Utilities';
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
    const [manuallyCalculateCalories, setManuallyCalculateCalories] = useState(false);
    const [dietMode, setDietMode] = useState(1);
    const [macroTargetMode, setMacroTargetMode] = useState(0);
    const [enableCaloriesTarget, setEnableCaloriesTarget] = useState(false);
    const [caloriesTarget, setCaloriesTarget] = useState(0);
    const [caloriesTargetError, setCaloriesTargetError] = useState('');
    const [enableProteinPercentage, setEnableProteinPercentage] = useState(false);
    const [proteinPercentage, setProteinPercentage] = useState(35);
    const [proteinPercentageGrams, setProteinPercentageGrams] = useState(0);
    const [enableCarbsPercentage, setEnableCarbsPercentage] = useState(false);
    const [carbsPercentage, setCarbsPercentage] = useState(35);
    const [carbsPercentageGrams, setCarbsPercentageGrams] = useState(0);
    const [enableFatPercentage, setEnableFatPercentage] = useState(false);
    const [fatPercentage, setFatPercentage] = useState(30);
    const [fatPercentageGrams, setFatPercentageGrams] = useState(0);
    const [enableProteinGrams, setEnableProteinGrams] = useState(false);
    const [proteinGrams, setProteinGrams] = useState(175);
    const [enableCarbsGrams, setEnableCarbsGrams] = useState(false);
    const [carbsGrams, setCarbsGrams] = useState(175);
    const [enableFatGrams, setEnableFatGrams] = useState(false);
    const [fatGrams, setFatGrams] = useState(67);
    const [percentagesError, setPercentagesError] = useState('');
    const [manualMacrosError] = useState('');
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

    const validateAndCalculatePercentages = useCallback(() => {
        if (enableProteinPercentage && enableCarbsPercentage && enableFatPercentage) {
            if (proteinPercentage + carbsPercentage + fatPercentage !== 100) {
                setPercentagesError('Total percentage must equal 100');
            } else {
                setPercentagesError('');
            }
        } else {
            let total = 0;

            if (enableProteinPercentage) {
                total += proteinPercentage;
            }

            if (enableCarbsPercentage) {
                total += carbsPercentage;
            }

            if (enableFatPercentage) {
                total += fatPercentage;
            }

            if (total >= 100) {
                setPercentagesError('Total percentage cannot be greater than 100');
            } else {
                setPercentagesError('');
            }
        }

        if (percentagesError === '') {
            setProteinPercentageGrams(Utilities.calculateProteinFromPercentage(caloriesTarget, proteinPercentage));
            setCarbsPercentageGrams(Utilities.calculateCarbsFromPercentage(caloriesTarget, carbsPercentage));
            setFatPercentageGrams(Utilities.calculateFatFromPercentage(caloriesTarget, fatPercentage));
        }
    }, [enableProteinPercentage, enableCarbsPercentage, enableFatPercentage, proteinPercentage, carbsPercentage, fatPercentage, caloriesTarget, percentagesError]);

    useEffect(() => {
        validateAndCalculatePercentages();
    }, [
        enableProteinPercentage,
        enableCarbsPercentage,
        enableFatPercentage,
        proteinPercentage,
        carbsPercentage,
        fatPercentage,
        validateAndCalculatePercentages,
    ]);

    const calculatePercentages = useCallback(() => {
        // if mode is percentages, calculate the grams
        if (macroTargetMode === 1) {
            setProteinPercentageGrams(Utilities.calculateProteinFromPercentage(caloriesTarget, proteinPercentage));
            setCarbsPercentageGrams(Utilities.calculateCarbsFromPercentage(caloriesTarget, carbsPercentage));
            setFatPercentageGrams(Utilities.calculateFatFromPercentage(caloriesTarget, fatPercentage));
        }
    }, [caloriesTarget, carbsPercentage, proteinPercentage, fatPercentage, macroTargetMode]);

    useEffect(() => {
        calculatePercentages();
    }, [caloriesTarget, calculatePercentages]);

    useEffect(() => {
        if (percentagesError === '' && manualMacrosError === '') {
            setSaveDisabled(false);
        } else {
            setSaveDisabled(true);
        }
    }, [percentagesError, manualMacrosError]);

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
                            <Checkbox
                                id="manuallycalculatecalories"
                                name="manuallycalculatecalories"
                                label="Manually Calculate Calories"
                                isChecked={manuallyCalculateCalories}
                                onChange={(e: any) => {
                                    setManuallyCalculateCalories(e.target.checked);
                                }}
                            />
                        </div>

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
                                    const macroMode = parseInt(e.target.value, 10);

                                    if (macroMode !== 0) {
                                        setEnableCaloriesTarget(true);
                                    }

                                    setMacroTargetMode(macroMode);
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
                                disabled={!manuallyCalculateCalories}
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
                                    proteinGrams={proteinPercentageGrams}
                                    enableCarbs={enableCarbsPercentage}
                                    carbsTarget={carbsPercentage}
                                    carbGrams={carbsPercentageGrams}
                                    enableFat={enableFatPercentage}
                                    fatTarget={fatPercentage}
                                    fatGrams={fatPercentageGrams}
                                    error={percentagesError}
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

                            <div
                                className="form-field"
                                data-testid="manualfields-div"
                                style={macroTargetMode === 2 ? { display: 'block' } : { display: 'none' }}
                            >
                                <MacroTargetForm
                                    mode="MANUAL"
                                    enableProtein={enableProteinGrams}
                                    proteinTarget={proteinGrams}
                                    enableCarbs={enableCarbsGrams}
                                    carbsTarget={carbsGrams}
                                    enableFat={enableFatGrams}
                                    fatTarget={fatGrams}
                                    error={manualMacrosError}
                                    onEnableProteinChange={(e: any) => {
                                        setEnableProteinGrams(e.target.checked);
                                    }}
                                    onProteinChange={(e: any) => {
                                        if (e.target.value !== '') {
                                            if (!Number.isNaN(e.target.value)) {
                                                setProteinGrams(parseInt(e.target.value, 10));
                                            }
                                        } else {
                                            setProteinGrams(0);
                                        }
                                    }}
                                    onEnableCarbsChange={(e: any) => {
                                        setEnableCarbsGrams(e.target.checked);
                                    }}
                                    onCarbsChange={(e: any) => {
                                        if (e.target.value !== '') {
                                            if (!Number.isNaN(e.target.value)) {
                                                setCarbsGrams(parseInt(e.target.value, 10));
                                            }
                                        } else {
                                            setCarbsGrams(0);
                                        }
                                    }}
                                    onEnableFatChange={(e: any) => {
                                        setEnableFatGrams(e.target.checked);
                                    }}
                                    onFatChange={(e: any) => {
                                        if (e.target.value !== '') {
                                            if (!Number.isNaN(e.target.value)) {
                                                setFatGrams(parseInt(e.target.value, 10));
                                            }
                                        } else {
                                            setFatGrams(0);
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
