import React, { useState } from 'react';

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
  alignItems: 'flex-end',
  gap: '10px',
  marginBottom: '1.5rem',
};

// Select 박스 너비를 input과 동일하게 조정
const selectStyle = {
  width: '300px',
  height: '40px',
  backgroundColor: '#f0f0f0',
  border: 'none',
  padding: '0 10px',
};

// inputStyle에 flexShrink 추가하여 축소 방지
const inputStyle = {
  width: '280px',
  height: '40px',
  backgroundColor: '#f0f0f0',
  border: 'none',
  padding: '0 10px',
  flexShrink: 0,
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

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const isMatching = form.confirmPassword && form.password === form.confirmPassword;

  return (
    <form>
      {/* 국적 */}
      <div style={fieldWrapper}>
        <label htmlFor="country" style={labelStyle}>국적 선택</label>
        <select
          name="country"
          id="country"
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
        </select>
      </div>

      {/* 닉네임 + 버튼 */}
      <div style={rowStyle}>
        <div style={{ flex: 1 }}>
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
          onMouseEnter={e => {
            e.target.style.backgroundColor = "#2e8ada";
            e.target.style.color = "#fff";
          }}
          onMouseLeave={e => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#2e8ada";
          }}
        >
          중복확인
        </button>
      </div>

      {/* 아이디 + 버튼 */}
      <div style={rowStyle}>
        <div style={{ flex: 1 }}>
          <label htmlFor="ID" style={labelStyle}>아이디</label>
          <input
            type="text"
            name="ID"
            value={form.ID}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <button
          type="button"
          style={buttonStyle}
          onMouseEnter={e => {
            e.target.style.backgroundColor = "#2e8ada";
            e.target.style.color = "#fff";
          }}
          onMouseLeave={e => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#2e8ada";
          }}
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
        <div style={{ flex: 1 }}>
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
          onMouseEnter={e => {
            e.target.style.backgroundColor = "#2e8ada";
            e.target.style.color = "#fff";
          }}
          onMouseLeave={e => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#2e8ada";
          }}
        >
          전송
        </button>
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
        <button
          type="button"
          style={buttonStyle}
          onMouseEnter={e => {
            e.target.style.backgroundColor = "#2e8ada";
            e.target.style.color = "#fff";
          }}
          onMouseLeave={e => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#2e8ada";
          }}
        >
          확인
        </button>
      </div>

      {/* 최종 가입 버튼 */}
      <div style={{ marginTop: '2rem' }}>
        <button
          type="submit"
          style={SignUpButtonStyle}
          onMouseEnter={e => {
            e.target.style.backgroundColor = "#086cc3";
          }}
          onMouseLeave={e => {
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
