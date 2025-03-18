import axios from 'axios';
import { toast } from 'react-toastify';

// ✅ Create an Axios instance for API calls
const api = axios.create({
  baseURL: 'https://readily-hip-leech.ngrok-free.app/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Replace with your auth method if needed
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ 请求拦截器错误:', error);
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API 响应错误:', error);

    if (!error.response) {
      toast.error('⚠️ 网络连接错误，请检查您的网络');
      return Promise.reject('Network error');
    }

    const { status, data } = error.response;

    if (status === 401) {
      toast.error('🔑 认证失败，请重新登录');
      localStorage.removeItem('authToken'); // 🔐 Optionally log the user out
      window.location.href = '/login'; // Redirect to login page if needed
    } else if (status === 403) {
      toast.error('🚫 访问被拒绝，您没有权限');
    } else if (status === 404) {
      toast.error('🔍 资源未找到');
    } else if (status === 500) {
      toast.error('⚠️ 服务器内部错误，请稍后再试');
    } else {
      toast.error(data.message || '❌ 发生错误，请稍后再试');
    }

    return Promise.reject(error);
  }
);

export default api;