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

  const sampleComments = [
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

  useEffect(() => {
    // 실제로는 API 호출
    setPostData(samplePost);
    setComments(sampleComments);
    setCurrentCategory(samplePost.category);
    setLoading(false);
  }, [postId]);

  const handleCategoryClick = (category) => {
    // 해당 카테고리 게시판으로 이동
    navigate(`/board/${category}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
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