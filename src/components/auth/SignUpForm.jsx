// src/components/auth/SignUpForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, checkNickname, checkUsername, sendVerificationEmail, verifyCode } from '../../api/auth';

const SignUpForm = () => {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    userId: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    email: '',
    verificationCode: '',
    university: '',
    nationality: ''
  });

  const [messages, setMessages] = useState({
    userId: '',
    nickname: '',
    password: '',
    confirmPassword: ''
  });

  const [validStatus, setValidStatus] = useState({
    userId: false,
    nickname: false,
    password: false,
    confirmPassword: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력값 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
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
      
      setMessages(prev => ({ ...prev, userId: response.message }));
      setValidStatus(prev => ({ ...prev, userId: response.available }));
      
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
    if (!form.email.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }

    try {
      const response = await sendVerificationEmail(form.email);
      console.log('이메일 전송 응답:', response);
      alert('인증 메일이 전송되었습니다.');
    } catch (err) {
      console.error('이메일 전송 에러:', err);
      alert('이메일 전송에 실패했습니다.');
    }
  };

  // 이메일 인증번호 확인
  const handleVerifyCode = async () => {
    if (!form.verificationCode.trim()) {
      alert('인증번호를 입력해주세요.');
      return;
    }

    try {
      const response = await verifyCode(form.email.trim(), form.verificationCode.trim());
      console.log('인증번호 확인 응답:', response);
      alert('인증에 성공했습니다.');
    } catch (err) {
      console.error('인증 확인 에러:', err);

      if (err.response?.data?.message?.includes('만료')) {
        alert('인증번호가 만료되었습니다.');
      } else if (err.response?.data?.message?.includes('틀')) {
        alert('인증번호가 틀렸습니다.');
      } else {
        alert('인증 중 오류가 발생했습니다.');
      }
    }
  };

  // 최종 회원가입 처리 - 함수명 변경으로 중복 해결
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    
    // 기본 유효성 검사
    if (!form.userId.trim()) {
      alert('아이디를 입력해주세요.');
      return;
    }
    
    if (!form.password.trim()) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    if (!form.nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    
    if (!form.email.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    
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
      console.error('회원가입 에러:', err);
      const errorMessage = err.response?.data?.message || err.message || '회원가입에 실패했습니다.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 비밀번호 일치 확인
  const isPasswordMatching = form.confirmPassword && form.password === form.confirmPassword;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            회원가입
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSignUpSubmit}>
          <div className="space-y-4">
            {/* 아이디 입력 */}
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                아이디 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 mt-1">
                <input
                  id="userId"
                  name="userId"
                  type="text"
                  value={form.userId}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="아이디를 입력하세요"
                />
                <button
                  type="button"
                  onClick={handleIDCheck}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  중복확인
                </button>
              </div>
              {messages.userId && (
                <p className={`mt-1 text-sm ${validStatus.userId ? 'text-green-600' : 'text-red-600'}`}>
                  {messages.userId}
                </p>
              )}
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호 <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                비밀번호 확인 <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="비밀번호를 다시 입력하세요"
              />
              {form.confirmPassword && (
                <p className={`mt-1 text-sm ${isPasswordMatching ? 'text-green-600' : 'text-red-600'}`}>
                  {isPasswordMatching ? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다'}
                </p>
              )}
            </div>

            {/* 닉네임 입력 */}
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                닉네임 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 mt-1">
                <input
                  id="nickname"
                  name="nickname"
                  type="text"
                  value={form.nickname}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="닉네임을 입력하세요"
                />
                <button
                  type="button"
                  onClick={handleNicknameCheck}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  중복확인
                </button>
              </div>
              {messages.nickname && (
                <p className={`mt-1 text-sm ${validStatus.nickname ? 'text-green-600' : 'text-red-600'}`}>
                  {messages.nickname}
                </p>
              )}
            </div>

            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                대학교 이메일 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="university@example.ac.kr"
                />
                <button
                  type="button"
                  onClick={handleSendEmail}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  인증메일
                </button>
              </div>
            </div>

            {/* 인증번호 입력 */}
            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
                인증번호
              </label>
              <div className="flex gap-2 mt-1">
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  value={form.verificationCode}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="인증번호를 입력하세요"
                />
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                >
                  인증확인
                </button>
              </div>
            </div>

            {/* 대학교 입력 */}
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                대학교
              </label>
              <input
                id="university"
                name="university"
                type="text"
                value={form.university}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="대학교명을 입력하세요"
              />
            </div>

            {/* 국적 입력 */}
            <div>
              <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                국적
              </label>
              <input
                id="nationality"
                name="nationality"
                type="text"
                value={form.nationality}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="국적을 입력하세요"
              />
            </div>
          </div>

          {/* 회원가입 버튼 */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '가입 중...' : '회원가입'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;