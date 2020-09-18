import { ClientArguments } from '../types/ClientArguments';

const apiUrl = process.env.REACT_APP_FT_API_URL;
const localStorageKey = '__fittracker_token__';

function logout() {
    window.localStorage.removeItem(localStorageKey);
}

async function client(endpoint: string, {
    data = null,
    contentType = 'application/json',
    fileUpload = false,
    ...customConfig
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: ClientArguments = {}) : Promise<any> {
    const token = window.localStorage.getItem(localStorageKey);

    const headers: Record<string, string> = {};

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (contentType !== null) {
        headers['Content-Type'] = contentType;
    }

    let body;
    if (data && data !== null) {
        body = (fileUpload ? data : JSON.stringify(data));
    }

    const config: RequestInit = {
        method: data ? 'POST' : 'GET',
        body,
        headers,
        ...customConfig,
    };

    return window.fetch(`${apiUrl}/${endpoint}`, config).then(async (response) => {
        if (response.status === 401) {
            logout();

            // refresh the page for them
            window.location.assign(window.location.toString());

            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject({ message: 'Please re-authenticate.' });
        }
        const responseData = await response.json();

        if (response.ok) {
            return responseData;
        }

        return Promise.reject(responseData);
    });
}

export { client };
