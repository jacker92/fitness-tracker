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
}

export { Utilities };
