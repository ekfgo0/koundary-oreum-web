// src/api/axiosInstance.js (디버깅 버전)
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.174.75:8080', // /api 제거
  timeout: 10000,
});

// 요청 인터셉터 (인증 토큰 자동 추가 + 디버깅)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('user_id') || localStorage.getItem('userId');
    
    console.log('API 요청 디버깅:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      token: token ? 'exists' : 'missing',
      userId: userId || 'missing',
      data: config.data
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('요청 인터셉터 오류:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (디버깅)
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('API 응답 성공:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API 응답 오류:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;