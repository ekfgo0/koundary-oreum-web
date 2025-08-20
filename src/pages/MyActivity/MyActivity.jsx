import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import { getMyActivity } from '../../api/user'; // 새로 추가될 API 함수예요

const ACTIVITY_TYPE_MAP = {
  posts: '내가 쓴 글',
  comments: '댓글 단 글',
  scraps: '스크랩한 글',
};

const MyActivity = () => {
  const { activityType } = useParams();
  const navigate = useNavigate();
  const title = ACTIVITY_TYPE_MAP[activityType] || '나의 활동';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ACTIVITY_TYPE_MAP[activityType]) {
      navigate('/myprofile');
      return;
    }

    const fetchActivity = async () => {
      try {
        setLoading(true);
        const data = await getMyActivity(activityType);
        setItems(data?.content || []);
      } catch (err) {
        console.error(`${title} 목록 조회 실패:`, err);
        setError('활동 내역을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [activityType, navigate, title]);

  const handleItemClick = (item) => {
    // postId가 있는 경우에만 상세 페이지로 이동하도록 해요.
    if (item.postId) {
      navigate(`/mypost/${item.postId}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title={title} showActions={true} />
      <main className="max-w-screen-lg mx-auto px-4 py-8">
        {loading ? (
          <p>목록을 불러오는 중...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500">아직 활동 내역이 없어요.</p>
        ) : (
          <table className="w-full text-sm border-t">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-3">제목</th>
                <th className="py-3 w-32">작성자</th>
                <th className="py-3 w-36">작성일</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.postId}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  <td className="py-3 pr-4">{item.title}</td>
                  <td className="py-3">{item.nickname}</td>
                  <td className="py-3">{item.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default MyActivity;