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
    if (!meta) {
      navigate('/boards/FREE/posts', { replace: true });
    }
  }, [meta, navigate]);

  useEffect(() => {
    if (!meta) return;

    let mounted = true;
    (async () => {
      try {
        setIsFetching(true);
        const data = await getBoardList({ category: meta.backendKey, page, size });
        
        if (mounted) {
          setRows(data?.content ?? []);
          setTotal(data?.totalElements ?? 0);
        }
      } catch (e) {
        console.error('board list error:', e);
        if (mounted) { setRows([]); setTotal(0); }
      } finally {
        if (mounted) setIsFetching(false);
      }
    })();

    return () => { mounted = false; };
  }, [meta, page, size, location.state?.refresh]);

  const handlePostClick = (post) => {
    navigate(`/boards/${slug}/posts/${post.postId}`);
  };

  if (!meta) {
    return null; 
  }

  const totalPages = Math.max(1, Math.ceil(total / size));

  const goPage = (next) => {
    navigate(`${location.pathname}?page=${next}`, { replace: true, state: {} });
  };

  const formatCreatedAt = (v) => {
  if (!v) return '-';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v; // 파싱 안 되면 원문 출력

  const yyyy  = String(d.getFullYear());
  const mm  = String(d.getMonth() + 1).padStart(2, '0');
  const dd  = String(d.getDate()).padStart(2, '0');
  const hh  = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');


  return `${yyyy}.${mm}.${dd}\n${hh}:${min}:${ss}`;
};

  return (
    <div className="min-h-screen bg-white">
      <Header title="" />
      <CategoryNavigation currentCategory={slug} />
      <div className="max-w-[1024px] mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">{meta.label}</h1>
          <div className="flex items-center gap-3">
            {isFetching && ( <div>로딩 중...</div> )}
            <button onClick={() => navigate(`/posts/${slug}`)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              글 작성
            </button>
          </div>
        </div>
        <table className="w-full text-sm border-t">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-3">제목</th>
              <th className="py-3 w-32">작성자</th>
              <th className="py-3 w-36">작성 시간</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr 
                key={item.postId} 
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => handlePostClick(item)}
              >
                <td className="py-3 pr-4">{item.title}</td>
                <td className="py-3">{item.nickname}</td>
                <td className="py-3 whitespace-pre-line">
                  {formatCreatedAt(item.createdAt)}
              </td>
              </tr>
            ))}
            {!isFetching && rows.length === 0 && (
              <tr><td className="py-12 text-center text-gray-400" colSpan={3}>게시글이 없습니다</td></tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-center gap-2 mt-6">
          <button className="px-3 py-1 border rounded disabled:opacity-40" onClick={() => goPage(page - 1)} disabled={page <= 1 || isFetching}>이전</button>
          <span className="px-2 py-1">{page} / {totalPages}</span>
          <button className="px-3 py-1 border rounded disabled:opacity-40" onClick={() => goPage(page + 1)} disabled={page >= totalPages || isFetching}>다음</button>
        </div>
      </div>
    </div>
  );
}