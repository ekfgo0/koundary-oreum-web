import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from '../../components/common/Header';
import CategoryNavigation from '../../components/common/CategoryNavigation';
import YourPostForm from '../../components/auth/YourPostForm';
import { postAPI } from '../../api/post';

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

const YourPost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const location = useLocation();
  
  const [postData, setPostData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('');
  const [reportModal, setReportModal] = useState({ isOpen: false, type: 'post', targetId: null, loading: false });

  const useMockData = import.meta.env.VITE_USE_MOCK === 'true';

  const getMockData = () => {
    const mockPost = {
      postId: parseInt(postId) || 2,
      userId: 2, // '남'의 ID라고 가정
      title: "캐나다 토론토 대학교 입학 후기 (Mock)",
      content: "이것은 목업 데이터입니다.",
      boardCode: "UNIVERSITY",
      nickname: "토론토학생",
      profileImageUrl: null,
      createdAt: "2024-03-14 10:15",
      scrapCount: 24,
      isMyPost: false,
      isScraped: false
    };
    const mockComments = [];
    return { post: mockPost, comments: mockComments };
  };

  const fetchRealData = async (boardCode) => {
    try {
      const post = await postAPI.getPost(postId, boardCode);
      const commentsData = await postAPI.getComments(postId);
      return { post, comments: commentsData.content || [] };
    } catch (error) {
      console.error('API 호출 실패:', error);
      throw error;
    }
  };

  useEffect(() => {
    const boardCode = location.state?.boardCode;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        let data;
        if (useMockData) {
          data = getMockData();
        } else {
          if (!boardCode) {
            setError('게시글 정보를 불러올 수 없습니다. (boardCode가 없습니다)');
            setLoading(false);
            return;
          }
          data = await fetchRealData(boardCode);
          const myUserId = localStorage.getItem('userId');
          if (myUserId && data.post.userId && String(data.post.userId) === myUserId) {
            navigate(`/mypost/${postId}`, { replace: true, state: { boardCode } });
            return;
          }
        }
        
        // 백엔드에서 받은 isScraped 값을 postData 상태에 올바르게 설정
        setPostData({
            ...data.post,
            isScraped: data.post.isScraped
        });
        setComments(data.comments);
        setCurrentCategory(data.post.boardCode);

      } catch (error) {
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
  }, [postId, useMockData, navigate, location.state]);

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

  const handleToggleScrap = async () => {
    const originalPostData = postData;
    setPostData(prev => {
        if (!prev) return null;
        const isCurrentlyScraped = prev.isScraped;
        const currentScrapCount = prev.scrapCount || 0;
        return {
            ...prev,
            isScraped: !isCurrentlyScraped,
            scrapCount: isCurrentlyScraped ? Math.max(0, currentScrapCount - 1) : currentScrapCount + 1,
        };
    });

    try {
        await postAPI.toggleScrap(postId, postData.boardCode);
    } catch (error) {
        alert(error.message || '스크랩 처리에 실패했습니다.');
        setPostData(originalPostData);
    }
  };

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

  const openReportModal = (type, targetId) => setReportModal({ isOpen: true, type, targetId, loading: false });
  const closeReportModal = () => setReportModal({ isOpen: false, type: 'post', targetId: null, loading: false });
  
  if (loading) {
    return <div className="min-h-screen bg-gray-50"><Header showActions={true} /><div className="p-8 text-center">로딩 중...</div></div>;
  }
  if (error) {
    return <div className="min-h-screen bg-gray-50"><Header showActions={true} /><div className="p-8 text-center text-red-500">오류가 발생했습니다: {error}</div></div>;
  }
  if (!postData) {
    return <div className="min-h-screen bg-gray-50"><Header showActions={true} /><div className="p-8 text-center">게시글을 찾을 수 없습니다.</div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showActions={true} />
      <CategoryNavigation currentCategory={currentCategory} />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <YourPostForm 
          postData={postData}
          setPostData={setPostData}
          comments={comments}
          setComments={setComments}
          onReportPost={() => openReportModal('post', postData.postId)}
          onReportComment={(commentId) => openReportModal('comment', commentId)}
          onToggleScrap={handleToggleScrap}
          onCreateComment={handleCreateComment}
        />
      </div>
      <ReportModal
        isOpen={reportModal.isOpen}
        onClose={closeReportModal}
        onSubmit={handleReport}
        loading={reportModal.loading}
      />
    </div>
  );
};

export default YourPost;