import api from './api';
async function requestWithRetry(fn, retries = 2, delayMs = 300) {
    try {
        return await fn();
    }
    catch (err) {
        if (retries <= 0)
            throw err;
        await new Promise((r) => setTimeout(r, delayMs));
        return requestWithRetry(fn, retries - 1, delayMs * 2);
    }
}
const useApi = () => {
    const get = async (url, options) => {
        const run = () => api.get(url, { params: options?.params }).then((r) => r.data);
        return requestWithRetry(run, options?.retries ?? 2);
    };
    const post = async (url, data, retries = 2) => {
        const run = () => api.post(url, data).then((r) => r.data);
        return requestWithRetry(run, retries);
    };
    const put = async (url, data, retries = 2) => {
        const run = () => api.put(url, data).then((r) => r.data);
        return requestWithRetry(run, retries);
    };
    const del = async (url, retries = 2) => {
        const run = () => api.delete(url).then((r) => r.data);
        return requestWithRetry(run, retries);
    };
    return { get, post, put, del };
};
export default useApi;
