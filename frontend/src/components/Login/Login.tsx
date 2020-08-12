import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { client } from '../../lib/client';
import { Form } from '../Form/Form';
import { TextBox } from '../TextBox/TextBox';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { AppContext } from '../AppContext/AppContext';

const Login = (props: { redirectUrl: string }) => {
    const { redirectUrl } = props;

    // eslint-disable-next-line no-unused-vars
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [emailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError] = useState('');

    const { loginUser } = useContext(AppContext);

    const login = async () => {
        setMessage('');

        client('users/authenticate', { data: { Email: email, Password: password } }).then(
            (data) => {
                if (data.error_message === '') {
                    setMessage('');
                    loginUser(data.token);
                    window.location.assign(redirectUrl);
                } else {
                    setMessage(data.error_message);
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
            <h1 className="centered">Login</h1>

            <ErrorMessage error={message} />

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
};

Login.propTypes = {
    redirectUrl: PropTypes.string,
};

export { Login };
