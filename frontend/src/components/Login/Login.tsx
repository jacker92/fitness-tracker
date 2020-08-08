import React, { useState } from 'react';
import { Form } from '../Form/Form';
import { TextBox } from '../TextBox/TextBox';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';

const Login = () => {
  // eslint-disable-next-line no-unused-vars
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [usernameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError] = useState('');

  const login = async () => {
    setMessage('Not yet implemented');
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
              error={usernameError}
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

export { Login };
