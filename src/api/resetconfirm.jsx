// src/api/resetPasswordConfirm.js
import axiosInstance from './axiosInstance';

const USE_MOCK =
  String(import.meta.env?.VITE_USE_MOCK ?? 'true').trim().toLowerCase() === 'true';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export async function confirmResetPassword({ token, newPassword }) {
  const t = String(token || '').trim();
  const pw = String(newPassword || '').trim();
  if (!t) throw new Error('유효하지 않은 토큰입니다.');
  if (!pw) throw new Error('새 비밀번호를 입력해 주세요.');

  if (USE_MOCK) {
    await sleep(500);
    if (t.length < 10) throw new Error('토큰이 유효하지 않아요.');
    return '비밀번호가 변경되었습니다.';
  }

  const { data } = await axiosInstance.post('/auth/reset-password/confirm', {
    token: t,
    newPassword: pw,
  });
  return data?.message ?? '비밀번호가 변경되었습니다.';
}
