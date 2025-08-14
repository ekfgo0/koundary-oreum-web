import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getBoardList } from '../../api/board';

const CATEGORY_MAP = {
  free:   { label: '자유 게시판', backendKey: 'FREE' },
  info:   { label: '정보게시판',   backendKey: 'INFO' },
  market: { label: '중고거래',     backendKey: 'MARKET' },
  meetup: { label: '모임 게시판',  backendKey: 'MEETUP' },
  country:{ label: '본인 국가',    backendKey: 'COUNTRY' },
  school: { label: '소속 학교',    backendKey: 'SCHOOL' },
};

export default function BoardList() {
  const { category: slug } = useParams();
  const meta = CATEGORY_MAP[slug] ?? CATEGORY_MAP.free;

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const size = 20;

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getBoardList({ category: meta.backendKey, page, size });

        // 다양한 응답 포맷 방어
        const items = data?.items ?? data?.content ?? data?.list ?? [];
        const totalCount = data?.total ?? data?.totalElements ?? data?.count ?? items.length;

        setRows(items);
        setTotal(totalCount);
      } catch (e) {
        console.error('board list error:', e);
        setRows([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    })();
  }, [meta.backendKey, page]);

  const totalPages = Math.max(1, Math.ceil(total / size));

  return (
    <div className="min-h-screen bg-white">
      <Header title="" />

      <div className="max-w-[1024px] mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-4">{meta.label}</h1>

        <table className="w-full text-sm border-t">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-3">제목</th>
              <th className="py-3 w-32">작성자</th>
              <th className="py-3 w-36">작성일</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td className="py-10 text-center text-gray-400" colSpan={3}>불러오는 중…</td></tr>
            )}

            {!loading && rows.map(item => (
              <tr
                key={item.id}
                className="border-t hover:bg-gray-50 cursor-pointer"
                // 상세 페이지 라우트 연결 시: onClick={() => navigate(`/post/${item.id}`)}
              >
                <td className="py-3 pr-4">{item.title}</td>
                <td className="py-3">{item.author}</td>
                <td className="py-3">{item.createdAt}</td>
              </tr>
            ))}

            {!loading && rows.length === 0 && (
              <tr><td className="py-12 text-center text-gray-400" colSpan={3}>게시글이 없습니다</td></tr>
            )}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div className="flex justify-center gap-2 mt-6">
          <button
            className="px-3 py-1 border rounded disabled:opacity-40"
            onClick={() => setSearchParams({ page: String(Math.max(1, page - 1)) })}
            disabled={page <= 1}
          >이전</button>

          <span className="px-2 py-1">{page} / {totalPages}</span>

          <button
            className="px-3 py-1 border rounded disabled:opacity-40"
            onClick={() => setSearchParams({ page: String(Math.min(totalPages, page + 1)) })}
            disabled={page >= totalPages}
          >다음</button>
        </div>
      </div>
    </div>
  );
}
