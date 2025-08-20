import axiosInstance from './axiosInstance';

const USE_MOCK = (import.meta.env?.VITE_USE_MOCK ?? 'true').toString() === 'true';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- 로컬스토리지에 mock 상태를 저장(새로고침해도 유지) ---
const LS_KEY = 'mock_me_v1';

const defaultMock = {
  userID: 1,          // 유저 고유 아이디
  loginId: 'abcd123', // 유저가 입력한 로그인 아이디
  nickname: '홍길동',
  university: '홍익대학교',
  email: 'test@example.com',
  country: 'Korea',
  profileImageUrl: '', // 프로필 이미지 URL
  isDefaultImage: true, // 기본 프로필 이미지 여부
  // 나의 활동 개수를 위한 목업 데이터 추가
  activity: {
    posts: 2,
    comments: 1,
    scraps: 1,
  },
};

function readMock() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : defaultMock;
  } catch {
    return defaultMock;
  }
}

function writeMock(obj) {
  localStorage.setItem(LS_KEY, JSON.stringify(obj));
}

// 서버-프론트 필드 정규화
const normalize = (data = {}) => ({
  userID: data.userID ?? data.userId ?? data.id ?? 0,
  loginId: data.loginId ?? data.username ?? '',
  nickname: data.nickname ?? '',
  university: data.university ?? data.school ?? '',
  email: data.email ?? '',
  country: data.country ?? data.nationality ?? '',
  profileImageUrl: data.profileImageUrl ?? data.profileImage ?? '',
  isDefaultImage: data.isDefaultImage ?? true,
  activity: data.activity, // activity 데이터도 추가
});

// ============ 프로필 조회 ============
// 내 프로필 정보 가져오기
export const getMyProfile = async () => {
  if (USE_MOCK) {
    await sleep(250);
    return readMock();
  }
  
  try {
    const { data } = await axiosInstance.get('/mypage/me');
    const normalizedData = normalize(data);
    
    // 최신 프로필 정보를 localStorage에 업데이트
    localStorage.setItem('userInfo', JSON.stringify(normalizedData));
    
    return normalizedData;
  } catch (error) {
    console.error('프로필 조회 실패:', error.response?.data || error.message);
    throw (error.response?.data ?? error);
  }
};

// ============ 비밀번호 변경 ============
export const changePassword = async (currentPassword, newPassword, confirmNewPassword) => {
  if (USE_MOCK) {
    await sleep(200);
    return { ok: true };
  }
  
  try {
    const { data } = await axiosInstance.put('/mypage/password', {
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword
    });
    
    console.log('비밀번호 변경 성공');
    return data;
  } catch (error) {
    console.error('비밀번호 변경 실패:', error.response?.data || error.message);
    throw (error.response?.data ?? error);
  }
};

// ============ 프로필 이미지 관리 ============
// 프로필 이미지 업로드
export const uploadProfileImage = async (fileOrFormData) => {
  if (USE_MOCK) {
    await sleep(300);

    let file = fileOrFormData;
    if (fileOrFormData instanceof FormData) {
      file =
        fileOrFormData.get('profileImage');
    }
    if (!(file instanceof File)) throw new Error('MOCK: 파일이 필요합니다.');

    const toDataURL = (f) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(f);
      });

    const dataUrl = await toDataURL(file);
    const me = readMock();
    me.profileImageUrl = dataUrl;
    me.isDefaultImage = false;
    writeMock(me);
    return { url: dataUrl, isDefaultImage: false };
  }

  try {
    const form = new FormData();
    if (fileOrFormData instanceof FormData) {
      const f =
        fileOrFormData.get('profileImage');
      form.append('profileImage', f);
    } else {
      form.append('profileImage', fileOrFormData);
    }

    const { data } = await axiosInstance.put('/mypage/profile-image', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const currentUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const updatedUser = {
      ...currentUser,
      profileImageUrl: data.profileImageUrl || data.url,
      isDefaultImage: false
    };
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    
    console.log('프로필 이미지 업로드 성공');
    return data;
  } catch (error) {
    console.error('프로필 이미지 업로드 실패:', error.response?.data || error.message);
    throw (error.response?.data ?? error);
  }
};

// 프로필 이미지 삭제 (기본 이미지로 되돌림)
export const deleteProfileImage = async () => {
  if (USE_MOCK) {
    await sleep(150);
    const me = readMock();
    me.profileImageUrl = '';
    me.isDefaultImage = true;
    writeMock(me);
    return { ok: true, isDefaultImage: true };
  }

  try {
    const { data } = await axiosInstance.delete('/mypage/delete-profile-image');

    const currentUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const updatedUser = {
      ...currentUser,
      profileImageUrl: '',
      isDefaultImage: true
    };
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    
    console.log('프로필 이미지 삭제 성공 - 기본 이미지로 변경');
    return data;
  } catch (error) {
    console.error('프로필 이미지 삭제 실패:', error.response?.data || error.message);
    throw (error.response?.data ?? error);
  }
};

// 캐시된 프로필 정보 새로고침
export const refreshProfile = async () => {
  try {
    const profileData = await getMyProfile();
    return profileData;
  } catch (error) {
    console.error('프로필 새로고침 실패:', error);
    throw error;
  }
};

// 회원 탈퇴
export const deleteMyAccount = async (password) => {
  try {
    const { data } = await axiosInstance.delete('/mypage/delete-account', {
      data: { password: password }
    });
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userInfo');
    
    return data;
  } catch (error) {
    throw (error.response?.data ?? error);
  }
};

// ============ 나의 활동 조회 (💡💡💡 제가 빠뜨렸던 바로 그 함수예요!) ============
export const getMyActivity = async (activityType) => {
  // 백엔드 MyPageController의 엔드포인트에 맞춰서, '댓글 단 글'의 경우 주소를 'commented-posts'로 변경해요.
  const endpoint = activityType === 'comments' ? 'commented-posts' : activityType;

  if (USE_MOCK) {
    await sleep(300);
    const mockData = {
      posts: [
        { postId: 101, title: '내가 쓴 첫 번째 글 (테스트)', nickname: '홍길동', createdAt: '2025-08-21' },
        { postId: 102, title: '내가 쓴 두 번째 글 (테스트)', nickname: '홍길동', createdAt: '2025-08-20' },
      ],
      comments: [ // 'commented-posts'에 대한 목업 데이터
        { postId: 201, title: '내가 댓글 단 글 (테스트)', nickname: '춘향이', createdAt: '2025-08-19' },
      ],
      scraps: [
        { postId: 301, title: '내가 스크랩한 글 (테스트)', nickname: '이몽룡', createdAt: '2025-08-18' },
      ],
    };
    // activityType에 맞는 목업 데이터를 반환하도록 수정
    return { content: mockData[activityType] || [] };
  }

  try {
    // 실제 서버에 나의 활동 내역을 요청해요.
    const { data } = await axiosInstance.get(`/mypage/${endpoint}`);
    return data;
  } catch (error) {
    console.error(`${activityType} 목록 조회 실패:`, error.response?.data || error.message);
    throw (error.response?.data ?? error);
  }
};