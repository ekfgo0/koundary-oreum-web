import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/common/Header';
import CategoryNavigation from '../../components/common/CategoryNavigation';
import MyPostForm from '../../components/auth/MyPostForm';
import YourPostForm from '../../components/auth/YourPostForm';
import { postAPI } from '../../api/post';

const PostDetail = () => {
  const navigate = useNavigate();
  const { category, postId } = useParams();

  const [postData, setPostData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMyPost, setIsMyPost] = useState(false);

  const useMockData = import.meta.env.VITE_USE_MOCK === 'true';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await postAPI.getPost(postId, category);
        
        const myUserId = localStorage.getItem('userId');
        const postIsMine = myUserId && data.userId && String(data.userId) === myUserId;
        
        setIsMyPost(postIsMine);
        setPostData(data);
        setComments(data.comments || []);

      } catch (err) {
        console.error('게시글 상세 조회 실패:', err);
        setError('게시글을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (postId && category) {
      fetchData();
    }
  }, [postId, category, navigate]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!postData) return <div>게시글이 없습니다.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showActions={true} />
      <CategoryNavigation currentCategory={category} />
      <div className="max-w-4xl mx-auto px-4 py-6">
        {isMyPost ? (
          <MyPostForm
            postData={postData}
            comments={comments}
            setComments={setComments}
          />
        ) : (
          <YourPostForm
            postData={postData}
            setPostData={setPostData}
            comments={comments}
            setComments={setComments}
          />
        )}
      </div>
    </div>
  );
};

export default PostDetail;