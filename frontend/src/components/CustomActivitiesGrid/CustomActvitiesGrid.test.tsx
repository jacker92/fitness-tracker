import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppContext } from '../AppContext/AppContext';
import { CustomActivitiesGrid } from './CustomActivitiesGrid';

describe('<CustomActivitiesGrid />', () => {
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
                <CustomActivitiesGrid />
            </AppContext.Provider>,
        );

        const dataRows = await screen.findAllByTestId(/griddatarow/);
        const editButtons = await screen.findAllByRole('button', { name: /Edit/i });
        const deleteButtons = await screen.findAllByRole('button', { name: /Delete/i });

        expect(dataRows).toHaveLength(3);
        expect(editButtons).toHaveLength(3);
        expect(deleteButtons).toHaveLength(3);

        await screen.findByText(/Hockey/);
        await screen.findByText(/Tennis/);
        await screen.findByText(/Yoga/);
    });
});
