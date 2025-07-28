import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  checkNickname,
  checkUsername,
  sendVerificationEmail,
  verifyCode,
  signUp,
  getUniversities
} from '../../api/auth';

const labelStyle = {
  display: 'block',
  marginBottom: '4px',
  fontSize: '14px',
  color: '#333',
};

const fieldWrapper = {
  marginBottom: '1.5rem',
};

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '1.5rem',
};

const inputStyle = {
  width: '100%',
  height: '40px',
  backgroundColor: '#f0f0f0',
  border: 'none',
  padding: '0 10px',
};

const selectStyle = {
  width: '100%',
  height: '40px',
  backgroundColor: '#f0f0f0',
  border: 'none',
  padding: '0 10px',
};

const buttonStyle = {
  width: '100px',
  height: '40px',
  padding: '8px 12px',
  border: '1px solid #2e8ada',
  color: '#2e8ada',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
};

const SignUpButtonStyle = {
  width: '100%',
  height: '40px',
  backgroundColor: '#2e8ada',
  color: '#fff',
  cursor: 'pointer',
};

const SignUpForm = () => {
  const [form, setForm] = useState({
    country: '',
    university: '',
    nickname: '',
    ID: '',
    password: '',
    confirmPassword: '',
    email: '',
    verificationCode: '',
  });

  const [universityList, setUniversityList] = useState([]);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  const [isIDAvailable, setIsIDAvailable] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getUniversities()
      .then(res => setUniversityList(res.data))
      .catch(err => {
        console.error(err);
        setUniversityList([]);
      });
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // 입력 시 해당 검증 플래그 초기화
    if (name === 'nickname') setIsNicknameAvailable(false);
    if (name === 'ID') setIsIDAvailable(false);
    if (name === 'verificationCode') setIsEmailVerified(false);
  };

  const handleNicknameCheck = async () => {
    try {
      const res = await checkNickname(form.nickname);
      if (res.data.available) {
        setIsNicknameAvailable(true);
        alert('사용 가능한 닉네임입니다.');
      } else {
        setIsNicknameAvailable(false);
        alert('이미 사용 중인 닉네임입니다.');
      }
    } catch (err) {
      console.error(err);
      alert('닉네임 확인 중 오류가 발생했습니다.');
    }
  };

  const handleIDCheck = async () => {
    try {
      const res = await checkUsername(form.ID);
      if (res.data.available) {
        setIsIDAvailable(true);
        alert('사용 가능한 아이디입니다.');
      } else {
        setIsIDAvailable(false);
        alert('이미 사용 중인 아이디입니다.');
      }
    } catch (err) {
      console.error(err);
      alert('아이디 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSendEmail = async () => {
    try {
      await sendVerificationEmail(form.email);
      alert('인증 메일이 전송되었습니다.');
    } catch (err) {
      console.error(err);
      alert('이메일 전송에 실패했습니다.');
    }
  };

  const handleVerifyCode = async () => {
    try {
      await verifyCode(form.email.trim(), form.verificationCode.trim());
      setIsEmailVerified(true);
      alert('인증에 성공했습니다.');
    } catch (err) {
      setIsEmailVerified(false);
      if (err.response?.data?.message?.includes('만료')) alert('인증번호가 만료되었습니다.');
      else if (err.response?.data?.message?.includes('틀')) alert('인증번호가 틀렸습니다.');
      else alert('인증 중 오류가 발생했습니다.');
    }
  };

  const isMatching = form.confirmPassword && form.password === form.confirmPassword;
  const isFormValid =
    form.country &&
    form.university &&
    isNicknameAvailable &&
    isIDAvailable &&
    form.password &&
    isMatching &&
    isEmailVerified;

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isFormValid) return alert('모든 항목을 올바르게 채워주세요.');
    try {
      await signUp(form);
      alert('회원가입이 완료되었습니다!');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('회원가입에 실패했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      {/* 국적 선택 */}
      <div style={fieldWrapper}>
        <label htmlFor="country" style={labelStyle}>국적 선택</label>
        <select
          id="country"
          name="country"
          value={form.country}
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

      {/* 대학 선택 */}
      <div style={fieldWrapper}>
        <label htmlFor="university" style={labelStyle}>소속대학 선택</label>
        <select
          id="university"
          name="university"
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

      {/* 닉네임 */}
      <div style={rowStyle}>
        <div style={{ flex: 1 }}>
          <label htmlFor="nickname" style={labelStyle}>닉네임</label>
          <input
            id="nickname"
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <button type="button" style={buttonStyle} onClick={handleNicknameCheck}>중복확인</button>
      </div>

      {/* 아이디 */}
      <div style={rowStyle}>
        <div style={{ flex: 1 }}>
          <label htmlFor="ID" style={labelStyle}>아이디</label>
          <input
            id="ID"
            name="ID"
            value={form.ID}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <button type="button" style={buttonStyle} onClick={handleIDCheck}>중복확인</button>
      </div>

      {/* 비밀번호 */}
      <div style={fieldWrapper}>
        <label htmlFor="password" style={labelStyle}>비밀번호</label>
        <input
          id="password"
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
        <div style={rowStyle}>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            style={inputStyle}
          />
          <span style={{ minWidth: '100px', color: isMatching ? '#2e8ada' : 'red', fontSize: isMatching ? '14px' : '12px' }}>
            {form.confirmPassword ? (isMatching ? '사용가능!' : '불일치') : ''}
          </span>
        </div>
      </div>

      {/* 이메일 */}
      <div style={rowStyle}>
        <div style={{ flex: 1 }}>
          <label htmlFor="email" style={labelStyle}>본인대학 이메일</label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <button type="button" style={buttonStyle} onClick={handleSendEmail}>전송</button>
      </div>

      {/* 인증번호 + 확인 */}
      <div style={rowStyle}>
        <div style={{ flex: 1 }}>
          <label htmlFor="verificationCode" style={labelStyle}>인증번호</label>
          <input
            type="text"
            name="verificationCode"
            value={form.verificationCode}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <button type="button" style={buttonStyle} onClick={handleVerifyCode}>
          확인
        </button>
      </div>

      {/* 최종 가입 버튼 */}
      <div style={{ marginTop: '2rem' }}>
        <button type="submit" style={SignUpButtonStyle} disabled={!isFormValid}>
          회원가입
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;