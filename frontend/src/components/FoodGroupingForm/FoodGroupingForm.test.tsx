/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import {
    render, act, screen, waitFor, fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FoodGrouping } from '../../types/FoodGrouping';
import { AppContext } from '../AppContext/AppContext';
import { FoodGroupingForm } from './FoodGroupingForm';

describe('<FoodGroupingForm />', () => {
    const newFoodGrouping: FoodGrouping = {
        id: 0,
        name: '',
        sortOrder: 0,
    };

    const existingFoodGrouping: FoodGrouping = {
        id: 1,
        name: 'Lunch',
        sortOrder: 2,
    };

    test('it renders the form for a new food', async () => {
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
                <FoodGroupingForm foodGrouping={newFoodGrouping} visible onSuccess={() => {}} onCancel={() => {}} />
            </AppContext.Provider>,
        );

        const nameField = await screen.findByLabelText(/Name/) as HTMLInputElement;
        expect(nameField.value).toBe('');

        const sortOrderField = await screen.findByLabelText(/Sort Order/) as HTMLInputElement;
        expect(sortOrderField.value).toBe('0');

        await screen.findByRole('button', { name: /Add/i });
    });

    test('it renders the form for an existing food', async () => {
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
                <FoodGroupingForm foodGrouping={existingFoodGrouping} visible onSuccess={() => {}} onCancel={() => {}} />
            </AppContext.Provider>,
        );

        const nameField = await screen.findByLabelText(/Name/) as HTMLInputElement;
        expect(nameField.value).toBe('Lunch');

        const sortOrderField = await screen.findByLabelText(/Sort Order/) as HTMLInputElement;
        expect(sortOrderField.value).toBe('2');

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
                <FoodGroupingForm foodGrouping={newFoodGrouping} visible onSuccess={() => {}} onCancel={() => {}} />
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
                <FoodGroupingForm foodGrouping={newFoodGrouping} visible onSuccess={() => {}} onCancel={() => {}} />
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
