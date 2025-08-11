// src/api/board.js
import axiosInstance from './axiosInstance';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const wait = (ms) => new Promise(r => setTimeout(r, ms));

export const getBoardList = async ({ category, page = 1, size = 20 }) => {
  if (USE_MOCK) {
    // 🔹 목업: 화면 확인용 더미 데이터
    await wait(300);
    const total = 83;
    const start = (page - 1) * size;
    const items = Array.from({ length: size }).map((_, i) => ({
      id: start + i + 1,
      title: `[${category}] 더미 글 제목 ${start + i + 1}`,
      author: '홍길동',
      createdAt: '2025.07.01',
    }));
    return { items, total, page, size };
  }

  // 🔹 실서버
  const { data } = await axiosInstance.get('/boards', {
    params: { category, page, size },
  });
  return data;
};
