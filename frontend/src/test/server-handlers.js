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
];

export { handlers };
