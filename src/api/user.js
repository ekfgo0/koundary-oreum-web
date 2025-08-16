import axios from './axiosInstance';

const USE_MOCK = (import.meta.env?.VITE_USE_MOCK ?? 'true').toString() === 'true';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- 로컬스토리지에 mock 상태를 저장(새로고침해도 유지) ---
const LS_KEY = 'mock_me_v1';

const defaultMock = {
  nickname: '홍길동',
  country: 'Korea',
  school: '홍익대학교',
  profileImage: '', // 시작은 빈 값
  activity: { posts: 12, comments: 47, lastLogin: '2025-08-10T12:34:00+09:00' },
  account: { userId: 'abcd123' },
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
  nickname: data.nickname ?? '',
  country: data.country ?? '',
  school: data.school ?? '',
  profileImage: data.profileImageUrl ?? data.profileImage ?? '',
  activity: {
    posts: data.postCount ?? data.posts ?? 0,
    comments: data.commentCount ?? data.comments ?? 0,
    lastLogin: data.lastLoginAt ?? data.lastLogin ?? '',
  },
  account: { userId: data.loginId ?? data.userId ?? '' },
});

// 내 프로필
export const getMyProfile = async () => {
  if (USE_MOCK) {
    await sleep(250);
    return readMock(); // 캐시 무력화는 페이지에서 처리
  }
  const { data } = await axios.get('/users/me');
  return normalize(data);
};

// 비밀번호 변경
export const changeMyPassword = async ({ current, next }) => {
  if (USE_MOCK) {
    await sleep(200);
    return { ok: true };
  }
  return axios.patch('/users/me/password', { current, next });
};

// 프로필 이미지 업로드 (mock은 data URL로 저장)
export const uploadMyAvatar = async (fileOrFormData) => {
  if (USE_MOCK) {
    await sleep(300);

    let file = fileOrFormData;
    if (fileOrFormData instanceof FormData) {
      file =
        fileOrFormData.get('file') ||
        fileOrFormData.get('avatar') ||
        fileOrFormData.get('image');
    }
    if (!(file instanceof File)) throw new Error('MOCK: 파일이 필요합니다.');

    // File → data URL(base64)로 변환 (새로고침해도 유지, blob 문제 없음)
    const toDataURL = (f) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result); // "data:image/png;base64,...."
        reader.onerror = reject;
        reader.readAsDataURL(f);
      });

    const dataUrl = await toDataURL(file);
    const me = readMock();
    me.profileImage = dataUrl;
    writeMock(me);
    return { url: dataUrl };
  }

  const form = new FormData();
  if (fileOrFormData instanceof FormData) {
    const f =
      fileOrFormData.get('file') ||
      fileOrFormData.get('avatar') ||
      fileOrFormData.get('image');
    form.append('file', f);
  } else {
    form.append('file', fileOrFormData);
  }

  return axios.post('/users/me/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// 프로필 이미지 삭제
export const deleteMyAvatar = async () => {
  if (USE_MOCK) {
    await sleep(150);
    const me = readMock();
    me.profileImage = '';
    writeMock(me);
    return { ok: true };
  }
  return axios.delete('/users/me/avatar');
};

// 회원 탈퇴
export const deleteMyAccount = async () => {
  if (USE_MOCK) {
    await sleep(150);
    localStorage.removeItem(LS_KEY);
    return { ok: true };
  }
  return axios.delete('/users/me');
};

export const logout = async () => {
  try {
    // 서버에 전달할 게 없으면 생략 가능
    // await axios.post('/auth/logout'); // (선택) 서버에 로그아웃 알림
  } catch (e) {
    // 로그아웃 API가 없어도 무시 가능
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // 혹시 기본값 박아둔 적 있으면 제거
    delete axios.defaults.headers.common.Authorization;
  }
};
