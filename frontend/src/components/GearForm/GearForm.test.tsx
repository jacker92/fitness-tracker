import React from 'react';
import {
    render, act, screen, fireEvent, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Gear } from '../../types/Gear';
import { AppContext } from '../AppContext/AppContext';
import { GearForm } from './GearForm';

describe('<GearForm />', () => {
    const newGear: Gear = {
        id: 0, name: '', active: true,
    };

    const existingGear: Gear = {
        id: 1, name: 'Test Gear', active: true,
    };

    test('it renders the form for a new gear', async () => {
        render(
            <AppContext.Provider value={{
                currentUser: { id: '123', name: 'Tester', email: 'test@test.com' },
                loginUser: null,
                logoutUser: null,
                toggleUserMenu: null,
                userMenuVisible: false,
                setOverlayVisibility: null,
                overlayVisible: false,
            }}
            >
                <GearForm gear={newGear} visible onSuccess={() => {}} onCancel={() => {}} />
            </AppContext.Provider>,
        );

        const nameField = await screen.findByLabelText(/Name/) as HTMLInputElement;
        expect(nameField.value).toBe('');

        await screen.findByRole('button', { name: /Add/i });
    });

    test('it renders the form for an existing metric', async () => {
        render(
            <AppContext.Provider value={{
                currentUser: { id: '123', name: 'Tester', email: 'test@test.com' },
                loginUser: null,
                logoutUser: null,
                toggleUserMenu: null,
                userMenuVisible: false,
                setOverlayVisibility: null,
                overlayVisible: false,
            }}
            >
                <GearForm gear={existingGear} visible onSuccess={() => {}} onCancel={() => {}} />
            </AppContext.Provider>,
        );

        const nameField = await screen.findByLabelText(/Name/) as HTMLInputElement;
        expect(nameField.value).toBe('Test Gear');

        await screen.findByRole('button', { name: /Update/i });
    });

    test('it validates the form', async () => {
        render(
            <AppContext.Provider value={{
                currentUser: { id: '123', name: 'Tester', email: 'test@test.com' },
                loginUser: null,
                logoutUser: null,
                toggleUserMenu: null,
                userMenuVisible: false,
                setOverlayVisibility: null,
                overlayVisible: false,
            }}
            >
                <GearForm gear={newGear} visible onSuccess={() => {}} onCancel={() => {}} />
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
                loginUser: null,
                logoutUser: null,
                toggleUserMenu: null,
                userMenuVisible: false,
                setOverlayVisibility: null,
                overlayVisible: false,
            }}
            >
                <GearForm gear={newGear} visible onSuccess={() => {}} onCancel={() => {}} />
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
