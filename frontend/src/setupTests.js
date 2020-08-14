/* eslint-disable import/no-extraneous-dependencies */
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// process.env.REACT_APP_FT_API_URL = '';

// // eslint-disable-next-line no-unused-vars
// async function mockFetch(url, config) {
//     switch (url) {
//         case '/users/getuser': {
//             return {
//                 ok: true,
//                 status: 200,
//                 json: async () => ({
//                     successful: true,
//                     error: '',
//                     user: {
//                         Name: 'Tester',
//                         Email: 'test@test.com',
//                         MeasurementSystem: 1,
//                         Birthday: '1/1/1900',
//                         Height: 60,
//                     },
//                 }),
//             };
//         }

//         default: {
//             throw new Error(`Unhandled request: ${url}`);
//         }
//     }
// }

// beforeAll(() => jest.spyOn(window, 'fetch'));
// beforeEach(() => window.mockImplementation(mockFetch));

import { server } from './test/server';

beforeAll(() => server.listen());

// if you need to add a handler after calling setupServer for some specific test
// this will remove that handler for the rest of them
// (which is important for test isolation):
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
