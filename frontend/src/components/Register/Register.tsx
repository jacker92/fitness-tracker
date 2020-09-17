import React, { useEffect, useState, useContext } from 'react';
import DatePicker from 'react-datepicker';
import { client } from '../../lib/client';
import { FormValidator } from '../../lib/FormValidator';
import { Utilities } from '../../lib/Utilities';
import { TextBox } from '../TextBox/TextBox';
import { SelectField } from '../SelectField/SelectField';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { AppContext } from '../AppContext/AppContext';

const Register = () => {
    // eslint-disable-next-line no-unused-vars
    const [errorMessage, setErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [measurementSystem, setMeasurementSystem] = useState(1);
    const [measurementSystemError] = useState('');
    const [gender, setGender] = useState('M');
    const [activityLevel, setActivityLevel] = useState(1);
    const [birthday, setBirthday] = useState(new Date());
    const [birthdayError, setBirthdayError] = useState('');
    const [height, setHeight] = useState(0);
    const [heightError, setHeightError] = useState('');
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const { loginUser } = useContext(AppContext);

    useEffect(() => {
        if (emailError !== '' || passwordError !== '' || confirmPasswordError !== '' || nameError !== '' || birthdayError !== '' || heightError !== '') {
            setSubmitDisabled(true);
        } else {
            setSubmitDisabled(false);
        }
    }, [emailError, passwordError, confirmPasswordError, nameError, birthdayError, heightError]);

    const checkEmail = (enteredEmail: string) => {
        if (!FormValidator.validateEmail(enteredEmail)) {
            setEmailError('Valid email address required');
        } else {
            client(`users/checkemail?userId=0&email=${enteredEmail}`).then(
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
                },
            );
        }
    };

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
            setNameError('Name is required');
            isValid = false;
        }

        if (!FormValidator.validateEmail(email)) {
            setEmailError('Valid email address required');
            isValid = false;
        }

        const passwordValidationResult = FormValidator.validatePassword(password, confirmPassword);
        if (!passwordValidationResult.valid) {
            setPasswordError(passwordValidationResult.message);
            setConfirmPasswordError(passwordValidationResult.message);
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

    const register = async () => {
        if (validate()) {
            client('users/register', {
                data: {
                    Name: name,
                    Email: email,
                    Password: password,
                    MeasurementSystem: measurementSystem,
                    Gender: gender,
                    ActivityLevel: activityLevel,
                    Birthday: birthday,
                    Height: height,
                },
            }).then(
                (data) => {
                    if (data.successful) {
                        setErrorMessage('');
                        loginUser(data.token);
                        window.location.assign('/');
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

    const validatePassword = () => {
        const { valid: passwordsValid, message } = FormValidator.validatePassword(password, confirmPassword);

        if (!passwordsValid) {
            setPasswordError(message);
            setConfirmPasswordError(message);
        } else {
            setPasswordError('');
            setConfirmPasswordError('');
        }
    };

    return (
        <>
            <h1 className="centered">Register for an Account</h1>

            <ErrorMessage error={errorMessage} />

            <form
                method="POST"
                onSubmit={async (e) => {
                    e.preventDefault();
                    await register();
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
                        <TextBox
                            id="password"
                            name="password"
                            type="password"
                            label="Password"
                            value={password}
                            error={passwordError}
                            autocomplete="new-password"
                            validationRule="notempty"
                            showErrorMessage={false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setPassword(e.target.value);
                            }}
                            validate={(e: React.ChangeEvent<HTMLInputElement>) => {
                                e.persist();
                                validatePassword();
                            }}
                        />
                    </div>

                    <div className="form-field">
                        <TextBox
                            id="confirmpassword"
                            name="confirmpassword"
                            type="password"
                            label="Confirm Password"
                            value={confirmPassword}
                            error={confirmPasswordError}
                            autocomplete="new-password"
                            validationRule="notempty"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setConfirmPassword(e.target.value);
                            }}
                            validate={(e: React.ChangeEvent<HTMLInputElement>) => {
                                e.persist();
                                validatePassword();
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
                                onChange={(date: Date, e: any) => {
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
                            <div className="error-text" style={birthdayError !== '' ? { display: 'block' } : { display: 'none' }}>
                                {birthdayError}
                            </div>
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

                    <div className="form-field">
                        <button type="submit" disabled={submitDisabled} aria-disabled={submitDisabled}>
                            Create Account
                        </button>
                    </div>
                </fieldset>
            </form>
        </>
    );
};

export { Register };
