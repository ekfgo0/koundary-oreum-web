import React, { useState, useEffect } from 'react';
import { MessageCircle, Bookmark, BookmarkCheck, User, Reply, Send, Flag } from 'lucide-react';

const YourPostForm = ({ 
  postData, 
  setPostData, 
  comments, 
  setComments, 
  onReportPost,
  onToggleScrap,
  onCreateComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState({ comment: false });

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setCurrentUser(userInfo);
    }
  }, []);
  
  const handleAddComment = async () => {
    if (!newComment.trim() || loading.comment) return;
    setLoading({ comment: true });
    try {
      await onCreateComment({ content: newComment });
      setNewComment('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading({ comment: false });
    }
  };

  const getTotalCommentCount = () => {
    if (!Array.isArray(comments)) return 0;
    return comments.reduce((total, comment) => total + 1 + (comment.replies?.length || 0), 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
              {/* 💡[수정!] postData.author.profileImage -> postData.profileImageUrl */}
              {postData.profileImageUrl ? (
                <img 
                  src={postData.profileImageUrl} 
                  alt="프로필" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              {/* 💡[수정!] postData.author.nickname -> postData.nickname */}
              <div className="font-semibold text-gray-900">{postData.nickname}</div>
              <div className="text-sm text-gray-500">{new Date(postData.createdAt).toLocaleString()}</div>
            </div>
          </div>
          
          <button onClick={onReportPost} className="flex items-center gap-1 px-3 py-1 text-sm text-gray-500 hover:text-red-500">
            <Flag className="w-4 h-4" /> 신고
          </button>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">{postData.title}</h1>
        <div className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">{postData.content}</div>

        <div className="flex items-center gap-6 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <MessageCircle className="w-5 h-5" />
            <span>{getTotalCommentCount()}</span>
          </div>
          <button onClick={onToggleScrap} className="flex items-center gap-2">
            {postData.isScraped ? <BookmarkCheck className="w-5 h-5 text-blue-500" /> : <Bookmark className="w-5 h-5 text-gray-600 hover:text-blue-500" />}
            <span>{postData.scrapCount || 0}</span>
          </button>
        </div>
      </div>
      
      <div className="border-t border-gray-200">
        <div className="p-4 space-y-4">
          <h3 className="font-semibold text-gray-900">댓글 {getTotalCommentCount()}개</h3>
          {comments && comments.map((comment) => (
            <CommentItem 
              key={comment.commentId} 
              comment={comment} 
              currentUser={currentUser}
            />
          ))}
        </div>
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                disabled={loading.comment}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                onKeyPress={(e) => e.key === 'Enter' && !loading.comment && handleAddComment()}
              />
              <button onClick={handleAddComment} disabled={loading.comment} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">
                {loading.comment ? '등록중...' : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CommentItem = ({ comment, currentUser }) => {
  const isMyComment = currentUser?.userId === comment.authorId;

  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
        {comment.authorProfileImage ? <img src={comment.authorProfileImage} alt="댓글 작성자 프로필" className="w-full h-full object-cover" /> : <User className="w-4 h-4 text-gray-600" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium text-sm text-gray-900">{comment.authorNickname}</span>
            <span className="text-xs text-gray-500 ml-2">{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
          {!isMyComment && (
            <button className="text-xs text-gray-500 hover:text-red-500">신고</button>
          )}
        </div>
        <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
      </div>
    </div>
  );
};

export default YourPostForm;