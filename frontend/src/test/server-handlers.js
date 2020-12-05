/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import { rest } from 'msw';

const handlers = [
    rest.get('*/users/getuser', (req, res, ctx) => res(ctx.json({
        successful: true,
        error: '',
        user: {
            name: 'Tester',
            email: 'test@test.com',
            measurementSystem: 1,
            birthday: '1/1/1900',
            height: 60,
            gender: 'M',
            activityLevel: 3,
            weight: 175,
            avatar: null,
            caloriesBurnedSetting: 0,
            manuallyCalculateCalories: false,
            dietMode: 2,
            dietPercentage: 20,
            tdee: 2900,
            dailyTarget: {
                macroTargetMode: 1,
                enableActiveMinuteTarget: false,
                activeMintueTarget: 30,
                enableCaloriesBurnedTarget: false,
                caloriesBurnedTarget: 300,
                enableCalorieTarget: true,
                calorieTarget: 2320,
                proteinPercentage: 35,
                carbohydratesPercentage: 35,
                fatPercentage: 30,
                proteinTarget: 158,
                carbohydratesTarget: 158,
                fatTarget: 60,
                enableProteinTarget: true,
                enableCarbohydratesTarget: true,
                enableFatTarget: false,
                enableColorCoding: false,
                caloriesYellowStart: 80,
                caloriesYellowEnd: 120,
                caloriesGreenStart: 90,
                caloriesGreenEnd: 110,
                proteinYellowStart: 80,
                proteinYellowEnd: 120,
                proteinGreenStart: 90,
                proteinGreenEnd: 110,
                carbohydratesYellowStart: 80,
                carbohydratesYellowEnd: 120,
                carbohydratesGreenStart: 90,
                carbohydratesGreenEnd: 110,
                fatYellowStart: 80,
                fatYellowEnd: 120,
                fatGreenStart: 90,
                fatGreenEnd: 110,
            },
        },
    }))),

    rest.post('*/users/updateprofile', (req, res, ctx) => res(ctx.json({
        successful: true,
        error: '',
    }))),

    rest.post('*/users/updateactivitysettings', (req, res, ctx) => res(ctx.json({
        successful: true,
        error: '',
    }))),

    rest.post('*/users/updatedietsettings', (req, res, ctx) => res(ctx.json({
        successful: true,
        error: '',
    }))),

    rest.post('*/users/changepassword', (req, res, ctx) => res(ctx.json({
        successful: true,
        error: '',
    }))),

    rest.post('*/metrics/addmetric', (req, res, ctx) => res(ctx.json({
        successful: true,
        error: '',
        metrics: [],
    }))),

    rest.post('*/metrics/updatemetric', (req, res, ctx) => res(ctx.json({
        successful: true,
        error: '',
        metrics: [],
    }))),

    rest.get('*/users/getusertrackedmetrics', (req, res, ctx) => res(ctx.json({
        successful: true,
        error: '',
        metrics: [
            {
                id: 1009,
                userId: 'TESTID',
                metricId: 7,
                metric: {
                    id: 7,
                    userId: 'TESTID',
                    name: 'BMI',
                    units: '',
                    type: 3,
                    isSystem: false,
                },
                isTracked: true,
            },
            {
                id: 2,
                userId: 'TESTID',
                metricId: -2,
                metric: {
                    id: -2,
                    userId: null,
                    name: 'Body Fat Percentage',
                    units: null,
                    type: 4,
                    isSystem: true,
                },
                isTracked: true,
            },
            {
                id: 1,
                userId: 'TESTID',
                metricId: -1,
                metric: {
                    id: -1,
                    userId: null,
                    name: 'Weight',
                    units: null,
                    type: 2,
                    isSystem: true,
                },
                isTracked: true,
            },
        ],
    }))),

    rest.get('*/gear/getusergear', (req, res, ctx) => res(ctx.json({
        successful: true,
        error: '',
        gear: [
            {
                id: 1,
                name: 'Running Shoe 1',
                active: false,
            },
            {
                id: 2,
                name: 'Running Shoe 2',
                active: true,
            },
        ],
    }))),

    rest.post('*/gear/save', (req, res, ctx) => res(ctx.json({
        successful: true,
        error: '',
        gear: [],
    }))),

    rest.get('*/users/getusercustomactivities', (req, res, ctx) => res(ctx.json({
        successful: true,
        error: '',
        activities: [
            {
                id: 1,
                name: 'Hockey',
                estimatedCaloriesBurnedPerMinute: 9,
                type: 0,
                isSystem: false,
            },
            {
                id: 2,
                name: 'Tennis',
                estimatedCaloriesBurnedPerMinute: 5,
                type: 0,
                isSystem: false,
            },
            {
                id: 3,
                name: 'Yoga',
                estimatedCaloriesBurnedPerMinute: 5,
                type: 0,
                isSystem: false,
            },
        ],
    }))),

    rest.post('*/activities/addactivity', (req, res, ctx) => res(ctx.json({
        successful: true,
        error: '',
        activities: [],
    }))),

    rest.post('*/activities/updateactivity', (req, res, ctx) => res(ctx.json({
        successful: true,
        error: '',
        activities: [],
    }))),

    rest.post('*/users/authenticate', (req, res, ctx) => {
        if (req.body.email === 'test@testing.com' && req.body.password === 'validPassword123') {
            return res(ctx.json({
                successful: true,
                error: '',
                userId: '123',
                name: 'Test User',
                email: 'test@testing.com',
                token: '1234567890',
            }));
        }
        return res(ctx.json({
            successful: false,
            error: 'Invalid email or password',
        }));
    }),

    rest.get('*/users/checkemail', (req, res, ctx) => res(ctx.json({
        successful: true,
        error: '',
        valid: true,
    }))),

    rest.post('*/users/register', (req, res, ctx) => res(ctx.json({
        successful: true,
        error: '',
        userId: '123',
        name: 'Test User',
        email: 'test@testing.com',
        token: '1234567890',
    }))),

    rest.get('*/foods/getusercustomfoods', (req, res, ctx) => res(ctx.json({
        successful: true,
        error: '',
        foods: [
            {
                id: 1,
                name: 'Yogurt',
                brand: 'Chobani',
                servingSize: '5 oz.',
                calories: 120,
                protein: 10,
                carbohydrates: 20,
                fat: 2,
                sugar: 10,
                isAlcoholic: false,
                isPublic: false,
                userId: '123',
            },
            {
                id: 2,
                name: 'Honeycrisp Apple',
                brand: null,
                servingSize: '1 Apple',
                calories: 90,
                protein: 1,
                carbohydrates: 24,
                fat: 2,
                sugar: 13,
                isAlcoholic: false,
                isPublic: false,
                userId: '123',
            },
            {
                id: 3,
                name: 'Beer',
                brand: 'Budweiser',
                servingSize: '12 oz.',
                calories: 145,
                protein: 1,
                carbohydrates: 35,
                fat: 0,
                sugar: 1,
                isAlcoholic: true,
                isPublic: false,
                userId: '123',
            },
        ],
    }))),

    rest.get('*/foodgroupings/getuserfoodgroupings', (req, res, ctx) => res(ctx.json({
        successful: true,
        error: '',
        foodGroupings: [
            {
                id: 1,
                name: 'Breakfast',
                sortOrder: 1,
                userId: '123',
            },
            {
                id: 2,
                name: 'Lunch',
                sortOrder: 2,
                userId: '123',
            },
            {
                id: 3,
                name: 'Dinner',
                sortOrder: 3,
                userId: '123',
            },
            {
                id: 4,
                name: 'Snacks',
                sortOrder: 4,
                userId: '123',
            },
        ],
    }))),

    rest.get('*/foods/getfood', (req, res, ctx) => res(ctx.json({
        successful: true,
        error: '',
        food: [
            {
                id: 1,
                userId: '123',
                name: 'Garlic Bread',
                brand: 'Wegmans',
                servingSize: '1 slice',
                calories: 134,
                protein: 4,
                carbohydrates: 21,
                fat: 6,
                sugar: 1,
                isAlcoholic: false,
                isPublic: false,
            },
        ],
    }))),

    rest.get('*/foods/search', (req, res, ctx) => res(ctx.json({
        successful: true,
        error: '',
        foods: [
            {
                id: 1,
                userId: '123',
                name: 'Garlic Bread',
                brand: 'Wegmans',
                servingSize: '1 slice',
                calories: 134,
                protein: 4,
                carbohydrates: 21,
                fat: 6,
                sugar: 1,
                isAlcoholic: false,
                isPublic: false,
            },
            {
                id: 2,
                userId: '123',
                name: 'Garlic',
                brand: '',
                servingSize: '1 clove',
                calories: 6,
                protein: 0,
                carbohydrates: 1,
                fat: 0,
                sugar: 0,
                isAlcoholic: false,
                isPublic: true,
            },
            {
                id: 3,
                userId: '123',
                name: 'Garlic Beer',
                brand: 'Just No',
                servingSize: '12 oz.',
                calories: 165,
                protein: 1,
                carbohydrates: 31,
                fat: 0,
                sugar: 2,
                isAlcoholic: true,
                isPublic: false,
            },
        ],
    }))),
];

export { handlers };
