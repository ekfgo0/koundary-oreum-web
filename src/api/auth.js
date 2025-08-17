// 인증 관련 API 호출 함수들
import axiosInstance from './axiosInstance';

// ========== 로그인 관련 ==========
// 로그인
export const login = async (loginId, password) => {
  try {
    const { data } = await axiosInstance.post('/auth/login', { loginId, password });
    
    // 로그인 성공 시 토큰과 사용자 정보를 localStorage에 저장
    // localStorage 저장이 필요한 이유:
    // 1. 페이지 새로고침 시 로그인상태 유지
    // 2. 사용자 정보 즉시 접근 (서버에 매번 요청하지 않고도 사용자 정보(이름, 프로필 등)를 바로 사용 가능)
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    
    // 사용자 정보 저장 (서버 응답 구조에 따라 조정 필요)
    if (data.user) {
      localStorage.setItem('user_id', data.user.id);
      localStorage.setItem('userInfo', JSON.stringify(data.user));
    } else if (data.userId) {
      // 만약 서버에서 userId만 보내는 경우
      localStorage.setItem('user_id', data.userId);
    }
    
    console.log('로그인 성공 - 토큰 저장됨:', data.token ? 'YES' : 'NO');
    
    return data;
  } catch (error) {
    console.error('로그인 실패:', error.response?.data || error.message);
    throw (error.response?.data ?? error);
  }
};

// ============ 로그아웃 관련 ============
export const logout = async () => {
  try {
    // 서버에 로그아웃 요청 (토큰 무효화)
    await axiosInstance.post('/auth/logout');
    console.log('서버 로그아웃 성공');
  } catch (error) {
    console.error('서버 로그아웃 오류:', error.response?.data || error.message);
    // 서버 로그아웃 실패해도 로컬 데이터는 삭제
  } finally {
    // 로컬 스토리지에서 모든 인증 관련 데이터 삭제
    localStorage.removeItem('authToken');
    localStorage.removeItem('user_id');
    localStorage.removeItem('userId'); //////////////////////// 혹시 둘 다 사용하는 경우 대비 <이거 확인 필요, 확인 후 밑 동일변수들 삭제
    localStorage.removeItem('userInfo');
    console.log('로컬 인증 데이터 삭제 완료');
  }
};

// ============ 보조 함수들 ============
// 로그인 상태 확인
export const isLoggedIn = () => {
  const token = localStorage.getItem('authToken');
  return !!token; // token이 있으면 true, 없으면 false
};

// 저장된 사용자 정보 가져오기
export const getStoredUserInfo = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

// 사용자 ID 가져오기
export const getStoredUserId = () => {
  return localStorage.getItem('user_id') || localStorage.getItem('userId');
};

// 저장된 토큰 가져오기
export const getStoredToken = () => {
  return localStorage.getItem('authToken');
};

// 토큰 유효성 검증 (서버에 확인)
export const validateToken = async () => {
  try {
    const { data } = await axiosInstance.get('/auth/me');
    return data;
  } catch (error) {
    // 토큰이 유효하지 않으면 로컬 데이터 삭제
    console.log('토큰 검증 실패 - 로컬 데이터 삭제');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user_id');
    localStorage.removeItem('userId');
    localStorage.removeItem('userInfo');
    throw (error.response?.data ?? error);
  }
};

// ============ 초기화 관련 ============
// 웹 시작 시 토큰 유효성 검사
export const initializeAuth = async () => {
  const token = getStoredToken();
  
  if (!token) {
    console.log('저장된 토큰 없음 - 로그인 필요');
    return false;
  }
  
  try {
    await validateToken();
    console.log('저장된 토큰 유효 - 로그인 상태 유지');
    return true;
  } catch (error) {
    console.log('저장된 토큰 무효 - 로그인 필요');
    return false;
  }
};

// =========== 회원가입 관련 ==========
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

// ============ 프로필 수정 관련 ============
// 비밀번호 변경
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const { data } = await axiosInstance.put('/auth/change-password', {
      currentPassword,
      newPassword
    });
    
    console.log('비밀번호 변경 성공');
    return data;
  } catch (error) {
    console.error('비밀번호 변경 실패:', error.response?.data || error.message);
    throw (error.response?.data ?? error);
  }
};
