import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('collegeClubToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const responseData = error?.response?.data;
    const fieldErrors = responseData?.errors;
    const validationMessage = fieldErrors && Object.values(fieldErrors).length
      ? Object.values(fieldErrors).join(' ')
      : null;
    const message = validationMessage
      || responseData?.message
      || (error?.response
        ? `Request failed with status ${error.response.status}. Please try again.`
        : 'Cannot reach the server. Check that the backend is running and the API URL is correct.');
    if (error?.response?.status === 401) {
      localStorage.removeItem('collegeClubToken');
      localStorage.removeItem('collegeClubUser');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    } else {
      window.dispatchEvent(new CustomEvent('club-management-api-error', { detail: message }));
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
