import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.174.46:8080', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
