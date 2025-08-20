import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import CategoryNavigation from '../../components/common/CategoryNavigation';
import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { getBoardList } from '../../api/board';

const CATEGORY_MAP = {
  'NATIONALITY':{ label: '소속 국가',     backendKey: 'NATIONALITY' },
  'UNIVERSITY': { label: '소속 학교',     backendKey: 'UNIVERSITY' },
  'FREE':   { label: '자유 게시판',  backendKey: 'FREE' },
  'INFORMATION':   { label: '정보 게시판',    backendKey: 'INFORMATION' },
  'TRADE': { label: '중고거래 게시판',      backendKey: 'TRADE' },
  'MEETING': { label: '모임 게시판',   backendKey: 'MEETING' },
};

export default function BoardList() {
  const { category: slug } = useParams();
  const meta = CATEGORY_MAP[slug];

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const size = 12;

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const sp = new URLSearchParams(searchParams);
    if ((sp.get('page') || '1') !== '1') {
      sp.set('page', '1');
      setSearchParams(sp, { replace: true });
    }
  }, [slug, setSearchParams]);

  // 목록 불러오기
  useEffect(() => {
    if (!meta) return;

    let mounted = true;
    (async () => {
      try {
        setIsFetching(true);
        const data = await getBoardList({ category: meta.backendKey, page: page, size });

        const items = data?.content ?? [];
        const totalCount = data?.totalElements ?? items.length;

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
        if (mounted) {
          setIsFetching(false);
        }
      }
    })();

    return () => { mounted = false; };
  }, [meta, page, size, location.state?.refresh]);

  if (!meta) {
    return (
      <div className="min-h-screen bg-white">
        <Header title="" />
        <div className="max-w-[1024px] mx-auto px-4 py-8">
          <p>잘못된 카테고리입니다.</p>
        </div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / size));

  const goPage = (next) => {
    navigate(`${location.pathname}?page=${next}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title="" />
      <CategoryNavigation currentCategory={slug} />
      <div className="max-w-[1024px] mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">{meta.label}</h1>
          <div className="flex items-center gap-3">
            {isFetching && (
              <div className="flex items-center gap-2 bg-white/80 border rounded px-3 py-1 text-sm">
                <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                로딩 중…
              </div>
            )}
            <button
              onClick={() => navigate(`/boards/${slug}/posts`)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition outline-none focus:outline-none"
            >
              글 작성
            </button>
          </div>
        </div>
        <table className="w-full text-sm border-t transition-opacity">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-3">제목</th>
              <th className="py-3 w-32">작성자</th>
              <th className="py-3 w-36">작성일</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item, index) => (
              <tr
                key={item.postId || `post-${index}`}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/mypost/${item.postId}`)}
              >
                <td className="py-3 pr-4">{item.title}</td>
                <td className="py-3">{item.nickname}</td>
                <td className="py-3">{item.createdAt}</td>
              </tr>
            ))}
            {!isFetching && rows.length === 0 && (
              <tr>
                <td className="py-12 text-center text-gray-400" colSpan={3}>
                  게시글이 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
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