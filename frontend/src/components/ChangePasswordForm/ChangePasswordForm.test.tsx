import React from 'react';
import {
    render, fireEvent, act, screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppContext } from '../AppContext/AppContext';
import { ChangePasswordForm } from './ChangePasswordForm';

describe('<EditProfileForm />', () => {
    test('it renders the form', async () => {
        render(
            <AppContext.Provider value={{
                currentUser: { id: '123', name: 'Tester', email: 'test@test.com' },
                loginUser: null,
                logoutUser: null,
                toggleUserMenu: null,
                userMenuVisible: false,
                setLoadingOverlayVisible: null,
                loadingOverlayVisible: false,
            }}
            >
                <ChangePasswordForm />
            </AppContext.Provider>,
        );

        await screen.findByLabelText(/Current Password/);
        await screen.findByTestId('new_password');
        await screen.findByTestId('confirm_new_password');
    });

    test('it validates the form', async () => {
        render(
            <AppContext.Provider value={{
                currentUser: { id: '123', name: 'Tester', email: 'test@test.com' },
                loginUser: null,
                logoutUser: null,
                toggleUserMenu: null,
                userMenuVisible: false,
                setLoadingOverlayVisible: null,
                loadingOverlayVisible: false,
            }}
            >
                <ChangePasswordForm />
            </AppContext.Provider>,
        );

        const currentPasswordField = await screen.findByLabelText(/Current Password/) as HTMLElement;
        const newPasswordField = await screen.findByTestId('new_password') as HTMLElement;
        const confirmNewPasswordField = await screen.findByTestId('confirm_new_password') as HTMLElement;

        await act(async () => {
            await waitFor(() => {
                fireEvent.blur(currentPasswordField);
                fireEvent.blur(newPasswordField);
                fireEvent.blur(confirmNewPasswordField);
            });
        });

        await screen.findByText('Current password is required');
        await screen.findAllByText('Password is required');

        const saveButton = screen.getByRole('button', { name: /Change Password/i });
        expect(saveButton).toBeDisabled();

        await act(async () => {
            await userEvent.clear(newPasswordField);
            await userEvent.clear(confirmNewPasswordField);

            await userEvent.type(currentPasswordField, 'OldPassword1234');
            await userEvent.type(newPasswordField, 'NewPassword1234');
            await userEvent.type(confirmNewPasswordField, 'NewPassword12345');

            await waitFor(() => {
                fireEvent.blur(currentPasswordField);
                fireEvent.blur(newPasswordField);
                fireEvent.blur(confirmNewPasswordField);
            });
        });

        await screen.findAllByText('Passwords do not match');

        expect(saveButton).toBeDisabled();

        await act(async () => {
            await userEvent.clear(newPasswordField);
            await userEvent.clear(confirmNewPasswordField);

            await userEvent.type(newPasswordField, 'Old123');
            await userEvent.type(confirmNewPasswordField, 'Old123');

            await waitFor(() => {
                fireEvent.blur(newPasswordField);
                fireEvent.blur(confirmNewPasswordField);
            });
        });

        await screen.findAllByText('Passwords must be at least 8 characters long');

        expect(saveButton).toBeDisabled();

        await act(async () => {
            await userEvent.clear(newPasswordField);
            await userEvent.clear(confirmNewPasswordField);

            await userEvent.type(newPasswordField, 'old123456789');
            await userEvent.type(confirmNewPasswordField, 'old123456789');

            await waitFor(() => {
                fireEvent.blur(newPasswordField);
                fireEvent.blur(confirmNewPasswordField);
            });
        });

        await screen.findAllByText('Password must contain at least one capital letter');

        expect(saveButton).toBeDisabled();

        await act(async () => {
            await userEvent.clear(newPasswordField);
            await userEvent.clear(confirmNewPasswordField);

            await userEvent.type(newPasswordField, 'Old_=12345');
            await userEvent.type(confirmNewPasswordField, 'Old_=12345');

            await waitFor(() => {
                fireEvent.blur(newPasswordField);
                fireEvent.blur(confirmNewPasswordField);
            });
        });

        expect(saveButton).toBeEnabled();
    });

    test('it submits the form successfully', async () => {
        render(
            <AppContext.Provider value={{
                currentUser: { id: '123', name: 'Tester', email: 'test@test.com' },
                loginUser: null,
                logoutUser: null,
                toggleUserMenu: null,
                userMenuVisible: false,
                setLoadingOverlayVisible: jest.fn(),
                loadingOverlayVisible: false,
            }}
            >
                <ChangePasswordForm />
            </AppContext.Provider>,
        );

        const currentPasswordField = await screen.findByLabelText(/Current Password/) as HTMLInputElement;
        const newPasswordField = await screen.findByTestId('new_password') as HTMLInputElement;
        const confirmNewPasswordField = await screen.findByTestId('confirm_new_password') as HTMLInputElement;
        const saveButton = screen.getByRole('button', { name: /Change Password/i }) as HTMLButtonElement;

        await act(async () => {
            await userEvent.type(currentPasswordField, 'OldPassword_=123');
            await userEvent.type(newPasswordField, 'NewPassword_=123');
            await userEvent.type(confirmNewPasswordField, 'NewPassword_=123');

            await userEvent.click(saveButton);
        });

        await screen.findByText('Password changed successfully');
    });
});
