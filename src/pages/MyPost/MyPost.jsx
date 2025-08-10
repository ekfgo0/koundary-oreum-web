import { useState, useEffect } from 'react';

const MyPost = ({ postId }) => {
  // 실제 환경에서는 react-router의 useNavigate와 useParams 사용
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
    // 실제로는 useNavigate()를 사용하여 페이지 이동
  };

  // 실제로는 useParams()로 URL에서 postId를 가져옴
  const currentPostId = postId || 1;

  // 게시글 데이터 (실제로는 서버에서 받아올 데이터)
  const [postData, setPostData] = useState({
    id: null,
    title: "",
    content: "",
    category: "",
    categories: [],
    images: [], // 첨부된 이미지 파일들
    author: {
      name: "사용자",
      avatar: "사"
    },
    createdAt: "",
    views: 0,
    isInfoPost: false
  });

  // 댓글 데이터
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyInputs, setReplyInputs] = useState({});
  const [showReplyForm, setShowReplyForm] = useState({});
  const [loading, setLoading] = useState(true);

  // 카테고리 한글 매핑
  const categoryMapping = {
    '소속국가': '소속 국가',
    '소속학교': '소속 학교',
    '자유게시판': '자유 게시판',
    '정보게시판': '정보 게시판',
    '중고거래 게시판': '중고거래 게시판',
    '모임게시판': '모임 게시판'
  };

  // 컴포넌트 마운트 시 게시글 데이터 불러오기
  useEffect(() => {
    fetchPostData();
  }, [currentPostId]);

  const fetchPostData = async () => {
    try {
      setLoading(true);
      
      // 실제 API 호출
      const token = localStorage.getItem('authToken') || '';
      const response = await fetch(`/api/posts/${currentPostId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPostData({
          id: data.id,
          title: data.title,
          content: data.content,
          category: data.category,
          categories: data.categories || [data.category],
          images: data.images || [],
          author: data.author,
          createdAt: data.createdAt,
          views: data.views || 0,
          isInfoPost: data.isInfoPost || false
        });
        
        // 댓글도 함께 불러오기
        if (data.comments) {
          setComments(data.comments);
        }
      } else {
        throw new Error('게시글을 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('게시글 로드 실패:', error);
      alert('게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 댓글 작성
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert('댓글을 입력하세요.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken') || '';
      const response = await fetch(`/api/posts/${currentPostId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newComment
        })
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments(prev => [...prev, newCommentData]);
        setNewComment("");
      } else {
        throw new Error('댓글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  // 답글 작성
  const handleAddReply = async (commentId) => {
    const replyContent = replyInputs[commentId];
    if (!replyContent?.trim()) {
      alert('답글을 입력하세요.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken') || '';
      const response = await fetch(`/api/posts/${currentPostId}/comments/${commentId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: replyContent
        })
      });

      if (response.ok) {
        const newReply = await response.json();
        setComments(prev => prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, replies: [...(comment.replies || []), newReply] }
            : comment
        ));
        setReplyInputs(prev => ({ ...prev, [commentId]: "" }));
        setShowReplyForm(prev => ({ ...prev, [commentId]: false }));
      } else {
        throw new Error('답글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('답글 작성 실패:', error);
      alert('답글 작성에 실패했습니다.');
    }
  };

  // 답글 입력값 변경
  const handleReplyInputChange = (commentId, value) => {
    setReplyInputs(prev => ({ ...prev, [commentId]: value }));
  };

  // 답글 폼 토글
  const toggleReplyForm = (commentId) => {
    setShowReplyForm(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  // 이미지 확대 보기
  const handleImageClick = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };

  // 총 댓글 수 계산
  const totalComments = comments.reduce((total, comment) => total + 1 + (comment.replies?.length || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600">게시글을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-5 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-500 italic cursor-pointer" onClick={() => navigate('/main')}>
            Koundary
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors">
              내 프로필
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-blue-500">
        <div className="max-w-6xl mx-auto px-5 py-3">
          <div className="flex gap-8">
            {['소속 국가', '소속 학교', '자유 게시판', '정보 게시판', '중고거래 게시판', '모임 게시판'].map((item) => (
              <button 
                key={item}
                onClick={() => navigate(`/board/${item}`)}
                className="text-white px-3 py-2 rounded hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* Post */}
        <article className="bg-white rounded border-2 border-blue-500 mb-6">
          {/* Post Header */}
          <div className="bg-blue-500 text-white py-3 px-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-semibold">
                    {postData.author.avatar || postData.author.name?.charAt(0) || '사'}
                  </div>
                  <span className="font-semibold">{postData.author.name}</span>
                </div>
                
                {/* 카테고리 표시 */}
                <div className="flex gap-2">
                  {postData.categories.map((category, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-white bg-opacity-20 rounded text-sm"
                    >
                      {categoryMapping[category] || category}
                    </span>
                  ))}
                  {postData.isInfoPost && (
                    <span className="px-2 py-1 bg-yellow-400 bg-opacity-90 text-blue-900 rounded text-sm font-medium">
                      정보글
                    </span>
                  )}
                </div>
              </div>
              
              <div className="text-sm opacity-90 flex gap-4">
                <span>{postData.createdAt}</span>
                <span>조회 {postData.views}</span>
                <button className="hover:text-red-300 transition-colors">신고</button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Post Title */}
            <h1 className="text-2xl font-bold mb-6 text-gray-900 border-b border-gray-200 pb-4">
              {postData.title}
            </h1>

            {/* Post Content */}
            <div className="text-gray-700 leading-relaxed mb-8 whitespace-pre-wrap">
              {postData.content}
            </div>

            {/* Images */}
            {postData.images && postData.images.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span>🖼️</span>
                  첨부 이미지 ({postData.images.length}개)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {postData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url || `/uploads/${image.filename}`}
                        alt={`첨부 이미지 ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => handleImageClick(image.url || `/uploads/${image.filename}`)}
                      />
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        클릭하여 확대
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Comments Section */}
        <section className="bg-white rounded border-2 border-blue-500">
          <div className="bg-blue-500 text-white py-3 px-6">
            <h2 className="font-bold flex items-center gap-2">
              <span>💬</span>
              댓글 {totalComments}개
            </h2>
          </div>

          <div className="p-6">
            {/* Comment Form */}
            <div className="mb-8">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요... (Ctrl + Enter로 빠른 작성)"
                className="w-full p-4 border-2 border-blue-500 rounded-lg resize-none focus:outline-none focus:border-blue-600"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleAddComment();
                  }
                }}
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleAddComment}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  댓글 작성
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  첫 번째 댓글을 작성해보세요!
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id}>
                    {/* Comment */}
                    <div className="border-l-4 border-blue-200 pl-4 hover:border-blue-400 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {comment.author?.avatar || comment.author?.name?.charAt(0) || '익'}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900">{comment.author?.name || '익명'}</span>
                            <span className="ml-2 text-xs text-gray-500">{comment.createdAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-700 mb-3 leading-relaxed pl-11">
                        {comment.content}
                      </div>
                      <div className="flex gap-4 pl-11">
                        <button
                          onClick={() => toggleReplyForm(comment.id)}
                          className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          답글
                        </button>
                        <button className="text-sm text-gray-500 hover:text-red-500 transition-colors">
                          신고
                        </button>
                      </div>

                      {/* Reply Form */}
                      {showReplyForm[comment.id] && (
                        <div className="mt-4 ml-11 pt-4 border-t border-gray-100">
                          <textarea
                            value={replyInputs[comment.id] || ""}
                            onChange={(e) => handleReplyInputChange(comment.id, e.target.value)}
                            placeholder="답글을 입력하세요... (Ctrl + Enter로 빠른 작성)"
                            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={2}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.ctrlKey) {
                                handleAddReply(comment.id);
                              }
                            }}
                          />
                          <div className="flex justify-end gap-2 mt-3">
                            <button
                              onClick={() => toggleReplyForm(comment.id)}
                              className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              취소
                            </button>
                            <button
                              onClick={() => handleAddReply(comment.id)}
                              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              답글 작성
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.map((reply) => (
                      <div key={reply.id} className="ml-11 mt-4 border-l-4 border-blue-100 pl-4 hover:border-blue-200 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {reply.author?.avatar || reply.author?.name?.charAt(0) || '익'}
                            </div>
                            <div>
                              <span className="font-semibold text-gray-900">{reply.author?.name || '익명'}</span>
                              <span className="ml-2 text-xs text-gray-500">{reply.createdAt}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-gray-700 mb-3 leading-relaxed pl-11">
                          {reply.content}
                        </div>
                        <div className="flex gap-4 pl-11">
                          <button className="text-sm text-gray-500 hover:text-red-500 transition-colors">
                            신고
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyPost;