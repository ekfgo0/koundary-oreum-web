import React, { useState, useEffect } from 'react';
import { MessageCircle, Bookmark, BookmarkCheck, User, Reply, Send, Flag, X } from 'lucide-react';

const YourPostForm = ({ 
  postData, 
  setPostData, 
  comments, 
  setComments, 
  onReportPost
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReplies, setShowReplies] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState({
    comment: false,
    reply: false,
    scrap: false
  });
  const [error, setError] = useState('');

  // Mock 모드 확인
  const useMockData = import.meta.env.VITE_USE_MOCK === 'true';

  // 현재 사용자 정보 가져오기
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (useMockData) {
        // Mock 사용자 데이터
        setCurrentUser({
          id: 2,
          nickname: "현재사용자",
          profileImage: null
        });
        return;
      }

      try {
        const token = localStorage.getItem('authToken') || '';
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      }
    };

    fetchCurrentUser();
  }, [useMockData]);

  // 스크랩 토글 함수
  const handleBookmarkToggle = async () => {
    if (loading.scrap) return;
    
    setLoading(prev => ({ ...prev, scrap: true }));
    setError('');
    
    try {
      if (useMockData) {
        // Mock 데이터 처리
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setPostData(prev => ({
          ...prev,
          scrap: !prev.scrap,
          scrapCount: prev.scrap ? prev.scrapCount - 1 : prev.scrapCount + 1
        }));
        
        console.log('Mock: 스크랩 토글됨');
        return;
      }

      const token = localStorage.getItem('authToken') || '';
      const method = postData.scrap ? 'DELETE' : 'POST';
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postData.id}/scrap`, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '스크랩 처리에 실패했습니다.');
      }

      // 스크랩 상태 토글
      setPostData(prev => ({
        ...prev,
        scrap: !prev.scrap,
        scrapCount: prev.scrap ? prev.scrapCount - 1 : prev.scrapCount + 1
      }));

    } catch (error) {
      console.error('스크랩 실패:', error);
      setError(error.message || '스크랩 처리에 실패했습니다.');
    } finally {
      setLoading(prev => ({ ...prev, scrap: false }));
    }
  };

  // 댓글 추가
  const handleAddComment = async () => {
    if (!newComment.trim() || loading.comment) return;

    // 입력값 검증
    if (newComment.length > 500) {
      setError('댓글은 500자 이내로 작성해주세요.');
      return;
    }

    setLoading(prev => ({ ...prev, comment: true }));
    setError('');

    try {
      if (useMockData) {
        // Mock 데이터 처리
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const comment = {
          id: Date.now(),
          author: currentUser?.nickname || "현재사용자",
          content: newComment,
          createdAt: new Date().toLocaleString('ko-KR'),
          replies: []
        };
        
        setComments(prev => [...prev, comment]);
        setNewComment('');
        
        // 댓글 수 업데이트
        setPostData(prev => ({
          ...prev,
          commentCount: prev.commentCount + 1
        }));
        return;
      }

      const token = localStorage.getItem('authToken') || '';
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postData.id}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: newComment.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '댓글 작성에 실패했습니다.');
      }

      const newCommentData = await response.json();
      setComments(prev => [...prev, newCommentData]);
      setNewComment('');
      
      // 댓글 수 업데이트
      setPostData(prev => ({
        ...prev,
        commentCount: prev.commentCount + 1
      }));

    } catch (error) {
      console.error('댓글 작성 실패:', error);
      setError(error.message || '댓글 작성에 실패했습니다.');
    } finally {
      setLoading(prev => ({ ...prev, comment: false }));
    }
  };

  // 대댓글 추가
  const handleAddReply = async (parentId) => {
    if (!replyText.trim() || loading.reply) return;

    // 입력값 검증
    if (replyText.length > 500) {
      setError('답글은 500자 이내로 작성해주세요.');
      return;
    }

    setLoading(prev => ({ ...prev, reply: true }));
    setError('');

    try {
      if (useMockData) {
        // Mock 데이터 처리
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const reply = {
          id: Date.now(),
          author: currentUser?.nickname || "현재사용자",
          content: replyText,
          createdAt: new Date().toLocaleString('ko-KR')
        };

        setComments(prev => prev.map(comment => 
          comment.id === parentId 
            ? { ...comment, replies: [...comment.replies, reply] }
            : comment
        ));

        setReplyText('');
        setReplyingTo(null);
        
        // 댓글 수 업데이트 (대댓글도 포함)
        setPostData(prev => ({
          ...prev,
          commentCount: prev.commentCount + 1
        }));
        return;
      }

      const token = localStorage.getItem('authToken') || '';
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments/${parentId}/replies`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: replyText.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '답글 작성에 실패했습니다.');
      }

      const newReply = await response.json();
      
      setComments(prev => prev.map(comment => 
        comment.id === parentId 
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      ));

      setReplyText('');
      setReplyingTo(null);
      
      // 댓글 수 업데이트 (대댓글도 포함)
      setPostData(prev => ({
        ...prev,
        commentCount: prev.commentCount + 1
      }));

    } catch (error) {
      console.error('답글 작성 실패:', error);
      setError(error.message || '답글 작성에 실패했습니다.');
    } finally {
      setLoading(prev => ({ ...prev, reply: false }));
    }
  };

  // 게시글 신고 처리
  const handleReportPost = async () => {
    const reason = prompt('신고 사유를 입력해주세요:');
    if (!reason || !reason.trim()) return;

    try {
      if (useMockData) {
        // Mock 데이터 처리
        await new Promise(resolve => setTimeout(resolve, 500));
        alert('신고가 접수되었습니다. 검토 후 조치하겠습니다.');
        return;
      }

      const token = localStorage.getItem('authToken') || '';
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postData.id}/report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: reason.trim(),
          type: 'post'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '신고 처리에 실패했습니다.');
      }

      alert('신고가 접수되었습니다. 검토 후 조치하겠습니다.');
      
      // 신고 완료 후 콜백 호출 (선택사항)
      if (onReportPost) {
        onReportPost(postData.id, reason);
      }

    } catch (error) {
      console.error('신고 처리 실패:', error);
      alert(error.message || '신고 처리에 실패했습니다.');
    }
  };

  // 답글 모드 토글
  const toggleReplyMode = (commentId) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setReplyText(''); // 답글 텍스트 초기화
    
    // 답글을 작성하려 할 때 대댓글 목록이 닫혀있다면 자동으로 열기
    if (replyingTo !== commentId) {
      setShowReplies(prev => ({
        ...prev,
        [commentId]: true
      }));
    }
  };

  // 답글 모드 취소
  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  // 대댓글 토글
  const toggleReplies = (commentId) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  // 전체 댓글 수 계산 (댓글 + 대댓글)
  const getTotalCommentCount = () => {
    return comments.reduce((total, comment) => {
      return total + 1 + comment.replies.length;
    }, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* 게시글 내용 */}
      <div className="p-6">
        {/* 작성자 정보와 신고 버튼 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              {postData.author.profileImage ? (
                <img 
                  src={postData.author.profileImage} 
                  alt="프로필" 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{postData.author.nickname}</div>
              <div className="text-sm text-gray-500">{postData.createdAt}</div>
            </div>
          </div>
          
          {/* 게시글 신고 버튼 */}
          {!postData.isMyPost && (
            <button
              onClick={handleReportPost}
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="게시글 신고"
            >
              <Flag className="w-4 h-4" />
              신고
            </button>
          )}
        </div>

        {/* 게시글 제목 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{postData.title}</h1>

        {/* 게시글 내용 */}
        <div className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
          {postData.content}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="flex items-center gap-6 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <MessageCircle className="w-5 h-5" />
            <span>{getTotalCommentCount()}</span>
          </div>
          
          {/* 스크랩 버튼 */}
          <button 
            onClick={handleBookmarkToggle}
            disabled={loading.scrap}
            className={`flex items-center gap-2 transition-colors ${
              postData.scrap 
                ? 'text-blue-500 hover:text-blue-600' 
                : 'text-gray-600 hover:text-blue-500'
            } ${loading.scrap ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {postData.scrap ? (
              <BookmarkCheck className="w-5 h-5" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
            <span>{postData.scrapCount}</span>
            {loading.scrap && <span className="text-xs">(처리중...)</span>}
          </button>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="border-t border-gray-200">
        {/* 댓글 목록 */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4">
            댓글 {getTotalCommentCount()}개
          </h3>

          {comments.map((comment) => (
            <div key={comment.id} className="mb-4">
              {/* 댓글 */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-gray-900">{comment.author}</span>
                      <span className="text-xs text-gray-500">{comment.createdAt}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500"
                    >
                      <Reply className="w-3 h-3" />
                      답글
                    </button>
                    
                    {comment.replies.length > 0 && (
                      <button
                        onClick={() => toggleReplies(comment.id)}
                        className="text-xs text-blue-500 hover:text-blue-600"
                      >
                        {showReplies[comment.id] ? '답글 숨기기' : `답글 ${comment.replies.length}개 보기`}
                      </button>
                    )}
                  </div>

                  {/* 대댓글 목록 */}
                  {showReplies[comment.id] && comment.replies.map((reply) => (
                    <div key={reply.id} className="mt-3 ml-6 flex gap-3">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-3 h-3 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-gray-900">{reply.author}</span>
                            <span className="text-xs text-gray-500">{reply.createdAt}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">{reply.content}</p>
                      </div>
                    </div>
                  ))}

                  {/* 답글 입력 */}
                  {replyingTo === comment.id && (
                    <div className="mt-3 ml-6 flex gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="답글을 입력하세요..."
                        disabled={loading.reply}
                        maxLength={500}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        onKeyPress={(e) => e.key === 'Enter' && !loading.reply && handleAddReply(comment.id)}
                      />
                      <button
                        onClick={() => handleAddReply(comment.id)}
                        disabled={loading.reply || !replyText.trim()}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {loading.reply ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 댓글 작성 */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              {currentUser?.profileImage ? (
                <img 
                  src={currentUser.profileImage} 
                  alt="프로필" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                disabled={loading.comment}
                maxLength={500}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                onKeyPress={(e) => e.key === 'Enter' && !loading.comment && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                disabled={loading.comment || !newComment.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {loading.comment ? '등록중...' : '등록'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourPostForm;