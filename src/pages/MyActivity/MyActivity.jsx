import React, { useEffect, useMemo, useState } from 'react';
import Header from '../../components/common/Header';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getMyActivity } from '../../api/user';

const TAB_META = {
  posts:    { label: '내가 쓴 글' },
  comments: { label: '댓글 단 글' },
  scraps:   { label: '스크랩한 글' },
};

const PAGE_SIZE = 12;

export default function MyActivity() {
  const { activityType } = useParams(); // posts | comments | scraps
  const navigate = useNavigate();
  const location = useLocation();

  const meta = TAB_META[activityType];
  const title = useMemo(() => meta?.label ?? '나의 활동', [meta]);

  // --- URL ?page= 파싱 & 안전화
  const sp = new URLSearchParams(location.search);
  const rawPage = Number(sp.get('page'));
  const initialPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const [page, setPage] = useState(initialPage);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  // 잘못된 탭이면 기본(내가 쓴 글)로 보정
  useEffect(() => {
    if (!meta) {
      navigate('/myactivity/posts?page=1', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityType]);

  // URL 쿼리 -> 내부 state 동기화
  useEffect(() => {
    setPage(initialPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // 데이터 로딩
  useEffect(() => {
    if (!meta) return;
    let mounted = true;
    (async () => {
      try {
        setIsFetching(true);
        const { content, totalElements } = await getMyActivity(activityType, { page, size: PAGE_SIZE });
        if (!mounted) return;
        setRows(content ?? []);
        setTotal(totalElements ?? 0);
      } catch (e) {
        console.error('my-activity error:', e);
        if (mounted) { setRows([]); setTotal(0); }
      } finally {
        if (mounted) setIsFetching(false);
      }
    })();
    return () => { mounted = false; };
  }, [activityType, page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // URL 보정기(잘못된 page를 들고 들어온 경우)
  useEffect(() => {
    if (!meta) return;
    const fixed = Math.min(Math.max(1, page), totalPages);
    if (fixed !== page) {
      navigate(`/myactivity/${activityType}?page=${fixed}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages, meta, activityType, page]);

  const goTab = (key) => navigate(`/myactivity/${key}?page=1`);
  const goPage = (next) => navigate(`/myactivity/${activityType}?page=${next}`);

  const handleRowClick = (item) => {
    if (item.postId && item.boardCode) {
      navigate(`/boards/${item.boardCode}/posts/${item.postId}`);
    } else if (item.postId) {
      navigate(`/posts/${item.postId}`);
    }
  };

  if (!meta) return null;

  return (
    <div className="min-h-screen bg-white">
      <Header title="" />
      <div className="max-w-[1024px] mx-auto px-4 py-8">

        {/* 상단 탭 */}
        <div className="flex items-center mb-4">
          <div className="flex gap-2">
            {Object.entries(TAB_META).map(([key, v]) => {
              const active = key === activityType;
              return (
                <button
                  key={key}
                  onClick={() => goTab(key)}
                  className={
                    'px-4 py-2 rounded-full border text-sm ' +
                    (active
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50')
                  }
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 테이블 */}
        <table className="w-full text-sm border-t">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-3">제목</th>
              <th className="py-3 w-32">작성자</th>
              <th className="py-3 w-36">작성일</th>
            </tr>
          </thead>
          <tbody>
            {/* 로딩 스켈레톤 */}
            {isFetching && rows.length === 0 && (
              <>
                <tr className="border-t animate-pulse">
                  <td className="py-3 pr-4"><div className="h-4 bg-gray-200 rounded w-3/4" /></td>
                  <td className="py-3"><div className="h-4 bg-gray-200 rounded w-2/3" /></td>
                  <td className="py-3"><div className="h-4 bg-gray-200 rounded w-1/2" /></td>
                </tr>
                <tr className="border-t animate-pulse">
                  <td className="py-3 pr-4"><div className="h-4 bg-gray-200 rounded w-1/2" /></td>
                  <td className="py-3"><div className="h-4 bg-gray-200 rounded w-1/3" /></td>
                  <td className="py-3"><div className="h-4 bg-gray-200 rounded w-1/2" /></td>
                </tr>
              </>
            )}

            {/* 데이터 */}
            {rows.map((item) => (
              <tr
                key={item.postId}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(item)}
              >
                <td className="py-3 pr-4">{item.title}</td>
                <td className="py-3">{item.nickname}</td>
                <td className="py-3">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                </td>
              </tr>
            ))}

            {/* 빈 상태 */}
            {!isFetching && rows.length === 0 && (
              <tr>
                <td className="py-12 text-center text-gray-400" colSpan={3}>
                  게시글이 없습니다
                </td>
              </tr>
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
