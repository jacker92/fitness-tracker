import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppContext } from '../AppContext/AppContext';
import { GearGrid } from './GearGrid';

describe('<GearGrid />', () => {
    test('it renders the grid', async () => {
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
                <GearGrid />
            </AppContext.Provider>,
        );

        const dataRows = await screen.findAllByTestId(/griddatarow/);
        const editButtons = await screen.findAllByRole('button', { name: /Edit/i });
        const deleteButtons = await screen.findAllByRole('button', { name: /Delete/i });
        const activateButtons = await screen.findAllByRole('button', { name: 'Activate' });
        const deactivateButtons = await screen.findAllByRole('button', { name: 'Deactivate' });

        expect(dataRows).toHaveLength(2);
        expect(editButtons).toHaveLength(2);
        expect(deleteButtons).toHaveLength(2);
        expect(activateButtons).toHaveLength(1);
        expect(deactivateButtons).toHaveLength(1);

        await screen.findByText(/Running Shoe 1/);
        await screen.findByText(/Running Shoe 2/);
    });
});
