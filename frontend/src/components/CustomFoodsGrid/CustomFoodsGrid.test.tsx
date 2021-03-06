import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppContext } from '../AppContext/AppContext';
import { CustomFoodsGrid } from './CustomFoodsGrid';

describe('<CustomFoodsGrid />', () => {
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
                <CustomFoodsGrid />
            </AppContext.Provider>,
        );

        const dataRows = await screen.findAllByTestId(/griddatarow/);
        const editButtons = await screen.findAllByRole('button', { name: /Edit/i });
        const deleteButtons = await screen.findAllByRole('button', { name: /Delete/i });

        expect(dataRows).toHaveLength(3);
        expect(editButtons).toHaveLength(3);
        expect(deleteButtons).toHaveLength(3);

        await screen.findByText(/Yogurt/);
        await screen.findByText('Honeycrisp Apple');
        await screen.findByText(/Beer/);
        await screen.findByText(/Budweiser/);
        await screen.findByText(/Chobani/);
    });
});
