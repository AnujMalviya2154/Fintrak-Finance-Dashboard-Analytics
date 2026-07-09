import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  timeout: 15000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401 — clear auth and redirect to login.
// Exception: some authenticated endpoints legitimately return 401 for domain
// errors (e.g. wrong current password on /user/password), not for bad JWTs.
// We must NOT force-logout the user in those cases.
const SKIP_AUTO_LOGOUT_URLS = ['/user/password', '/user/login'];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    const isSkipped = SKIP_AUTO_LOGOUT_URLS.some((u) => requestUrl.includes(u));

    if (error.response?.status === 401 && !isSkipped) {
      localStorage.removeItem('token');
      // Avoid redirect loops if already on /login or /register
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
