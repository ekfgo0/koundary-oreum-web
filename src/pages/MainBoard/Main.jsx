import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import { mockBoards } from '../../api/mockup';
import { getBoardList } from '../../api/board';

const BRAND = '#2e8ada';
const MAX_WIDTH = 960;
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const CATEGORY_MAP = {
  NATIONALITY: { name: '소속 국가', backendKey: 'NATIONALITY' },
  UNIVERSITY:  { name: '소속 학교', backendKey: 'UNIVERSITY' },
  FREE:        { name: '자유 게시판', backendKey: 'FREE' },
  INFORMATION: { name: '정보 게시판', backendKey: 'INFORMATION' },
  TRADE:       { name: '중고거래/나눔 게시판', backendKey: 'TRADE' },
  MEETING:     { name: '모임 게시판', backendKey: 'MEETING' },
};
const IDS = Object.keys(CATEGORY_MAP);

const BoardCard = ({ id, title, posts, onMore }) => (
  <div className="rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(0,0,0,0.08)] overflow-hidden">
    <div className="h-12 px-5 flex items-center" style={{ backgroundColor: BRAND }}>
      <h3 className="text-white md:text-large font-semibold leading-none">{title}</h3>
    </div>
    <div className="p-4 md:p-5">
      {posts.length === 0 ? (
        <div className="py-8 text-center text-gray-500 text-sm">
          아직 작성된 글이 없습니다.
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 mb-4">
          {posts.slice(0, 5).map((postTitle, i) => (
            <li key={i} className="py-2">
              <a href="#" className="block truncate text-[15px] text-gray-700 hover:text-gray-900" title={postTitle}>
                {postTitle}
              </a>
            </li>
          ))}
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
  const [boards, setBoards] = useState(
    USE_MOCK
      ? mockBoards
      : IDS.map((id) => ({ id, name: CATEGORY_MAP[id].name, posts: [] }))
  );

  useEffect(() => {
    if (USE_MOCK) return;

    (async () => {
      try {
        const results = await Promise.all(
          IDS.map(async (id) => {
            const { backendKey, name } = CATEGORY_MAP[id];
            const res = await getBoardList({ category: backendKey, page: 1, size: 5 });
            const list = Array.isArray(res?.content) ? res.content : [];
            const titles = list.map((post) => post?.title).filter(Boolean);
            return { id, name, posts: titles };
          })
        );
        setBoards(results);
      } catch (e) {
        console.error('메인 보드 불러오기 실패:', e);
      }
    })();
  }, []);

  const goMore = (key) => navigate(`/boards/${key}/posts`);

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