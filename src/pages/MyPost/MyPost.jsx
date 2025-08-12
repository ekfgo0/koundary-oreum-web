// src/pages/MyPost/MyPost.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/common/Header';
import MyPostForm from '../../components/auth/MyPostForm';

const MyPost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  
  const [postData, setPostData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('');

  const categories = [
    '소속국가',
    '소속학교', 
    '자유게시판',
    '정보게시판',
    '중고거래 게시판',
    '모임게시판'
  ];

  // Mock 모드 확인
  const useMockData = import.meta.env.VITE_USE_MOCK === 'true';

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

  // 실제 API 호출
  const fetchRealData = async () => {
    const token = localStorage.getItem('authToken') || '';
    
    // 게시글 데이터 가져오기
    const postResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!postResponse.ok) {
      throw new Error('게시글을 불러올 수 없습니다.');
    }
    
    const post = await postResponse.json();
    
    // 댓글 데이터 가져오기
    const commentsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/comments`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!commentsResponse.ok) {
      throw new Error('댓글을 불러올 수 없습니다.');
    }
    
    const comments = await commentsResponse.json();
    
    return { post, comments };
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
          await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
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

  const handleCategoryClick = (category) => {
    // 해당 카테고리 게시판으로 이동
    navigate(`/board/${category}`);
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          showActions={true}
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <div className="text-lg text-gray-600">글을 불러오는 중...</div>
            {useMockData && (
              <div className="text-sm text-blue-500 mt-2">🔧 Mock 데이터 모드</div>
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
        <Header 
          showActions={true}
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-4">⚠️ 오류가 발생했습니다</div>
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
        <Header 
          showActions={true}
        />
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
      <Header  
        showActions={true}
      />
      
      {/* 카테고리 네비게이션 */}
      <div className="bg-blue-500 py-2">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`flex-1 px-3 py-1 font-medium transition-all bg-blue-500 border-none outline-none ${
                  currentCategory === category
                    ? 'text-blue-900'
                    : 'text-white hover:text-blue-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Mock 모드 표시 */}
        {useMockData && (
          <div className="mb-4 p-2 bg-blue-100 border border-blue-300 rounded text-blue-800 text-sm">
            Mock 데이터 모드가 활성화되어 있습니다. .env에서 VITE_USE_MOCK=false로 변경하면 실제 API를 사용합니다.
          </div>
        )}
        
        <MyPostForm 
          postData={postData}
          comments={comments}
          setComments={setComments}
        />
      </div>
    </div>
  );
};

export default MyPost;