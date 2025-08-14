import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.174.46:8080', // ← 여기에 실제 백엔드 주소 입력
  //baseURL: import.meta.env.VITE_API_BASE_URL, // ← 여기에 실제 백엔드 주소 입력
  headers: {
    'Content-Type': 'application/json',
     timeout: 8000,
  },
});

// 요청 인터셉터: 모든 요청에 토큰 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // 로그인 시 저장했던 토큰
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
