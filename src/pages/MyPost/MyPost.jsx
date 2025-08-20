import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from '../../components/common/Header';
import CategoryNavigation from '../../components/common/CategoryNavigation';
import MyPostForm from '../../components/auth/MyPostForm';
import { postAPI } from '../../api/post';

const MyPost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const location = useLocation();

  const [postData, setPostData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('');

  const useMockData = import.meta.env.VITE_USE_MOCK === 'true';

  const getMockData = () => {
    const mockPost = {
      postId: parseInt(postId) || 1,
      userId: 1,
      title: "해외 유학생활 꿀팁 공유 (Mock)",
      content: "이것은 목업 데이터입니다. 실제 데이터가 아닙니다.",
      boardCode: "NATIONALITY",
      nickname: "독일유학생",
      profileImageUrl: null, // 💡 프로필 이미지 URL 필드 추가
      createdAt: "2024-03-15 14:30",
      scrapCount: 12,
      isMyPost: true
    };
    const mockComments = [];
    return { post: mockPost, comments: mockComments };
  };
  
  const fetchRealData = async (boardCode) => {
    try {
      const post = await postAPI.getPost(postId, boardCode);
      const commentsData = await postAPI.getComments(postId);
      // 💡 백엔드 응답(PostResponse)에 profileImageUrl이 포함되어 있으므로, 그대로 사용해요.
      return { post, comments: commentsData.content || [] };
    } catch (error) {
      console.error('API 호출 실패:', error);
      throw error;
    }
  };

  useEffect(() => {
    const boardCode = location.state?.boardCode;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let data;
        
        if (useMockData) {
          console.log('Mock 데이터 모드 - MyPost');
          await new Promise(resolve => setTimeout(resolve, 500));
          data = getMockData();
        } else {
          if (!boardCode) {
            setError('게시글 정보를 불러올 수 없습니다. (boardCode가 없습니다)');
            setLoading(false);
            return;
          }
          console.log(`실제 API 호출 - MyPost (boardCode: ${boardCode})`);
          data = await fetchRealData(boardCode);

          const myUserId = localStorage.getItem('userId');
          if (myUserId && data.post.userId && String(data.post.userId) !== myUserId) {
              navigate(`/yourpost/${postId}`, { replace: true, state: { boardCode } });
              return;
          }
        }

        // 💡 isMyPost와 함께 profileImageUrl도 postData에 잘 담아줘요.
        setPostData({ ...data.post, isMyPost: true, profileImageUrl: data.post.profileImageUrl });
        setComments(data.comments);
        setCurrentCategory(data.post.boardCode);
        
      } catch (error) {
        console.error('데이터 로드 실패:', error);
        setError(error.message || '데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchData();
    } else {
      setError('유효하지 않은 게시글 ID입니다.');
      setLoading(false);
    }
  }, [postId, useMockData, navigate, location.state]);
  
  const handleCreateComment = async (commentData) => {
    try {
      const newComment = await postAPI.createComment(postId, commentData);
      setComments(prev => [...prev, newComment]);
    } catch (error) {
      alert(error.message || '댓글 작성에 실패했습니다.');
    }
  };

  const handleUpdateComment = async (commentId, commentData) => {
    try {
      const updatedComment = await postAPI.updateComment(postId, commentId, commentData);
      setComments(prev => 
        prev.map(c => c.id === commentId ? updatedComment : c)
      );
    } catch (error) {
      alert(error.message || '댓글 수정에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('정말 댓글을 삭제하시겠습니까?')) {
      try {
        await postAPI.deleteComment(postId, commentId);
        setComments(prev => prev.filter(c => c.id !== commentId));
      } catch (error) {
        alert(error.message || '댓글 삭제에 실패했습니다.');
      }
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50"><Header showActions={true} /><div className="p-8 text-center">로딩 중...</div></div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50"><Header showActions={true} /><div className="p-8 text-center text-red-500">오류가 발생했습니다: {error}</div></div>
    );
  }

  if (!postData) {
    return (
      <div className="min-h-screen bg-gray-50"><Header showActions={true} /><div className="p-8 text-center">게시글을 찾을 수 없습니다.</div></div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showActions={true} />
      <CategoryNavigation currentCategory={currentCategory} />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <MyPostForm 
          postData={postData}
          comments={comments}
          setComments={setComments}
          onCreateComment={handleCreateComment}
          onUpdateComment={handleUpdateComment}
          onDeleteComment={handleDeleteComment}
        />
      </div>
    </div>
  );
};

export default MyPost;