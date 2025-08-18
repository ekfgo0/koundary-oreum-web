import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.0.18:8080', // 현재 캡쳐 기준
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
