// src/components/auth/MyPostForm.jsx

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Bookmark, User, Send, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { postAPI } from '../../api/post';

const getFullImageUrl = (path) => {
  // path가 유효하지 않으면 빈 문자열을 반환합니다.
  if (!path) return ""; 

  // 이미지가 미리보기(blob)이거나 완전한 URL 형태이면 그대로 사용합니다.
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
    return path;
  }

  // .env 파일에 설정된 API 서버의 기본 URL을 가져옵니다.
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) {
    console.error("오류: .env 파일에 VITE_API_BASE_URL이 설정되지 않았습니다.");
    return path; 
  }

  // 서버 URL과 이미지 상대 경로를 합쳐 완전한 URL을 생성
  const fullUrl = `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  console.log('생성된 최종 이미지 URL:', fullUrl); // 콘솔에서 URL을 확인하기 위한 로그
  return fullUrl;
};

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
const CommentItem = ({ comment, currentUser, onUpdate, onDelete, onCreateReply, nestingLevel = 0 }) => {
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
            {isMyComment && !isEditing && !isDeletedByServer && (
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <button onClick={() => setIsEditing(true)} className="hover:text-blue-500">수정</button>
                <button onClick={() => onDelete(comment.commentId)} className="hover:text-red-500">삭제</button>
              </div>
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
          <CommentItem key={reply.commentId} comment={reply} currentUser={currentUser} onUpdate={onUpdate} onDelete={onDelete} onCreateReply={onCreateReply} nestingLevel={nestingLevel + 1} />
        ))
      )}
    </div>
  );
};

const MyPostForm = ({ postData, comments, setComments, onUpdateComment, onDeleteComment, onCreateComment }) => {
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    setCurrentUser(userInfo);
  }, []);

  const handleEditPost = () => {
    navigate(`/posts/${postData.boardCode}?edit=${postData.postId}`, { state: { postData } });
  };
  const handleDeletePost = async () => {
    if (window.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      try {
        await postAPI.deletePost(postData.postId, postData.boardCode);
        alert('글이 삭제되었습니다.');
        navigate(`/boards/${postData.boardCode}/posts`);
      } catch (error) {
        alert(error.message || '글 삭제에 실패했습니다.');
      }
    }
  };
  const handleAddTopLevelComment = async () => {
    if (!newComment.trim()) return;
    try {
      await onCreateComment({ content: newComment });
      setNewComment('');
    } catch (error) {
      alert(error.message || '댓글 작성에 실패했습니다.');
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

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
               {postData.profileImageUrl ? (<img src={postData.profileImageUrl} alt="프로필" className="w-full h-full object-cover" />) : (<User className="w-6 h-6 text-white" />)}
             </div>
             <div>
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
        <div className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">{postData.content}</div>

        {postData.imageUrls && postData.imageUrls.length > 0 && (
          <div className="my-6 space-y-4">
            {postData.imageUrls.map((url, index) => (
              <img
                key={index}
                src={getFullImageUrl(url)}
                alt={`첨부 이미지 ${index + 1}`}
                className="max-w-full h-auto rounded-lg border"
              />
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-6 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <MessageCircle className="w-5 h-5" />
            <span>{totalCommentCount}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 cursor-not-allowed">
            <Bookmark className="w-5 h-5" />
            <span>{postData.scrapCount || 0}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="p-4 space-y-4">
          <h3 className="font-semibold text-gray-900">댓글 {totalCommentCount}개</h3>
          {comments && comments.map((comment) => (
            <CommentItem key={comment.commentId} comment={comment} currentUser={currentUser} onUpdate={onUpdateComment} onDelete={onDeleteComment} onCreateReply={onCreateComment} />
          ))}
        </div>
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-3">
             <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="댓글을 입력하세요..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" onKeyPress={(e) => e.key === 'Enter' && handleAddTopLevelComment()} />
             <button onClick={handleAddTopLevelComment} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
               <Send className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPostForm;