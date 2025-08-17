// src/pages/Posts/Post.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import koundaryLogo from '../../components/common/Koundarylogo.png';
import { postAPI } from '../../api/post'; // 새로 만든 API import

// API 기본 URL 설정 - 실제 백엔드 서버 주소로 수정
const API_BASE_URL = 'http://192.168.174.75:8080';

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
  // const [selectedFiles, setSelectedFiles] = useState([]); // 이미지 업로드 준비될 때까지 주석처리
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInfoPost, setIsInfoPost] = useState(false);
  const [error, setError] = useState(null);

  // 수정 모드일 때 기존 데이터로 폼 초기화
  useEffect(() => {
    if (isEditMode && editData) {
      setFormData({
        title: editData.title,
        content: editData.content,
        category: editData.category
      });
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

  // 이미지 업로드 관련 함수들 - 백엔드 준비될 때까지 주석처리
  /*
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // 파일 크기 검증 (5MB)
    const maxSize = 5 * 1024 * 1024;
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`${file.name}은 5MB를 초과합니다.`);
        return false;
      }
      return true;
    });
    
    setSelectedFiles(validFiles);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  */

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

      // 실제 API 호출 (백엔드 준비 완료 후)
      const boardCode = getCategoryBoardCode(formData.category);

      console.log('API 호출 데이터:', {
        boardCode,
        title: formData.title,
        content: formData.content,
        imageUrls: [] // 현재는 빈 배열
      });

      // 새로운 API 구조에 맞게 호출
      const postData = {
        title: formData.title,
        content: formData.content,
        imageUrls: [] // 이미지 업로드 준비될 때까지 빈 배열
      };

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
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // if (formData.title || formData.content || selectedFiles.length > 0) { // 이미지 체크 제거
    if (formData.title || formData.content) {
      if (window.confirm('작성 중인 내용이 있습니다. 정말 취소하시겠습니까?')) {
        navigate('/main');
      }
    } else {
      navigate('/main');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b py-4">
        <div className="max-w-screen-lg mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div onClick={() => navigate('/main')} className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
              <img 
                src={koundaryLogo} 
                alt="Koundary Logo" 
                className="h-8 object-contain"
                onError={(e) => {
                  console.error('이미지 로드 실패:', e.target.src);
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div 
                className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold" 
                style={{ display: 'none' }}
              >
                K
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition-all">
              내 프로필
            </button>
            <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition-all">
              로그아웃
            </button>
          </div>
        </div>
      </header>

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

            {/* File Upload - 백엔드 이미지 업로드 준비될 때까지 주석처리 */}
            {/*
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
              />
              <div className="text-sm text-gray-500 mt-1">
                이미지 파일만 업로드 가능 (JPG, PNG, GIF 등, 최대 5MB)
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-gray-700">선택된 파일:</p>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            */}
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
                  disabled={isSubmitting}
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (isEditMode ? '수정 중...' : '작성 중...') : (isEditMode ? '글 수정' : '글 작성')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mock 모드 활성화 알림 */}
        <div className="bg-green-50 border border-green-200 rounded p-4 mt-4">
          <h3 className="font-medium text-green-800 mb-2">✅ Mock 모드 활성화</h3>
          <div className="text-sm text-green-700 space-y-1">
            <p>• 백엔드 인증 문제 해결 전까지 임시로 Mock 모드로 동작합니다</p>
            <p>• 글 작성 폼과 유효성 검사는 정상 작동합니다</p>
            <p>• 실제 데이터 저장은 되지 않지만 UI 테스트가 가능합니다</p>
            <p>• 백엔드 준비 완료 시 <code className="bg-green-100 px-1 rounded">USE_MOCK_MODE = false</code>로 변경</p>
          </div>
        </div>

        {/* 백엔드 해결해야 할 문제들 */}
        <div className="bg-orange-50 border border-orange-200 rounded p-4 mt-4">
          <h3 className="font-medium text-orange-800 mb-2">🔧 백엔드에서 해결해야 할 문제들</h3>
          <div className="text-sm text-orange-700 space-y-1">
            <p><strong>1. 사용자 인증 문제:</strong></p>
            <p className="ml-4">• CustomUserDetails.getUserId()에서 null 반환</p>
            <p className="ml-4">• 사용자 정보가 제대로 로드되지 않음</p>
            <p><strong>2. 임시 해결책:</strong></p>
            <p className="ml-4">• 테스트용 사용자 생성: test_user_001</p>
            <p className="ml-4">• 또는 인증 체크 임시 비활성화</p>
            <p><strong>3. 파일 업로드:</strong></p>
            <p className="ml-4">• multipart/form-data 지원 추가</p>
          </div>
        </div>

        {/* 글 작성 가이드 */}
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-4">
          <h3 className="font-medium text-blue-800 mb-2">📝 글 작성 가이드</h3>
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