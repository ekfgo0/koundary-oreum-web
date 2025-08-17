import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { postAPI } from '../../api/post';
import axiosInstance from '../../api/axiosInstance'; // 이미지 업로드용
import Header from '../../components/common/Header';

// 카테고리를 boardCode로 변환하는 함수
const getCategoryBoardCode = (categoryName) => {
  const categoryMap = {
    '소속국가': 'country',
    '소속학교': 'school',
    '자유게시판': 'free',
    '정보게시판': 'info',
    '중고거래 게시판': 'trade',
    '모임게시판': 'meeting'
  };
  return categoryMap[categoryName] || 'free';
};

const Post = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // 수정 모드 확인
  const editPostId = searchParams.get('edit');
  const isEditMode = Boolean(editPostId);
  const editData = location.state?.postData;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '소속국가'
  });
  
  const [selectedFiles, setSelectedFiles] = useState([]); // 선택된 파일들
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]); // 업로드된 이미지 URL들
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInfoPost, setIsInfoPost] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false); // 이미지 업로드 상태

  // 수정 모드일 때 기존 데이터로 폼 초기화
  useEffect(() => {
    if (isEditMode && editData) {
      setFormData({
        title: editData.title,
        content: editData.content,
        category: editData.category
      });
      // 기존 이미지 URL들도 설정
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 에러 메시지 초기화
    if (error) setError(null);
  };

  // 이미지 파일 선택 처리
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // 파일 크기 및 타입 검증
    const maxSize = 5 * 1024 * 1024; // 5MB
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

  // 선택된 파일 제거
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 업로드된 이미지 URL 제거
  const removeUploadedImage = (index) => {
    setUploadedImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  // 이미지 업로드 함수
  const uploadImages = async () => {
    if (selectedFiles.length === 0) return [];

    setUploadingImages(true);
    const uploadedUrls = [];

    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('image', file); // 백엔드에서 받는 필드명에 맞게 조정

        try {
          const response = await axiosInstance.post('/upload/image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          // 백엔드 응답에서 이미지 URL 추출
          const imageUrl = response.data.imageUrl || response.data.url || response.data.data?.url;
          if (imageUrl) {
            uploadedUrls.push(imageUrl);
          }
        } catch (uploadError) {
          console.error(`이미지 업로드 실패 (${file.name}):`, uploadError);
          alert(`${file.name} 업로드에 실패했습니다.`);
        }
      }

      return uploadedUrls;
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // 유효성 검사
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
      // 임시: Mock 모드 활성화 (백엔드 인증 문제 해결 전까지)
      const USE_MOCK_MODE = true; // 백엔드 준비되면 false로 변경

      if (USE_MOCK_MODE) {
        // Mock 모드: 실제 API 호출 없이 성공 시뮬레이션
        console.log('Mock 모드 - 글 작성 시뮬레이션');
        console.log('Mock 이미지 URL들:', uploadedImageUrls);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
        
        const message = isEditMode 
          ? 'Mock: 글이 성공적으로 수정되었습니다!'
          : isInfoPost && formData.category !== '정보게시판'
            ? `Mock: 글이 ${formData.category}과 정보게시판에 동시에 작성되었습니다!`
            : 'Mock: 글이 성공적으로 작성되었습니다!';
        
        alert(message);
        navigate('/main');
        return;
      }

      // 1. 새로 선택된 파일들을 업로드
      const newImageUrls = await uploadImages();
      
      // 2. 기존 업로드된 URL들과 새로운 URL들을 합침
      const allImageUrls = [...uploadedImageUrls, ...newImageUrls];

      // 3. 게시글 데이터 준비
      const boardCode = getCategoryBoardCode(formData.category);
      const postData = {
        title: formData.title,
        content: formData.content,
        imageUrls: allImageUrls, // URL 배열로 전송
        isInfoPost: isInfoPost && formData.category !== '정보게시판' // 정보글 여부
      };

      console.log('API 호출 데이터:', {
        boardCode,
        postData
      });

      // 4. 게시글 작성/수정 API 호출
      let result;
      if (isEditMode) {
        result = await postAPI.updatePost(boardCode, editPostId, postData);
        console.log('글 수정 성공:', result);
      } else {
        result = await postAPI.createPost(boardCode, postData);
        console.log('글 작성 성공:', result);
      }
      
      const message = isEditMode 
        ? '글이 성공적으로 수정되었습니다!'
        : isInfoPost && formData.category !== '정보게시판'
          ? `글이 ${formData.category}과 정보게시판에 동시에 작성되었습니다!`
          : '글이 성공적으로 작성되었습니다!';
      
      alert(message);
      
      if (isEditMode) {
        navigate(`/mypost/${editPostId}`);
      } else {
        navigate('/main');
      }
      
    } catch (error) {
      console.error(isEditMode ? '글 수정 실패:' : '글 작성 실패:', error);
      setError(error.message || '글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (formData.title || formData.content || selectedFiles.length > 0 || uploadedImageUrls.length > 0) {
      if (window.confirm('작성 중인 내용이 있습니다. 정말 취소하시겠습니까?')) {
        navigate('/main');
      }
    } else {
      navigate('/main');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={isEditMode ? "글 수정" : "새 글 작성"} showActions={true} onlyLogout={false} />

      {/* Post Writing Form */}
      <div className="max-w-6xl mx-auto px-5 mt-5">
        {/* 에러 메시지 표시 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white border-2 border-blue-500 rounded">
          {/* Form Header */}
          <div className="bg-blue-500 text-white py-3 px-5">
            <h1 className="font-bold text-lg text-center">
              {isEditMode ? '글 수정' : '새 글 작성'}
            </h1>
          </div>
          
          {/* Form Body */}
          <div className="p-6 space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                게시판 선택
              </label>
              <div className="flex">
                {categories.map((category, index) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, category }));
                      if (category === '정보게시판') {
                        setIsInfoPost(false);
                      }
                    }}
                    className={`flex-1 py-3 px-4 text-sm transition-all rounded-none border border-blue-500 relative ${
                      index !== 0 ? '-ml-px' : ''
                    } ${
                      formData.category === category
                        ? 'bg-blue-500 text-white z-10'
                        : 'bg-white text-blue-500 hover:bg-blue-50 z-0'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="제목을 입력하세요"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                maxLength="100"
                required
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {formData.title.length}/100
              </div>
            </div>

            {/* Content Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="내용을 입력하세요"
                rows="15"
                className="w-full p-3 border border-gray-300 rounded resize-none focus:outline-none focus:border-blue-500"
                maxLength="2000"
                required
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {formData.content.length}/2000
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지 첨부 (선택사항)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                disabled={uploadingImages || isSubmitting}
              />
              <div className="text-sm text-gray-500 mt-1">
                이미지 파일만 업로드 가능 (JPG, PNG, GIF 등, 최대 5MB)
              </div>
              
              {/* 업로드된 이미지 URL들 표시 */}
              {uploadedImageUrls.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-gray-700">업로드된 이미지:</p>
                  {uploadedImageUrls.map((url, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                      <div className="flex items-center gap-3">
                        <img 
                          src={url} 
                          alt={`업로드된 이미지 ${index + 1}`}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs" style={{ display: 'none' }}>
                          이미지
                        </div>
                        <span className="text-sm text-gray-600 truncate max-w-xs">{url}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeUploadedImage(index)}
                        className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded"
                        disabled={isSubmitting}
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 선택된 파일들 표시 */}
              {selectedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-gray-700">선택된 파일 (업로드 대기 중):</p>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                          미리보기
                        </div>
                        <span className="text-sm text-gray-600">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)}MB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded"
                        disabled={uploadingImages || isSubmitting}
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {uploadingImages && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-600">이미지 업로드 중...</p>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex justify-between items-center">
              {/* 정보글 체크박스 */}
              {formData.category !== '정보게시판' && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="infoPost"
                    checked={isInfoPost}
                    onChange={(e) => setIsInfoPost(e.target.checked)}
                    className="w-4 h-4"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="infoPost" className="text-sm text-gray-700">
                    정보글 (선택한 게시판과 정보게시판에 동시 게시)
                  </label>
                </div>
              )}
              
              <div className="flex gap-3 ml-auto">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-all"
                  disabled={isSubmitting || uploadingImages}
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || uploadingImages}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingImages ? '이미지 업로드 중...' : 
                   isSubmitting ? (isEditMode ? '수정 중...' : '작성 중...') : 
                   (isEditMode ? '글 수정' : '글 작성')}
                </button>
              </div>
            </div>
          </div>
        </div>

                {/* 글 작성 가이드 */}
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-4">
          <h3 className="font-medium text-blue-800 mb-2">글 작성 가이드</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 제목은 100자 이내로 작성해주세요</li>
            <li>• 내용은 2000자 이내로 작성해주세요</li>
            <li>• 적절한 게시판을 선택해주세요</li>
            <li>• 현재 텍스트만 작성 가능합니다 (이미지 업로드 준비 중)</li>
            <li>• 욕설이나 부적절한 내용은 삭제될 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Post;