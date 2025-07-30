import axios from 'axios';

const axiosInstance = axios.create({
<<<<<<< HEAD
  baseURL: 'http://172.30.1.1:8080', 
=======
  baseURL: 'http://192.168.174.46:8080', // ← 여기에 실제 백엔드 주소 입력
>>>>>>> 0d0356183b6b87cb7418fae171d96c64e9dbe01d
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
