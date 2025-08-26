import axios from './axiosInstance';

// 게시글 관련 API 함수들
export const postAPI = {
  // 새 글 작성 (수정됨)
  createPost: async (boardCode, postData, files = []) => {
    try {
      const formData = new FormData();

      // 1. JSON 데이터를 'data' 파트에 Blob으로 추가
      const jsonBlob = new Blob([JSON.stringify(postData)], { type: 'application/json' });
      formData.append('data', jsonBlob);

      // 2. 이미지 파일들을 'images' 파트에 추가
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await axios.post(`/boards/${boardCode}/posts`, formData, {
        headers: {
          // 중요: multipart/form-data 헤더는 axios가 FormData 객체를 보고 자동으로 설정하므로,
          // 수동으로 설정하지 않습니다.
        },
      });
      return response.data;
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      throw new Error(error.response?.data?.message || '게시글 작성에 실패했습니다.');
    }
  },

  // 글 수정 (수정됨)
  updatePost: async (boardCode, postId, postData, newFiles = []) => {
    try {
      const formData = new FormData();
      
      const jsonBlob = new Blob([JSON.stringify(postData)], { type: 'application/json' });
      formData.append('data', jsonBlob);

      newFiles.forEach(file => {
        formData.append('images', file);
      });

      // 게시글 수정은 PATCH 또는 PUT을 사용할 수 있습니다. 백엔드와 확인이 필요하지만,
      // 일반적으로 수정을 위해 PATCH를 많이 사용합니다.
      const response = await axios.patch(`/boards/${boardCode}/posts/${postId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
  reportPost: async (postId, reason) => {
    try {
      const response = await axios.post(`/reports`, { 
        postId: postId,
        reason: reason,
      });
      return response.data;
    } catch (error) {
      console.error('게시글 신고 실패:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('인증 정보가 유효하지 않습니다. 다시 로그인해주세요.');
      }
      throw new Error(error.response?.data?.message || '신고 처리 중 오류가 발생했습니다.');
    }
  },


  // 스크랩
  toggleScrap: async (postId) => {
    try {
      const response = await axios.post(`/posts/${postId}/scrap`, {});
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