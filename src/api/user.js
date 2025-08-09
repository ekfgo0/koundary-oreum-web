// src/api/user.js
import axios from './axiosInstance';

// 내 프로필 가져오기
export const getMyProfile = async () => {
  const { data } = await axios.get('/users/me'); // 엔드포인트는 백엔드 스펙에 맞춰 조정
  return data;
};

// 비밀번호 변경
export const changeMyPassword = async ({ current, next }) => {
  return axios.patch('/users/me/password', { current, next });
};

// 프로필 이미지 업로드
export const uploadMyAvatar = async (file) => {
  const form = new FormData();
  form.append('file', file); // 필드명(file)이 다르면 백엔드에 맞춰 변경
  return axios.post('/users/me/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// 프로필 이미지 삭제
export const deleteMyAvatar = () => axios.delete('/users/me/avatar');

// 회원 탈퇴
export const deleteMyAccount = () => axios.delete('/users/me');
