import axios from 'axios';
import config from '../config/env';
import useUserStore from "@/store/useUserStore"
import { redirect } from "react-router";

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
    const token = useUserStore.getState().token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
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
    // 401 跳转登录页
    // console.log('response', response);
    return response;
  },
  (error) => {
    // 统一处理错误
    // 401 跳转登录页
    console.log('error', error);
    if (error.status === 401) {
      if (error.status === 401) {
        // 使用 window.location 进行重定向
        window.location.href = '/#/login';
        return;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;