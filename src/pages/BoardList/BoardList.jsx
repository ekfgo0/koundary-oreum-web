// src/pages/BoardList/BoardList.jsx
import React, { useEffect, useState } from 'react';
import Header from '../../components/profile/Header';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'; // ✅ useNavigate 추가
import { getBoardList } from '../../api/board';

const CATEGORY_MAP = {
  free:   { label: '자유 게시판', backendKey: 'FREE' },
  info:   { label: '정보게시판',   backendKey: 'INFO' },
  market: { label: '중고거래',     backendKey: 'MARKET' },
  meetup: { label: '모임 게시판',  backendKey: 'MEETUP' },
  country:{ label: '소속 국가',    backendKey: 'COUNTRY' },
  school: { label: '소속 학교',    backendKey: 'SCHOOL' },
};

export default function BoardList() {
  const { category: slug } = useParams();
  const meta = CATEGORY_MAP[slug] ?? CATEGORY_MAP.free;

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const size = 12;

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const navigate = useNavigate(); // ✅ 추가

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsFetching(true);
        const data = await getBoardList({ category: meta.backendKey, page, size });

        const items = data?.items ?? data?.content ?? data?.list ?? [];
        const totalCount = data?.total ?? data?.totalElements ?? data?.count ?? items.length;

        if (mounted) {
          setRows(items);
          setTotal(totalCount);
        }
      } catch (e) {
        console.error('board list error:', e);
        if (mounted) {
          setRows([]);
          setTotal(0);
        }
      } finally {
        mounted && setIsFetching(false);
      }
    })();
    return () => { mounted = false; };
  }, [meta.backendKey, page]);

  const totalPages = Math.max(1, Math.ceil(total / size));

  const goPage = (next) => {
    const sp = new URLSearchParams(searchParams);
    sp.set('page', String(next));
    setSearchParams(sp);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title="" />

      <div className="max-w-[1024px] mx-auto px-4 py-8">
        {/* 제목 + 글 작성 버튼 + 로딩 표시 */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">{meta.label}</h1>

          <div className="flex items-center gap-3">
            {/* 🔄 로딩 스피너 */}
            {isFetching && (
              <div className="flex items-center gap-2 bg-white/80 border rounded px-3 py-1 text-sm">
                <svg
                  className="animate-spin h-4 w-4 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                로딩 중…
              </div>
            )}

            {/* ✏️ 글 작성 버튼 */}
           <button
              onClick={() => navigate('/posts')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition outline-none focus:outline-none"
            >
              글 작성
            </button>

          </div>
        </div>

        {/* 테이블 */}
        <table className="w-full text-sm border-t transition-opacity">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-3">제목</th>
              <th className="py-3 w-32">작성자</th>
              <th className="py-3 w-36">작성일</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(item => (
              <tr key={item.id} className="border-t hover:bg-gray-50 cursor-pointer">
                <td className="py-3 pr-4">{item.title}</td>
                <td className="py-3">{item.author}</td>
                <td className="py-3">{item.createdAt}</td>
              </tr>
            ))}

            {!isFetching && rows.length === 0 && (
              <tr><td className="py-12 text-center text-gray-400" colSpan={3}>게시글이 없습니다</td></tr>
            )}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div className="flex justify-center gap-2 mt-6">
          <button
            className="px-3 py-1 border rounded disabled:opacity-40"
            onClick={() => goPage(Math.max(1, page - 1))}
            disabled={page <= 1 || isFetching}
          >
            이전
          </button>

          <span className="px-2 py-1">{page} / {totalPages}</span>

          <button
            className="px-3 py-1 border rounded disabled:opacity-40"
            onClick={() => goPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages || isFetching}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
