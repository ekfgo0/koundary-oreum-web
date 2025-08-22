// src/api/findId.js
import axiosInstance from './axiosInstance';

const USE_MOCK =
  String(import.meta.env?.VITE_USE_MOCK ?? 'true').trim().toLowerCase() === 'true';

/** ---------- MOCK ---------- */
const mockUsers = {
  'hong@yonsei.ac.kr': { loginId: 'hong123' },
  'lee@sogang.ac.kr':  { loginId: 'sg_lee' },
  'kim@ewha.ac.kr':    { loginId: 'ewha_kim' },
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 아이디 찾기: 입력한 학교 이메일로 아이디를 발송 */
export const requestFindIdEmail = async (email) => {
  if (USE_MOCK) {
    await sleep(600);
    if (!mockUsers[email]) {
      const err = new Error('등록되지 않은 이메일이에요.');
      err.status = 404;
      throw err;
    }
    // 실제로 메일을 보내지는 않지만, 보냈다고 가정
    console.log(`[MOCK] ${email}로 아이디(${mockUsers[email].loginId})를 발송했습니다.`);
    return { message: '입력하신 이메일로 아이디를 전송했어요.' };
  }

  // ✅ 실제 API: 단일 엔드포인트만 사용
  const { data } = await axiosInstance.post(
    '/auth/find-loginId',                 // 백엔드 명세 경로
    { universityEmail: email }            // ⚠️ 키 이름 정확히 맞추기
  );
  return data; // { message: '...'} 형태 가정
};
