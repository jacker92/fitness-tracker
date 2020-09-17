import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { client } from '../../lib/client';
import { TextBox } from '../TextBox/TextBox';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { AppContext } from '../AppContext/AppContext';
import { FormValidator } from '../../lib/FormValidator';

const Login = (props: { redirectUrl: string, message: string, messageColor: string }) => {
    const { redirectUrl, message, messageColor } = props;

    // eslint-disable-next-line no-unused-vars
    const [errorMessage, setErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [saveDisabled, setSaveDisabled] = useState(false);

    const { loginUser } = useContext(AppContext);

    const validate = () => {
        let isValid: boolean = true;

        if (!FormValidator.validateEmail(email)) {
            setEmailError('Valid email address required');
            isValid = false;
        }

        if (!FormValidator.validateNotEmpty(password)) {
            setPasswordError('Password is required');
            isValid = false;
        }

        return isValid;
    };

    const login = async () => {
        setErrorMessage('');

        if (validate()) {
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
        }
    };

    useEffect(() => {
        if (emailError === '' && passwordError === '') {
            setSaveDisabled(false);
        } else {
            setSaveDisabled(true);
        }
    }, [emailError, passwordError]);

    return (
        <>
            <h1 className="centered">Login</h1>

            <ErrorMessage error={errorMessage} />

            <div className="form-message" style={{ display: (message === '' ? 'none' : 'block'), color: messageColor }}>{message}</div>

            <form
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
                            autocomplete="email"
                            validationRule="email"
                            onChange={(e: any) => {
                                setEmail(e.target.value);
                            }}
                            onErrorChange={(error: string) => {
                                setEmailError(error);
                            }}
                        />
                    </div>

                    <div className="form-field">
                        <TextBox
                            id="password"
                            name="password"
                            type="password"
                            label="Password"
                            autocomplete="current-password"
                            value={password}
                            error={passwordError}
                            validationRule="notempty"
                            onChange={(e: any) => {
                                setPassword(e.target.value);
                            }}
                            onErrorChange={(error: string) => {
                                setPasswordError(error);
                            }}
                        />
                    </div>

                    <div className="form-field">
                        <button type="submit" disabled={saveDisabled} aria-disabled={saveDisabled}>Login</button>
                    </div>
                </fieldset>
            </form>
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
