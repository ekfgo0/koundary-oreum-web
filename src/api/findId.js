// src/api/findId.js
import axiosInstance from './axiosInstance';

const USE_MOCK =
  String(import.meta.env?.VITE_USE_MOCK ?? 'true').trim().toLowerCase() === 'true';

/** ---------- 모의 데이터/로직 ---------- */
const mockUsers = {
  'hong@yonsei.ac.kr': { loginId: 'hong123' },
  'lee@sogang.ac.kr': { loginId: 'sg_lee' },
  'kim@ewha.ac.kr': { loginId: 'ewha_kim' },
};
const mockCodes = new Map(); // email -> code

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 인증코드 발송 */
export const sendFindIdCode = async (email) => {
  if (USE_MOCK) {
    await sleep(600);
    // 등록된 메일만 성공 처리(실제 서비스와 유사)
    if (!mockUsers[email]) {
      const err = new Error('등록되지 않은 이메일이에요.');
      err.status = 404;
      throw err;
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    mockCodes.set(email, code);
    // 콘솔로 코드 노출(테스트 편의)
    console.log(`[MOCK] 아이디 찾기 코드 for ${email}: ${code}`);
    return { ok: true };
  }

  // ▶ 실제 API 연결부(엔드포인트는 백엔드에 맞춰 수정)
  const { data } = await axiosInstance.post('/auth/find-id/send-email', { email });
  return data; // { ok: true } 형태 가정
};

/** 인증코드 검증 + 아이디 조회 */
export const verifyFindIdCode = async (email, code) => {
  if (USE_MOCK) {
    await sleep(600);
    const saved = mockCodes.get(email);
    if (!saved || saved !== code) {
      const err = new Error('인증코드가 올바르지 않아요.');
      err.status = 400;
      throw err;
    }
    const user = mockUsers[email];
    if (!user) {
      const err = new Error('등록된 사용자를 찾을 수 없어요.');
      err.status = 404;
      throw err;
    }
    return { loginId: user.loginId };
  }

  // ▶ 실제 API 연결부(엔드포인트는 백엔드에 맞춰 수정)
  const { data } = await axiosInstance.post('/auth/find-id/verify', { email, code });
  // data 예시: { loginId: 'hong123' }
  return data;
};
