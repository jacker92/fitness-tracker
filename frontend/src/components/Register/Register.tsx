import React, { useEffect, useState, useContext } from 'react';
import { client } from '../../lib/client';
import { Form } from '../Form/Form';
import { TextBox } from '../TextBox/TextBox';
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
        // const resp = client('/users/register', { Name: name, Email: email, Password: password})
        client('users/register', { data: { Name: name, Email: email, Password: password } }).then(
            (data) => {
                setMessage('');
                loginUser(data.token);
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