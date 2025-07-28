import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://your-backend-api.com/api', // ← 여기에 실제 백엔드 주소 입력
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
