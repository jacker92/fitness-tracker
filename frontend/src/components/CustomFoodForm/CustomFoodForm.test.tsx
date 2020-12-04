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
        brand: '',
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
        brand: 'Chobani',
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

        const brandField = await screen.findByLabelText(/Brand/) as HTMLInputElement;
        expect(brandField.value).toBe('');

        const caloriesField = await screen.findByLabelText(/Calories/) as HTMLInputElement;
        expect(caloriesField.value).toBe('0');

        const proteinField = await screen.findByLabelText(/Protein/) as HTMLInputElement;
        expect(proteinField.value).toBe('0');

        const carbsField = await screen.findByLabelText(/Carbohydrates/) as HTMLSelectElement;
        expect(carbsField.value).toBe('0');

        const fatField = await screen.findByLabelText(/Fat/) as HTMLInputElement;
        expect(fatField.value).toBe('0');

        const sugarField = await screen.findByLabelText(/Sugar/) as HTMLInputElement;
        expect(sugarField.value).toBe('0');

        const isPublicCheckbox = await screen.findByLabelText(/Public/) as HTMLInputElement;
        expect(isPublicCheckbox.checked).toBeFalsy();

        const isAlcoholicCheckbox = await screen.findByLabelText(/Alcoholic/) as HTMLInputElement;
        expect(isAlcoholicCheckbox.checked).toBeFalsy();

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

        const brandField = await screen.findByLabelText(/Brand/) as HTMLInputElement;
        expect(brandField.value).toBe('Chobani');

        const caloriesField = await screen.findByLabelText(/Calories/) as HTMLInputElement;
        expect(caloriesField.value).toBe('120');

        const proteinField = await screen.findByLabelText(/Protein/) as HTMLInputElement;
        expect(proteinField.value).toBe('10');

        const carbsField = await screen.findByLabelText(/Carbohydrates/) as HTMLSelectElement;
        expect(carbsField.value).toBe('20');

        const fatField = await screen.findByLabelText(/Fat/) as HTMLInputElement;
        expect(fatField.value).toBe('2');

        const sugarField = await screen.findByLabelText(/Sugar/) as HTMLInputElement;
        expect(sugarField.value).toBe('10');

        const isPublicCheckbox = await screen.findByLabelText(/Public/) as HTMLInputElement;
        expect(isPublicCheckbox.checked).toBeTruthy();

        const isAlcoholicCheckbox = await screen.findByLabelText(/Alcoholic/) as HTMLInputElement;
        expect(isAlcoholicCheckbox.checked).toBeFalsy();

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
