// src/pages/Main/Main.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/profile/Header';

const BRAND = '#2e8ada';
const MAX_WIDTH = 960;

// ✅ 라우트 키와 일치하도록 id 통일: country, school, free, info, market, meetup
const boards = [
  { id: 'country', name: '소속 국가', posts: ['자유에 첫 글…', 'GDG 진행…', '프로젝트 회의…', 'UI 고도화…', '내일 일정…'] },
  { id: 'school',  name: '소속 학교', posts: ['정보 모음…', '도구 추천…', '세팅 가이드…', '강의 링크…', '문서 템플릿…'] },
  { id: 'free',    name: '자유 게시판', posts: ['키보드 팝니다', '모니터 나눔', '의자 판매', '교재 교환', 'SSD 판매'] },
  { id: 'info',    name: '정보 게시판', posts: ['이번 주 모임', '스터디 모집', '점심 번개', '오프라인 회의', '온라인 밋업'] },
  { id: 'market',  name: '중고거래/나눔 게시판', posts: ['axios 질문', '라우터 이슈', '빌드 에러', 'CORS 설정', '성능 튜닝'] },
  { id: 'meetup',  name: '모임 게시판', posts: ['포트폴리오 피드백', '이력서 템플릿', '면접 후기', '코테 팁', '인턴 모집'] },
];

// ====== 카드 컴포넌트 ======
const BoardCard = ({ id, title, posts, onMore }) => (
  <div className="rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(0,0,0,0.08)] overflow-hidden">
    <div className="h-12 px-5 flex items-center" style={{ backgroundColor: BRAND }}>
      <h3 className="text-white md:text-large font-semibold leading-none">{title}</h3>
    </div>

    <div className="p-4 md:p-5">
      <ul className="divide-y divide-gray-100 mb-4">
        {posts.slice(0, 5).map((p, i) => (
          <li key={i} className="py-2">
            <a href="#" className="block truncate text-[15px] text-gray-700 hover:text-gray-900" title={p}>
              {p}
            </a>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onMore(id)}               // ✅ id로 라우팅
        className="w-full rounded-xl px-4 py-2 text-sm font-medium border border-gray-200 outline-none hover:border-gray-300 hover:bg-gray-50"
        aria-label={`${title} 더보기`}
      >
        더보기
      </button>
    </div>
  </div>
);

// ====== 페이지 ======
export default function Main() {
  const navigate = useNavigate();
  const goMore = (key) => navigate(`/board/${key}`); // ✅ SPA 네비게이션

  return (
    <div className="min-h-screen bg-[#f5f9fc]">
      <Header title="" />

      <main
        className="mx-auto px-4 md:px-6 py-8 md:py-12"
        style={{ maxWidth: `${MAX_WIDTH}px` }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {boards.map((b) => (
            <BoardCard key={b.id} id={b.id} title={b.name} posts={b.posts} onMore={goMore} />
          ))}
        </div>
      </main>
    </div>
  );
}
