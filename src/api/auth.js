import axiosInstance from './axiosInstance';  // axiosInstance.js 파일에서 axios 인스턴스를 import

export const login = async (id, password) => {
  try {
    const response = await axiosInstance.post('/login', {
      id,
      password
    });
    return response.data;  // 서버에서 받은 데이터 반환
  } catch (error) {
    throw error.response?.data || error;  // 에러 처리
  }
}

export const checkNickname = (nickname) =>
  axiosInstance.post('/check-nickname', { nickname });

export const checkUsername = (ID) =>
  axiosInstance.post('/check-username', { ID });

export const sendVerificationEmail = (email) =>
  axiosInstance.post('/send-verification-email', { email });

export const verifyCode = (email, code) =>
  axiosInstance.post('/verify-code', { email, code });

export const signUp = (formData) =>
  axiosInstance.post('/signup', formData);  // 회원가입 요청 처리

export const getUniversities = () =>
  axiosInstance.get('/universities');
