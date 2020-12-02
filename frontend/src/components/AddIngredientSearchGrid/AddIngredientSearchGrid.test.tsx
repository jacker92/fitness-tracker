/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { render, act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppContext } from '../AppContext/AppContext';
import { AddIngredientSearchGrid } from './AddIngredientSearchGrid';

describe('<AddIngredientSearchGrid />', () => {
    test('it renders the form and grid', async () => {
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
                <AddIngredientSearchGrid visible onFoodSelected={() => {}} onCancel={() => {}} />
            </AppContext.Provider>,
        );

        const searchTermsField = await screen.findByLabelText(/Search Terms/) as HTMLInputElement;
        expect(searchTermsField.value).toBe('');
    });

    test('it returns records and populates the grid on a search', async () => {
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
                <AddIngredientSearchGrid visible onFoodSelected={() => {}} onCancel={() => {}} />
            </AppContext.Provider>,
        );

        const searchTermsField = await screen.findByLabelText(/Search Terms/) as HTMLInputElement;
        const searchButton = screen.getByRole('button', { name: /Search/i });

        await act(async () => {
            await userEvent.type(searchTermsField, 'Garlic');
            await userEvent.click(searchButton);
        });

        await screen.findByText(/Garlic Bread/);
        await screen.findByText('Garlic');
        await screen.findByText(/Garlic Beer/);
    });

    test('it validates the search form', async () => {
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
                <AddIngredientSearchGrid visible onFoodSelected={() => {}} onCancel={() => {}} />
            </AppContext.Provider>,
        );

        const searchButton = screen.getByRole('button', { name: /Search/i });

        await act(async () => {
            await userEvent.click(searchButton);
        });

        await screen.findByText(/Please enter some search terms/);
    });
});
