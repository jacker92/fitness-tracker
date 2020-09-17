import React, { useState, useEffect, useContext } from 'react';
import { client } from '../../lib/client';
import { FormValidator } from '../../lib/FormValidator';
import { TextBox } from '../TextBox/TextBox';
import { SelectField } from '../SelectField/SelectField';
import { Checkbox } from '../Checkbox/Checkbox';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { SuccessMessage } from '../SuccessMessage/SuccessMessage';
import { AppContext } from '../AppContext/AppContext';
import { LoadingBox } from '../LoadingBox/LoadingBox';

const EditActivitySettingsForm = () => {
    const [status, setStatus] = useState('initialized');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [caloriesBurnedSetting, setCaloriesBurnedSetting] = useState(0);
    const [enableActiveMinuteTarget, setEnableActiveMinuteTarget] = useState(false);
    const [activeMinuteTarget, setActiveMinuteTarget] = useState(0);
    const [activeMinuteTargetError, setActiveMinuteTargetError] = useState('');
    const [enableCaloriesBurnedTarget, setEnableCaloriesBurnedTarget] = useState(false);
    const [caloriesBurnedTarget, setCaloriesBurnedTarget] = useState(0);
    const [caloriesBurnedTargetError, setCaloriesBurnedTargetError] = useState('');
    const [saveDisabled, setSaveDisabled] = useState(false);

    const { currentUser } = useContext(AppContext);

    useEffect(() => {
        client('users/getuser').then(
            (data) => {
                if (data.successful) {
                    setCaloriesBurnedSetting(data.user.CaloriesBurnedSetting);
                    setEnableActiveMinuteTarget(data.user.DailyTarget.EnableActiveMinuteTarget);
                    setActiveMinuteTarget(data.user.DailyTarget.ActiveMintueTarget);
                    setEnableCaloriesBurnedTarget(data.user.DailyTarget.EnableCaloriesBurnedTarget);
                    setCaloriesBurnedTarget(data.user.DailyTarget.CaloriesBurnedTarget);
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

    useEffect(() => {
        if (activeMinuteTargetError === '' && caloriesBurnedTargetError === '') {
            setSaveDisabled(false);
        } else {
            setSaveDisabled(true);
        }
    }, [activeMinuteTargetError, caloriesBurnedTargetError]);

    const validate = () => {
        let isValid = true;

        if (!FormValidator.validateNumeric(activeMinuteTarget)) {
            isValid = false;
            setActiveMinuteTargetError('Active Minute Target must be numeric');
        }

        if (!FormValidator.validateNumeric(caloriesBurnedTarget)) {
            isValid = false;
            setCaloriesBurnedTargetError('Calories Burned Target must be numeric');
        }

        return isValid;
    };

    const saveActivitySettings = () => {
        setErrorMessage('');
        setSuccessMessage('');

        if (validate()) {
            client('users/updateactivitysettings', {
                data: {
                    CaloriesBurnedSetting: caloriesBurnedSetting,
                    EnableActiveMinuteTarget: enableActiveMinuteTarget,
                    ActiveMintueTarget: activeMinuteTarget,
                    EnableCaloriesBurnedTarget: enableCaloriesBurnedTarget,
                    CaloriesBurnedTarget: caloriesBurnedTarget,
                },
            }).then(
                (data) => {
                    if (data.successful) {
                        setSuccessMessage('Activity settings updated successfully');
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
                        await saveActivitySettings();
                    }}
                >
                    <fieldset>
                        <div className="form-field">
                            <SelectField
                                id="caloriesburnedsetting"
                                name="caloriesburnedsetting"
                                label="Handle Calories Burned"
                                value={caloriesBurnedSetting}
                                valueList={[
                                    { value: 0, text: 'Ignore' },
                                    { value: 1, text: 'Balance' },
                                ]}
                                requiredField
                                includeBlank={false}
                                onChange={(e: any) => {
                                    setCaloriesBurnedSetting(parseInt(e.target.value, 10));
                                }}
                            />
                        </div>

                        <div className="form-field">
                            <Checkbox
                                id="enableactiveminutetarget"
                                name="enableactiveminutetarget"
                                label="Enable Active Minute Target"
                                value={1}
                                isChecked={enableActiveMinuteTarget}
                                onChange={(e: any) => {
                                    setEnableActiveMinuteTarget(e.target.checked);
                                }}
                            />
                        </div>

                        <div
                            className="form-field"
                            data-testid="activeminutetarget-div"
                            style={enableActiveMinuteTarget ? { display: 'block' } : { display: 'none' }}
                        >
                            <TextBox
                                id="activeminutetarget"
                                name="activeminutetarget"
                                label="Active Minute Target"
                                value={activeMinuteTarget}
                                error={activeMinuteTargetError}
                                validationRule="numeric"
                                onChange={(e: any) => {
                                    if (e.target.value !== '') {
                                        if (!Number.isNaN(e.target.value)) {
                                            setActiveMinuteTarget(parseInt(e.target.value, 10));
                                        }
                                    } else {
                                        setActiveMinuteTarget(0);
                                    }
                                }}
                                onErrorChange={(error: string) => {
                                    setActiveMinuteTargetError(error);
                                }}
                            />
                        </div>

                        <div className="form-field">
                            <Checkbox
                                id="enablecaloriesburnedtarget"
                                name="enablecaloriesburnedtarget"
                                label="Enable Calories Burned Target"
                                value={1}
                                isChecked={enableCaloriesBurnedTarget}
                                onChange={(e: any) => {
                                    setEnableCaloriesBurnedTarget(e.target.checked);
                                }}
                            />
                        </div>

                        <div
                            className="form-field"
                            data-testid="caloriesburnedtarget-div"
                            style={enableCaloriesBurnedTarget ? { display: 'block' } : { display: 'none' }}
                        >
                            <TextBox
                                id="caloriesburnedtarget"
                                name="caloriesburnedtarget"
                                label="Calories Burned Target"
                                value={caloriesBurnedTarget}
                                error={caloriesBurnedTargetError}
                                validationRule="numeric"
                                onChange={(e: any) => {
                                    if (e.target.value !== '') {
                                        if (!Number.isNaN(e.target.value)) {
                                            setCaloriesBurnedTarget(parseInt(e.target.value, 10));
                                        }
                                    } else {
                                        setCaloriesBurnedTarget(0);
                                    }
                                }}
                                onErrorChange={(error: string) => {
                                    setCaloriesBurnedTargetError(error);
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

export { EditActivitySettingsForm };
