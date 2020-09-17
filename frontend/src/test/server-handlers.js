import { rest } from 'msw';

const handlers = [
    rest.get('*/users/getuser', (req, res, ctx) => res(ctx.json({
        successful: true,
        error: '',
        user: {
            Name: 'Tester',
            Email: 'test@test.com',
            MeasurementSystem: 1,
            Birthday: '1/1/1900',
            Height: 60,
            Gender: 'M',
            ActivityLevel: 3,
            Weight: 175,
            Avatar: null,
            CaloriesBurnedSetting: 0,
            ManuallyCalculateCalories: false,
            DietMode: 2,
            DietPercentage: 20,
            TDEE: 2900,
            DailyTarget: {
                MacroTargetMode: 1,
                EnableActiveMinuteTarget: false,
                ActiveMintueTarget: 30,
                EnableCaloriesBurnedTarget: false,
                CaloriesBurnedTarget: 300,
                EnableCalorieTarget: true,
                CalorieTarget: 2320,
                ProteinPercentage: 35,
                CarbohydratesPercentage: 35,
                FatPercentage: 30,
                ProteinTarget: 158,
                CarbohydratesTarget: 158,
                FatTarget: 60,
                EnableProteinTarget: true,
                EnableCarbohydratesTarget: true,
                EnableFatTarget: false,
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

    rest.get('*/users/getusergear', (req, res, ctx) => res(ctx.json({
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

    rest.post('*/gear/addgear', (req, res, ctx) => res(ctx.json({
        successful: true,
        error: '',
        gear: [],
    }))),

    rest.post('*/gear/updategear', (req, res, ctx) => res(ctx.json({
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
        if (req.body.Email === 'test@testing.com' && req.body.Password === 'validPassword123') {
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
];

export { handlers };
