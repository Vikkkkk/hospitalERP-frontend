import axios from 'axios';
import { toast } from 'react-toastify';

// Create an Axios instance for API calls
const api = axios.create({
  baseURL: 'https://readily-hip-leech.ngrok-free.app', // Replace with your backend URL and port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to handle tokens (if needed)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Replace with your auth method if needed
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      toast.error(error.response.data.message || 'An error occurred');
    } else {
      toast.error('Network error');
    }
    return Promise.reject(error);
  }
);

export default api;
