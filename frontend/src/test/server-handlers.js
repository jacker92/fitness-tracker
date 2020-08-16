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
            Avatar: null,
        },
    }))),

    rest.post('*/users/updateprofile', (req, res, ctx) => res(ctx.json({
        successful: true,
        error: '',
    }))),
];

export { handlers };
