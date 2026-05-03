import axios from 'axios';

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('teamTaskUser');

  if (storedUser) {
    try {
      const { token } = JSON.parse(storedUser);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      localStorage.removeItem('teamTaskUser');
    }
  }

  return config;
});

export const getApiError = (error) => {
  const data = error?.response?.data;

  if (typeof data === 'string') {
    return data;
  }

  return data?.message || data?.error || error?.message || 'Something went wrong. Please try again.';
};

export default api;
