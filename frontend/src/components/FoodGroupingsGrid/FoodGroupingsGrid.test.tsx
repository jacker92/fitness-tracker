import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppContext } from '../AppContext/AppContext';
import { FoodGroupingsGrid } from './FoodGroupingsGrid';

describe('<FoodGroupingsGrid />', () => {
    test('it renders the grid', async () => {
        render(
            <AppContext.Provider value={{
                currentUser: { id: '123', name: 'Tester', email: 'test@test.com' },
                loginUser: null,
                logoutUser: null,
                toggleUserMenu: jest.fn(),
                userMenuVisible: false,
                setOverlayVisibility: jest.fn(),
                overlayVisible: false,
            }}
            >
                <FoodGroupingsGrid />
            </AppContext.Provider>,
        );

        const dataRows = await screen.findAllByTestId(/griddatarow/);
        const editButtons = await screen.findAllByRole('button', { name: /Edit/i });
        const deleteButtons = await screen.findAllByRole('button', { name: /Delete/i });

        expect(dataRows).toHaveLength(4);
        expect(editButtons).toHaveLength(4);
        expect(deleteButtons).toHaveLength(4);

        await screen.findByText(/Breakfast/);
        await screen.findByText(/Lunch/);
        await screen.findByText(/Dinner/);
        await screen.findByText(/Snacks/);
    });
});
