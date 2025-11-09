import api from './api';

type QueryOptions = {
  params?: Record<string, unknown>;
  retries?: number;
};

async function requestWithRetry<T>(fn: () => Promise<T>, retries = 2, delayMs = 300): Promise<T> {
  try {
    return await fn();
  } catch (err: unknown) {
    if (retries <= 0) throw err;
    await new Promise((r) => setTimeout(r, delayMs));
    return requestWithRetry(fn, retries - 1, delayMs * 2);
  }
}

const useApi = () => {
  const get = async <T = unknown>(url: string, options?: QueryOptions): Promise<T> => {
    const run = () => api.get<T>(url, { params: options?.params }).then((r) => r.data as T);
    return requestWithRetry(run, options?.retries ?? 2);
  };

  const post = async <T = unknown, D = unknown>(url: string, data?: D, retries = 2): Promise<T> => {
    const run = () => api.post<T>(url, data).then((r) => r.data as T);
    return requestWithRetry(run, retries);
  };

  const put = async <T = unknown, D = unknown>(url: string, data?: D, retries = 2): Promise<T> => {
    const run = () => api.put<T>(url, data).then((r) => r.data as T);
    return requestWithRetry(run, retries);
  };

  const del = async <T = unknown>(url: string, retries = 2): Promise<T> => {
    const run = () => api.delete<T>(url).then((r) => r.data as T);
    return requestWithRetry(run, retries);
  };

  return { get, post, put, del };
};

export default useApi;
