import React, { useState, useEffect } from 'react';
import { MessageCircle, Bookmark, User, Reply, Send, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { postAPI } from '../../api/post'; // postAPI 임포트

const MyPostForm = ({ postData, comments, setComments, onCreateComment, onUpdateComment, onDeleteComment }) => {
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // 로컬 스토리지에서 현재 사용자 정보를 가져와요.
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setCurrentUser(userInfo);
    }
  }, []);

  // 글 수정 버튼 클릭 시 동작
  const handleEditPost = () => {
    navigate(`/posts/${postData.boardCode}?edit=${postData.postId}`, {
      state: { postData }
    });
  };

  // 글 삭제 버튼 클릭 시 동작
  const handleDeletePost = async () => {
    if (window.confirm('정말로 이 글을 삭제하시겠습니까? 삭제된 글은 복구할 수 없습니다.')) {
      try {
        await postAPI.deletePost(postData.postId, postData.boardCode);
        alert('글이 성공적으로 삭제되었습니다.');
        navigate(`/boards/${postData.boardCode}/posts`); // 삭제 후 목록으로 이동
      } catch (error) {
        alert(error.message || '글 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    onCreateComment({ content: newComment });
    setNewComment('');
  };

  // 전체 댓글 수 계산
  const getTotalCommentCount = () => {
    if (!comments) return 0;
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
                  className="w-12 h-12 rounded-full object-cover"
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
          
          {postData.isMyPost && (
            <div className="flex items-center gap-2">
              <button onClick={handleEditPost} className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">
                <Edit className="w-4 h-4" /> 수정
              </button>
              <button onClick={handleDeletePost} className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
                <Trash2 className="w-4 h-4" /> 삭제
              </button>
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">{postData.title}</h1>

        <div className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
          {postData.content}
        </div>

        <div className="flex items-center gap-6 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <MessageCircle className="w-5 h-5" />
            <span>{getTotalCommentCount()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 cursor-not-allowed">
            <Bookmark className="w-5 h-5" />
            <span>{postData.scrapCount || 0}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4">댓글 {getTotalCommentCount()}개</h3>
          {comments && comments.map((comment) => (
            <CommentItem 
              key={comment.commentId} 
              comment={comment} 
              currentUser={currentUser}
              onUpdate={onUpdateComment}
              onDelete={onDeleteComment}
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
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <button onClick={handleAddComment} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 댓글 하나를 담당하는 컴포넌트
const CommentItem = ({ comment, currentUser, onUpdate, onDelete }) => {
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
          {isMyComment && (
            <div className="flex gap-2">
              <button onClick={() => onUpdate(comment.commentId, { content: prompt('수정할 내용을 입력하세요', comment.content) })} className="text-xs text-gray-500 hover:text-blue-500">수정</button>
              <button onClick={() => onDelete(comment.commentId)} className="text-xs text-gray-500 hover:text-red-500">삭제</button>
            </div>
          )}
        </div>
        <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
        {/* 대댓글 기능은 추후 확장 가능 */}
      </div>
    </div>
  );
};

export default MyPostForm;