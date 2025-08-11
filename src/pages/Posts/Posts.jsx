import React, { useState } from 'react';

const Post = () => {
  // 실제 환경에서는 react-router의 useNavigate 사용
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
    // 실제로는 useNavigate()를 사용하여 페이지 이동
  };

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '소속국가'
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInfoPost, setIsInfoPost] = useState(false);

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
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    
    if (!formData.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 토큰 가져오기 (localStorage, sessionStorage, 또는 context에서)
      const token = localStorage.getItem('authToken') || '';
      
      // FormData 생성 (파일 업로드 포함)
      const submitFormData = new FormData();
      submitFormData.append('title', formData.title);
      submitFormData.append('content', formData.content);
      submitFormData.append('category', formData.category);
      submitFormData.append('isInfoPost', isInfoPost);
      
      // 카테고리 배열 처리
      const categories = isInfoPost && formData.category !== '정보게시판' 
        ? [formData.category, '정보게시판'] 
        : [formData.category];
      submitFormData.append('categories', JSON.stringify(categories));
      
      // 파일 첨부
      selectedFiles.forEach((file) => {
        submitFormData.append(`images`, file);
      });

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // FormData 사용시 Content-Type 헤더는 자동으로 설정됨
        },
        body: submitFormData
      });

      if (response.ok) {
        const result = await response.json();
        console.log('글 작성 성공:', result);
        
        const message = isInfoPost && formData.category !== '정보게시판'
          ? `글이 ${formData.category}과 정보게시판에 동시에 작성되었습니다!`
          : '글이 성공적으로 작성되었습니다!';
        
        alert(message);
        navigate('/main');
      } else {
        const error = await response.json();
        throw new Error(error.message || '서버 오류가 발생했습니다.');
      }
      
    } catch (error) {
      console.error('글 작성 실패:', error);
      alert(error.message || '글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (formData.title || formData.content || selectedFiles.length > 0) {
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
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold">
                K
              </div>
            </div>
            <span className="text-xl font-semibold">새 글 작성</span>
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
        <div onSubmit={handleSubmit}>
          <div className="bg-white border-2 border-blue-500 rounded">
            {/* Form Header */}
            <div className="bg-blue-500 text-white py-3 px-5">
              <h1 className="font-bold text-lg text-center">새 글 작성</h1>
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

              {/* File Upload */}
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
                
                {/* 선택된 파일 목록 */}
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
                    {isSubmitting ? '작성 중...' : '글 작성'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 글 작성 가이드 */}
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-4">
          <h3 className="font-medium text-blue-800 mb-2">📝 글 작성 가이드</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 제목은 100자 이내로 작성해주세요</li>
            <li>• 내용은 2000자 이내로 작성해주세요</li>
            <li>• 적절한 게시판을 선택해주세요</li>
            <li>• 이미지는 최대 5MB까지 업로드 가능합니다</li>
            <li>• 욕설이나 부적절한 내용은 삭제될 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Post;