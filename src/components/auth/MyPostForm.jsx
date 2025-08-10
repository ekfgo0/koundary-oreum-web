// src/components/auth/MyPostForm.jsx
import React, { useState } from 'react';
import { MessageCircle, Bookmark, User, Reply, Send, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyPostForm = ({ postData, comments, setComments }) => {
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReplies, setShowReplies] = useState({});

  // 글 수정 버튼 클릭
  const handleEditPost = () => {
    // 수정 모드로 Posts 페이지로 이동
    navigate(`/posts?edit=${postData.id}`, {
      state: {
        editMode: true,
        postData: postData
      }
    });
  };

  // 댓글 추가
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      author: "현재사용자", // 실제로는 로그인된 사용자 정보
      content: newComment,
      createdAt: new Date().toLocaleString('ko-KR'),
      replies: []
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  // 대댓글 추가
  const handleAddReply = (parentId) => {
    if (!replyText.trim()) return;

    const reply = {
      id: Date.now(),
      author: "현재사용자",
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
        {/* 작성자 정보와 수정 버튼 */}
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
          
          {/* 수정 버튼 */}
          {postData.isMyPost && (
            <button
              onClick={handleEditPost}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              <Edit className="w-4 h-4" />
              수정
            </button>
          )}
        </div>

        {/* 게시글 제목 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{postData.title}</h1>

        {/* 게시글 내용 */}
        <div className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
          {postData.content}
        </div>

        {/* 액션 버튼들 */}
        <div className="flex items-center gap-6 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <MessageCircle className="w-5 h-5" />
            <span>{getTotalCommentCount()}</span>
          </div>
          
          {!postData.isMyPost && (
            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
              <Bookmark className="w-5 h-5" />
              <span>{postData.scrapCount}</span>
            </button>
          )}
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
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-gray-900">{comment.author}</span>
                    <span className="text-xs text-gray-500">{comment.createdAt}</span>
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

                  {/* 답글 입력 */}
                  {replyingTo === comment.id && (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="답글을 입력하세요..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddReply(comment.id)}
                      />
                      <button
                        onClick={() => handleAddReply(comment.id)}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* 대댓글 목록 */}
                  {showReplies[comment.id] && comment.replies.map((reply) => (
                    <div key={reply.id} className="mt-3 ml-6 flex gap-3">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-3 h-3 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-gray-900">{reply.author}</span>
                          <span className="text-xs text-gray-500">{reply.createdAt}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 댓글 작성 */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                등록
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPostForm;