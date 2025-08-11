import axiosInstance from './axiosInstance';

// 로그인
export const login = async (loginId, password) => {
  try {
    const { data } = await axiosInstance.post('/auth/login', { loginId, password });
    return data;
  } catch (error) {
    throw (error.response?.data ?? error);
  }
};

// 닉네임 중복 확인
export const checkNickname = async (nickname) => {
  const { data } = await axiosInstance.post('/users/check-nickname', { nickname });
  return data;
};

// 아이디 중복 확인
export const checkUsername = async (loginId) => {
  const { data } = await axiosInstance.post('/users/check-loginId', { loginId });
  return data;
};

// 인증 메일 전송
export const sendVerificationEmail = async (email) => {
  const { data } = await axiosInstance.post('/email/send-code', { email });
  return data;
};

// 인증번호 확인
export const verifyCode = async (email, code) => {
  const { data } = await axiosInstance.post('/email/verify-code', { email, code });
  return data;
};

// 회원가입
export const signUp = async (formData) => {
  const { data } = await axiosInstance.post('/users/signup', formData);
  return data;
};

// 대학 목록
export const getUniversities = async () => {
  const { data } = await axiosInstance.get('/universities');
  return data;
};

