// src/components/auth/PostForm.jsx (기존 PostForm.jsx 수정)
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
  handleSubmit,
  handleCancel
}) => {

  const handleCategoryChange = (category) => {
    setFormData(prev => ({ ...prev, category }));
    if (category === '정보게시판') {
      setIsInfoPost(false);
    }
  };

  // 마우스를 올렸을 때 배경색과 글씨를 바꾸는 함수
  const handleButtonHover = (e) => {
    e.target.style.backgroundColor = '#2e8ada';
    e.target.style.color = '#fff';
  };

  // 마우스를 뗐을 때 배경색과 글씨를 바꾸는 함수
  const handleButtonLeave = (e) => {
    e.target.style.backgroundColor = 'transparent';
    e.target.style.color = '#2e8ada';
  };

  // 닉네임 중복확인 처리
  // 1. 빈 값 체크
  // 2. API 호출 (checkNickname)
  // 3. 성공/실패에 따른 메시지 처리
  // 4. alert 표시
  const handleNicknameCheck = async () => {
    if (!form.nickname.trim()) {
      setMessages(prev => ({ ...prev, nickname: '닉네임을 입력해주세요.' }));
      setValidStatus(prev => ({ ...prev, nickname: false }));
      return;
    }

   try {
    const response = await checkNickname(form.nickname);
    console.log('닉네임 확인 응답:', response);

    setMessages(prev => ({ ...prev, nickname: response.message }));
    setValidStatus(prev => ({ ...prev, nickname: response.available }));

    alert(response.message);
  } catch (err) {
    console.error('닉네임 확인 에러:', err);
    const errorMessage = err.message || '닉네임 확인 중 오류가 발생했습니다.';
    setMessages(prev => ({ ...prev, nickname: errorMessage }));
    setValidStatus(prev => ({ ...prev, nickname: false }));
    alert(errorMessage);
  }
};

  // 아이디 중복 확인 처리
  const handleIDCheck = async () => {
    if (!form.userId.trim()) {
      setMessages(prev => ({ ...prev, userId: '아이디를 입력해주세요.' }));
      setValidStatus(prev => ({ ...prev, userId: false }));
      return;
    }

    try {
      const response = await checkUsername(form.userId);
      console.log('아이디 확인 응답:', response);
      
      // 백엔드 응답 메시지 표시
      setMessages(prev => ({ ...prev, userId: response.message }));
      setValidStatus(prev => ({ ...prev, userId: response.available }));
      
      // alert도 함께 표시
      alert(response.message);
    } catch (err) {
      console.error('아이디 확인 에러:', err);
      const errorMessage = err.message || '아이디 확인 중 오류가 발생했습니다.';
      setMessages(prev => ({ ...prev, userId: errorMessage }));
      setValidStatus(prev => ({ ...prev, userId: false }));
      alert(errorMessage);
    }
  };

  // 이메일 인증 메일 전송
  const handleSendEmail = async () => {
    try {
      const response = await sendVerificationEmail(form.email);
      console.log('이메일 전송 응답:', response);
      alert('인증 메일이 전송되었습니다.');
    } catch (err) {
      console.error(err);
      alert('이메일 전송에 실패했습니다.');
    }
  };

  // 이메일 인증번호 확인
  const handleVerifyCode = async () => {
    try {

      const response = await verifyCode(form.email.trim(), form.verificationCode.trim());
      console.log('인증번호 확인 응답:', response);
      alert('인증에 성공했습니다.');
    } catch (err) {
      console.error(err);

      if (err.response?.data?.message?.includes('만료')) {
        alert('인증번호가 만료되었습니다.');
      } else if (err.response?.data?.message?.includes('틀')) {
        alert('인증번호가 틀렸습니다.');
      } else {
        alert('인증 중 오류가 발생했습니다.');
      }
    }
  };

  // 최종 회원가입 처리 - 백엔드에서 모든 검증을 처리
  const handleSubmit = async e => {
    e.preventDefault();
    
    // 백엔드가 기대하는 형태로 데이터 변환
    const signupData = {
      loginId: form.userId,
      password: form.password,
      confirmPassword: form.confirmPassword,
      nickname: form.nickname,
      universityEmail: form.email,
      university: form.university,
      nationality: form.nationality
    };
    
    try {
      const response = await signUp(signupData);
      console.log('회원가입 응답:', response);
      alert('회원가입이 완료되었습니다!');
      navigate('/login');
    } catch (err) {
      console.error(err);

      // 백엔드에서 보내는 구체적인 에러 메시지를 표시
      const errorMessage = err.response?.data?.message || err.message || '회원가입에 실패했습니다.';
      alert(errorMessage);
    }
  };

  // 비밀번호와 비밀번호 확인이 일치하는지 확인하는 계산된 값
  // 비밀번호 확인 필드에 값이 있고, 두 비밀번호가 일치할 때 true
  const isMatching = form.confirmPassword && form.password === form.confirmPassword;

  return (
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
  );
};

export default PostForm;