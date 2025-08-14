import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/common/Header';
import CategoryNavigation from '../../components/common/CategoryNavigation';
import MyPostForm from '../../components/auth/MyPostForm';
import { postAPI } from '../../api/post'; // 통합된 API 사용

const MyPost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  
  const [postData, setPostData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('');

  // Mock 모드 확인 (환경변수 또는 개발 모드)
  const useMockData = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.DEV;

  // Mock 데이터
  const getMockData = () => {
    const mockPost = {
      id: parseInt(postId) || 1,
      title: "해외 유학생활 꿀팁 공유",
      content: "안녕하세요! 독일에서 유학 중인 학생입니다. 처음 유학 오시는 분들을 위해 몇 가지 유용한 팁을 공유하려고 해요.\n\n1. 은행 계좌 개설은 미리 준비하세요\n2. 기숙사 신청은 빠를수록 좋아요\n3. 언어교환 모임에 적극 참여해보세요\n\n더 궁금한 것이 있으면 댓글로 물어보세요!",
      category: "소속국가",
      author: {
        nickname: "독일유학생",
        profileImage: null
      },
      createdAt: "2024-03-15 14:30",
      scrapCount: 12,
      commentCount: 8,
      isMyPost: true
    };

    const mockComments = [
      {
        id: 1,
        author: "호주학생",
        content: "정말 유용한 정보네요! 저도 호주에서 비슷한 경험을 했어요.",
        createdAt: "2024-03-15 15:20",
        replies: [
          {
            id: 2,
            author: "독일유학생",
            content: "호주도 비슷한가 보네요! 혹시 호주만의 특별한 팁이 있다면 공유해주세요 😊",
            createdAt: "2024-03-15 15:25"
          }
        ]
      },
      {
        id: 3,
        author: "예비유학생",
        content: "내년에 독일 유학 예정인데 정말 도움이 됩니다. 은행 계좌는 어느 은행을 추천하시나요?",
        createdAt: "2024-03-15 16:10",
        replies: []
      }
    ];

    return { post: mockPost, comments: mockComments };
  };

  // 실제 API 호출 (통합된 API 사용)
  const fetchRealData = async () => {
    try {
      // 게시글과 댓글을 병렬로 가져오기
      const [post, comments] = await Promise.all([
        postAPI.getPost(postId),
        postAPI.getComments(postId)
      ]);

      return { post, comments };
    } catch (error) {
      console.error('API 호출 실패:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let data;
        
        if (useMockData) {
          // Mock 데이터 사용
          console.log('Mock 데이터 모드 - MyPost');
          // 로딩 시뮬레이션
          await new Promise(resolve => setTimeout(resolve, 500));
          data = getMockData();
        } else {
          // 실제 API 호출
          console.log('실제 API 호출 - MyPost');
          data = await fetchRealData();
        }

        setPostData(data.post);
        setComments(data.comments);
        setCurrentCategory(data.post.category);
        
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
  }, [postId, useMockData]);

  // 댓글 작성 핸들러
  const handleCreateComment = async (commentData) => {
    try {
      if (useMockData) {
        // Mock 모드에서는 로컬 상태만 업데이트
        const newComment = {
          id: Date.now(),
          ...commentData,
          createdAt: new Date().toLocaleString(),
          replies: []
        };
        setComments(prev => [...prev, newComment]);
        return newComment;
      } else {
        // 실제 API 호출
        const newComment = await postAPI.createComment(postId, commentData);
        setComments(prev => [...prev, newComment]);
        return newComment;
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      throw error;
    }
  };

  // 댓글 수정 핸들러
  const handleUpdateComment = async (commentId, commentData) => {
    try {
      if (useMockData) {
        // Mock 모드에서는 로컬 상태만 업데이트
        setComments(prev => 
          prev.map(comment => 
            comment.id === commentId 
              ? { ...comment, ...commentData, updatedAt: new Date().toLocaleString() }
              : comment
          )
        );
      } else {
        // 실제 API 호출
        const updatedComment = await postAPI.updateComment(postId, commentId, commentData);
        setComments(prev => 
          prev.map(comment => 
            comment.id === commentId ? updatedComment : comment
          )
        );
      }
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      throw error;
    }
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (commentId) => {
    try {
      if (useMockData) {
        // Mock 모드에서는 로컬 상태만 업데이트
        setComments(prev => prev.filter(comment => comment.id !== commentId));
      } else {
        // 실제 API 호출
        await postAPI.deleteComment(postId, commentId);
        setComments(prev => prev.filter(comment => comment.id !== commentId));
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      throw error;
    }
  };

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showActions={true} />
        <CategoryNavigation currentCategory={currentCategory} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <div className="text-lg text-gray-600">글을 불러오는 중...</div>
            {useMockData && (
              <div className="text-sm text-blue-500 mt-2">Mock 데이터 모드</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showActions={true} />
        <CategoryNavigation currentCategory={currentCategory} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-4">오류가 발생했습니다</div>
            <div className="text-gray-600 mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
            >
              다시 시도
            </button>
            <button 
              onClick={() => navigate('/main')}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              메인으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 게시글이 없을 때
  if (!postData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showActions={true} />
        <CategoryNavigation currentCategory={currentCategory} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-gray-600 text-lg">게시글을 찾을 수 없습니다</div>
            <button 
              onClick={() => navigate('/main')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              메인으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showActions={true} />
      
      {/* 카테고리 네비게이션 */}
      <CategoryNavigation 
        currentCategory={currentCategory}
        onCategoryChange={handleCategoryChange}
      />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Mock 모드 표시 */}
        {useMockData && (
          <div className="mb-4 p-2 bg-blue-100 border border-blue-300 rounded text-blue-800 text-sm">
            Mock 데이터 모드가 활성화되어 있습니다. (실제 API 연결 전까지 사용)
          </div>
        )}
        
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