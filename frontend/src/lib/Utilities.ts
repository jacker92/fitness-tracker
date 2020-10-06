import { SelectValue } from '../types/SelectValue';

class Utilities {
    static calculateProteinFromPercentage(calories: number, proteinPercentage: number): number {
        return Math.round((calories / 4) * (proteinPercentage / 100));
    }

    static calculateCarbsFromPercentage(calories: number, carbsPercentage: number): number {
        return Math.round((calories / 4) * (carbsPercentage / 100));
    }

    static calculateFatFromPercentage(calories: number, fatPercentage: number): number {
        return Math.round((calories / 9) * (fatPercentage / 100));
    }

    static calculateAge(birthday: Date): number {
        const now: Date = new Date();

        const todayYear: number = now.getFullYear();
        const todayMonth: number = now.getMonth();
        const todayDay: number = now.getDate();

        const birthdayYear: number = birthday.getFullYear();
        const birthdayMonth: number = birthday.getMonth();
        const birthdayDay: number = birthday.getDate();

        let age = todayYear - birthdayYear;
        let monthAge = 0;

        if (todayMonth >= birthdayMonth) {
            monthAge = todayMonth - birthdayMonth;
        } else {
            age -= 1;
            monthAge = 12 + todayMonth - birthdayMonth;
        }

        if (todayDay < birthdayDay) {
            monthAge -= 1;

            if (monthAge < 0) {
                monthAge = 11;
                age -= 1;
            }
        }
        return age;
    }

    static ColorCodeRangeValues: Array<SelectValue> = [
        { value: 0, text: '0%' },
        { value: 5, text: '5%' },
        { value: 10, text: '10%' },
        { value: 15, text: '15%' },
        { value: 20, text: '20%' },
        { value: 25, text: '25%' },
        { value: 30, text: '30%' },
        { value: 35, text: '35%' },
        { value: 40, text: '40%' },
        { value: 45, text: '45%' },
        { value: 50, text: '50%' },
        { value: 55, text: '55%' },
        { value: 60, text: '60%' },
        { value: 65, text: '65%' },
        { value: 70, text: '70%' },
        { value: 75, text: '75%' },
        { value: 80, text: '80%' },
        { value: 85, text: '85%' },
        { value: 90, text: '90%' },
        { value: 95, text: '95%' },
        { value: 100, text: '100%' },
        { value: 105, text: '105%' },
        { value: 110, text: '110%' },
        { value: 115, text: '115%' },
        { value: 120, text: '120%' },
        { value: 125, text: '125%' },
        { value: 130, text: '130%' },
        { value: 135, text: '135%' },
        { value: 140, text: '140%' },
        { value: 145, text: '145%' },
        { value: 150, text: '150%' },
    ]
}

export { Utilities };
