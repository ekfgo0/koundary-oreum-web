// src/api/post.js

import axios from './axiosInstance';

// 게시글 관련 API 함수들
export const postAPI = {
  // 새 글 작성
  createPost: async (boardCode, { title, content, imageUrls = [], isInfoPost = false }) => {
    try {
      const response = await axios.post(`/boards/${boardCode}/posts`, {
        title,
        content,
        isInformation: isInfoPost, 
        imageUrls,
      });
      return response.data;
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      throw new Error(error.response?.data?.message || '게시글 작성에 실패했습니다.');
    }
  },

  // 글 수정
  updatePost: async (boardCode, postId, { title, content, imageUrls = [] }) => {
    try {
      const response = await axios.patch(`/boards/${boardCode}/posts/${postId}`, {
        title,
        content,
        imageUrls,
      });
      return response.data;
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      throw new Error(error.response?.data?.message || '게시글 수정에 실패했습니다.');
    }
  },

  // 게시글 목록 조회
  getPosts: async (boardCode, params = {}) => {
    try {
      const response = await axios.get(`/boards/${boardCode}/posts`, { params });
      return response.data;
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error);
      throw new Error(error.response?.data?.message || '게시글 목록을 불러오는데 실패했습니다.');
    }
  },

  // 특정 게시글 조회
  getPost: async (postId, boardCode = null) => {
    try {
      const url = boardCode ? `/boards/${boardCode}/posts/${postId}` : `/posts/${postId}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('게시글 조회 실패:', error);
      throw new Error(error.response?.data?.message || '게시글을 불러오는데 실패했습니다.');
    }
  },

  // 게시글 삭제
  deletePost: async (postId, boardCode = null) => {
    try {
      const url = boardCode ? `/boards/${boardCode}/posts/${postId}` : `/posts/${postId}`;
      const response = await axios.delete(url);
      return response.data;
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      throw new Error(error.response?.data?.message || '게시글 삭제에 실패했습니다.');
    }
  },


  // 댓글 조회
  getComments: async (postId) => {
    try {
      const url = `/api/posts/${postId}/comments`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('댓글 조회 실패:', error);
      throw new Error(error.response?.data?.message || '댓글을 불러오는데 실패했습니다.');
    }
  },

  // 댓글 작성
  createComment: async (postId, commentData) => {
    try {
      const url = `/api/posts/${postId}/comments`;
      const response = await axios.post(url, {
        content: commentData.content,
      });
      return response.data;
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      throw new Error(error.response?.data?.message || '댓글 작성에 실패했습니다.');
    }
  },

  // 대댓글 작성
  createReply: async (commentId, commentData) => {
    try {
      const url = `/api/comments/${commentId}/replies`;
      const response = await axios.post(url, {
        content: commentData.content,
      });
      return response.data;
    } catch (error) {
      console.error('대댓글 작성 실패:', error);
      throw new Error(error.response?.data?.message || '대댓글 작성에 실패했습니다.');
    }
  },

  // 댓글 수정
  updateComment: async (postId, commentId, commentData) => {
    try {
      const url = `/api/comments/${commentId}`; 
      const response = await axios.patch(url, {
        content: commentData.content
      });
      return response.data;
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      throw new Error(error.response?.data?.message || '댓글 수정에 실패했습니다.');
    }
  },

  // 댓글 삭제
  deleteComment: async (postId, commentId) => {
    try {
      const url = `/api/comments/${commentId}`;
      const response = await axios.delete(url);
      return response.data;
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      throw new Error(error.response?.data?.message || '댓글 삭제에 실패했습니다.');
    }
  },
  // 신고 관련 API
  reportPost: async (postId, reason, boardCode = null) => {
    try {
      const response = await axios.post(`/reports`, { 
        reason: reason,
        post_id: postId,
        boardCode: boardCode
      });
      return response.data;
    } catch (error) {
      console.error('게시글 신고 실패:', error);
      throw new Error(error.response?.data?.message || '신고 처리 중 오류가 발생했습니다.');
    }
  },

  reportComment: async (postId, commentId, reason, boardCode = null) => {
    try {
      const response = await axios.post(`/reports`, { 
        reason: reason,
        comment_id: commentId,
        post_id: postId,
        boardCode: boardCode
      });
      return response.data;
    } catch (error) {
      console.error('댓글 신고 실패:', error);
      throw new Error(error.response?.data?.message || '댓글 신고 처리 중 오류가 발생했습니다.');
    }
  },

  // 스크랩
  toggleScrap: async (postId, boardCode) => {
    try {
      // API 요청 시 body에 boardCode를 포함하여 전송합니다.
      const response = await axios.post(`/posts/${postId}/scrap`, { boardCode });
      return response.data;
    } catch (error) {
      console.error('스크랩 처리 실패:', error);
      throw new Error(error.response?.data?.message || '스크랩 처리에 실패했습니다.');
    }
  },

  // 내가 쓴 글, 댓글 조회
  getMyPosts: async (userId) => {
    try {
      const response = await axios.get(`/user/${postId}/posts,comment_id`);
      return response.data;
    } catch (error) {
      console.error('내 게시글 조회 실패:', error);
      throw new Error(error.response?.data?.message || '내 게시글을 불러오는데 실패했습니다.');
    }
  }
};

export default postAPI;