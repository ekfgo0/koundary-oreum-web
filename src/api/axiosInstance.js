import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.174.75:8080', // 백엔드 서버 주소
  timeout: 10000,
});

// 요청 인터셉터 (인증 토큰 자동 추가 + 디버깅)
// 토큰 추출: 브라우저 로컬 스토리지에서 인증 토큰을 가져옴
// 사용자 ID 추출: 두가지 변수(user_id, userID) 중 하나에서 사용자 아이디를 찾음
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('user_id') || localStorage.getItem('userId');
    
    console.log('API 요청 디버깅:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      token: token ? 'exists' : 'missing',
      userId: userId || 'missing',
      data: config.data
    });
    
    // 토큰이 있으면 Authorization: Bearer 토큰값 헤더를 자동으로 추가
    // 토큰이 없으면 해당 헤더를 삭제함
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    else delete config.headers.Authorization;
    return config;
  },
  (error) => {
    console.error('요청 인터셉터 오류:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (디버깅)
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('API 응답 성공:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API 응답 오류:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;