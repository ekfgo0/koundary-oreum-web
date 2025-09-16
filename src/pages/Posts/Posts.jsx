// src/pages/Posts/Posts.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams, useParams } from 'react-router-dom';
import { postAPI } from '../../api/post';
import Header from '../../components/common/Header';
import PostForm from '../../components/auth/PostForm';

const CATEGORY_MAP_FRONTEND = {
  'NATIONALITY': '소속국가',
  'UNIVERSITY': '소속학교',
  'FREE': '자유게시판',
  'INFORMATION': '정보게시판',
  'TRADE': '중고거래 게시판',
  'MEETING': '모임게시판',
};

// 한글 카테고리명을 백엔드 코드로 변환
const getCategoryBoardCode = (categoryName) => {
  const categoryMap = {
    '소속국가': 'NATIONALITY',
    '소속학교': 'UNIVERSITY',
    '자유게시판': 'FREE',
    '정보게시판': 'INFORMATION',
    '중고거래 게시판': 'TRADE',
    '모임게시판': 'MEETING'
  };
  return categoryMap[categoryName];
};

const Post = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { category: urlCategory } = useParams();

  const [searchParams] = useSearchParams();
  
  const editPostId = searchParams.get('edit');
  const isEditMode = Boolean(editPostId);
  const editData = location.state?.postData;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: CATEGORY_MAP_FRONTEND[urlCategory] || '자유게시판'
  });
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInfoPost, setIsInfoPost] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode && editData) {
      setFormData({
        title: editData.title,
        content: editData.content,
        category: CATEGORY_MAP_FRONTEND[editData.boardCode] || '자유게시판'
      });
      if (editData.imageUrls && editData.imageUrls.length > 0) {
        setUploadedImageUrls(editData.imageUrls);
      }
    }
  }, [isEditMode, editData]);

  const categories = [
    '소속국가',
    '소속학교', 
    '자유게시판',
    '정보게시판',
    '중고거래 게시판',
    '모임게시판'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024;
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name}은 이미지 파일이 아닙니다.`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`${file.name}은 5MB를 초과합니다.`);
        return false;
      }
      return true;
    });
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    
    if (!formData.content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const board_code = getCategoryBoardCode(formData.category);

      const postDataPayload = {
        title: formData.title,
        content: formData.content,
        isInformation: isInfoPost && formData.category !== '정보게시판',
        imageUrls: isEditMode ? uploadedImageUrls : [],
      };

      let result;
      if (isEditMode) {
        result = await postAPI.updatePost(board_code, editPostId, postDataPayload, selectedFiles);
      } else {
        result = await postAPI.createPost(board_code, postDataPayload, selectedFiles);
      }
      
      const message = isEditMode 
        ? '글이 성공적으로 수정되었습니다!'
        : isInfoPost && formData.category !== '정보게시판'
          ? `글이 ${formData.category}, 정보게시판에 동시 게시되었습니다!`
          : '글이 성공적으로 작성되었습니다!';
      
      alert(message);
      
      if (isEditMode) {
        navigate(`/boards/${board_code}/posts/${editPostId}`);
      } else {
        navigate(`/boards/${board_code}/posts`, { state: { refresh: true } });
      }
      
    } catch (error) {
      console.error(isEditMode ? '글 수정 실패:' : '글 작성 실패:', error);
      setError(error.message || '글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (formData.title || formData.content || selectedFiles.length > 0) {
      if (window.confirm('작성 중인 내용이 있습니다. 정말 취소하시겠습니까?')) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={isEditMode ? "글 수정" : "새 글 작성"} showActions={true} onlyLogout={false} />

      <div className="max-w-6xl mx-auto px-5 mt-5">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <PostForm
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          selectedFiles={selectedFiles}
          isSubmitting={isSubmitting}
          isInfoPost={isInfoPost}
          setIsInfoPost={setIsInfoPost}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
          removeFile={removeFile}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          isEditMode={isEditMode}
        />

        <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-4">
          <h3 className="font-medium text-blue-800 mb-2">글 작성 가이드</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 제목은 100자 이내로 작성해주세요</li>
            <li>• 내용은 2000자 이내로 작성해주세요</li>
            <li>• 적절한 게시판을 선택해주세요</li>
            <li>• 욕설이나 부적절한 내용은 삭제될 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Post;