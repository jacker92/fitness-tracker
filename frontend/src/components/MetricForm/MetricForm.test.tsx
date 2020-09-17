import React from 'react';
import {
    render, act, screen, fireEvent, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppContext } from '../AppContext/AppContext';
import { MetricForm } from './MetricForm';
// eslint-disable-next-line no-unused-vars
import { Metric } from '../../lib/types/Metric';

describe('<MetricForm />', () => {
    const newMetric: Metric = {
        id: 0, name: '', units: '', type: 0,
    };

    const existingMetric: Metric = {
        id: 1, name: 'Test Metric', units: 'light years', type: 3,
    };

    test('it renders the form for a new metric', async () => {
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
                <MetricForm metric={newMetric} visible onSuccess={() => {}} onCancel={() => {}} />
            </AppContext.Provider>,
        );

        const nameField = await screen.findByLabelText(/Name/) as HTMLInputElement;
        expect(nameField.value).toBe('');

        const typeField = await screen.findByLabelText(/Type/) as HTMLSelectElement;
        expect(typeField.value).toBe('0');

        const unitsDiv = await screen.findByTestId(/units-div/) as HTMLDivElement;
        expect(unitsDiv.style.display).toEqual('none');

        await screen.findByRole('button', { name: /Add/i });
    });

    test('it renders the form for an existing metric', async () => {
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
                <MetricForm metric={existingMetric} visible onSuccess={() => {}} onCancel={() => {}} />
            </AppContext.Provider>,
        );

        const nameField = await screen.findByLabelText(/Name/) as HTMLInputElement;
        expect(nameField.value).toBe('Test Metric');

        const typeField = await screen.findByLabelText(/Type/) as HTMLSelectElement;
        expect(typeField.value).toBe('3');

        const unitsDiv = await screen.findByTestId(/units-div/) as HTMLDivElement;
        expect(unitsDiv.style.display).toEqual('block');

        const unitsField = await screen.findByLabelText(/Units/) as HTMLInputElement;
        expect(unitsField.value).toBe('light years');

        await screen.findByRole('button', { name: /Update/i });
    });

    test('it validates the form', async () => {
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
                <MetricForm metric={newMetric} visible onSuccess={() => {}} onCancel={() => {}} />
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
                loginUser: jest.fn(),
                logoutUser: jest.fn(),
                toggleUserMenu: jest.fn(),
                userMenuVisible: false,
                setOverlayVisibility: jest.fn(),
                overlayVisible: false,
            }}
            >
                <MetricForm metric={newMetric} visible onSuccess={() => {}} onCancel={() => {}} />
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
