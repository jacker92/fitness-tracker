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
                loginUser: jest.fn(),
                logoutUser: jest.fn(),
                toggleUserMenu: jest.fn(),
                userMenuVisible: false,
                setOverlayVisibility: jest.fn(),
                overlayVisible: false,
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

        const genderField = await screen.findByLabelText(/Gender/) as HTMLSelectElement;
        expect(genderField.value).toBe('M');

        const activityLevelField = await screen.findByLabelText(/Activity Level/) as HTMLSelectElement;
        expect(activityLevelField.value).toBe('3');
    });

    test('it shows validation errors', async () => {
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
                <EditProfileForm />
            </AppContext.Provider>,
        );

        const nameField = await screen.findByLabelText(/Name/) as HTMLElement;
        const emailField = await screen.findByLabelText(/Email/) as HTMLElement;
        const heightField = await screen.findByLabelText(/Height/) as HTMLElement;

        await act(async () => {
            await userEvent.clear(nameField);
            await userEvent.clear(emailField);
            await userEvent.clear(heightField);
            await userEvent.type(heightField, '0');

            await waitFor(() => {
                fireEvent.blur(nameField);
                fireEvent.blur(emailField);
                fireEvent.blur(heightField);
            });
        });

        await screen.findByText(/Name is required/);
        await screen.findByText(/Valid email address required/);
        await screen.findByText('Height must be numeric and greater than zero');

        const saveButton = screen.getByRole('button', { name: /Save Changes/i });
        expect(saveButton).toBeDisabled();
    });

    test('it changes the height label when the measurement system is set to metric', async () => {
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

    test('it updates the profile successfully', async () => {
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
                <EditProfileForm />
            </AppContext.Provider>,
        );

        const heightField = await screen.findByLabelText(/Height/) as HTMLElement;
        const saveButton = screen.getByRole('button', { name: /Save Changes/i }) as HTMLButtonElement;

        await act(async () => {
            await userEvent.clear(heightField);
            await userEvent.type(heightField, '70');

            await userEvent.click(saveButton);
        });

        await screen.findByText(/Profile updated successfully/);
    });
});
