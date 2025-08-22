import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/common/Header';
import CategoryNavigation from '../../components/common/CategoryNavigation';
import MyPostForm from '../../components/auth/MyPostForm';
import YourPostForm from '../../components/auth/YourPostForm';
import { postAPI } from '../../api/post';

const PostDetail = () => {
  const navigate = useNavigate();
  const { category, postId } = useParams();

  const [postData, setPostData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMyPost, setIsMyPost] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 게시글 정보와 댓글 목록을 각각 서버에서 불러옵니다.
        const post = await postAPI.getPost(postId, category);
        const commentsData = await postAPI.getComments(postId);
        
        const myUserId = localStorage.getItem('userId');
        const postIsMine = myUserId && post.userId && String(post.userId) === myUserId;
        
        setIsMyPost(postIsMine);
        
        // 게시글 데이터와 댓글 데이터를 각각 상태에 저장합니다.
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
  
  // 댓글 생성 핸들러 (대댓글 포함)
  const handleCreateComment = async (commentData) => {
    try {
      let newComment;
      if (commentData.parentId) {
        newComment = await postAPI.createReply(commentData.parentId, { content: commentData.content });
        // 상태 업데이트 로직 (대댓글)
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

  // 댓글 수정 핸들러
  const handleUpdateComment = async (commentId, commentData) => {
    try {
      const updatedComment = await postAPI.updateComment(commentId, commentData);
      // 상태 업데이트 로직 (대댓글 포함)
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

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (commentId) => {
    if (window.confirm('정말 댓글을 삭제하시겠습니까?')) {
      try {
        await postAPI.deleteComment(commentId);
        // 상태 업데이트 로직 (대댓글 포함)
        const remove = (comments) => {
          return comments.filter(c => c.commentId !== commentId).map(c => {
            if (c.replies) return { ...c, replies: remove(c.replies) };
            return c;
          });
        };
        setComments(prev => remove(prev));
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
          />
        )}
      </div>
    </div>
  );
};

export default PostDetail;