import React from 'react';
import {
    render, fireEvent, act, screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppContext } from '../AppContext/AppContext';
import { Login } from './Login';

describe('<Login />', () => {
    test('it renders the form', async () => {
        render(
            <AppContext.Provider value={{
                currentUser: null,
                loginUser: jest.fn(),
                logoutUser: jest.fn(),
                toggleUserMenu: jest.fn(),
                userMenuVisible: false,
                setOverlayVisibility: jest.fn(),
                overlayVisible: false,
            }}
            >
                <Login />
            </AppContext.Provider>,
        );

        const emailField = await screen.findByLabelText(/Email/) as HTMLInputElement;
        expect(emailField.value).toBe('');

        const passwordField = await screen.findByLabelText(/Password/) as HTMLInputElement;
        expect(passwordField.value).toBe('');
    });

    test('it shows the validation errors', async () => {
        render(
            <AppContext.Provider value={{
                currentUser: null,
                loginUser: jest.fn(),
                logoutUser: jest.fn(),
                toggleUserMenu: jest.fn(),
                userMenuVisible: false,
                setOverlayVisibility: jest.fn(),
                overlayVisible: false,
            }}
            >
                <Login />
            </AppContext.Provider>,
        );

        const emailField = await screen.findByLabelText(/Email/) as HTMLInputElement;
        const passwordField = await screen.findByLabelText(/Password/) as HTMLInputElement;

        await act(async () => {
            await userEvent.clear(emailField);
            await userEvent.clear(passwordField);

            await waitFor(() => {
                fireEvent.blur(emailField);
                fireEvent.blur(passwordField);
            });
        });

        await screen.findByText(/Valid email address required/);
        await screen.findByText(/Password is required/);

        const loginButton = screen.getByRole('button', { name: /Login/i });
        expect(loginButton).toBeDisabled();
    });

    test('it shows the validation errors on login click', async () => {
        render(
            <AppContext.Provider value={{
                currentUser: null,
                loginUser: jest.fn(),
                logoutUser: jest.fn(),
                toggleUserMenu: jest.fn(),
                userMenuVisible: false,
                setOverlayVisibility: jest.fn(),
                overlayVisible: false,
            }}
            >
                <Login />
            </AppContext.Provider>,
        );

        const loginButton = screen.getByRole('button', { name: /Login/i });

        await act(async () => {
            await userEvent.click(loginButton);
        });

        await screen.findByText(/Valid email address required/);
        await screen.findByText(/Password is required/);

        expect(loginButton).toBeDisabled();
    });

    test('it successfully logs the user in', async () => {
        render(
            <AppContext.Provider value={{
                currentUser: null,
                loginUser: jest.fn(),
                logoutUser: jest.fn(),
                toggleUserMenu: jest.fn(),
                userMenuVisible: false,
                setOverlayVisibility: jest.fn(),
                overlayVisible: false,
            }}
            >
                <Login />
            </AppContext.Provider>,
        );

        const emailField = await screen.findByLabelText(/Email/) as HTMLInputElement;
        const passwordField = await screen.findByLabelText(/Password/) as HTMLInputElement;
        const loginButton = screen.getByRole('button', { name: /Login/i });

        await act(async () => {
            await userEvent.type(emailField, 'test@testing.com');
            await userEvent.type(passwordField, 'validPassword123');

            await userEvent.click(loginButton);
        });
    });

    test('it alerts the user to an invalid login', async () => {
        render(
            <AppContext.Provider value={{
                currentUser: null,
                loginUser: jest.fn(),
                logoutUser: jest.fn(),
                toggleUserMenu: jest.fn(),
                userMenuVisible: false,
                setOverlayVisibility: jest.fn(),
                overlayVisible: false,
            }}
            >
                <Login />
            </AppContext.Provider>,
        );

        const emailField = await screen.findByLabelText(/Email/) as HTMLInputElement;
        const passwordField = await screen.findByLabelText(/Password/) as HTMLInputElement;
        const loginButton = screen.getByRole('button', { name: /Login/i });

        await act(async () => {
            await userEvent.type(emailField, 'test@testing.com');
            await userEvent.type(passwordField, 'invalidPassword123');

            await userEvent.click(loginButton);
        });

        await screen.findByText(/Invalid email or password/);
    });
});
