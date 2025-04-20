import axios from 'axios';
import config from '../config/env';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: config.apiHost,
  timeout: config.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证信息等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // 可以在这里统一处理响应
    return response;
  },
  (error) => {
    // 统一处理错误
    return Promise.reject(error);
  }
);

export default apiClient;