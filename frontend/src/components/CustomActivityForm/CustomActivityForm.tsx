import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Activity } from '../../types/Activity';
import { CustomActivityFormProps } from '../../types/CustomActivityFormProps';
import { client } from '../../lib/client';
import { FormValidator } from '../../lib/FormValidator';
import { ModalWindow } from '../ModalWindow/ModalWindow';
import { TextBox } from '../TextBox/TextBox';
import { SelectField } from '../SelectField/SelectField';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';

const CustomActivityForm: React.FC<CustomActivityFormProps> = (props) => {
    const {
        activity, visible, onSuccess, onCancel,
    } = props;

    const [isVisible, setIsVisible] = useState(visible);
    const [id, setId] = useState(activity.id);
    const [name, setName] = useState(activity.name);
    const [nameError, setNameError] = useState('');
    const [estimatedCaloriesBurnedPerMinute, setEstimatedCaloriesBurnedPerMinute] = useState(activity.estimatedCaloriesBurnedPerMinute);
    const [type, setType] = useState(activity.type);
    const [saveDisabled, setSaveDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const theActivityForm = useRef(null);

    useEffect(() => {
        setIsVisible(visible);
    }, [visible]);

    useEffect(() => {
        setId(activity.id);
        setName(activity.name);
        setEstimatedCaloriesBurnedPerMinute(activity.estimatedCaloriesBurnedPerMinute);
        setType(activity.type);
    }, [activity]);

    useEffect(() => {
        if (nameError === '') {
            setSaveDisabled(false);
        } else {
            setSaveDisabled(true);
        }
    }, [nameError]);

    const resetForm = () => {
        setName('');
        setNameError('');
        setEstimatedCaloriesBurnedPerMinute(0);
        setType(0);
        setSaveDisabled(false);
        theActivityForm.current.reset();
    };

    const addActivity = (newActivity: Activity) => {
        client('activities/addactivity', {
            data: {
                name: newActivity.name,
                estimatedCaloriesBurnedPerMinute: newActivity.estimatedCaloriesBurnedPerMinute,
                type: newActivity.type,
            },
        }).then(
            (data) => {
                if (data.successful) {
                    resetForm();
                    onSuccess(data.activities);
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
    };

    const updateActivity = (updatedActivity: Activity) => {
        client('activities/updateactivity', {
            data: {
                id: updatedActivity.id,
                name: updatedActivity.name,
                type: updatedActivity.type,
                estimatedCaloriesBurnedPerMinute: updatedActivity.estimatedCaloriesBurnedPerMinute,
            },
        }).then(
            (data) => {
                if (data.successful) {
                    resetForm();
                    onSuccess(data.activities);
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
    };

    const validate = () => {
        let isValid = true;

        if (!FormValidator.validateNotEmpty(name)) {
            isValid = false;
            setNameError('Name is required');
        }

        return isValid;
    };

    return (
        <ModalWindow width={376} visible={isVisible}>
            <div className="grid-form">
                <h2>Add New Metric</h2>

                <ErrorMessage error={errorMessage} />

                <form
                    className="autowidth"
                    method="POST"
                    ref={theActivityForm}
                    onSubmit={async (e) => {
                        e.preventDefault();

                        if (validate()) {
                            const editedActivity: Activity = {
                                id,
                                name,
                                estimatedCaloriesBurnedPerMinute,
                                type,
                                isSystem: false,
                            };

                            if (id > 0) {
                                await updateActivity(editedActivity);
                            } else {
                                await addActivity(editedActivity);
                            }
                        }
                    }}
                >
                    <fieldset>
                        <div className="form-field">
                            <TextBox
                                id="name"
                                name="name"
                                label="Name"
                                value={name}
                                error={nameError}
                                validationRule="notempty"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setName(e.target.value);
                                }}
                                onErrorChange={(error: string) => {
                                    setNameError(error);
                                }}
                            />
                        </div>

                        <div className="form-field">
                            <TextBox
                                id="estimatedCaloriesBurnedPerMinute"
                                name="estimatedCaloriesBurnedPerMinute"
                                label="Est. Calories Burned per Minute"
                                value={estimatedCaloriesBurnedPerMinute}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.value !== '') {
                                        if (!Number.isNaN(e.target.value)) {
                                            setEstimatedCaloriesBurnedPerMinute(parseInt(e.target.value, 10));
                                        }
                                    } else {
                                        setEstimatedCaloriesBurnedPerMinute(0);
                                    }
                                }}
                            />
                        </div>

                        <div className="form-field">
                            <SelectField
                                id="metrictype"
                                name="metrictype"
                                label="Type"
                                value={type}
                                valueList={[
                                    { value: 0, text: 'None' },
                                    { value: 1, text: 'Distance' },
                                ]}
                                requiredField
                                includeBlank={false}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    const typeVal = parseInt(e.target.value, 10);
                                    setType(typeVal);
                                }}
                            />
                        </div>

                        <div className="form-field">
                            <button type="submit" disabled={saveDisabled} aria-disabled={saveDisabled}>
                                {id > 0 ? 'Update' : 'Add' }
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    resetForm();
                                    onCancel();
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </ModalWindow>
    );
};

CustomActivityForm.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    activity: PropTypes.exact({
        id: PropTypes.number,
        name: PropTypes.string.isRequired,
        estimatedCaloriesBurnedPerMinute: PropTypes.number.isRequired,
        type: PropTypes.number.isRequired,
        isSystem: PropTypes.bool.isRequired,
    }).isRequired,
    visible: PropTypes.bool.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export { CustomActivityForm };
