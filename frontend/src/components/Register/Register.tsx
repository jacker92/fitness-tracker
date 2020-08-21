import React, { useEffect, useState, useContext } from 'react';
import DatePicker from 'react-datepicker';
import { client } from '../../lib/client';
import { Form } from '../Styles/Form';
import { TextBox } from '../TextBox/TextBox';
import { SelectField } from '../SelectField/SelectField';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { AppContext } from '../AppContext/AppContext';

const Register = () => {
    // eslint-disable-next-line no-unused-vars
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [emailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError] = useState('');
    const [name, setName] = useState('');
    const [nameError] = useState('');
    const [measurementSystem, setMeasurementSystem] = useState(1);
    const [measurementSystemError] = useState('');
    const [gender, setGender] = useState('M');
    const [activityLevel, setActivityLevel] = useState(1);
    const [birthday, setBirthday] = useState(new Date());
    const [birthdayError] = useState('');
    const [height, setHeight] = useState(0);
    const [heightError, setHeightError] = useState('');
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const { loginUser } = useContext(AppContext);

    useEffect(() => {
        if (emailError !== '' || passwordError !== '' || confirmPasswordError !== '' || nameError) {
            setSubmitDisabled(true);
        } else {
            setSubmitDisabled(false);
        }
    }, [emailError, passwordError, confirmPasswordError, nameError]);

    const register = async () => {
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
                    setMessage('');
                    loginUser(data.token);
                    window.location.assign('/');
                } else {
                    setMessage(data.error);
                }
            },
            (error) => {
                if (typeof error === 'string') {
                    setMessage(error);
                } else if (typeof error.message === 'string') {
                    setMessage(error.message);
                } else {
                    setMessage('An error has occurred');
                }
            },
        );
    };

    return (
        <>
            <h1 className="centered">Register for an Account</h1>

            <ErrorMessage error={message} />

            <Form
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
                            validationRule="notempty"
                            onChange={(e: any) => {
                                setName(e.target.value);
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
                            validationRule="email"
                            onChange={(e: any) => {
                                setEmail(e.target.value);
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
                            validationRule="notempty"
                            onChange={(e: any) => {
                                setPassword(e.target.value);
                            }}
                        />
                    </div>

                    <div className="form-field">
                        <TextBox
                            id="confirm_password"
                            name="confirm_password"
                            type="password"
                            label="Confirm Password"
                            value={confirmPassword}
                            error={confirmPasswordError}
                            validationRule="notempty"
                            onChange={(e: any) => {
                                setConfirmPassword(e.target.value);
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
                                if (e.target.value !== '') {
                                    if (!Number.isNaN(e.target.value)) {
                                        setHeight(parseInt(e.target.value, 10));
                                    }
                                } else {
                                    setHeight(0);
                                }
                            }}
                            onErrorChange={(error: string) => {
                                setHeightError(error);
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
                            onChange={(e: any) => {
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
                            onChange={(e: any) => {
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
            </Form>
        </>
    );
};

export { Register };
