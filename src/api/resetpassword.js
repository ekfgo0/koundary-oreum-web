// src/api/resetpassword.js
import axiosInstance from './axiosInstance';

const USE_MOCK =
  String(import.meta.env?.VITE_USE_MOCK ?? 'true').trim().toLowerCase() === 'true';

/* ---------------- MOCK ---------------- */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 샘플 mock DB: loginId ↔ universityEmail 매칭
const mockUsers = {
  hong123:   { universityEmail: 'hong@yonsei.ac.kr' },
  sg_lee:    { universityEmail: 'lee@sogang.ac.kr' },
  ewha_kim:  { universityEmail: 'kim@ewha.ac.kr' },
};

function ensureMatch(loginId, universityEmail) {
  const user = mockUsers[loginId];
  if (!user || user.universityEmail !== universityEmail) {
    const err = new Error('아이디와 이메일이 일치하지 않아요.');
    err.status = 404;
    throw err;
  }
}

/* ------------- 실제 함수 ------------- */
/**
 * 비밀번호 찾기 요청(아이디-이메일 매칭 검증)
 * @param {{loginId: string, email: string}} param0
 * @returns {Promise<string>} 서버 message 문자열
 */
export async function sendPwCode({ loginId, email }) {
  const payload = { loginId: String(loginId || '').trim(), universityEmail: String(email || '').trim() };
  if (!payload.loginId) throw new Error('아이디를 입력해 주세요.');
  if (!payload.universityEmail) throw new Error('이메일을 입력해 주세요.');

  if (USE_MOCK) {
    await sleep(500);
    ensureMatch(payload.loginId, payload.universityEmail);
    return '아이디와 이메일이 확인되었어요.'; // 서버의 message 역할
  }

  const { data } = await axiosInstance.post('/auth/reset-password/request', payload);
  // 서버가 { message } 형태로 응답한다고 가정
  return data?.message ?? '요청이 처리되었습니다.';
}