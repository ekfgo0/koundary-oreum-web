import React from 'react';

const PostForm = ({
  formData,
  setFormData,
  categories,
  selectedFiles,
  isSubmitting,
  isInfoPost,
  setIsInfoPost,
  handleInputChange,
  handleFileChange,
  removeFile,
  handleSubmit,  // 이름 원래대로
  handleCancel,
  isEditMode
}) => {

  const handleCategoryChange = (category) => {
    setFormData(prev => ({ ...prev, category }));
    if (category === '정보게시판') {
      setIsInfoPost(false);
    }
  };

  return (
    <div className="bg-white border-2 border-blue-500 rounded">
      {/* Form Header */}
      <div className="bg-blue-500 text-white py-3 px-5">
        <h1 className="font-bold text-lg text-center">{isEditMode ? '글 수정' : '새 글 작성'}</h1>
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
                onClick={() => handleCategoryChange(category)}
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
              onClick={handleSubmit}  // 원래 이름으로
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (isEditMode ? '수정 중...' : '작성 중...') : (isEditMode ? '글 수정' : '글 작성')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostForm;