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
    const message = error?.response?.data?.message || 'Something went wrong';
    if (error?.response?.status === 401) {
      localStorage.removeItem('collegeClubToken');
      localStorage.removeItem('collegeClubUser');
      window.location.href = '/login';
    } else {
      window.dispatchEvent(new CustomEvent('club-management-api-error', { detail: message }));
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
