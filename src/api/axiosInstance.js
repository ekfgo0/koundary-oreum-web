import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://172.30.1.1:8080', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
