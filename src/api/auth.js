// 인증 관련 API 호출 함수들
import axiosInstance from './axiosInstance';
// 토큰 확인 헬퍼 함수
const ensureAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('로그인이 필요합니다. 토큰이 없습니다.');
  }
  console.log('토큰 확인됨:', token.substring(0, 20) + '...');
  return token;
};

// ========== 로그인 관련 ==========
// 로그인
export const login = async (loginId, password) => {
  try {
    console.log('로그인 API 호출 중...');
    const { data } = await axiosInstance.post('/auth/login', { loginId, password });
    
    console.log('서버 응답 구조:', data); // 디버깅용
    
    // 백엔드 LoginResponse 구조에 맞게 토큰 저장
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      console.log('accessToken 저장됨');
    } else if (data.token) {
      // 혹시 백엔드에서 token으로 보내는 경우 대비
      localStorage.setItem('accessToken', data.token);
      console.log('token을 accessToken으로 저장됨');
    }
    
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
      console.log('refreshToken 저장됨');
    }
    
    // 사용자 정보 저장
    if (data.userId) {
      localStorage.setItem('userId', data.userId.toString());
      
      // 사용자 정보 객체로 저장
      const userInfo = {
        userId: data.userId,
        nickname: data.nickname,
        profileImageUrl: data.profileImageUrl
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      console.log('사용자 정보 저장됨:', userInfo);
    } else if (data.user) {
      // 만약 user 객체로 감싸져서 오는 경우
      localStorage.setItem('userId', data.user.id.toString());
      localStorage.setItem('userInfo', JSON.stringify(data.user));
      console.log('사용자 정보(user 객체) 저장됨');
    }
    
    console.log('로그인 성공 - 모든 데이터 저장 완료');
    return data;
  } catch (error) {
    console.error('로그인 실패:', error.response?.data || error.message);
    throw (error.response?.data ?? error);
  }
};

// ============ 로그아웃 관련 ============
export const logout = async () => {
  try {
    // 토큰이 있는지 먼저 확인
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('이미 로그아웃 상태입니다.');
      return;
    }
    
    console.log('서버 로그아웃 요청 중... 토큰:', token.substring(0, 20) + '...');
    
    // 명시적으로 헤더 포함해서 요청
    const response = await axiosInstance.post('/auth/logout', {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('서버 로그아웃 성공:', response.status);
  } catch (error) {
    console.error('서버 로그아웃 오류:', error.response?.status, error.response?.data || error.message);
    
    // 상세한 에러 분석
    if (error.response?.status === 400) {
      console.log('400 에러 - 요청 형식 문제 또는 토큰 형식 오류');
      console.log('요청 헤더:', error.config?.headers);
      console.log('요청 데이터:', error.config?.data);
    } else if (error.response?.status === 401) {
      console.log('401 에러 - 토큰이 이미 무효화됨 (정상적인 경우)');
    } else if (error.response?.status === 404) {
      console.log('404 에러 - 로그아웃 API 엔드포인트가 존재하지 않음');
    } else if (!error.response) {
      console.log('네트워크 에러 - 서버에 연결할 수 없음');
    }
    
    // 400, 401 에러는 일반적으로 정상적인 로그아웃으로 처리
    if (error.response?.status === 400 || error.response?.status === 401) {
      console.log('토큰 문제이지만 로컬 데이터 삭제 진행');
    }
  } finally {
    // 어떤 상황이든 로컬 데이터는 삭제
    console.log('로컬 인증 데이터 삭제 중...');
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userInfo');
    
    console.log('로컬 인증 데이터 삭제 완료');
    
    // 삭제 후 상태 확인
    console.log('삭제 후 토큰 상태:', {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
      userId: localStorage.getItem('userId'),
      userInfo: localStorage.getItem('userInfo')
    });
  }
};

// 강제 로그아웃 함수 (서버 요청 없이 로컬만 삭제)
export const forceLogout = () => {
  console.log('강제 로그아웃 - 서버 요청 없이 로컬 데이터만 삭제');
  
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('userInfo');
  localStorage.removeItem('token');
  localStorage.removeItem('authToken');
  
  console.log('강제 로그아웃 완료');
};

// ============ 보조 함수들 ============
// 로그인 상태 확인
export const isLoggedIn = () => {
  const token = localStorage.getItem('accessToken');
  return !!token;
};

// 저장된 사용자 정보 가져오기
export const getStoredUserInfo = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

// 사용자 ID 가져오기
export const getStoredUserId = () => {
  return localStorage.getItem('userId');
};

// 저장된 토큰 가져오기
export const getStoredToken = () => {
  return localStorage.getItem('accessToken');
};

// 토큰 유효성 검증
export const validateToken = async () => {
  ensureAuthenticated();
  
  try {
    console.log('토큰 유효성 검증 중...');
    const { data } = await axiosInstance.get('/auth/me');
    console.log('토큰 유효성 검증 성공');
    return data;
  } catch (error) {
    console.error('토큰 검증 실패:', error.response?.data || error.message);
    
    // 토큰이 유효하지 않으면 로컬 데이터 삭제
    if (error.response?.status === 401) {
      console.log('토큰 무효 - 로컬 데이터 삭제');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userInfo');
    }
    
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
  try {
    console.log('닉네임 중복 확인 중...');
    const { data } = await axiosInstance.post('/users/check-nickname', { nickname });
    console.log('닉네임 중복 확인 완료');
    return data;
  } catch (error) {
    console.error('닉네임 중복 확인 실패:', error.response?.data || error.message);
    throw (error.response?.data ?? error);
  }
};

// 아이디 중복 확인
export const checkUsername = async (loginId) => {
  try {
    console.log('아이디 중복 확인 중...');
    const { data } = await axiosInstance.post('/users/check-loginId', { loginId });
    console.log('아이디 중복 확인 완료');
    return data;
  } catch (error) {
    console.error('아이디 중복 확인 실패:', error.response?.data || error.message);
    throw (error.response?.data ?? error);
  }
};

// 인증 메일 전송
export const sendVerificationEmail = async (email) => {
  try {
    console.log('📡 인증 메일 전송 중...');
    const { data } = await axiosInstance.post('/email/send-code', { email });
    console.log('인증 메일 전송 완료');
    return data;
  } catch (error) {
    console.error('인증 메일 전송 실패:', error.response?.data || error.message);
    throw (error.response?.data ?? error);
  }
};

// 인증번호 확인
export const verifyCode = async (email, code) => {
  try {
    console.log('인증번호 확인 중...');
    const { data } = await axiosInstance.post('/email/verify-code', { email, code });
    console.log('인증번호 확인 완료');
    return data;
  } catch (error) {
    console.error('인증번호 확인 실패:', error.response?.data || error.message);
    throw (error.response?.data ?? error);
  }
};

// 회원가입
export const signUp = async (formData) => {
  try {
    console.log('회원가입 요청 중...');
    const { data } = await axiosInstance.post('/users/signup', formData);
    console.log('회원가입 성공');
    return data;
  } catch (error) {
    console.error('회원가입 실패:', error.response?.data || error.message);
    throw (error.response?.data ?? error);
  }
};

// ============ 디버깅 함수들 ============
export const debugAuthState = () => {
  console.log('=== 현재 인증 상태 디버깅 ===');
  console.log('accessToken:', localStorage.getItem('accessToken'));
  console.log('refreshToken:', localStorage.getItem('refreshToken'));
  console.log('userId:', localStorage.getItem('userId'));
  console.log('userInfo:', localStorage.getItem('userInfo'));
  console.log('isLoggedIn():', isLoggedIn());
  console.log('getStoredUserInfo():', getStoredUserInfo());
  console.log('getStoredUserId():', getStoredUserId());
};

// 토큰 재발급 API - 인증 필요하지만 특별한 헤더 처리
export const reissueToken = async (refreshToken) => {
  try {
    console.log('토큰 재발급 요청 중...');
    // refreshToken은 헤더에 별도로 전송
    const { data } = await axiosInstance.post('/auth/reissue', {}, {
      headers: {
        'Refresh-Token': refreshToken
      }
    });
    
    // 새로운 토큰들 저장
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    
    console.log('토큰 재발급 성공');
    return data;
  } catch (error) {
    console.error('토큰 재발급 실패:', error.response?.data || error.message);
    
    // 재발급 실패 시 모든 토큰 삭제
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userInfo');
    
    throw (error.response?.data ?? error);
  }
};