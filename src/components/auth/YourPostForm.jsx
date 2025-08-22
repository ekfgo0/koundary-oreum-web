// src/components/auth/YourPostForm.jsx

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Bookmark, User, Send, Flag } from 'lucide-react';

// 댓글 수정을 위한 인라인 폼 컴포넌트
const CommentEditForm = ({ comment, onSave, onCancel }) => {
  const [editText, setEditText] = useState(comment.content);
  const textareaRef = useRef(null);
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.focus();
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);
  const handleSave = () => {
    if (editText.trim()) {
      onSave(comment.commentId, { content: editText.trim() });
    }
  };
  const handleTextChange = (e) => {
    setEditText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };
  return (
    <div className="mt-2 flex items-start gap-2">
      <textarea ref={textareaRef} value={editText} onChange={handleTextChange} className="flex-1 p-2 border border-gray-300 rounded-lg text-sm resize-none" rows="1" />
      <div className="flex gap-2">
        <button onClick={handleSave} className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg">저장</button>
        <button onClick={onCancel} className="px-3 py-1.5 bg-white border border-gray-300 text-xs rounded-lg">취소</button>
      </div>
    </div>
  );
};

// 답글 작성을 위한 인라인 폼 컴포넌트
const ReplyForm = ({ parentComment, onCreateReply, onCancel }) => {
  const [replyText, setReplyText] = useState(`@${parentComment.authorNickname} `);
  const textareaRef = useRef(null);
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.focus();
      textarea.selectionStart = textarea.value.length;
      textarea.selectionEnd = textarea.value.length;
    }
  }, []);
  const handleSubmitReply = () => {
    if (replyText.trim()) {
      onCreateReply({ content: replyText, parentId: parentComment.commentId });
    }
  };
  return (
    <div className="mt-3">
      <textarea ref={textareaRef} value={replyText} onChange={(e) => setReplyText(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-y min-h-[60px]" rows="2" />
      <div className="flex justify-end gap-2 mt-2">
        <button onClick={handleSubmitReply} className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded-lg">답글 등록</button>
        <button onClick={onCancel} className="px-4 py-1.5 bg-white border border-gray-300 text-sm rounded-lg">취소</button>
      </div>
    </div>
  );
};

// 댓글 아이템 컴포넌트
const CommentItem = ({ comment, currentUser, onUpdate, onDelete, onReportComment, onCreateReply, nestingLevel = 0 }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const isMyComment = currentUser?.userId === comment.authorId;
  const isDeletedByServer = comment.content === '(삭제된 댓글입니다)';
  const hasReplies = comment.replies && comment.replies.length > 0;

  if (isDeletedByServer && !hasReplies) {
    return null;
  }
  
  const handleUpdate = (commentId, data) => { onUpdate(commentId, data); setIsEditing(false); };
  const handleCreateReply = (replyData) => { onCreateReply(replyData); setIsReplying(false); };

  return (
    <div className={`flex flex-col ${nestingLevel > 0 ? 'ml-10 mt-3 space-y-3 border-l-2 pl-4' : ''}`}>
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden">
          {!isDeletedByServer && (comment.authorProfileImage ? <img src={comment.authorProfileImage} alt="프로필" className="w-full h-full object-cover" /> : <User className="w-4 h-4 text-gray-600" />)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className={`font-medium text-sm ${isDeletedByServer ? 'text-gray-500' : 'text-gray-900'}`}>
                {isDeletedByServer ? '삭제된 작성자' : comment.authorNickname}
              </span>
              <span className="text-xs text-gray-500 ml-2">{new Date(comment.createdAt).toLocaleString()}</span>
            </div>
            
            {isMyComment && !isDeletedByServer ? (
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <button onClick={() => setIsEditing(true)} className="hover:text-blue-500">수정</button>
                <button onClick={() => onDelete(comment.commentId)} className="hover:text-red-500">삭제</button>
              </div>
            ) : (
              !isDeletedByServer && <button onClick={() => onReportComment(comment.commentId)} className="text-xs text-gray-500 hover:text-red-500">신고</button>
            )}
          </div>

          {isEditing && !isDeletedByServer ? (
            <CommentEditForm comment={comment} onSave={handleUpdate} onCancel={() => setIsEditing(false)} />
          ) : (
            <>
              <p className={`text-gray-700 text-sm mt-1 whitespace-pre-line ${isDeletedByServer ? 'italic text-gray-500' : ''}`}>
                {comment.content}
              </p>
              {nestingLevel === 0 && !isDeletedByServer && (
                <button onClick={() => setIsReplying(true)} className="text-xs text-gray-500 mt-2 hover:text-blue-500">답글달기</button>
              )}
            </>
          )}
          {isReplying && <ReplyForm parentComment={comment} onCreateReply={handleCreateReply} onCancel={() => setIsReplying(false)} />}
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        comment.replies.map(reply => (
          <CommentItem key={reply.commentId} comment={reply} currentUser={currentUser} onUpdate={onUpdate} onDelete={onDelete} onReportComment={onReportComment} onCreateReply={onCreateReply} nestingLevel={nestingLevel + 1} />
        ))
      )}
    </div>
  );
};


const YourPostForm = ({ 
  postData, 
  setPostData, 
  comments, 
  setComments, 
  onReportPost,
  onReportComment,
  onToggleScrap,
  onCreateComment,
  onUpdateComment,
  onDeleteComment
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
  
  const handleAddTopLevelComment = async () => {
    if (!newComment.trim() || loading.comment) return;
    setLoading({ comment: true });
    try {
      await onCreateComment({ content: newComment, parentId: null });
      setNewComment('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading({ comment: false });
    }
  };

  const getTotalCommentCount = (comments) => {
    if (!Array.isArray(comments)) return 0;
    let count = 0;
    for (const comment of comments) {
      if (comment.content !== '(삭제된 댓글입니다)') {
        count++;
      }
      if (comment.replies) {
        count += getTotalCommentCount(comment.replies);
      }
    }
    return count;
  };

  const totalCommentCount = getTotalCommentCount(comments);

  // 스크랩 여부에 따라 아이콘 스타일을 결정하는 변수
  const scrapIconClass = postData.isScraped
    ? "w-5 h-5 text-yellow-500 fill-yellow-500" // 스크랩된 경우
    : "w-5 h-5 text-gray-600 hover:text-yellow-500"; // 스크랩되지 않은 경우

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
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
            <span>{totalCommentCount}</span>
          </div>
          <button onClick={onToggleScrap} className="flex items-center gap-2">
            <Bookmark className={scrapIconClass} />
            <span>{postData.scrapCount || 0}</span>
          </button>
        </div>
      </div>
      
      <div className="border-t border-gray-200">
        <div className="p-4 space-y-4">
          <h3 className="font-semibold text-gray-900">댓글 {totalCommentCount}개</h3>
          {comments && comments.map((comment) => (
            <CommentItem 
              key={comment.commentId} 
              comment={comment} 
              currentUser={currentUser}
              onUpdate={onUpdateComment}
              onDelete={onDeleteComment}
              onReportComment={onReportComment}
              onCreateReply={onCreateComment}
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
                onKeyPress={(e) => e.key === 'Enter' && !loading.comment && handleAddTopLevelComment()}
              />
              <button onClick={handleAddTopLevelComment} disabled={loading.comment} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">
                {loading.comment ? '등록중...' : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourPostForm;