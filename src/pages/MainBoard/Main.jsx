// src/pages/MainBoard/Main.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/common/Header';
import { mockBoards } from '../../api/mockup';
import { getBoardList } from '../../api/board';

const BRAND = '#2e8ada';
const MAX_WIDTH = 960;
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// 프론트 라우트 id
const CATEGORY_MAP = {
  NATIONALITY: { name: '소속 국가', backendKey: 'NATIONALITY' },
  UNIVERSITY:  { name: '소속 학교', backendKey: 'UNIVERSITY' },
  FREE:    { name: '자유 게시판', backendKey: 'FREE' },
  INFORMATION:    { name: '정보 게시판', backendKey: 'INFORMATION' },
  TRADE:  { name: '중고거래 게시판', backendKey: 'TRADE' },
  MEETING:  { name: '모임 게시판', backendKey: 'MEETING' },
};
const IDS = Object.keys(CATEGORY_MAP);

// 게시판 카드
const BoardCard = ({ id, title, posts, onMore }) => (
  <div className="rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(0,0,0,0.08)] overflow-hidden">
    <div className="h-12 px-5 flex items-center" style={{ backgroundColor: BRAND }}>
      <h3 className="text-white md:text-large font-semibold leading-none">{title}</h3>
    </div>

    <div className="p-4 md:p-5">
      {/* 빈 posts 배열일 때 메시지 표시 */}
      {posts.length === 0 ? (
        <div className="py-8 text-center text-gray-500 text-sm">
          아직 작성된 글이 없습니다.
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 mb-4">
          {posts.slice(0, 5).map((postTitle, i) => {
            const key = (typeof postTitle === 'object' && postTitle?.id) ? postTitle.id : i;

            return (
              <li key={key} className="py-2">
                <a
                  href="#"
                  className="block truncate text-[15px] text-gray-700 hover:text-gray-900"
                  title={postTitle}
                >
                  {postTitle}
                </a>
              </li>
            );
          })}
        </ul>
      )}

      <button
        onClick={() => onMore(id)}
        className="w-full rounded-xl px-4 py-2 text-sm font-medium border border-gray-200 outline-none hover:border-gray-300 hover:bg-gray-50"
        aria-label={`${title} 더보기`}
      >
        더보기
      </button>
    </div>
  </div>
);

export default function Main() {
  const navigate = useNavigate();
  const location = useLocation();

  // 보드 상태 (목업이면 즉시, 실서버면 빈 리스트로 시작)
  const [boards, setBoards] = useState(
    USE_MOCK
      ? mockBoards
      : IDS.map((id) => ({ id, name: CATEGORY_MAP[id].name, posts: [] }))
  );

  useEffect(() => {
    if (USE_MOCK) return; // 목업 모드면 API 호출 안 함

    (async () => {
      try {
        const results = await Promise.all(
          IDS.map(async (id) => {
            const { backendKey, name } = CATEGORY_MAP[id];
            // 💡[수정 1] page: 1로 변경
            const res = await getBoardList({ category: backendKey, page: 1, size: 5 });

            // 💡[수정 2] res.data.content -> res.content로 올바르게 수정
            const list = Array.isArray(res?.content) ? res.content : [];

            // 유효한 제목이 있는 포스트만 필터링
            const titles = list
              .map((post) => post?.title)
              .filter(title => title && title.trim() !== ''); // 빈 문자열 제거

            return { id, name, posts: titles };
          })
        );
        setBoards(results);
      } catch (e) {
        console.error('메인 보드 불러오기 실패:', e);
      }
    })();
  }, []);

  const goMore = (key) => navigate(`/board/${key}`);

  return (
    <div className="min-h-screen bg-[#f5f9fc]">
      <Header/>
      <main className="mx-auto px-4 md:px-6 py-8 md:py-12" style={{ maxWidth: `${MAX_WIDTH}px` }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {boards.map((b) => (
            <BoardCard key={b.id} id={b.id} title={b.name} posts={b.posts} onMore={goMore} />
          ))}
        </div>
      </main>
    </div>
  );
}