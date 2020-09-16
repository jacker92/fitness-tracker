import React from 'react';
import {
    render, fireEvent, act, screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppContext } from '../AppContext/AppContext';
import { Register } from './Register';

describe('<Register />', () => {
    test('it renders the form', async () => {
        render(
            <AppContext.Provider value={{
                currentUser: { id: '123', name: 'Tester', email: 'test@test.com' },
                loginUser: jest.fn(),
                logoutUser: jest.fn(),
                toggleUserMenu: jest.fn(),
                userMenuVisible: false,
                setOverlayVisibility: jest.fn(),
                overlayVisible: false,
            }}
            >
                <Register />
            </AppContext.Provider>,
        );

        await screen.findByLabelText(/Name/);
        await screen.findByLabelText(/Email/);
        await screen.findByLabelText('Password');
        await screen.findByLabelText('Confirm Password');
        await screen.findByLabelText(/Measurement System/);
        await screen.findByLabelText(/Birthday/);
        await screen.findByLabelText(/Height/);
        await screen.findByLabelText(/Gender/);
        await screen.findByLabelText(/Activity Level/);
    });

    test('it validates the form on blurring the fields', async () => {
        render(
            <AppContext.Provider value={{
                currentUser: { id: '123', name: 'Tester', email: 'test@test.com' },
                loginUser: jest.fn(),
                logoutUser: jest.fn(),
                toggleUserMenu: jest.fn(),
                userMenuVisible: false,
                setOverlayVisibility: jest.fn(),
                overlayVisible: false,
            }}
            >
                <Register />
            </AppContext.Provider>,
        );

        const nameField = await screen.findByLabelText(/Name/);
        const emailField = await screen.findByLabelText(/Email/);
        const passwordField = await screen.findByLabelText('Password');
        const confirmPasswordField = await screen.findByLabelText('Confirm Password');
        const heightField = await screen.findByLabelText(/Height/);
        const submitButton = screen.getByRole('button', { name: /Create Account/i });

        await act(async () => {
            fireEvent.blur(nameField);
            fireEvent.blur(emailField);
            fireEvent.blur(passwordField);
            fireEvent.blur(confirmPasswordField);
            fireEvent.blur(heightField);
        });

        await screen.findByText(/Name is required/);
        await screen.findByText(/Valid email address required/);
        await screen.findAllByText(/Password is required/);
        await screen.findByText(/Height must be numeric and greater than zero/);

        expect(submitButton).toBeDisabled();
    });

    test('it validates the form on submit', async () => {
        render(
            <AppContext.Provider value={{
                currentUser: { id: '123', name: 'Tester', email: 'test@test.com' },
                loginUser: jest.fn(),
                logoutUser: jest.fn(),
                toggleUserMenu: jest.fn(),
                userMenuVisible: false,
                setOverlayVisibility: jest.fn(),
                overlayVisible: false,
            }}
            >
                <Register />
            </AppContext.Provider>,
        );

        const submitButton = screen.getByRole('button', { name: /Create Account/i });

        await act(async () => {
            await userEvent.click(submitButton);
        });

        await screen.findByText(/Name is required/);
        await screen.findByText(/Valid email address required/);
        await screen.findAllByText(/Password is required/);
        await screen.findByText(/You must be 13 years or older to register/);
        await screen.findByText(/Height must be numeric and greater than zero/);

        expect(submitButton).toBeDisabled();
    });

    test('it submits the form', async () => {
        render(
            <AppContext.Provider value={{
                currentUser: { id: '123', name: 'Tester', email: 'test@test.com' },
                loginUser: jest.fn(),
                logoutUser: jest.fn(),
                toggleUserMenu: jest.fn(),
                userMenuVisible: false,
                setOverlayVisibility: jest.fn(),
                overlayVisible: false,
            }}
            >
                <Register />
            </AppContext.Provider>,
        );

        const nameField = await screen.findByLabelText(/Name/);
        const emailField = await screen.findByLabelText(/Email/);
        const passwordField = await screen.findByLabelText('Password');
        const confirmPasswordField = await screen.findByLabelText('Confirm Password');
        const birthdayField = await screen.findByLabelText(/Birthday/);
        const heightField = await screen.findByLabelText(/Height/);
        const submitButton = screen.getByRole('button', { name: /Create Account/i });

        await act(async () => {
            await userEvent.type(nameField, 'Test User');
            await fireEvent.blur(nameField);
            await userEvent.type(emailField, 'test@testing.com');
            await fireEvent.blur(emailField);
            await userEvent.type(passwordField, 'validPassword123');
            await fireEvent.blur(passwordField);
            await userEvent.type(confirmPasswordField, 'validPassword123');
            await fireEvent.blur(confirmPasswordField);
            await userEvent.type(birthdayField, '06/01/1980');
            await userEvent.type(heightField, '72');
            await fireEvent.blur(heightField);

            await userEvent.click(submitButton);
        });
    });
});
