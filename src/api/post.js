import axios from './axiosInstance';

// 게시글 관련 API 함수들
export const postAPI = {
  // 새 글 작성
  createPost: async (boardCode, { title, content, imageUrls = [] }) => {
    try {
      console.log('전송할 데이터:', { boardCode, title, content, imageUrls });

      const response = await axios.post(`/boards/${boardCode}/posts`, {
        title,
        content,
        imageUrls,
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

  // 글 수정
  updatePost: async (boardCode, postId, { title, content, imageUrls = [] }) => {
    try {
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
  getComments: async (postId, boardCode = null) => {
    try {
      // boardCode가 있으면 새 API 구조, 없으면 기존 구조 사용
      const url = boardCode 
        ? `/boards/${boardCode}/posts/${postId}/comments` 
        : `/posts/${postId}/comments`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('댓글 조회 실패:', error);
      throw new Error(error.response?.data?.message || '댓글을 불러오는데 실패했습니다.');
    }
  },

  // 댓글 작성 (boardCode 선택적 처리)
  createComment: async (postId, commentData, boardCode = null) => {
    try {
      // boardCode가 있으면 새 API 구조, 없으면 기존 구조 사용
      const url = boardCode 
        ? `/boards/${boardCode}/posts/${postId}/comments`
        : `/posts/${postId}/comments`;
      const response = await axios.post(url, {
        content: commentData.content,
        parent_comment_id: commentData.parent_comment_id || null
      });
      return response.data;
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      throw new Error(error.response?.data?.message || '댓글 작성에 실패했습니다.');
    }
  },

  // 댓글 수정 (boardCode 선택적 처리)
  updateComment: async (postId, commentId, commentData, boardCode = null) => {
    try {
      // boardCode가 있으면 새 API 구조, 없으면 기존 구조 사용
      const url = boardCode 
        ? `/boards/${boardCode}/posts/${postId}/comments/${commentId}`
        : `/posts/${postId}/comments/${commentId}`;
      const response = await axios.put(url, {
        content: commentData.content
      });
      return response.data;
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      throw new Error(error.response?.data?.message || '댓글 수정에 실패했습니다.');
    }
  },

  // 댓글 삭제 (boardCode 선택적 처리)
  deleteComment: async (postId, commentId, boardCode = null) => {
    try {
      // boardCode가 있으면 새 API 구조, 없으면 기존 구조 사용
      const url = boardCode 
        ? `/boards/${boardCode}/posts/${postId}/comments/${commentId}`
        : `/posts/${postId}/comments/${commentId}`;
      const response = await axios.delete(url);
      return response.data;
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      throw new Error(error.response?.data?.message || '댓글 삭제에 실패했습니다.');
    }
  },

  // 신고 관련 API (기존 구조 유지 - 백엔드 확인 필요)
  reportPost: async (postId, reason, boardCode = null) => {
    try {
      // POST /report 또는 POST /boards/{boardCode}/posts/{postId}/report
      const response = await axios.post('/report', { 
        reason: reason,
        post_id: postId,
        boardCode: boardCode // 추가 정보
      });
      return response.data;
    } catch (error) {
      console.error('게시글 신고 실패:', error);
      throw new Error(error.response?.data?.message || '신고 처리 중 오류가 발생했습니다.');
    }
  },

  reportComment: async (postId, commentId, reason, boardCode = null) => {
    try {
      // POST /report
      const response = await axios.post('/report', { 
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

  // 스크랩 관련 API (기존 구조 유지 - 백엔드 확인 필요)
  toggleScrap: async (postId, boardCode = null) => {
    try {
      // POST /scrap
      const response = await axios.post('/scrap', {
        post_id: postId,
        boardCode: boardCode
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

export default postAPI;