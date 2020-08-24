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

    static TDEEMultipliers = {
        male: {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            very: 1.725,
            extremely: 1.9,
        },
        female: {
            sedentary: 1.1,
            light: 1.275,
            moderate: 1.35,
            very: 1.525,
            extremely: 1.7,
        },
    };

    static calculateBMR(args: { gender: string, measurementSystem: number, weight: number, height: number, age: number }) {
        let weightInKg = 0;
        let heightInCm = 0;

        if (args.measurementSystem === 1) {
            // convert to metric
            weightInKg = args.weight * 0.45359;
            heightInCm = args.height * 2.54;
        } else {
            heightInCm = args.height * 100;
        }

        console.log({
            weight: args.weight,
            height: args.height,
            weightInKg,
            heightInCm,
        });

        if (args.gender === 'M') {
            return (heightInCm * 6.25) + (weightInKg * 9.99) - (args.age * 4.92) + 5;
        }

        return (heightInCm * 6.25) + (weightInKg * 9.99) - (args.age * 4.92) - 161;
    }

    static calculateTDEE(gender: string, bmr: number, activityLevel: number) {
        let activityMultiplier = 1;

        switch (activityLevel) {
            case 1:
                if (gender === 'M') {
                    activityMultiplier = this.TDEEMultipliers.male.light;
                } else {
                    activityMultiplier = this.TDEEMultipliers.female.light;
                }
                break;

            case 2:
                if (gender === 'M') {
                    activityMultiplier = this.TDEEMultipliers.male.moderate;
                } else {
                    activityMultiplier = this.TDEEMultipliers.female.moderate;
                }
                break;

            case 3:
                if (gender === 'M') {
                    activityMultiplier = this.TDEEMultipliers.male.very;
                } else {
                    activityMultiplier = this.TDEEMultipliers.female.very;
                }
                break;

            case 4:
                if (gender === 'M') {
                    activityMultiplier = this.TDEEMultipliers.male.extremely;
                } else {
                    activityMultiplier = this.TDEEMultipliers.female.extremely;
                }
                break;

            case 5:
            default:
                if (gender === 'M') {
                    activityMultiplier = this.TDEEMultipliers.male.sedentary;
                } else {
                    activityMultiplier = this.TDEEMultipliers.female.sedentary;
                }
                break;
        }

        console.log({
            BMR: bmr,
            TDEE: Math.round(bmr * activityMultiplier),
        });

        return Math.round(bmr * activityMultiplier);
    }

    static calculateCalories(tdee: number, multiplier: number) {
        return tdee * multiplier;
    }
}

export { Utilities };
