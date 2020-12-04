/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { render, act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddIngredientForm } from './AddIngredientForm';
import { RecipeFood } from '../../types/RecipeFood';

describe('<AddIngredientForm />', () => {
    const newIngredient: RecipeFood = {
        id: 1,
        recipeId: 0,
        foodId: 1,
        food: {
            id: 1,
            userId: '123',
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
        quantity: 1,
        calories: 160,
        protein: 34,
        carbohydrates: 0,
        fat: 3,
        sugar: 3,
        isAlcoholic: false,
    };

    const existingIngredient: RecipeFood = {
        id: 1,
        recipeId: 0,
        foodId: 1,
        food: {
            id: 1,
            userId: '123',
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
        quantity: 2,
        calories: 320,
        protein: 68,
        carbohydrates: 0,
        fat: 6,
        sugar: 6,
        isAlcoholic: false,
    };

    test('it renders the form for a new ingredient', async () => {
        render(
            <AddIngredientForm
                recipeFood={newIngredient}
                visible
                nextRowId={-1}
                onSuccess={() => {}}
                onCancel={() => {}}
            />,
        );

        const quantityField = await screen.findByLabelText(/Quantity/) as HTMLInputElement;
        expect(quantityField.value).toBe('1');

        await screen.findByText(/Wellsley Farms Tilapia/);
        await screen.findByText(/6 oz. Filet/);
    });

    test('it renders the form for an existing ingredient', async () => {
        render(
            <AddIngredientForm
                recipeFood={existingIngredient}
                visible
                isNew={false}
                nextRowId={-1}
                onSuccess={() => {}}
                onCancel={() => {}}
            />,
        );

        const quantityField = await screen.findByLabelText(/Quantity/) as HTMLInputElement;
        expect(quantityField.value).toBe('2');

        await screen.findByText(/Wellsley Farms Tilapia/);
        await screen.findByText(/6 oz. Filet/);
    });

    // test('it validates the form', async () => {
    //     render(
    //         <AddIngredientForm
    //             recipeFood={newIngredient}
    //             visible
    //             nextRowId={-1}
    //             onSuccess={() => {}}
    //             onCancel={() => {}}
    //         />,
    //     );

    //     const quantityField = await screen.findByLabelText(/Quantity/i) as HTMLInputElement;
    //     const addButton = await screen.findByRole('button', { name: /Add/i }) as HTMLButtonElement;

    //     await screen.findByText(/Wellsley Farms Tilapia/);

    //     await act(async () => {
    //         await userEvent.clear(quantityField);
    //         await userEvent.type(quantityField, '0');
    //         await userEvent.click(addButton);
    //     });

    //     await screen.findByText(/Quantity must be numeric and greater than zero/);
    // });
});
