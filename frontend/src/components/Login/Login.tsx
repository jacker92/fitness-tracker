import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { client } from '../../lib/client';
import { Form } from '../Styles/Form';
import { TextBox } from '../TextBox/TextBox';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { AppContext } from '../AppContext/AppContext';

const Login = (props: { redirectUrl: string, message: string, messageColor: string }) => {
    const { redirectUrl, message, messageColor } = props;

    // eslint-disable-next-line no-unused-vars
    const [errorMessage, setErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const [emailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError] = useState('');

    const { loginUser } = useContext(AppContext);

    const login = async () => {
        setErrorMessage('');

        client('users/authenticate', { data: { Email: email, Password: password } }).then(
            (data) => {
                if (data.successful) {
                    setErrorMessage('');
                    loginUser(data.token);
                    window.location.assign(redirectUrl);
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
            <h1 className="centered">Login</h1>

            <ErrorMessage error={errorMessage} />

            <div className="form-message" style={{ display: (message === '' ? 'none' : 'block'), color: messageColor }}>{message}</div>

            <Form
                method="POST"
                onSubmit={async (e) => {
                    e.preventDefault();
                    await login();
                }}
            >
                <fieldset>
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
                        <button type="submit">Login</button>
                    </div>
                </fieldset>
            </Form>
        </>
    );
};

Login.defaultProps = {
    redirectUrl: '/',
    message: '',
    messageColor: 'hsl(0, 0%, 19%)',
};

Login.propTypes = {
    redirectUrl: PropTypes.string,
    message: PropTypes.string,
    messageColor: PropTypes.string,
};

export { Login };
