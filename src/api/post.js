// src/api/post.js
import axios from './axiosInstance'; // 기존 axios 인스턴스 사용

// 백엔드 개발자와 확인된 실제 API 엔드포인트에 맞게 수정

// 게시글 관련 API 함수들
export const postAPI = {
  // 새 글 작성
  createPost: async (postData) => {
    try {
      const formData = new FormData();
      
      // 백엔드 명세에 맞는 필드명 사용
      formData.append('title', postData.title);
      formData.append('content', postData.content);
      formData.append('user_id', postData.user_id || localStorage.getItem('user_id'));
      formData.append('board_id', postData.board_id || 1); // 카테고리에 따른 board_id 매핑 필요
      formData.append('language_id', postData.language_id || 1); // 기본값 설정
      
      // 이미지 파일들 추가
      if (postData.files && postData.files.length > 0) {
        postData.files.forEach((file) => {
          formData.append('images[]', file);
        });
      }

      // 백엔드 명세에 따른 엔드포인트: POST /posts
      const response = await axios.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      
      // 404 오류인 경우 더 구체적인 메시지
      if (error.response?.status === 404) {
        throw new Error('API 엔드포인트가 존재하지 않습니다. 백엔드 개발자에게 API 경로를 확인해주세요.');
      }
      
      throw new Error(error.response?.data?.message || '게시글 작성에 실패했습니다.');
    }
  },

  // 글 수정 (백엔드 명세에 없음 - 확인 필요)
  updatePost: async (postId, postData) => {
    try {
      const formData = new FormData();
      
      // 기본 데이터 추가
      formData.append('title', postData.title);
      formData.append('content', postData.content);
      formData.append('user_id', postData.user_id || localStorage.getItem('user_id'));
      formData.append('board_id', postData.board_id || 1);
      formData.append('language_id', postData.language_id || 1);
      
      // 새 이미지 파일들 추가
      if (postData.files && postData.files.length > 0) {
        postData.files.forEach((file) => {
          formData.append('images[]', file);
        });
      }

      // PUT 요청 (백엔드에서 지원하는지 확인 필요)
      const response = await axios.put(`/posts/${postId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      
      if (error.response?.status === 404) {
        throw new Error('수정할 게시글을 찾을 수 없거나 API 엔드포인트가 존재하지 않습니다.');
      }
      
      throw new Error(error.response?.data?.message || '게시글 수정에 실패했습니다.');
    }
  },

  // 게시글 목록 조회
  getPosts: async (params = {}) => {
    try {
      // 백엔드 명세: GET /posts?post_id=...
      const response = await axios.get('/posts', { params });
      return response.data;
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error);
      throw new Error(error.response?.data?.message || '게시글 목록을 불러오는데 실패했습니다.');
    }
  },

  // 특정 게시글 조회
  getPost: async (postId) => {
    try {
      // 백엔드 명세: GET /posts?post_id={postId}
      const response = await axios.get('/posts', { 
        params: { post_id: postId } 
      });
      return response.data;
    } catch (error) {
      console.error('게시글 조회 실패:', error);
      throw new Error(error.response?.data?.message || '게시글을 불러오는데 실패했습니다.');
    }
  },

  // 게시글 삭제 (백엔드 명세에 없음 - 확인 필요)
  deletePost: async (postId) => {
    try {
      const response = await axios.delete(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      throw new Error(error.response?.data?.message || '게시글 삭제에 실패했습니다.');
    }
  },

  // 댓글 관련 API
  getComments: async (postId) => {
    try {
      // 백엔드 명세: POST /posts/post_id/comments (GET이 아닌 POST로 되어있음)
      // 실제로는 GET일 가능성이 높으므로 백엔드 개발자와 확인 필요
      const response = await axios.get(`/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      console.error('댓글 조회 실패:', error);
      throw new Error(error.response?.data?.message || '댓글을 불러오는데 실패했습니다.');
    }
  },

  createComment: async (postId, commentData) => {
    try {
      // 백엔드 명세: POST /posts/post_id/comments
      const response = await axios.post(`/posts/${postId}/comments`, {
        user_id: commentData.user_id || localStorage.getItem('user_id'),
        content: commentData.content,
        parent_comment_id: commentData.parent_comment_id || null
      });
      return response.data;
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      throw new Error(error.response?.data?.message || '댓글 작성에 실패했습니다.');
    }
  },

  updateComment: async (postId, commentId, commentData) => {
    try {
      // 백엔드 명세에 없음 - 확인 필요
      const response = await axios.put(`/posts/${postId}/comments/${commentId}`, {
        content: commentData.content
      });
      return response.data;
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      throw new Error(error.response?.data?.message || '댓글 수정에 실패했습니다.');
    }
  },

  deleteComment: async (postId, commentId) => {
    try {
      // 백엔드 명세에 없음 - 확인 필요
      const response = await axios.delete(`/posts/${postId}/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      throw new Error(error.response?.data?.message || '댓글 삭제에 실패했습니다.');
    }
  },

  // 신고 관련 API
  reportPost: async (postId, reason) => {
    try {
      // 백엔드 명세: POST /report
      const response = await axios.post('/report', { 
        user_id: localStorage.getItem('user_id'),
        reason: reason,
        post_id: postId // post/comment_id 필드
      });
      return response.data;
    } catch (error) {
      console.error('게시글 신고 실패:', error);
      throw new Error(error.response?.data?.message || '신고 처리 중 오류가 발생했습니다.');
    }
  },

  reportComment: async (postId, commentId, reason) => {
    try {
      // 백엔드 명세: POST /report
      const response = await axios.post('/report', { 
        user_id: localStorage.getItem('user_id'),
        reason: reason,
        comment_id: commentId // post/comment_id 필드
      });
      return response.data;
    } catch (error) {
      console.error('댓글 신고 실패:', error);
      throw new Error(error.response?.data?.message || '댓글 신고 처리 중 오류가 발생했습니다.');
    }
  },

  // 스크랩 관련 API
  toggleScrap: async (postId) => {
    try {
      // 백엔드 명세: POST /scrap
      const response = await axios.post('/scrap', {
        user_id: localStorage.getItem('user_id'),
        post_id: postId
      });
      return response.data;
    } catch (error) {
      console.error('스크랩 처리 실패:', error);
      throw new Error(error.response?.data?.message || '스크랩 처리에 실패했습니다.');
    }
  },

  // 내가 쓴 글, 댓글 조회
  getMyPosts: async (userId) => {
    try {
      // 백엔드 명세: GET /user/user_id/posts,comment_id
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