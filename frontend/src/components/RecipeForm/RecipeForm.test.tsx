/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { render, act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Recipe } from '../../types/Recipe';
import { AppContext } from '../AppContext/AppContext';
import { RecipeForm } from './RecipeForm';

describe('<RecipeForm />', () => {
    const newRecipe: Recipe = {
        id: 0,
        name: '',
        servings: 1,
        isPublic: false,
        ingredients: [],
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        sugar: 0,
        isAlcoholic: false,
    };

    const existingRecipe: Recipe = {
        id: 1,
        userId: '123',
        name: 'Lime Baked Tilapia',
        servings: 3,
        isPublic: false,
        ingredients: [
            {
                id: 1,
                foodId: 1,
                recipeId: 1,
                food: {
                    id: 1,
                    name: 'Tilapia',
                    brand: 'Wellsley Farms',
                    servingSize: '6 oz. Filet',
                    calories: 160,
                    protein: 34,
                    carbohydrates: 0,
                    fat: 3,
                    sugar: 3,
                    isPublic: false,
                    isAlcoholic: false,
                },
                quantity: 3,
                calories: 480,
                protein: 102,
                carbohydrates: 0,
                fat: 9,
                sugar: 0,
                isAlcoholic: false,
            },
            {
                id: 2,
                foodId: 2,
                recipeId: 1,
                food: {
                    id: 2,
                    name: 'Salted Butter',
                    brand: 'Generic',
                    servingSize: '1 tbsp.',
                    calories: 102,
                    protein: 0,
                    carbohydrates: 0,
                    fat: 12,
                    sugar: 0,
                    isPublic: false,
                    isAlcoholic: false,
                },
                quantity: 1,
                calories: 102,
                protein: 0,
                carbohydrates: 0,
                fat: 12,
                sugar: 0,
                isAlcoholic: false,
            },
            {
                id: 3,
                foodId: 3,
                recipeId: 1,
                food: {
                    id: 3,
                    name: 'Lime',
                    brand: '',
                    servingSize: '1 Lime',
                    calories: 20,
                    protein: 1,
                    carbohydrates: 7,
                    fat: 0,
                    sugar: 1,
                    isPublic: false,
                    isAlcoholic: false,
                },
                quantity: 1,
                calories: 20,
                protein: 1,
                carbohydrates: 7,
                fat: 0,
                sugar: 1,
                isAlcoholic: false,
            },
        ],
        calories: 201,
        protein: 32,
        carbohydrates: 2,
        fat: 7,
        sugar: 0,
        isAlcoholic: false,
    };

    test('it renders the form for a new recipe', async () => {
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
                <RecipeForm recipe={newRecipe} visible onSuccess={() => {}} onCancel={() => {}} />
            </AppContext.Provider>,
        );

        const nameField = await screen.findByLabelText(/Name/) as HTMLInputElement;
        expect(nameField.value).toBe('');

        const servingsField = await screen.findByLabelText(/Servings/) as HTMLInputElement;
        expect(servingsField.value).toBe('1');
    });

    test('it renders the form for an existing recipe', async () => {
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
                <RecipeForm recipe={existingRecipe} visible onSuccess={() => {}} onCancel={() => {}} />
            </AppContext.Provider>,
        );

        const nameField = await screen.findByLabelText(/Name/) as HTMLInputElement;
        expect(nameField.value).toBe('Lime Baked Tilapia');

        const servingsField = await screen.findByLabelText(/Servings/) as HTMLInputElement;
        expect(servingsField.value).toBe('3');

        await screen.findByText('201');
        await screen.findByText('34g');
        await screen.findByText('2g');
        await screen.findByText('7g');
    });

    test('it validates there are ingredients', async () => {
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
                <RecipeForm recipe={newRecipe} visible onSuccess={() => {}} onCancel={() => {}} />
            </AppContext.Provider>,
        );

        const nameField = await screen.findByLabelText(/Name/) as HTMLInputElement;
        const servingsField = await screen.findByLabelText(/Servings/) as HTMLInputElement;
        const saveButton = screen.getByRole('button', { name: /Save Recipe/i }) as HTMLButtonElement;

        await act(async () => {
            await userEvent.type(nameField, 'Brand Spanking New Recipe');
            await userEvent.type(servingsField, '4');
            await userEvent.click(saveButton);
        });

        await screen.findByText(/Please enter at least 1 ingredient/);
    });

    test('it validates servings and name', async () => {
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
                <RecipeForm recipe={newRecipe} visible onSuccess={() => {}} onCancel={() => {}} />
            </AppContext.Provider>,
        );

        const servingsField = await screen.findByLabelText(/Servings/) as HTMLInputElement;
        const saveButton = screen.getByRole('button', { name: /Save Recipe/i }) as HTMLButtonElement;

        await act(async () => {
            await userEvent.clear(servingsField);
            await userEvent.type(servingsField, '0');
            await userEvent.click(saveButton);
        });

        await screen.findByText(/Name is required/);
        await screen.findByText(/There must be more than zero servings/);
        await screen.findByText(/Please enter at least 1 ingredient/);
    });
});
