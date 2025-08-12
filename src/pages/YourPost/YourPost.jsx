import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/common/Header';
import YourPostForm from '../../components/auth/YourPostForm';

// 신고 모달 컴포넌트
const ReportModal = ({ isOpen, onClose, onSubmit }) => {
  const [reportReason, setReportReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const reportReasons = [
    '스팸/광고',
    '욕설/비방',
    '음란/선정적 내용',
    '허위정보',
    '저작권 침해',
    '개인정보 노출',
    '기타'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reportReason) {
      alert('신고 사유를 선택해주세요.');
      return;
    }
    
    const finalReason = reportReason === '기타' ? customReason : reportReason;
    if (reportReason === '기타' && !customReason.trim()) {
      alert('기타 사유를 입력해주세요.');
      return;
    }

    onSubmit(finalReason);
    setReportReason('');
    setCustomReason('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">게시글 신고</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">신고 사유</label>
            <div className="space-y-2">
              {reportReasons.map((reason) => (
                <label key={reason} className="flex items-center">
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={reportReason === reason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {reportReason === '기타' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">상세 내용</label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md resize-none"
                rows="3"
                placeholder="신고 사유를 자세히 입력해주세요."
                maxLength="500"
              />
              <div className="text-xs text-gray-500 mt-1">
                {customReason.length}/500
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              신고하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const YourPost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  
  const [postData, setPostData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('');
  
  // 신고 관련 상태
  const [reportModal, setReportModal] = useState({
    isOpen: false,
    type: 'post',
    targetId: null
  });

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
      scrap: false // 내가 스크랩했는지 여부
    };

    const mockComments = [
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

  // 신고 기능
  const handleReport = async (reason) => {
    const token = localStorage.getItem('authToken') || '';
    
    try {
      if (useMockData) {
        // Mock 모드에서는 시뮬레이션
        console.log('Mock 신고 요청:', {
          type: 'post',
          targetId: reportModal.targetId,
          reason: reason
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
        alert('게시글 신고가 접수되었습니다.');
        return;
      }

      // 실제 API 호출
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${reportModal.targetId}/report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: reason
        })
      });

      if (!response.ok) {
        throw new Error('신고 처리 중 오류가 발생했습니다.');
      }

      alert('게시글 신고가 접수되었습니다.');
      
    } catch (error) {
      console.error('신고 실패:', error);
      alert('신고 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 신고 모달 열기
  const openReportModal = (targetId) => {
    setReportModal({
      isOpen: true,
      type: 'post',
      targetId: targetId
    });
  };

  // 신고 모달 닫기
  const closeReportModal = () => {
    setReportModal({
      isOpen: false,
      type: 'post',
      targetId: null
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let data;
        
        if (useMockData) {
          // Mock 데이터 사용
          console.log('Mock 데이터 모드 - YourPost');
          await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
          data = getMockData();
        } else {
          // 실제 API 호출
          console.log('실제 API 호출 - YourPost');
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
        
        <YourPostForm 
          postData={postData}
          setPostData={setPostData}
          comments={comments}
          setComments={setComments}
          onReportPost={() => openReportModal(postData.id)}
        />
      </div>

      {/* 신고 모달 */}
      <ReportModal
        isOpen={reportModal.isOpen}
        onClose={closeReportModal}
        onSubmit={handleReport}
      />
    </div>
  );
};

export default YourPost;