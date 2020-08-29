import React, { useState, useEffect, useContext } from 'react';
import { client } from '../../lib/client';
import { Form } from '../Styles/Form';
import { TextBox } from '../TextBox/TextBox';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { SuccessMessage } from '../SuccessMessage/SuccessMessage';
import { FormValidator } from '../../lib/FormValidator';
import { AppContext } from '../AppContext/AppContext';

const ChangePasswordForm = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [currentPasswordError, setCurrentPasswordError] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [saveDisabled, setSaveDisabled] = useState(false);

    const { setLoadingOverlayVisible } = useContext(AppContext);

    const validateForm = () => {
        let isValid = true;

        if (!FormValidator.validateNotEmpty(currentPassword)) {
            setCurrentPasswordError('Current password is required');
            isValid = false;
        }

        const passwordValidationResult = FormValidator.validatePassword(newPassword, confirmNewPassword);
        if (!passwordValidationResult.valid) {
            setNewPasswordError(passwordValidationResult.message);
            setConfirmNewPasswordError(passwordValidationResult.message);
        }

        return isValid;
    };

    const changePassword = async () => {
        setLoadingOverlayVisible(true);

        setErrorMessage('');
        setSuccessMessage('');

        if (validateForm()) {
            client('users/changepassword', {
                data: {
                    CurrentPassword: currentPassword,
                    NewPassword: newPassword,
                    ConfirmNewPassword: confirmNewPassword,
                },
            }).then(
                (data) => {
                    setLoadingOverlayVisible(false);
                    if (data.successful) {
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmNewPassword('');
                        setSuccessMessage('Password changed successfully');
                    } else {
                        setErrorMessage(data.error);
                    }
                },
                (error) => {
                    setLoadingOverlayVisible(false);
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

    const validate = (fieldId: string, value: string) => {
        const { valid: passwordsValid, message } = FormValidator.validatePassword(newPassword, confirmNewPassword);

        // eslint-disable-next-line default-case
        switch (fieldId) {
            case 'currentpassword':
                if (!FormValidator.validateNotEmpty(value)) {
                    setCurrentPasswordError('Current password is required');
                } else {
                    setCurrentPasswordError('');
                }
                break;

            case 'newpassword':
            case 'confirmnewpassword':
                if (!passwordsValid) {
                    setNewPasswordError(message);
                    setConfirmNewPasswordError(message);
                } else {
                    setNewPasswordError('');
                    setConfirmNewPasswordError('');
                }
                break;
        }
    };

    useEffect(() => {
        if (currentPasswordError === '' && newPasswordError === '' && confirmNewPasswordError === '') {
            setSaveDisabled(false);
        } else {
            setSaveDisabled(true);
        }
    }, [currentPasswordError, newPasswordError, confirmNewPasswordError]);

    return (
        <>
            <h2>Change Password</h2>

            <ErrorMessage error={errorMessage} />
            <SuccessMessage message={successMessage} />

            <Form
                className="autowidth"
                method="POST"
                onSubmit={async (e) => {
                    e.preventDefault();
                    await changePassword();
                }}
            >
                <fieldset>
                    <div className="form-field">
                        <TextBox
                            id="current_password"
                            name="current_password"
                            type="password"
                            label="Current Password"
                            value={currentPassword}
                            error={currentPasswordError}
                            onChange={(e: any) => {
                                setCurrentPassword(e.target.value);
                            }}
                            onErrorChange={(error: string) => {
                                setCurrentPasswordError(error);
                            }}
                            validate={(e: any) => {
                                e.persist();
                                validate('currentpassword', e.target.value);
                            }}
                        />
                    </div>

                    <div className="form-field">
                        <TextBox
                            id="new_password"
                            name="new_password"
                            type="password"
                            label="New Password"
                            value={newPassword}
                            error={newPasswordError}
                            showErrorMessage={false}
                            onChange={(e: any) => {
                                setNewPassword(e.target.value);
                            }}
                            onErrorChange={(error: string) => {
                                setNewPasswordError(error);
                            }}
                            validate={(e: any) => {
                                e.persist();
                                validate('newpassword', e.target.value);
                            }}
                        />
                    </div>

                    <div className="form-field">
                        <TextBox
                            id="confirm_new_password"
                            name="confirm_new_password"
                            type="password"
                            label="Confirm New Password"
                            value={confirmNewPassword}
                            error={confirmNewPasswordError}
                            onChange={(e: any) => {
                                setConfirmNewPassword(e.target.value);
                            }}
                            onErrorChange={(error: string) => {
                                setConfirmNewPasswordError(error);
                            }}
                            validate={(e: any) => {
                                e.persist();
                                validate('confirmnewpassword', e.target.value);
                            }}
                        />
                    </div>

                    <div className="form-field">
                        <button type="submit" disabled={saveDisabled} aria-disabled={saveDisabled}>
                            Change Password
                        </button>
                    </div>
                </fieldset>
            </Form>
        </>
    );
};

export { ChangePasswordForm };
