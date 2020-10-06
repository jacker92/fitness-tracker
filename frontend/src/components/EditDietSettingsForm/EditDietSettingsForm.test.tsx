import React from 'react';
import {
    render, act, screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppContext } from '../AppContext/AppContext';
import { EditDietSettingsForm } from './EditDietSettingsForm';

describe('<EditDietSettingsForm />', () => {
    test('it renders the form', async () => {
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
                <EditDietSettingsForm />
            </AppContext.Provider>,
        );

        const manuallyCalculateCaloriesCheckbox = await screen.findByLabelText(/Manually Calculate Calories/) as HTMLInputElement;
        expect(manuallyCalculateCaloriesCheckbox.checked).toEqual(false);

        const dietModeSelect = await screen.findByLabelText(/Diet Mode/) as HTMLSelectElement;
        expect(dietModeSelect.value).toBe('2');

        const dietPercentageField = await screen.findByLabelText(/Cut Percentage/) as HTMLInputElement;
        expect(dietPercentageField.value).toBe('20');

        const enableCaloriesTargetCheckbox = await screen.findByLabelText(/Enable Calories Target/) as HTMLInputElement;
        expect(enableCaloriesTargetCheckbox.checked).toEqual(true);

        const caloriesTargetField = await screen.findByLabelText('Calories Target') as HTMLInputElement;
        expect(caloriesTargetField.value).toBe('2320');

        const macroTargetModeSelect = await screen.findByLabelText(/Macro Target Mode/) as HTMLSelectElement;
        expect(macroTargetModeSelect.value).toBe('1');

        const percentFieldsDiv = await screen.findByTestId(/percentagefields-div/);
        expect(percentFieldsDiv.style.display).toEqual('block');

        const enableProteinPercentageCheckbox = await screen.findByTestId(/enableprotein_PERCENT/) as HTMLInputElement;
        expect(enableProteinPercentageCheckbox.checked).toEqual(true);

        const proteinPercentageField = await screen.findByTestId('protein_PERCENT') as HTMLInputElement;
        expect(proteinPercentageField.value).toBe('35');

        const enableCarbohydratesPercentageCheckbox = await screen.findByTestId(/enablecarbs_PERCENT/) as HTMLInputElement;
        expect(enableCarbohydratesPercentageCheckbox.checked).toEqual(true);

        const carbohydratesPercentageField = await screen.findByTestId('carbs_PERCENT') as HTMLInputElement;
        expect(carbohydratesPercentageField.value).toBe('35');

        const enableFatPercentageCheckbox = await screen.findByTestId(/enablefat_PERCENT/) as HTMLInputElement;
        expect(enableFatPercentageCheckbox.checked).toEqual(false);

        const fatPercentageField = await screen.findByTestId('fat_PERCENT');
        expect(fatPercentageField.style.display).toEqual('none');

        const manualFieldsDiv = await screen.findByTestId(/manualfields-div/);
        expect(manualFieldsDiv.style.display).toEqual('none');

        const enableColorCodingCheckbox = await screen.findByTestId(/enablecolorcoding/) as HTMLInputElement;
        expect(enableColorCodingCheckbox.checked).toEqual(false);

        const colorCodingFieldsDiv = await screen.findByTestId(/colorcoding-div/);
        expect(colorCodingFieldsDiv.style.display).toEqual('none');
    });

    test('it toggles the fields', async () => {
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
                <EditDietSettingsForm />
            </AppContext.Provider>,
        );

        const enableCaloriesTargetCheckbox = await screen.findByLabelText(/Enable Calories Target/) as HTMLInputElement;
        const caloriesTargetDiv = await screen.findByTestId(/caloriestarget-div/) as HTMLDivElement;
        const enableFatPercentageCheckbox = await screen.findByTestId(/enablefat_PERCENT/) as HTMLInputElement;
        const fatPercentageField = await screen.findByTestId('fat_PERCENT') as HTMLInputElement;
        const enableColorCodingCheckbox = await screen.findByTestId(/enablecolorcoding/) as HTMLInputElement;
        const colorCodingFieldsDiv = await screen.findByTestId(/colorcoding-div/);
        const caloriesYellowStartField = await screen.findByTestId('CALORIES_yellowstart') as HTMLSelectElement;
        const proteinGreenStartField = await screen.findByTestId('PROTEIN_greenstart') as HTMLSelectElement;
        const carbsGreenEndField = await screen.findByTestId('CARBOHYDRATES_greenend') as HTMLSelectElement;
        const fatYellowEndField = await screen.findByTestId('FAT_yellowend') as HTMLSelectElement;

        expect(caloriesTargetDiv.style.display).toEqual('block');
        expect(fatPercentageField.style.display).toEqual('none');
        expect(colorCodingFieldsDiv.style.display).toEqual('none');

        await act(async () => {
            await userEvent.click(enableCaloriesTargetCheckbox);
            await userEvent.click(enableFatPercentageCheckbox);
            await userEvent.click(enableColorCodingCheckbox);
        });

        expect(caloriesTargetDiv.style.display).toEqual('none');
        expect(fatPercentageField.style.display).toEqual('inline-block');
        expect(fatPercentageField.value).toBe('30');
        expect(colorCodingFieldsDiv.style.display).toEqual('block');
        expect(caloriesYellowStartField.value).toBe('80');
        expect(proteinGreenStartField.value).toBe('90');
        expect(carbsGreenEndField.value).toBe('110');
        expect(fatYellowEndField.value).toBe('120');
    });

    test('it updates the diet settings successfully', async () => {
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
                <EditDietSettingsForm />
            </AppContext.Provider>,
        );

        const proteinPercentageField = await screen.findByTestId('protein_PERCENT') as HTMLInputElement;
        const carbohydratesPercentageField = await screen.findByTestId('carbs_PERCENT') as HTMLInputElement;
        const enableFatPercentageCheckbox = await screen.findByTestId(/enablefat_PERCENT/) as HTMLInputElement;
        const fatPercentageField = await screen.findByTestId('fat_PERCENT') as HTMLInputElement;
        const saveButton = screen.getByRole('button', { name: /Save Changes/i }) as HTMLButtonElement;

        await act(async () => {
            await userEvent.click(enableFatPercentageCheckbox);

            await userEvent.clear(proteinPercentageField);
            await userEvent.clear(carbohydratesPercentageField);
            await userEvent.clear(fatPercentageField);

            await userEvent.type(proteinPercentageField, '30');
            await userEvent.type(carbohydratesPercentageField, '40');
            await userEvent.type(fatPercentageField, '30');

            await userEvent.click(saveButton);
        });

        await screen.findByText(/Diet settings updated successfully/);
    });
});
