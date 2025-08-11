import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.174.46:8080', // ← 여기에 실제 백엔드 주소 입력
  //baseURL: import.meta.env.VITE_API_BASE_URL, // ← 여기에 실제 백엔드 주소 입력
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
