import React, {
    useState, useEffect, useContext, useCallback,
} from 'react';
import { DietSettingsUpdateRequest } from '../../types/DietSettingsUpdateRequest';
import { client } from '../../lib/client';
import { Utilities } from '../../lib/Utilities';
import { TextBox } from '../TextBox/TextBox';
import { SelectField } from '../SelectField/SelectField';
import { Checkbox } from '../Checkbox/Checkbox';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { SuccessMessage } from '../SuccessMessage/SuccessMessage';
import { AppContext } from '../AppContext/AppContext';
import { LoadingBox } from '../LoadingBox/LoadingBox';
import { MacroTargetForm } from '../MacroTargetForm/MacroTargetForm';
import { ColorCodingForm } from '../ColorCodingForm/ColorCodingForm';

const EditDietSettingsForm: React.FC = () => {
    const [status, setStatus] = useState('initialized');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [manuallyCalculateCalories, setManuallyCalculateCalories] = useState(false);
    const [dietMode, setDietMode] = useState(1);
    const [dietPercentage, setDietPercentage] = useState(0);
    const [dietPercentageError, setDietPercentageError] = useState('');
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
    const [weight, setWeight] = useState(0);
    const [tdee, setTdee] = useState(0);
    const [enableColorCoding, setEnableColorCoding] = useState(false);
    const [caloriesYellowStart, setCaloriesYellowStart] = useState(80);
    const [caloriesYellowEnd, setCaloriesYellowEnd] = useState(120);
    const [caloriesGreenStart, setCaloriesGreenStart] = useState(90);
    const [caloriesGreenEnd, setCaloriesGreenEnd] = useState(110);
    const [proteinYellowStart, setProteinYellowStart] = useState(80);
    const [proteinYellowEnd, setProteinYellowEnd] = useState(120);
    const [proteinGreenStart, setProteinGreenStart] = useState(90);
    const [proteinGreenEnd, setProteinGreenEnd] = useState(110);
    const [carbohydratesYellowStart, setCarbohydratesYellowStart] = useState(80);
    const [carbohydratesYellowEnd, setCarbohydratesYellowEnd] = useState(120);
    const [carbohydratesGreenStart, setCarbohydratesGreenStart] = useState(90);
    const [carbohydratesGreenEnd, setCarbohydratesGreenEnd] = useState(110);
    const [fatYellowStart, setFatYellowStart] = useState(80);
    const [fatYellowEnd, setFatYellowEnd] = useState(120);
    const [fatGreenStart, setFatGreenStart] = useState(90);
    const [fatGreenEnd, setFatGreenEnd] = useState(110);
    const [saveDisabled, setSaveDisabled] = useState(false);

    const { currentUser } = useContext(AppContext);

    useEffect(() => {
        client('users/getuser').then(
            (data) => {
                if (data.successful) {
                    setMacroTargetMode(data.user.dailyTarget.macroTargetMode);
                    setManuallyCalculateCalories(data.user.manuallyCalculateCalories);
                    setDietMode(data.user.dietMode);
                    setDietPercentage(data.user.dietPercentage);
                    setWeight(data.user.weight);
                    setTdee(data.user.tdee);

                    setEnableCaloriesTarget(data.user.dailyTarget.enableCalorieTarget);
                    setCaloriesTarget(data.user.dailyTarget.calorieTarget);

                    setProteinPercentage(data.user.dailyTarget.proteinPercentage);
                    setCarbsPercentage(data.user.dailyTarget.carbohydratesPercentage);
                    setFatPercentage(data.user.dailyTarget.fatPercentage);
                    setProteinGrams(data.user.dailyTarget.proteinTarget);
                    setCarbsGrams(data.user.dailyTarget.carbohydratesTarget);
                    setFatGrams(data.user.dailyTarget.fatTarget);

                    setEnableColorCoding(data.user.dailyTarget.enableColorCoding);
                    setCaloriesYellowStart(data.user.dailyTarget.caloriesYellowStart);
                    setCaloriesYellowEnd(data.user.dailyTarget.caloriesYellowEnd);
                    setCaloriesGreenStart(data.user.dailyTarget.caloriesGreenStart);
                    setCaloriesGreenEnd(data.user.dailyTarget.caloriesGreenEnd);
                    setProteinYellowStart(data.user.dailyTarget.proteinYellowStart);
                    setProteinYellowEnd(data.user.dailyTarget.proteinYellowEnd);
                    setProteinGreenStart(data.user.dailyTarget.proteinGreenStart);
                    setProteinGreenEnd(data.user.dailyTarget.proteinGreenEnd);
                    setCarbohydratesYellowStart(data.user.dailyTarget.carbohydratesYellowStart);
                    setCarbohydratesYellowEnd(data.user.dailyTarget.carbohydratesYellowEnd);
                    setCarbohydratesGreenStart(data.user.dailyTarget.carbohydratesGreenStart);
                    setCarbohydratesGreenEnd(data.user.dailyTarget.carbohydratesGreenEnd);
                    setFatYellowStart(data.user.dailyTarget.fatYellowStart);
                    setFatYellowEnd(data.user.dailyTarget.fatYellowEnd);
                    setFatGreenStart(data.user.dailyTarget.fatGreenStart);
                    setFatGreenEnd(data.user.dailyTarget.fatGreenEnd);

                    switch (data.user.dailyTarget.macroTargetMode) {
                        case 1: // percentages
                            setEnableProteinPercentage(data.user.dailyTarget.enableProteinTarget);
                            setEnableCarbsPercentage(data.user.dailyTarget.enableCarbohydratesTarget);
                            setEnableFatPercentage(data.user.dailyTarget.enableFatTarget);
                            break;

                        case 2: // manual
                            setEnableProteinGrams(data.user.dailyTarget.enableProteinTarget);
                            setEnableCarbsGrams(data.user.dailyTarget.enableCarbohydratesTarget);
                            setEnableFatGrams(data.user.dailyTarget.enableFatTarget);
                            break;

                        case 0:
                        default: // off
                            break;
                    }

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

    const calculateCalories = useCallback(() => {
        if (!manuallyCalculateCalories) {
            switch (dietMode) {
                case 2: // cut
                    setCaloriesTarget(Math.round(tdee - (tdee * (dietPercentage / 100))));
                    break;

                case 3: // bulk
                    setCaloriesTarget(Math.round(tdee + (tdee * (dietPercentage / 100))));
                    break;

                case 1: // maintenance
                default:
                    setCaloriesTarget(tdee);
                    break;
            }
        }
    }, [manuallyCalculateCalories, dietMode, tdee, dietPercentage]);

    useEffect(() => {
        calculateCalories();
    }, [manuallyCalculateCalories, dietMode, dietPercentage, calculateCalories]);

    const validate = () => true;

    const updateDietSettings = async () => {
        let params: DietSettingsUpdateRequest;

        switch (macroTargetMode) {
            case 1: // percentages
                params = {
                    manuallyCalculateCalories,
                    macroTargetMode,
                    dietMode,
                    dietPercentage,
                    enableCalorieTarget: enableCaloriesTarget,
                    calorieTarget: caloriesTarget,
                    enableProteinTarget: enableProteinPercentage,
                    proteinTarget: proteinPercentageGrams,
                    proteinPercentage,
                    enableCarbohydratesTarget: enableCarbsPercentage,
                    carbohydratesTarget: carbsPercentageGrams,
                    carbohydratesPercentage: carbsPercentage,
                    enableFatTarget: enableFatPercentage,
                    fatTarget: fatPercentageGrams,
                    fatPercentage,
                    enableColorCoding,
                    caloriesYellowStart,
                    caloriesYellowEnd,
                    caloriesGreenStart,
                    caloriesGreenEnd,
                    proteinYellowStart,
                    proteinYellowEnd,
                    proteinGreenStart,
                    proteinGreenEnd,
                    carbohydratesYellowStart,
                    carbohydratesYellowEnd,
                    carbohydratesGreenStart,
                    carbohydratesGreenEnd,
                    fatYellowStart,
                    fatYellowEnd,
                    fatGreenStart,
                    fatGreenEnd,
                };
                break;
            case 2: // manual
                params = {
                    manuallyCalculateCalories,
                    macroTargetMode,
                    dietMode,
                    dietPercentage,
                    enableCalorieTarget: enableCaloriesTarget,
                    calorieTarget: caloriesTarget,
                    enableProteinTarget: enableProteinGrams,
                    proteinTarget: proteinGrams,
                    proteinPercentage,
                    enableCarbohydratesTarget: enableCarbsGrams,
                    carbohydratesTarget: carbsGrams,
                    carbohydratesPercentage: carbsPercentage,
                    enableFatTarget: enableFatGrams,
                    fatTarget: fatGrams,
                    fatPercentage,
                    enableColorCoding,
                    caloriesYellowStart,
                    caloriesYellowEnd,
                    caloriesGreenStart,
                    caloriesGreenEnd,
                    proteinYellowStart,
                    proteinYellowEnd,
                    proteinGreenStart,
                    proteinGreenEnd,
                    carbohydratesYellowStart,
                    carbohydratesYellowEnd,
                    carbohydratesGreenStart,
                    carbohydratesGreenEnd,
                    fatYellowStart,
                    fatYellowEnd,
                    fatGreenStart,
                    fatGreenEnd,
                };
                break;

            default: // off
                params = {
                    manuallyCalculateCalories,
                    macroTargetMode,
                    dietMode,
                    dietPercentage,
                    enableCalorieTarget: enableCaloriesTarget,
                    calorieTarget: caloriesTarget,
                    enableProteinTarget: false,
                    proteinTarget: proteinGrams,
                    proteinPercentage,
                    enableCarbohydratesTarget: false,
                    carbohydratesTarget: carbsGrams,
                    carbohydratesPercentage: carbsPercentage,
                    enableFatTarget: false,
                    fatTarget: fatGrams,
                    fatPercentage,
                    enableColorCoding,
                    caloriesYellowStart,
                    caloriesYellowEnd,
                    caloriesGreenStart,
                    caloriesGreenEnd,
                    proteinYellowStart,
                    proteinYellowEnd,
                    proteinGreenStart,
                    proteinGreenEnd,
                    carbohydratesYellowStart,
                    carbohydratesYellowEnd,
                    carbohydratesGreenStart,
                    carbohydratesGreenEnd,
                    fatYellowStart,
                    fatYellowEnd,
                    fatGreenStart,
                    fatGreenEnd,
                };
                break;
        }

        setErrorMessage('');
        setSuccessMessage('');

        if (validate()) {
            client('users/updatedietsettings', {
                data: params,
            }).then(
                (data) => {
                    if (data.successful) {
                        setSuccessMessage('Diet settings updated successfully');
                    } else {
                        setErrorMessage(data.error);
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
                },
            );
        } else {
            setErrorMessage('Please correct the validation errors');
        }
    };

    return (
        <>
            <ErrorMessage error={errorMessage} />
            <SuccessMessage message={successMessage} />

            {status === 'initialized' && <LoadingBox />}

            {(status === 'loaded' || status === 'saving') && (
                <form
                    className="autowidth"
                    method="POST"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        await updateDietSettings();
                    }}
                >
                    <fieldset>
                        <div className="form-field">
                            <Checkbox
                                id="manuallycalculatecalories"
                                name="manuallycalculatecalories"
                                label="Manually Calculate Calories"
                                isChecked={manuallyCalculateCalories}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const doManualCalories = e.target.checked;
                                    if (weight === 0 && !doManualCalories) {
                                        setErrorMessage('You must enter your weight before you can automatically calculate calories');
                                        return;
                                    }

                                    if (!doManualCalories) {
                                        setCaloriesTarget(tdee);
                                    }

                                    setManuallyCalculateCalories(doManualCalories);
                                }}
                            />
                        </div>

                        <div
                            className="form-field"
                            data-testid="dietmode-div"
                            style={!manuallyCalculateCalories ? { display: 'block' } : { display: 'none' }}
                        >
                            <SelectField
                                id="dietmode"
                                name="dietmode"
                                label="Diet Mode"
                                value={dietMode}
                                valueList={[
                                    { value: 1, text: 'Maintenance' },
                                    { value: 2, text: 'Cut' },
                                    { value: 3, text: 'Bulk' },
                                ]}
                                includeBlank={false}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    setDietMode(parseInt(e.target.value, 10));
                                }}
                            />
                        </div>

                        <div
                            className="form-field"
                            data-testid="dietpercentage-div"
                            style={!manuallyCalculateCalories && (dietMode !== 0) ? { display: 'block' } : { display: 'none' }}
                        >
                            <TextBox
                                id="dietpercentage"
                                name="dietpercentage"
                                label={`${dietMode === 2 ? 'Cut' : 'Bulk'} Percentage`}
                                value={dietPercentage}
                                error={dietPercentageError}
                                validationRule="numeric"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.value !== '') {
                                        if (!Number.isNaN(e.target.value)) {
                                            setDietPercentage(parseInt(e.target.value, 10));
                                        }
                                    } else {
                                        setDietPercentage(0);
                                    }
                                }}
                                onErrorChange={(error: string) => {
                                    setDietPercentageError(error);
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
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    const macroMode = parseInt(e.target.value, 10);

                                    if (macroMode !== 0) {
                                        setEnableCaloriesTarget(true);
                                    }

                                    setMacroTargetMode(macroMode);
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
                                    onEnableProteinChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setEnableProteinPercentage(e.target.checked);
                                    }}
                                    onProteinChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        if (e.target.value !== '') {
                                            if (!Number.isNaN(e.target.value)) {
                                                setProteinPercentage(parseInt(e.target.value, 10));
                                            }
                                        } else {
                                            setProteinPercentage(0);
                                        }
                                    }}
                                    onEnableCarbsChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setEnableCarbsPercentage(e.target.checked);
                                    }}
                                    onCarbsChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        if (e.target.value !== '') {
                                            if (!Number.isNaN(e.target.value)) {
                                                setCarbsPercentage(parseInt(e.target.value, 10));
                                            }
                                        } else {
                                            setCarbsPercentage(0);
                                        }
                                    }}
                                    onEnableFatChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setEnableFatPercentage(e.target.checked);
                                    }}
                                    onFatChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                                    onEnableProteinChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setEnableProteinGrams(e.target.checked);
                                    }}
                                    onProteinChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        if (e.target.value !== '') {
                                            if (!Number.isNaN(e.target.value)) {
                                                setProteinGrams(parseInt(e.target.value, 10));
                                            }
                                        } else {
                                            setProteinGrams(0);
                                        }
                                    }}
                                    onEnableCarbsChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setEnableCarbsGrams(e.target.checked);
                                    }}
                                    onCarbsChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        if (e.target.value !== '') {
                                            if (!Number.isNaN(e.target.value)) {
                                                setCarbsGrams(parseInt(e.target.value, 10));
                                            }
                                        } else {
                                            setCarbsGrams(0);
                                        }
                                    }}
                                    onEnableFatChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setEnableFatGrams(e.target.checked);
                                    }}
                                    onFatChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                            <Checkbox
                                id="enablecolorcoding"
                                name="enablecolorcoding"
                                label="Enable Color Coding"
                                value={1}
                                isChecked={enableColorCoding}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setEnableColorCoding(e.target.checked);
                                }}
                            />
                        </div>

                        <div
                            className="form-field"
                            data-testid="colorcoding-div"
                            style={enableColorCoding ? { display: 'block' } : { display: 'none' }}
                        >
                            <ColorCodingForm
                                mode="Calories"
                                yellowStart={caloriesYellowStart}
                                yellowEnd={caloriesYellowEnd}
                                greenStart={caloriesGreenStart}
                                greenEnd={caloriesGreenEnd}
                                onYellowStartChange={(e) => {
                                    setCaloriesYellowStart(parseInt(e.target.value, 10));
                                }}
                                onYellowEndChange={(e) => {
                                    setCaloriesYellowEnd(parseInt(e.target.value, 10));
                                }}
                                onGreenStartChange={(e) => {
                                    setCaloriesGreenStart(parseInt(e.target.value, 10));
                                }}
                                onGreenEndChange={(e) => {
                                    setCaloriesGreenEnd(parseInt(e.target.value, 10));
                                }}
                            />

                            <ColorCodingForm
                                mode="Protein"
                                yellowStart={proteinYellowStart}
                                yellowEnd={proteinYellowEnd}
                                greenStart={proteinGreenStart}
                                greenEnd={proteinGreenEnd}
                                onYellowStartChange={(e) => {
                                    setProteinYellowStart(parseInt(e.target.value, 10));
                                }}
                                onYellowEndChange={(e) => {
                                    setProteinYellowEnd(parseInt(e.target.value, 10));
                                }}
                                onGreenStartChange={(e) => {
                                    setProteinGreenStart(parseInt(e.target.value, 10));
                                }}
                                onGreenEndChange={(e) => {
                                    setProteinGreenEnd(parseInt(e.target.value, 10));
                                }}
                            />

                            <ColorCodingForm
                                mode="Carbohydrates"
                                yellowStart={carbohydratesYellowStart}
                                yellowEnd={carbohydratesYellowEnd}
                                greenStart={carbohydratesGreenStart}
                                greenEnd={carbohydratesGreenEnd}
                                onYellowStartChange={(e) => {
                                    setCarbohydratesYellowStart(parseInt(e.target.value, 10));
                                }}
                                onYellowEndChange={(e) => {
                                    setCarbohydratesYellowEnd(parseInt(e.target.value, 10));
                                }}
                                onGreenStartChange={(e) => {
                                    setCarbohydratesGreenStart(parseInt(e.target.value, 10));
                                }}
                                onGreenEndChange={(e) => {
                                    setCarbohydratesGreenEnd(parseInt(e.target.value, 10));
                                }}
                            />

                            <ColorCodingForm
                                mode="Fat"
                                yellowStart={fatYellowStart}
                                yellowEnd={fatYellowEnd}
                                greenStart={fatGreenStart}
                                greenEnd={fatGreenEnd}
                                onYellowStartChange={(e) => {
                                    setFatYellowStart(parseInt(e.target.value, 10));
                                }}
                                onYellowEndChange={(e) => {
                                    setFatYellowEnd(parseInt(e.target.value, 10));
                                }}
                                onGreenStartChange={(e) => {
                                    setFatGreenStart(parseInt(e.target.value, 10));
                                }}
                                onGreenEndChange={(e) => {
                                    setFatGreenEnd(parseInt(e.target.value, 10));
                                }}
                            />
                        </div>

                        <div className="form-field">
                            <button type="submit" disabled={saveDisabled} aria-disabled={saveDisabled}>
                                Save Changes
                            </button>
                        </div>
                    </fieldset>
                </form>
            )}
        </>
    );
};

export { EditDietSettingsForm };
