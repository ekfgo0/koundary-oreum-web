// src/pages/YourPost/YourPost.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/common/Header';
import YourPostForm from '../../components/auth/YourPostForm';

const YourPost = () => {
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

  // 샘플 데이터 (실제로는 API에서 가져올 데이터)
  const samplePost = {
    id: 1,
    title: "캐나다 토론토 대학교 입학 후기",
    content: "안녕하세요! 작년에 토론토 대학교에 입학한 학생입니다. 많은 분들이 궁금해하시는 입학 과정과 준비 사항들을 공유하려고 해요.\n\n1. IELTS 점수는 최소 7.0 이상 준비하세요\n2. 추천서는 3개월 전부터 미리 부탁드리세요\n3. Personal Statement가 정말 중요해요\n\n토론토는 정말 살기 좋은 도시입니다! 한국 음식도 쉽게 구할 수 있고, 교통도 편리해요. 더 궁금한 점이 있으면 댓글로 물어보세요!",
    category: "소속학교",
    author: {
      nickname: "토론토학생",
      profileImage: null
    },
    createdAt: "2024-03-14 10:15",
    scrapCount: 24,
    commentCount: 12,
    isMyPost: false,
    isBookmarked: false // 내가 스크랩했는지 여부
  };

  const sampleComments = [
    {
      id: 1,
      author: "예비유학생2024",
      content: "정말 유용한 정보 감사합니다! IELTS 공부 방법도 궁금해요.",
      createdAt: "2024-03-14 11:30",
      replies: [
        {
          id: 2,
          author: "토론토학생",
          content: "IELTS는 라이팅 파트를 특히 집중적으로 연습하시길 추천드려요! 인강보다는 실제 연습이 더 도움됐습니다.",
          createdAt: "2024-03-14 11:45"
        }
      ]
    },
    {
      id: 3,
      author: "캐나다꿈나무",
      content: "토론토 대학교 생활비는 어느 정도 드나요? 기숙사 vs 자취 중에 고민이에요.",
      createdAt: "2024-03-14 14:20",
      replies: []
    },
    {
      id: 4,
      author: "유학맘",
      content: "아이가 내년에 지원 예정인데 이런 후기 너무 도움돼요! 혹시 장학금 관련 정보도 있나요?",
      createdAt: "2024-03-14 16:45",
      replies: []
    }
  ];

  useEffect(() => {
    // 실제로는 API 호출
    const fetchData = async () => {
      try {
        setLoading(true);
        // TODO: 실제 API 호출로 교체
        setPostData(samplePost);
        setComments(sampleComments);
        setCurrentCategory(samplePost.category);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

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
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              다시 시도
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
        <YourPostForm 
          postData={postData}
          setPostData={setPostData}
          comments={comments}
          setComments={setComments}
        />
      </div>
    </div>
  );
};

export default YourPost;