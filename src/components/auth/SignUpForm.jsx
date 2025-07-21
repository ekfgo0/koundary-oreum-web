import React, { useState } from 'react';

const labelStyle = {
  display: 'block',
  marginBottom: '4px',
  fontSize: '14px',
  color: '#333',
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const selectStyle = {
    width: '300px',
    height: '40px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    padding: '0 10px',
  };

  const inputStyle = {
    width: '280px',
    height: '40px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    padding: '0 10px',
  };

  const rowStyle = {
    display: 'flex',
    gap: '10px',
  };

  const buttonStyle = {
    width: "100px",
    height: "40px",
    padding: "8px 12px",
    border: "1px solid #2e8ada",
    color: "#2e8ada",
    backgroundColor: "transparent",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  };

    const SignUpButtonStyle = {
    width: '100px',
    height: '40px',
    // border: '1px solid #2e8ada',
    backgroundColor: '#2e8ada',
    color: '#fff',
    cursor: 'pointer',
  };

return (
  <div>
    <label htmlFor="country" style={labelStyle}>국적 선택</label>
    <select name="country" id="country" value={form.country} onChange={handleChange} style={selectStyle}>
      <option value="">선택하세요</option>
      <option value="대한민국">대한민국</option>
      <option value="미국">미국</option>
      <option value="영국">영국</option>
      <option value="캐나다">캐나다</option>
    </select>

    <label htmlFor="university" style={labelStyle}>소속대학 선택</label>
    <select name="university" value={form.university} onChange={handleChange} style={selectStyle}>
      <option value="">선택하세요</option>
    </select>

    <label htmlFor="nickname" style={labelStyle}>닉네임</label>
    <input type="text" name="nickname" value={form.nickname} onChange={handleChange} style={inputStyle} />
    <button type="button" style={buttonStyle}             
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = "#2e8ada";
        e.target.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "transparent";
        e.target.style.color = "#2e8ada";
      }}>중복확인</button>

    <label htmlFor="ID" style={labelStyle}>아이디</label>
    <input type="text" name="ID" value={form.ID} onChange={handleChange} style={inputStyle} />
    <button type="button" style={buttonStyle}             
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = "#2e8ada";
        e.target.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "transparent";
        e.target.style.color = "#2e8ada";
      }}>중복확인</button>

    <label htmlFor="password" style={labelStyle}>비밀번호</label>
    <input type="password" name="password" value={form.password} onChange={handleChange} style={inputStyle} />

    <label htmlFor="confirmPassword" style={labelStyle}>비밀번호 확인</label>
    <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} style={inputStyle} />

    <label htmlFor="email" style={labelStyle}>본인대학 이메일</label>
    <input type="email" name="email" value={form.email} onChange={handleChange} style={inputStyle} />
    <button type="button" style={buttonStyle}             
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = "#2e8ada";
        e.target.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "transparent";
        e.target.style.color = "#2e8ada";
      }}>전송</button>

    <label htmlFor="verificationCode" style={labelStyle}>인증번호</label>
    <input type="text" name="verificationCode" value={form.verificationCode} onChange={handleChange} style={inputStyle} />
    <button type="button" style={buttonStyle}             
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = "#2e8ada";
        e.target.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "transparent";
        e.target.style.color = "#2e8ada";
      }}>확인</button>

    <button type="submit" style={{ ...SignUpButtonStyle, width: '100%' }}
        onMouseEnter={(e) => {
        e.target.style.backgroundColor = "#086cc3";
        e.target.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "#2e8ada";
        e.target.style.color = "#fff";
      }}>회원가입</button>
  </div>
);}

export default SignUpForm;
