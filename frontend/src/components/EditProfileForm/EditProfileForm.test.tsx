import React from 'react';
import {
    render, fireEvent, act, screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppContext } from '../AppContext/AppContext';
import { EditProfileForm } from './EditProfileForm';

describe('<EditProfileForm />', () => {
    test('it renders the form', async () => {
        render(
            <AppContext.Provider value={{
                currentUser: { id: '123', name: 'Tester', email: 'test@test.com' },
                loginUser: null,
                logoutUser: null,
                toggleUserMenu: null,
                userMenuVisible: false,
            }}
            >
                <EditProfileForm />
            </AppContext.Provider>,
        );

        const nameField = await screen.findByLabelText(/Name/) as HTMLInputElement;
        expect(nameField.value).toBe('Tester');

        const emailField = await screen.findByLabelText(/Email/) as HTMLInputElement;
        expect(emailField.value).toBe('test@test.com');

        const measurementSystemField = await screen.findByLabelText(/Measurement System/) as HTMLSelectElement;
        expect(measurementSystemField.value).toBe('1');

        const birthdayField = await screen.findByLabelText(/Birthday/) as HTMLInputElement;
        expect(birthdayField.value).toBe('01/01/1900');

        const heightField = await screen.findByLabelText(/Height/) as HTMLInputElement;
        expect(heightField.value).toBe('60');
    });

    test('it shows validation errors', async () => {
        render(
            <AppContext.Provider value={{
                currentUser: { id: '123', name: 'Tester', email: 'test@test.com' },
                loginUser: null,
                logoutUser: null,
                toggleUserMenu: null,
                userMenuVisible: false,
            }}
            >
                <EditProfileForm />
            </AppContext.Provider>,
        );

        const nameField = await screen.findByLabelText(/Name/) as HTMLElement;
        const emailField = await screen.findByLabelText(/Email/) as HTMLElement;
        const heightField = await screen.findByLabelText(/Height/) as HTMLElement;

        await act(async () => {
            await userEvent.clear(nameField);
            await userEvent.clear(emailField);
            await userEvent.type(heightField, 'A');

            await waitFor(() => {
                fireEvent.blur(nameField);
                fireEvent.blur(emailField);
                fireEvent.blur(heightField);
            });
        });

        await screen.findByText(/Name is required/);
        await screen.findByText(/Valid email address required/);
        await screen.findByText('Height (inches) must be numeric');

        const saveButton = screen.getByRole('button', { name: /Save Changes/i });
        expect(saveButton).toBeDisabled();
    });

    test('it changes the height label when the measurement system is set to metric', async () => {
        render(
            <AppContext.Provider value={{
                currentUser: { id: '123', name: 'Tester', email: 'test@test.com' },
                loginUser: null,
                logoutUser: null,
                toggleUserMenu: null,
                userMenuVisible: false,
            }}
            >
                <EditProfileForm />
            </AppContext.Provider>,
        );

        const measurementSystemField = await screen.findByLabelText(/Measurement System/) as HTMLSelectElement;

        await act(async () => {
            await userEvent.selectOptions(measurementSystemField, ['2']);
        });

        await screen.findByLabelText('Height (meters)');

        const inchesHeightField = screen.queryByLabelText('Height (inches)');
        expect(inchesHeightField).not.toBeInTheDocument();
    });
});
