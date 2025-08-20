import axiosInstance from './axiosInstance';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const wait = (ms) => new Promise(r => setTimeout(r, ms));

export const getBoardList = async ({ category, page = 1, size = 20 }) => {
  if (USE_MOCK) {
    // --- 목업 데이터 ---
    await wait(300); // 로딩감 주기
    const total = 83;
    const start = (page - 1) * size;

    const items = Array.from({ length: size }).map((_, i) => {
      const n = start + i + 1;
      return {
        id: n,
        title: `[${category}] 더미 글 제목 ${n}`,
        author: n % 3 === 0 ? '이혁' : '홍길동',
        createdAt: '2025.07.01',
      };
    });

    return { items, total, page, size };
  }

  // --- 실서버 호출 ---
  const { data } = await axiosInstance.get(`/boards/${category}/posts`, {
    params: { page: page - 1, size },
  });
  return data;
};