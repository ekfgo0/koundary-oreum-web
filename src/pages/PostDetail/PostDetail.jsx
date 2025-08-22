// src/pages/PostDetail/PostDetail.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/common/Header';
import CategoryNavigation from '../../components/common/CategoryNavigation';
import MyPostForm from '../../components/auth/MyPostForm';
import YourPostForm from '../../components/auth/YourPostForm';
import { postAPI } from '../../api/post';

// 신고 모달 컴포넌트 추가
const ReportModal = ({ isOpen, onClose, onSubmit, loading = false }) => {
  const [reportReason, setReportReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reportReason.trim()) {
      alert('신고 사유를 입력해주세요.');
      return;
    }
    onSubmit(reportReason.trim());
    setReportReason('');
  };

  useEffect(() => { if (!isOpen) setReportReason(''); }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">게시글 신고</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md resize-none"
            rows="4"
            placeholder="신고 사유를 자세히 입력해주세요."
            maxLength="500"
            disabled={loading}
          />
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 border rounded">취소</button>
            <button type="submit" disabled={loading || !reportReason.trim()} className="px-4 py-2 bg-red-500 text-white rounded">
              {loading ? '신고 중...' : '신고하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PostDetail = () => {
  const navigate = useNavigate();
  const { category, postId } = useParams();

  const [postData, setPostData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMyPost, setIsMyPost] = useState(false);

  // 신고 모달 상태 추가
  const [reportModal, setReportModal] = useState({ isOpen: false, type: 'post', targetId: null, loading: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const post = await postAPI.getPost(postId, category);
        const commentsData = await postAPI.getComments(postId);
        
        const myUserId = localStorage.getItem('userId');
        const postIsMine = myUserId && post.userId && String(post.userId) === myUserId;
        
        setIsMyPost(postIsMine);
        setPostData({ ...post, isMyPost: postIsMine, boardCode: category });

        setComments(commentsData.content || []);

      } catch (err) {
        console.error('게시글 상세 조회 실패:', err);
        setError('게시글을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (postId && category) {
      fetchData();
    }
  }, [postId, category, navigate]);
  
  // 스크랩 핸들러 추가
  const handleToggleScrap = async () => {
    try {
      const result = await postAPI.toggleScrap(postId);
      setPostData(prev => ({
        ...prev,
        isScraped: result.isScraped,
        scrapCount: result.scrapCount
      }));
    } catch (error) {
      alert(error.message || '스크랩 처리에 실패했습니다.');
    }
  };

  // 신고 핸들러 추가
  const handleReport = async (reason) => {
    try {
      setReportModal(prev => ({ ...prev, loading: true }));
      const { type, targetId } = reportModal;
      if (type === 'post') {
        await postAPI.reportPost(targetId, reason);
      } else {
        await postAPI.reportComment(postId, targetId, reason);
      }
      alert('신고가 접수되었습니다.');
    } catch (error) {
      alert(error.message || '신고 처리 중 오류가 발생했습니다.');
    } finally {
      closeReportModal();
    }
  };

  // 모달 제어 함수 추가
  const openReportModal = (type, targetId) => setReportModal({ isOpen: true, type, targetId, loading: false });
  const closeReportModal = () => setReportModal({ isOpen: false, type: 'post', targetId: null, loading: false });

  const handleCreateComment = async (commentData) => {
    try {
      let newComment;
      if (commentData.parentId) {
        newComment = await postAPI.createReply(commentData.parentId, { content: commentData.content });
        const addReply = (comments, parentId, reply) => {
          return comments.map(comment => {
            if (comment.commentId === parentId) {
              return { ...comment, replies: [...(comment.replies || []), reply] };
            }
            if (comment.replies) {
              return { ...comment, replies: addReply(comment.replies, parentId, reply) };
            }
            return comment;
          });
        };
        setComments(prev => addReply(prev, commentData.parentId, newComment));
      } else {
        newComment = await postAPI.createComment(postId, { content: commentData.content });
        setComments(prev => [...prev, newComment]);
      }
    } catch (error) {
      alert(error.message || '댓글 작성에 실패했습니다.');
    }
  };

  const handleUpdateComment = async (commentId, commentData) => {
    try {
      const updatedComment = await postAPI.updateComment(postId, commentId, commentData);
      const update = (comments) => {
        return comments.map(comment => {
          if (comment.commentId === commentId) return updatedComment;
          if (comment.replies) return { ...comment, replies: update(comment.replies) };
          return comment;
        });
      };
      setComments(prev => update(prev));
    } catch (error) {
      alert(error.message || '댓글 수정에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('정말 댓글을 삭제하시겠습니까?')) {
      try {
        await postAPI.deleteComment(postId, commentId);
        const commentsData = await postAPI.getComments(postId);
        setComments(commentsData.content || []);
      } catch (error) {
        alert(error.message || '댓글 삭제에 실패했습니다.');
      }
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!postData) return <div>게시글이 없습니다.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showActions={true} />
      <CategoryNavigation currentCategory={category} />
      <div className="max-w-4xl mx-auto px-4 py-6">
        {isMyPost ? (
          <MyPostForm
            postData={postData}
            comments={comments}
            setComments={setComments}
            onCreateComment={handleCreateComment}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
          />
        ) : (
          <YourPostForm
            postData={postData}
            setPostData={setPostData}
            comments={comments}
            setComments={setComments}
            onReportPost={() => openReportModal('post', postData.postId)}
            onReportComment={(commentId) => openReportModal('comment', commentId)}
            onToggleScrap={handleToggleScrap}
            onCreateComment={handleCreateComment}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
          />
        )}
      </div>
      {/* ReportModal 렌더링 추가 */}
      <ReportModal
        isOpen={reportModal.isOpen}
        onClose={closeReportModal}
        onSubmit={handleReport}
        loading={reportModal.loading}
      />
    </div>
  );
};

export default PostDetail;