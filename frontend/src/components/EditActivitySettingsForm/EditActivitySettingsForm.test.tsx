import React from 'react';
import {
    render, fireEvent, act, screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppContext } from '../AppContext/AppContext';
import { EditActivitySettingsForm } from './EditActivitySettingsForm';

describe('<EditActivitySettingsForm />', () => {
    test('it renders the form', async () => {
        render(
            <AppContext.Provider value={{
                currentUser: { id: '123', name: 'Tester', email: 'test@test.com' },
                loginUser: null,
                logoutUser: null,
                toggleUserMenu: null,
                userMenuVisible: false,
            }}
            >
                <EditActivitySettingsForm />
            </AppContext.Provider>,
        );

        const caloriesBurnedSettingField = await screen.findByLabelText(/Handle Calories Burned/) as HTMLSelectElement;
        expect(caloriesBurnedSettingField.value).toBe('0');

        const enableActiveMinuteTargetField = await screen.findByLabelText(/Enable Active Minute Target/) as HTMLInputElement;
        expect(enableActiveMinuteTargetField.checked).toEqual(false);

        const activeMinuteTargetDiv = await screen.findByTestId(/activeminutetarget-div/);
        expect(activeMinuteTargetDiv.style.display).toEqual('none');

        const enableCaloriesBurnedTargetField = await screen.findByLabelText(/Enable Calories Burned Target/) as HTMLInputElement;
        expect(enableCaloriesBurnedTargetField.checked).toEqual(false);

        const caloriesBurnedTargetDiv = await screen.findByTestId(/caloriesburnedtarget-div/);
        expect(caloriesBurnedTargetDiv.style.display).toEqual('none');
    });

    test('it toggles the target fields', async () => {
        render(
            <AppContext.Provider value={{
                currentUser: { id: '123', name: 'Tester', email: 'test@test.com' },
                loginUser: null,
                logoutUser: null,
                toggleUserMenu: null,
                userMenuVisible: false,
            }}
            >
                <EditActivitySettingsForm />
            </AppContext.Provider>,
        );

        const activeMinuteTargetDiv = await screen.findByTestId(/activeminutetarget-div/);
        expect(activeMinuteTargetDiv.style.display).toEqual('none');

        const caloriesBurnedTargetDiv = await screen.findByTestId(/caloriesburnedtarget-div/);
        expect(caloriesBurnedTargetDiv.style.display).toEqual('none');

        const enableActiveMinuteTargetField = await screen.findByLabelText(/Enable Active Minute Target/) as HTMLInputElement;
        const enableCaloriesBurnedTargetField = await screen.findByLabelText(/Enable Calories Burned Target/) as HTMLInputElement;

        await act(async () => {
            await userEvent.click(enableActiveMinuteTargetField);
            await userEvent.click(enableCaloriesBurnedTargetField);
        });

        expect(activeMinuteTargetDiv.style.display).toEqual('block');
        expect(activeMinuteTargetDiv.style.display).toEqual('block');

        const activeMinutesTargetField = await screen.findByLabelText('Active Minute Target') as HTMLInputElement;
        expect(activeMinutesTargetField.value).toBe('30');

        const caloriesBurnedTargetField = await screen.findByLabelText('Calories Burned Target') as HTMLInputElement;
        expect(caloriesBurnedTargetField.value).toBe('300');
    });

    test('it updates the profile successfully', async () => {
        render(
            <AppContext.Provider value={{
                currentUser: { id: '123', name: 'Tester', email: 'test@test.com' },
                loginUser: null,
                logoutUser: null,
                toggleUserMenu: null,
                userMenuVisible: false,
            }}
            >
                <EditActivitySettingsForm />
            </AppContext.Provider>,
        );

        const enableActiveMinuteTargetField = await screen.findByLabelText(/Enable Active Minute Target/) as HTMLInputElement;
        const enableCaloriesBurnedTargetField = await screen.findByLabelText(/Enable Calories Burned Target/) as HTMLInputElement;

        await act(async () => {
            await userEvent.click(enableActiveMinuteTargetField);
            await userEvent.click(enableCaloriesBurnedTargetField);
        });

        const activeMinutesTargetField = await screen.findByLabelText('Active Minute Target') as HTMLInputElement;
        const caloriesBurnedTargetField = await screen.findByLabelText('Calories Burned Target') as HTMLInputElement;
        const saveButton = screen.getByRole('button', { name: /Save Changes/i }) as HTMLButtonElement;

        await act(async () => {
            await userEvent.clear(activeMinutesTargetField);
            await userEvent.clear(caloriesBurnedTargetField);
            await userEvent.type(activeMinutesTargetField, '45');
            await userEvent.type(caloriesBurnedTargetField, '400');

            await userEvent.click(saveButton);
        });

        await screen.findByText(/Activity settings updated successfully/);
    });
});
