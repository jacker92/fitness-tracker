import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import { client } from '../../lib/client';
import { FormValidator } from '../../lib/FormValidator';
import { Form } from '../Styles/Form';
import { TextBox } from '../TextBox/TextBox';
import { SelectField } from '../SelectField/SelectField';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { SuccessMessage } from '../SuccessMessage/SuccessMessage';
import { AppContext } from '../AppContext/AppContext';
import { LoadingBox } from '../LoadingBox/LoadingBox';

import 'react-datepicker/dist/react-datepicker.css';

const EditProfileForm = () => {
    const [status, setStatus] = useState('initialized');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [measurementSystem, setMeasurementSystem] = useState(1);
    const [measurementSystemError] = useState('');
    const [birthday, setBirthday] = useState(new Date());
    const [birthdayError] = useState('');
    const [height, setHeight] = useState('');
    const [heightError, setHeightError] = useState('');
    const [avatar, setAvatar] = useState('');
    const [saveDisabled, setSaveDisabled] = useState(false);

    const { currentUser } = useContext(AppContext);

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
                    setMeasurementSystem(data.user.MeasurementSystem);

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

    const validate = () => {
        let isValid = true;

        if (!FormValidator.validateNotEmpty(name)) {
            isValid = false;
            setNameError('Name is required');
        }

        if (!FormValidator.validateNumeric(height)) {
            isValid = false;
            setHeightError('Height must be numeric');
        }

        return isValid;
    };

    const saveProfile = () => {
        setErrorMessage('');
        setSuccessMessage('');

        if (validate()) {
            client('users/updateprofile', {
                data: {
                    Name: name,
                    Email: email,
                    MeasurementSystem: measurementSystem,
                    Birthday: birthday,
                    Height: parseInt(height, 10),
                },
            }).then(
                (data) => {
                    if (data.successful) {
                        setSuccessMessage('Profile updated successfully');
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

    const checkEmail = (enteredEmail: string) => {
        if (!FormValidator.validateEmail(enteredEmail)) {
            setEmailError('Valid email address required');
        } else {
            client(`users/checkemail?userId=${currentUser.id}&email=${enteredEmail}`).then(
                (data) => {
                    if (data.successful) {
                        if (!data.valid) {
                            setEmailError('Email is already in use');
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

    const uploadImage = (e: any) => {
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

    const removeAvatar = () => {
        setErrorMessage('');
        setSuccessMessage('');

        // eslint-disable-next-line no-alert
        if (window.confirm('Are you sure you want to remove your avatar?')) {
            client('users/removeavatar', { data: {} }).then(
                (data) => {
                    if (data.successful) {
                        setAvatar('');
                        setSuccessMessage('Avatar removed successfully');
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
        }
    };

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
                                validationRule="notempty"
                                onChange={(e: any) => {
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
                                onChange={(e: any) => {
                                    setEmail(e.target.value);
                                }}
                                validate={(e: any) => {
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
                                onChange={(e: any) => {
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
                                    onChange={(date: Date, e: any) => {
                                        e.preventDefault();
                                        setBirthday(date);
                                    }}
                                    closeOnScroll
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
                                validationRule="numeric"
                                onChange={(e: any) => {
                                    setHeight(e.target.value);
                                }}
                                onErrorChange={(error: string) => {
                                    setHeightError(error);
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
                                            <button type="button" onClick={removeAvatar}>
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
                </Form>
            )}
        </>
    );
};

export { EditProfileForm };
