// src/api/post.js
import axios from './axiosInstance';

// 게시글 관련 API 함수들
export const postAPI = {
  // 새 글 작성 (수정된 API 명세에 맞게)
  createPost: async (boardCode, { title, content, imageUrls = [] }) => {
    try {
      console.log('전송할 데이터:', { boardCode, title, content, imageUrls });

      // 백엔드 새 명세: POST /boards/{boardCode}/posts
      const response = await axios.post(`/boards/${boardCode}/posts`, {
        title,
        content,
        imageUrls, // 서버 DTO가 images면 images로 변경
      });
      
      return response.data;
      
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      console.error('에러 응답:', error.response?.data);
      
      // 500 오류인 경우 (서버 내부 오류)
      if (error.response?.status === 500) {
        throw new Error('서버 내부 오류가 발생했습니다.');
      }
      
      // 401 오류인 경우 (인증 실패)
      if (error.response?.status === 401) {
        throw new Error('사용자 인증이 필요합니다. 다시 로그인해주세요.');
      }
      
      // 404 오류인 경우
      if (error.response?.status === 404) {
        throw new Error('해당 게시판을 찾을 수 없습니다.');
      }
      
      throw new Error(error.response?.data?.message || error.message || '게시글 작성에 실패했습니다.');
    }
  },

  // 글 수정 (새 API 구조 추정)
  updatePost: async (boardCode, postId, { title, content, imageUrls = [] }) => {
    try {
      // PUT /boards/{boardCode}/posts/{postId} 형태로 추정
      const response = await axios.put(`/boards/${boardCode}/posts/${postId}`, {
        title,
        content,
        imageUrls,
      });

      return response.data;
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      
      if (error.response?.status === 404) {
        throw new Error('수정할 게시글을 찾을 수 없습니다.');
      }
      
      throw new Error(error.response?.data?.message || '게시글 수정에 실패했습니다.');
    }
  },

  // 게시글 목록 조회 (새 API 구조 추정)
  getPosts: async (boardCode, params = {}) => {
    try {
      // GET /boards/{boardCode}/posts
      const response = await axios.get(`/boards/${boardCode}/posts`, { params });
      return response.data;
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error);
      throw new Error(error.response?.data?.message || '게시글 목록을 불러오는데 실패했습니다.');
    }
  },

  // 특정 게시글 조회 (새 API 구조 추정)
  getPost: async (boardCode, postId) => {
    try {
      // GET /boards/{boardCode}/posts/{postId}
      const response = await axios.get(`/boards/${boardCode}/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('게시글 조회 실패:', error);
      throw new Error(error.response?.data?.message || '게시글을 불러오는데 실패했습니다.');
    }
  },

  // 게시글 삭제 (새 API 구조 추정)
  deletePost: async (boardCode, postId) => {
    try {
      // DELETE /boards/{boardCode}/posts/{postId}
      const response = await axios.delete(`/boards/${boardCode}/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      throw new Error(error.response?.data?.message || '게시글 삭제에 실패했습니다.');
    }
  },

  // 댓글 관련 API (새 API 구조 추정)
  getComments: async (boardCode, postId) => {
    try {
      // GET /boards/{boardCode}/posts/{postId}/comments
      const response = await axios.get(`/boards/${boardCode}/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      console.error('댓글 조회 실패:', error);
      throw new Error(error.response?.data?.message || '댓글을 불러오는데 실패했습니다.');
    }
  },

  createComment: async (boardCode, postId, commentData) => {
    try {
      // POST /boards/{boardCode}/posts/{postId}/comments
      const response = await axios.post(`/boards/${boardCode}/posts/${postId}/comments`, {
        content: commentData.content,
        parent_comment_id: commentData.parent_comment_id || null
      });
      return response.data;
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      throw new Error(error.response?.data?.message || '댓글 작성에 실패했습니다.');
    }
  },

  updateComment: async (boardCode, postId, commentId, commentData) => {
    try {
      // PUT /boards/{boardCode}/posts/{postId}/comments/{commentId}
      const response = await axios.put(`/boards/${boardCode}/posts/${postId}/comments/${commentId}`, {
        content: commentData.content
      });
      return response.data;
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      throw new Error(error.response?.data?.message || '댓글 수정에 실패했습니다.');
    }
  },

  deleteComment: async (boardCode, postId, commentId) => {
    try {
      // DELETE /boards/{boardCode}/posts/{postId}/comments/{commentId}
      const response = await axios.delete(`/boards/${boardCode}/posts/${postId}/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      throw new Error(error.response?.data?.message || '댓글 삭제에 실패했습니다.');
    }
  },

  // 신고 관련 API (기존 구조 유지 - 백엔드 확인 필요)
  reportPost: async (boardCode, postId, reason) => {
    try {
      // POST /report 또는 POST /boards/{boardCode}/posts/{postId}/report
      const response = await axios.post('/report', { 
        reason: reason,
        post_id: postId,
        board_code: boardCode // 추가 정보
      });
      return response.data;
    } catch (error) {
      console.error('게시글 신고 실패:', error);
      throw new Error(error.response?.data?.message || '신고 처리 중 오류가 발생했습니다.');
    }
  },

  reportComment: async (boardCode, postId, commentId, reason) => {
    try {
      // POST /report
      const response = await axios.post('/report', { 
        reason: reason,
        comment_id: commentId,
        post_id: postId,
        board_code: boardCode
      });
      return response.data;
    } catch (error) {
      console.error('댓글 신고 실패:', error);
      throw new Error(error.response?.data?.message || '댓글 신고 처리 중 오류가 발생했습니다.');
    }
  },

  // 스크랩 관련 API (기존 구조 유지 - 백엔드 확인 필요)
  toggleScrap: async (boardCode, postId) => {
    try {
      // POST /scrap
      const response = await axios.post('/scrap', {
        post_id: postId,
        board_code: boardCode
      });
      return response.data;
    } catch (error) {
      console.error('스크랩 처리 실패:', error);
      throw new Error(error.response?.data?.message || '스크랩 처리에 실패했습니다.');
    }
  },

  // 내가 쓴 글, 댓글 조회 (기존 구조 유지 - 백엔드 확인 필요)
  getMyPosts: async (userId) => {
    try {
      // GET /user/{userId}/posts,comment_id
      const response = await axios.get(`/user/${userId}/posts,comment_id`);
      return response.data;
    } catch (error) {
      console.error('내 게시글 조회 실패:', error);
      throw new Error(error.response?.data?.message || '내 게시글을 불러오는데 실패했습니다.');
    }
  }
};

// 기본 export
export default postAPI;