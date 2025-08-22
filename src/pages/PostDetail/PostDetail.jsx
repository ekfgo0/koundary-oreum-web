// src/pages/PostDetail/PostDetail.jsx (수정 후 전체 코드)

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
          />
        )}
      </div>
    </div>
  );
};

export default PostDetail;