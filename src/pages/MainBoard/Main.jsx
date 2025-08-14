// src/pages/MainBoard/Main.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import { mockBoards } from '../../api/mockup';   // 목업
import { getBoardList } from '../../api/board';  // 실제 API

const BRAND = '#2e8ada';
const MAX_WIDTH = 960;
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// 프론트 라우트 id ↔ 백엔드 카테고리 매핑
const CATEGORY_MAP = {
  country: { name: '소속 국가', backendKey: 'COUNTRY' },
  school:  { name: '소속 학교', backendKey: 'SCHOOL' },
  free:    { name: '자유 게시판', backendKey: 'FREE' },
  info:    { name: '정보 게시판', backendKey: 'INFO' },
  market:  { name: '중고거래/나눔 게시판', backendKey: 'MARKET' },
  meetup:  { name: '모임 게시판', backendKey: 'MEETUP' },
};
const IDS = Object.keys(CATEGORY_MAP);

// 게시판 카드
const BoardCard = ({ id, title, posts, onMore }) => (
  <div className="rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(0,0,0,0.08)] overflow-hidden">
    <div className="h-12 px-5 flex items-center" style={{ backgroundColor: BRAND }}>
      <h3 className="text-white md:text-large font-semibold leading-none">{title}</h3>
    </div>

    <div className="p-4 md:p-5">
      <ul className="divide-y divide-gray-100 mb-4">
        {posts.slice(0, 5).map((p, i) => {
          // 문자열/객체 둘 다 안전하게 제목 뽑기
          const text =
            typeof p === 'string'
              ? p
              : p?.title ?? p?.name ?? p?.subject ?? p?.content ?? JSON.stringify(p);
          const key = (typeof p === 'object' && p?.id) ? p.id : i;

          return (
            <li key={key} className="py-2">
              <a
                href="#"
                className="block truncate text-[15px] text-gray-700 hover:text-gray-900"
                title={text}
              >
                {text}
              </a>
            </li>
          );
        })}
      </ul>

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
            // ⚠️ getBoardList 시그니처/응답 구조는 백엔드에 맞게 조정 필요
            const res = await getBoardList({ category: backendKey, page: 0, size: 5 });

            // 대표적인 응답 케이스를 폭넓게 커버
            const list = Array.isArray(res?.content) ? res.content
              : Array.isArray(res?.data?.content) ? res.data.content
              : Array.isArray(res?.data) ? res.data
              : Array.isArray(res) ? res
              : [];

            const titles = list.map((post) =>
              post?.title ?? post?.name ?? post?.subject ?? post?.content ?? String(post)
            );

            return { id, name, posts: titles };
          })
        );
        setBoards(results);
      } catch (e) {
        console.error('메인 보드 불러오기 실패:', e);
        // 실패 시 목업으로 폴백하려면 아래 주석 해제
        // setBoards(mockBoards);
      }
    })();
  }, []);

  const goMore = (key) => navigate(`/board/${key}`);

  return (
    <div className="min-h-screen bg-[#f5f9fc]">
      <Header title="" />
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
