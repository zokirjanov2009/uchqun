import axios from 'axios';
import { API_URL } from '../config';
import { getStoredAuth, storeAuth, clearAuth } from '../storage/authStorage';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const { accessToken } = await getStoredAuth();
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken } = await getStoredAuth();
        if (!refreshToken) throw new Error('No refresh token');

        const resp = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const { accessToken } = resp.data || {};
        if (!accessToken) throw new Error('Refresh did not return accessToken');

        const current = await getStoredAuth();
        await storeAuth({ ...current, accessToken });

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (e) {
        await clearAuth();
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

