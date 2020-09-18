import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import { client } from '../../lib/client';
import { FormValidator } from '../../lib/FormValidator';
import { Utilities } from '../../lib/Utilities';
import { TextBox } from '../TextBox/TextBox';
import { Confirm } from '../Confirm/Confirm';
import { SelectField } from '../SelectField/SelectField';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { SuccessMessage } from '../SuccessMessage/SuccessMessage';
import { AppContext } from '../AppContext/AppContext';
import { LoadingBox } from '../LoadingBox/LoadingBox';

import 'react-datepicker/dist/react-datepicker.css';

const EditProfileForm: React.FC = () => {
    const [status, setStatus] = useState('initialized');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [measurementSystem, setMeasurementSystem] = useState(1);
    const [measurementSystemError] = useState('');
    const [gender, setGender] = useState('M');
    const [activityLevel, setActivityLevel] = useState(1);
    const [birthday, setBirthday] = useState(new Date());
    const [birthdayError, setBirthdayError] = useState('');
    const [height, setHeight] = useState(0);
    const [heightError, setHeightError] = useState('');
    const [avatar, setAvatar] = useState('');
    const [saveDisabled, setSaveDisabled] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);

    const { currentUser, setOverlayVisibility } = useContext(AppContext);

    const getUserAvatar = () => {
        client('users/getavatar').then(
            (data) => {
                if (data.successful) {
                    setAvatar(`data:image/png;base64,${data.image}`);
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
    };

    useEffect(() => {
        client('users/getuser').then(
            (data) => {
                if (data.successful) {
                    setName(data.user.Name);
                    setEmail(data.user.Email);
                    setMeasurementSystem(parseInt(data.user.MeasurementSystem, 10));
                    setGender(data.user.Gender);
                    setActivityLevel(data.user.ActivityLevel);

                    if (data.user.Birthday.substring(0, 4) !== '0001') {
                        setBirthday(new Date(data.user.Birthday));
                    }

                    if (data.user.Height > 0) {
                        setHeight(data.user.Height);
                    }

                    if (data.user.Avatar !== '' && data.user.Avatar !== null) {
                        getUserAvatar();
                    } else {
                        setStatus('loaded');
                    }
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
        if (emailError === '' && heightError === '' && birthdayError === '' && nameError === '') {
            setSaveDisabled(false);
        } else {
            setSaveDisabled(true);
        }
    }, [emailError, heightError, birthdayError, nameError]);

    const validateBirthday = (dob: Date) => {
        const age = Utilities.calculateAge(dob);

        let isValid = true;

        if (age < 13) {
            setBirthdayError('You must be 13 years or older to register');
            isValid = false;
        } else {
            setBirthdayError('');
        }

        return isValid;
    };

    const validate = () => {
        let isValid = true;

        if (!FormValidator.validateNotEmpty(name)) {
            isValid = false;
            setNameError('Name is required');
        }

        if (!FormValidator.validateEmail(email)) {
            setEmailError('Valid email address required');
            isValid = false;
        }

        if (!FormValidator.validateRequiredNumericGreaterThanZero(height)) {
            setHeightError('Height must be numeric and greater than zero');
            isValid = false;
        }

        if (!validateBirthday(birthday)) {
            isValid = false;
        }

        return isValid;
    };

    const saveProfile = () => {
        setOverlayVisibility(true, true);
        setErrorMessage('');
        setSuccessMessage('');

        if (validate()) {
            client('users/updateprofile', {
                data: {
                    Name: name,
                    Email: email,
                    MeasurementSystem: measurementSystem,
                    Birthday: birthday,
                    Height: height,
                    Gender: gender,
                    ActivityLevel: activityLevel,
                },
            }).then(
                (data) => {
                    if (data.successful) {
                        setSuccessMessage('Profile updated successfully');
                    } else {
                        setErrorMessage(data.error);
                    }
                    setOverlayVisibility(false, false);
                },
                (error) => {
                    if (typeof error === 'string') {
                        setErrorMessage(error);
                    } else if (typeof error.message === 'string') {
                        setErrorMessage(error.message);
                    } else {
                        setErrorMessage('An error has occurred');
                    }
                    setOverlayVisibility(false, false);
                },
            );
        } else {
            setErrorMessage('Please correct the validation errors');
            setOverlayVisibility(false, false);
        }
    };

    const checkEmail = (enteredEmail: string) => {
        if (!FormValidator.validateEmail(enteredEmail)) {
            setEmailError('Valid email address required');
        } else {
            client(`users/checkemail?userId=${currentUser.id}&email=${enteredEmail}`).then(
                (data) => {
                    if (data.successful) {
                        if (!data.valid) {
                            setEmailError('Email is already in use');
                        } else {
                            setEmailError('');
                        }
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
        }
    };

    const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        setErrorMessage('');
        setSuccessMessage('');

        const { files } = e.target;
        const formData = new FormData();
        formData.append('Image', files[0]);

        client('users/uploadavatar', { data: formData, contentType: null, fileUpload: true }).then(
            (data) => {
                if (data.successful) {
                    setSuccessMessage('Avatar uploaded successfully');
                    setAvatar(`data:image/png;base64,${data.image}`);
                } else {
                    setErrorMessage(data.error);
                }
            },
            (error) => {
                if (typeof error === 'string') {
                    setErrorMessage(error);
                } else if (typeof error.message === 'string') {
                    setErrorMessage(error.message);
                } else if (error.errors.Image[0]) {
                    setErrorMessage(error.errors.Image[0]);
                } else {
                    setErrorMessage('An error has occurred');
                }
            },
        );
    };

    const removeAvatar = async () => {
        setErrorMessage('');
        setSuccessMessage('');

        await client('users/removeavatar', { data: {} }).then(
            (data) => {
                if (data.successful) {
                    setAvatar('');
                    setSuccessMessage('Avatar removed successfully');
                } else {
                    setErrorMessage(data.error);
                }
                setConfirmVisible(false);
            },
            (error) => {
                if (typeof error === 'string') {
                    setErrorMessage(error);
                } else if (typeof error.message === 'string') {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage('An error has occurred');
                }
                setConfirmVisible(false);
            },
        );
    };

    return (
        <>
            <ErrorMessage error={errorMessage} />
            <SuccessMessage message={successMessage} />

            <Confirm
                text="Are you sure you want to remove your avatar?"
                visible={confirmVisible}
                onCancel={() => {
                    setConfirmVisible(false);
                }}
                onConfirm={async () => {
                    await removeAvatar();
                }}
            />

            {status === 'initialized' && <LoadingBox />}

            {(status === 'loaded' || status === 'saving') && (
                <form
                    className="autowidth"
                    method="POST"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        await saveProfile();
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
                                autocomplete="name"
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
                                id="email"
                                name="email"
                                label="Email"
                                value={email}
                                error={emailError}
                                autocomplete="email"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setEmail(e.target.value);
                                }}
                                validate={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    e.preventDefault();
                                    checkEmail(e.target.value);
                                }}
                            />
                        </div>

                        <div className="form-field">
                            <SelectField
                                id="measurementsystem"
                                name="measurementsystem"
                                label="Measurement System"
                                value={measurementSystem}
                                valueList={[
                                    { value: 1, text: 'US' },
                                    { value: 2, text: 'Metric' },
                                ]}
                                error={measurementSystemError}
                                requiredField
                                includeBlank={false}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    setMeasurementSystem(parseInt(e.target.value, 10));
                                }}
                            />
                        </div>

                        <div className="form-field">
                            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                            <label htmlFor="birthday" className={birthdayError !== '' ? 'errored' : ''}>
                                Birthday
                                <br />
                                <DatePicker
                                    name="birthday"
                                    id="birthday"
                                    selected={birthday}
                                    onChange={(date: Date, e: React.ChangeEvent<HTMLInputElement>) => {
                                        e.preventDefault();
                                        setBirthday(date);
                                        validateBirthday(date);
                                    }}
                                    closeOnScroll
                                    autoComplete="bday"
                                    maxDate={new Date()}
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                />
                            </label>
                        </div>

                        <div className="form-field">
                            <TextBox
                                id="height"
                                name="height"
                                label={`Height (${measurementSystem === 1 ? 'inches' : 'meters'})`}
                                value={height}
                                error={heightError}
                                validationRule="requiredgreaterzero"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.value !== '') {
                                        if (!Number.isNaN(e.target.value)) {
                                            setHeight(parseInt(e.target.value, 10));
                                        }
                                    } else {
                                        setHeight(0);
                                    }
                                }}
                                onErrorChange={(error: string) => {
                                    setHeightError(error.replace(' (inches)', '').replace(' (meters)', ''));
                                }}
                            />
                        </div>

                        <div className="form-field">
                            <SelectField
                                id="gender"
                                name="gender"
                                label="Gender"
                                value={gender}
                                valueList={[
                                    { value: 'M', text: 'Male' },
                                    { value: 'F', text: 'Female' },
                                ]}
                                requiredField
                                includeBlank={false}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    setGender(e.target.value);
                                }}
                            />
                        </div>

                        <div className="form-field">
                            <SelectField
                                id="activitylevel"
                                name="activitylevel"
                                label="Activity Level"
                                value={activityLevel}
                                valueList={[
                                    { value: 1, text: 'Sedentary' },
                                    { value: 2, text: 'Lightly Active' },
                                    { value: 3, text: 'Moderately Active' },
                                    { value: 4, text: 'Very Active' },
                                    { value: 5, text: 'Extremely Active' },
                                ]}
                                requiredField
                                includeBlank={false}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    setActivityLevel(parseInt(e.target.value, 10));
                                }}
                            />
                        </div>

                        <div className="form-field-upload">
                            <label htmlFor="avatar">
                                Avatar
                                {avatar !== '' && (
                                    <div className="image-preview">
                                        <img src={avatar} alt={name} />
                                        <div className="remove-avatar">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setConfirmVisible(true);
                                                }}
                                            >
                                                Remove Avatar
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div className="upload-field">
                                    <div className="button-wrap">
                                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                                        <label className="button" htmlFor="avatar">
                                            {avatar === '' ? 'Choose Image' : 'Replace Avatar'}
                                        </label>
                                        <input
                                            type="file"
                                            id="avatar"
                                            name="avatar"
                                            accept="image/*"
                                            onChange={(e) => {
                                                uploadImage(e);
                                            }}
                                        />
                                    </div>
                                </div>
                            </label>
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

export { EditProfileForm };
