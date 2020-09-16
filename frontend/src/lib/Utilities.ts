class Utilities {
    static calculateProteinFromPercentage(calories: number, proteinPercentage: number) {
        return Math.round((calories / 4) * (proteinPercentage / 100));
    }

    static calculateCarbsFromPercentage(calories: number, carbsPercentage: number) {
        return Math.round((calories / 4) * (carbsPercentage / 100));
    }

    static calculateFatFromPercentage(calories: number, fatPercentage: number) {
        return Math.round((calories / 9) * (fatPercentage / 100));
    }

    static calculateAge(birthday: Date) {
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
}

export { Utilities };
