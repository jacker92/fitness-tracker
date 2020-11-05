/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import {
    render, act, screen, waitFor, fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CustomFood } from '../../types/CustomFood';
import { AppContext } from '../AppContext/AppContext';
import { CustomFoodForm } from './CustomFoodForm';

describe('<CustomFoodForm />', () => {
    const newFood: CustomFood = {
        id: 0,
        name: '',
        servingSize: '',
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        sugar: 0,
        isAlcoholic: false,
        isPublic: false,
    };

    const existingFood: CustomFood = {
        id: 1,
        name: 'Yogurt',
        servingSize: '5 oz.',
        calories: 120,
        protein: 10,
        carbohydrates: 20,
        fat: 2,
        sugar: 10,
        isAlcoholic: false,
        isPublic: true,
        userId: '123',
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
                <CustomFoodForm food={newFood} visible onSuccess={() => {}} onCancel={() => {}} />
            </AppContext.Provider>,
        );

        const nameField = await screen.findByLabelText(/Name/) as HTMLInputElement;
        expect(nameField.value).toBe('');

        const caloriesField = await screen.findByLabelText(/Calories/) as HTMLInputElement;
        expect(caloriesField.value).toBe('0');

        const carbsField = await screen.findByLabelText(/Carbohydrates/) as HTMLSelectElement;
        expect(carbsField.value).toBe('0');

        const isPublicCheckbox = await screen.findByLabelText(/Public/) as HTMLInputElement;
        expect(isPublicCheckbox.checked).toBeFalsy();

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
                <CustomFoodForm food={existingFood} visible onSuccess={() => {}} onCancel={() => {}} />
            </AppContext.Provider>,
        );

        const nameField = await screen.findByLabelText(/Name/) as HTMLInputElement;
        expect(nameField.value).toBe('Yogurt');

        const caloriesField = await screen.findByLabelText(/Calories/) as HTMLInputElement;
        expect(caloriesField.value).toBe('120');

        const carbsField = await screen.findByLabelText(/Carbohydrates/) as HTMLSelectElement;
        expect(carbsField.value).toBe('20');

        const isPublicCheckbox = await screen.findByLabelText(/Public/) as HTMLInputElement;
        expect(isPublicCheckbox.checked).toBeTruthy();

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
                <CustomFoodForm food={newFood} visible onSuccess={() => {}} onCancel={() => {}} />
            </AppContext.Provider>,
        );

        const nameField = await screen.findByLabelText(/Name/) as HTMLInputElement;
        const servingSizeField = await screen.findByLabelText(/Serving Size/) as HTMLInputElement;

        await act(async () => {
            await userEvent.clear(nameField);
            await userEvent.clear(servingSizeField);

            await waitFor(() => {
                fireEvent.blur(nameField);
                fireEvent.blur(servingSizeField);
            });
        });

        await screen.findByText(/Name is required/);
        await screen.findByText(/Serving Size is required/);

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
                <CustomFoodForm food={newFood} visible onSuccess={() => {}} onCancel={() => {}} />
            </AppContext.Provider>,
        );

        const addButton = screen.getByRole('button', { name: /Add/i });

        await act(async () => {
            await userEvent.click(addButton);
        });

        await screen.findByText(/Name is required/);
        await screen.findByText(/Serving size is required/);

        expect(addButton).toBeDisabled();
    });
});
