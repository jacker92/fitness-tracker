/**
 * Fields:
 * Name
 * Email
 * Measurement System
 * Birthday
 * Height
 * Avatar
 */

import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import { client } from '../../lib/client';
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
    const [nameError] = useState('');
    const [email, setEmail] = useState('');
    const [emailError] = useState('');
    const [measurementSystem, setMeasurementSystem] = useState(1);
    const [measurementSystemError] = useState('');
    const [birthday, setBirthday] = useState(new Date());
    const [birthdayError] = useState('');
    const [height, setHeight] = useState('');
    const [heightError] = useState('');

    const { currentUser } = useContext(AppContext);

    useEffect(() => {
        client('users/getuser').then(
            (data) => {
                if (data.successful) {
                    setName(data.user.Name);
                    setEmail(data.user.Email);
                    setMeasurementSystem(data.user.MeasurementSystem);

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

    const saveProfile = async () => {
        setErrorMessage('');
        setSuccessMessage('');

        client('users/updateprofile', {
            data: {
                Name: name, Email: email, MeasurementSystem: measurementSystem, Birthday: birthday, Height: height,
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
    };

    return (
        <>
            <ErrorMessage error={errorMessage} />
            <SuccessMessage message={successMessage} />

            {status === 'initialized' && (<LoadingBox />)}

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
                            <SelectField
                                id="measurementsystem"
                                name="measurementsystem"
                                label="Measurement System"
                                value={measurementSystem}
                                valueList={[{ value: 1, text: 'US' }, { value: 2, text: 'Metric' }]}
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
                                    onChange={(date:Date, e:any) => {
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
                            />
                        </div>

                        <div className="form-field">
                            <button type="submit">Save Changes</button>
                        </div>
                    </fieldset>
                </Form>
            )}
        </>
    );
};

export { EditProfileForm };
