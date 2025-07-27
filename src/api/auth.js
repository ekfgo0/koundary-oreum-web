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
