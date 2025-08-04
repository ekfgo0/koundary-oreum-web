import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  checkNickname,
  checkUsername,
  sendVerificationEmail,
  verifyCode,
  signUp
} from '../../api/auth';

const labelStyle = {
  display: 'block',
  marginBottom: '4px',
  fontSize: '14px',
  color: '#333',
};

// 각 입력 필드를 감싸는 컨테이너의 하단 여백
const fieldWrapper = {
  marginBottom: '1.5rem',
};

// 입력 필드와 버튼이 한 줄에 배치되는 행의 스타일 (닉네임, 아이디, 이메일, 인증번호)
const rowStyle = {
  display: 'flex',
  alignItems: 'flex-end',
  gap: '10px',
  marginBottom: '1.5rem',
};

// 선택 박스 요소들의 스타일 (국적, 소속대학)
const selectStyle = {
  width: '100%',
  height: '40px',
  backgroundColor: '#f0f0f0',
  border: 'none',
  padding: '0 10px',
};

// 모든 입력 필드의 공통 스타일
const inputStyle = {
  width: '100%',
  height: '40px',
  backgroundColor: '#f0f0f0',
  border: 'none',
  padding: '0 10px',
  flexShrink: 0,
};

// 중복확인, 전송, 확인 버튼의 기본 스타일
const buttonStyle = {
  width: '100px',
  height: '40px',
  padding: '8px 12px',
  border: '1px solid #2e8ada',
  color: '#2e8ada',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  flexShrink: 0,
};

// 회원가입 버튼의 스타일
const SignUpButtonStyle = {
  width: '100%',
  height: '40px',
  backgroundColor: '#2e8ada',
  color: '#fff',
  cursor: 'pointer',
};

// 입력 필드를 감싸는 컨테이너 (버튼과 함께 배치될 때 사용)
const inputContainerStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
};

// 응답 메시지 스타일
const messageStyle = {
  fontSize: '12px',
  marginTop: '4px',
  minHeight: '16px',
};

// 모든 폼 입력값을 저장하는 상태 객체
const SignUpForm = () => {
  const [form, setForm] = useState({
    nationality: '',
    university: '',
    nickname: '',
    userId: '',
    password: '',
    confirmPassword: '',
    email: '',
    verificationCode: '',
  });

  // 중복확인 결과 메세지를 저장하는 상태 객체
  const [messages, setMessages] = useState({
    nickname: '',
    userId: '',
  });

  // 중복확인 성공 여부를 저장하는 상태 객체
  const [validStatus, setValidStatus] = useState({
    nickname: false,
    userId: false,
  });

  // React Router의 페이지 이동 함수 (회원가입 완료 후 로그인 페이지로 이동)
  const navigate = useNavigate();
  
  // 모든 입력 필드의 값 변경을 처리하는 공통 함수
  // 매개변수: e - 이벤트 객체
  // 동작: 입력값 업데이트 + 닉네임/아이디 필드 변경 시 검증 상태 초기화
  // (이 함수가 없으면 한 번 닉네임, 아이디를 입력하고 나면 그 다음부턴 계속 중복된 정보라고 뜰 것임)
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // 입력값이 변경되면 해당 필드의 메시지와 상태 초기화
    if (name === 'nickname') {
      setMessages(prev => ({ ...prev, nickname: '' }));
      setValidStatus(prev => ({ ...prev, nickname: false }));
    } else if (name === 'userId') {
      setMessages(prev => ({ ...prev, userId: '' }));
      setValidStatus(prev => ({ ...prev, userId: false }));
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
        const response = await axios.post(
          'http://localhost:8080/users/check-nickname',
          { nickname }, // JSON body
          {
            headers: {
              'Content-Type': 'application/json' // 꼭 지정!
            }
          }
    );
    alert(res.data.available ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.');
    console.log(response.data); // true or false + message
  } catch (err) {
    console.error(err.response?.data || err.message);
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
      const res = await verifyCode(form.email.trim(), form.verificationCode.trim());
      alert('인증에 성공했습니다.');
    } catch (err) {
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
    <form onSubmit={handleSubmit}>
      {/* 국적 */}
      <div style={fieldWrapper}>
        <label htmlFor="nationality" style={labelStyle}>국적 선택</label>
        <select
          name="nationality"
          id="nationality"
          value={form.nationality}
          onChange={handleChange}
          style={selectStyle}
        >
          <option value="">선택하세요</option>
          <option value="대한민국">대한민국</option>
          <option value="미국">미국</option>
          <option value="영국">영국</option>
          <option value="캐나다">캐나다</option>
        </select>
      </div>

      {/* 소속대학 */}
      <div style={fieldWrapper}>
        <label htmlFor="university" style={labelStyle}>소속대학 선택</label>
        <select
          name="university"
          id="university"
          value={form.university}
          onChange={handleChange}
          style={selectStyle}
        >
          <option value="">선택하세요</option>
          <option value="홍익대학교">홍익대학교</option>
          <option value="연세대학교">연세대학교</option>
          <option value="서강대학교">서강대학교</option>
          <option value="이화여자대학교">이화여자대학교</option>
        </select>
      </div>

      {/* 닉네임 + 버튼 */}
      <div style={rowStyle}>
        <div style={inputContainerStyle}>
          <label htmlFor="nickname" style={labelStyle}>닉네임</label>
          <input
            type="text"
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <button 
          type="button" 
          style={buttonStyle} 
          onClick={handleNicknameCheck}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
        >
          중복확인
        </button>
      </div>

      {/* 아이디 + 버튼 */}
      <div style={rowStyle}>
        <div style={inputContainerStyle}>
          <label htmlFor="userId" style={labelStyle}>아이디</label>
          <input
            type="text"
            name="userId"
            value={form.userId}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <button 
          type="button" 
          style={buttonStyle} 
          onClick={handleIDCheck}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
        >
          중복확인
        </button>
      </div>

      {/* 비밀번호 */}
      <div style={fieldWrapper}>
        <label htmlFor="password" style={labelStyle}>비밀번호</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      {/* 비밀번호 확인 */}
      <div style={fieldWrapper}>
        <label htmlFor="confirmPassword" style={labelStyle}>비밀번호 확인</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            style={inputStyle}
          />
          <span
            style={{
              minWidth: '200px',
              color: isMatching ? '#2e8ada' : 'red',
              fontSize: isMatching ? '14px' : '12px',
            }}
          >
            {form.confirmPassword
              ? isMatching
                ? '사용가능!'
                : '비밀번호가 서로 일치하지 않습니다.'
              : ''}
          </span>
        </div>
      </div>

      {/* 이메일 + 전송 */}
      <div style={rowStyle}>
        <div style={inputContainerStyle}>
          <label htmlFor="email" style={labelStyle}>본인대학 이메일</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <button 
          type="button" 
          style={buttonStyle} 
          onClick={handleSendEmail}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
        >
          전송
        </button>
      </div>

      {/* 인증번호 + 확인 */}
      <div style={rowStyle}>
        <div style={inputContainerStyle}>
          <label htmlFor="verificationCode" style={labelStyle}>인증번호</label>
          <input
            type="text"
            name="verificationCode"
            value={form.verificationCode}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <button 
          type="button" 
          style={buttonStyle} 
          onClick={handleVerifyCode}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
        >
          확인
        </button>
      </div>

      {/* 회원가입 버튼 */}
      <div style={{ marginTop: '2rem' }}>
        <button
          type="submit"
          style={SignUpButtonStyle}
          onMouseEnter={ e => {
            e.target.style.backgroundColor = "#086cc3";
          }}
          onMouseLeave={ e => {
            e.target.style.backgroundColor = "#2e8ada";
          }}
        >
          회원가입
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;