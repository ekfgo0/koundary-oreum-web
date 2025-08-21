// src/api/resetPassword.js
import axiosInstance from './axiosInstance';

const USE_MOCK =
  String(import.meta.env?.VITE_USE_MOCK ?? 'true').trim().toLowerCase() === 'true';

/* ------- MOCK 영역 ------- */
// 아이디 찾기에서 쓰던 동일한 테스트 계정 재사용 가정
const mockUsers = {
  'hong@yonsei.ac.kr': { loginId: 'hong123', password: 'oldpass1!' },
  'lee@sogang.ac.kr': { loginId: 'sg_lee',   password: 'oldpass2!' },
  'kim@ewha.ac.kr':   { loginId: 'ewha_kim', password: 'oldpass3!' },
};
const mockCodes = new Map(); // email -> code
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export async function sendPwCode(email) {
  if (USE_MOCK) {
    await sleep(500);
    if (!mockUsers[email]) {
      const err = new Error('등록되지 않은 이메일이에요.');
      err.status = 404;
      throw err;
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    mockCodes.set(email, code);
    console.log(`[MOCK] 비밀번호 재설정 코드 for ${email}: ${code}`);
    return { ok: true };
  }
  const { data } = await axiosInstance.post('/auth/reset-password/send-email', { email });
  return data; // { ok:true }
}

export async function verifyPwCode(email, code) {
  if (USE_MOCK) {
    await sleep(500);
    const saved = mockCodes.get(email);
    if (!saved || saved !== code) {
      const err = new Error('인증코드가 올바르지 않아요.');
      err.status = 400;
      throw err;
    }
    return { ok: true };
  }
  const { data } = await axiosInstance.post('/auth/reset-password/verify', { email, code });
  return data; // { ok:true }
}

export async function resetPassword(email, newPassword) {
  if (USE_MOCK) {
    await sleep(500);
    if (!mockUsers[email]) {
      const err = new Error('등록된 사용자를 찾을 수 없어요.');
      err.status = 404;
      throw err;
    }
    mockUsers[email].password = newPassword;
    // 한 번 사용한 코드 제거(보안)
    mockCodes.delete(email);
    return { ok: true };
  }
  const { data } = await axiosInstance.post('/auth/reset-password/reset', {
    email, newPassword,
  });
  return data; // { ok:true }
}
