import React from 'react';
import {
    render, act, screen, fireEvent, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Activity } from '../../types/Activity';
import { AppContext } from '../AppContext/AppContext';
import { CustomActivityForm } from './CustomActivityForm';

describe('<GearForm />', () => {
    const newActivity: Activity = {
        id: 0, name: '', estimatedCaloriesBurnedPerMinute: 0, type: 0, isSystem: false,
    };

    const existingActivity: Activity = {
        id: 1, name: 'Hockey', estimatedCaloriesBurnedPerMinute: 10, type: 0, isSystem: false,
    };

    test('it renders the form for a new gear', async () => {
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
                <CustomActivityForm activity={newActivity} visible onSuccess={() => {}} onCancel={() => {}} />
            </AppContext.Provider>,
        );

        const nameField = await screen.findByLabelText(/Name/) as HTMLInputElement;
        expect(nameField.value).toBe('');

        const caloriesField = await screen.findByLabelText(/Est. Calories Burned per Minute/) as HTMLInputElement;
        expect(caloriesField.value).toBe('0');

        const typeField = await screen.findByLabelText(/Type/) as HTMLSelectElement;
        expect(typeField.value).toBe('0');

        await screen.findByRole('button', { name: /Add/i });
    });

    test('it renders the form for an existing metric', async () => {
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
                <CustomActivityForm activity={existingActivity} visible onSuccess={() => {}} onCancel={() => {}} />
            </AppContext.Provider>,
        );

        const nameField = await screen.findByLabelText(/Name/) as HTMLInputElement;
        expect(nameField.value).toBe('Hockey');

        const caloriesField = await screen.findByLabelText(/Est. Calories Burned per Minute/) as HTMLInputElement;
        expect(caloriesField.value).toBe('10');

        const typeField = await screen.findByLabelText(/Type/) as HTMLSelectElement;
        expect(typeField.value).toBe('0');

        await screen.findByRole('button', { name: /Update/i });
    });

    test('it validates the form', async () => {
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
                <CustomActivityForm activity={newActivity} visible onSuccess={() => {}} onCancel={() => {}} />
            </AppContext.Provider>,
        );

        const nameField = await screen.findByLabelText(/Name/) as HTMLInputElement;

        await act(async () => {
            await userEvent.clear(nameField);

            await waitFor(() => {
                fireEvent.blur(nameField);
            });
        });

        await screen.findByText(/Name is required/);

        const addButton = screen.getByRole('button', { name: /Add/i });
        expect(addButton).toBeDisabled();
    });

    test('it validates the form when add is clicked', async () => {
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
                <CustomActivityForm activity={newActivity} visible onSuccess={() => {}} onCancel={() => {}} />
            </AppContext.Provider>,
        );

        const addButton = screen.getByRole('button', { name: /Add/i });

        await act(async () => {
            await userEvent.click(addButton);
        });

        await screen.findByText(/Name is required/);

        expect(addButton).toBeDisabled();
    });
});
