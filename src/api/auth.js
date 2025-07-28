<<<<<<< HEAD
import axios from 'axios'

const BASE_URL = 'https://your-backend-url.com/api'  // 백엔드 주소로 변경

export const login = async (id, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      id,
      password
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}
=======
import axios from './axiosInstance';

export const checkNickname = (nickname) =>
  axios.post('/check-nickname', { nickname });

export const checkUsername = (ID) =>
  axios.post('/check-username', { ID });

export const sendVerificationEmail = (email) =>
  axios.post('/send-verification-email', { email });

export const verifyCode = (email, code) =>
  axios.post('/verify-code', { email, code });

export const signUp = (formData) =>
  axios.post('/signup', formData);

export const getUniversities = () =>
  axios.get('/universities');
>>>>>>> 07e4f7c01e20a6a79dbe811ab2d87369d84ab4d0
