import axios from './axiosInstance';

// .env에서 VITE_USE_MOCK=true면 mock 사용
const USE_MOCK = (import.meta.env?.VITE_USE_MOCK ?? 'true').toString() === 'true';

// Mock 데이터
const mockProfile = {
  nickname: '홍길동',
  country: 'Korea',
  school: '홍익대학교',
  profileImage:
    'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=256&h=256&fit=crop',
  activity: {
    posts: 12,
    comments: 47,
    lastLogin: '2025-08-10T12:34:00+09:00',
  },
  account: { userId: 'abcd123' },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
    await sleep(300);
    return mockProfile;
  }
  try {
    const { data } = await axios.get('/users/me');
    return normalize(data);
  } catch {
    await sleep(200);
    return mockProfile;
  }
};

// 비밀번호 변경
export const changeMyPassword = async ({ current, next }) => {
  if (USE_MOCK) {
    await sleep(200);
    return { ok: true };
  }
  return axios.patch('/users/me/password', { current, next });
};

// 프로필 이미지 업로드
export const uploadMyAvatar = async (file) => {
  if (USE_MOCK) {
    await sleep(200);
    return { url: mockProfile.profileImage };
  }
  const form = new FormData();
  form.append('file', file);
  return axios.post('/users/me/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// 프로필 이미지 삭제
export const deleteMyAvatar = async () => {
  if (USE_MOCK) {
    await sleep(150);
    return { ok: true };
  }
  return axios.delete('/users/me/avatar');
};

// 회원 탈퇴
export const deleteMyAccount = async () => {
  if (USE_MOCK) {
    await sleep(150);
    return { ok: true };
  }
  return axios.delete('/users/me');
};
