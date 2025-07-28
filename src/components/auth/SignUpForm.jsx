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
  alignItems: 'flex-end',
  gap: '10px',
  marginBottom: '1.5rem',
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
  const [universityList, setUniversityList] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  // 처음 마운트될 때 한 번만 호출
  getUniversities()
    .then(res => setUniversityList(res.data))
    .catch(err => {
      console.error(err);
      setUniversityList([]);
    });
}, []);  // 빈 배열: 마운트 시 1회 실행


  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNicknameCheck = async () => {
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

  const handleIDCheck = async () => {
    try {
      const res = await checkUsername(form.ID);
      alert(res.data.available ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.');
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

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return alert('비밀번호가 서로 일치하지 않습니다.');
    }
    try {
      await signUp(form);
      alert('회원가입이 완료되었습니다!');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('회원가입에 실패했습니다.');
    }
  };

  const isMatching = form.confirmPassword && form.password === form.confirmPassword;

  return (
    <form onSubmit={handleSubmit}>
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
          <option value="홍익대학교">홍익대학교</option>
          <option value="연세대학교">연세대학교</option>
          <option value="서강대학교">서강대학교</option>
          <option value="이화여자대학교">이화여자대학교</option>
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
        <button type="button" style={buttonStyle} onClick={handleNicknameCheck}>
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
        <button type="button" style={buttonStyle} onClick={handleIDCheck}>
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
        <button type="button" style={buttonStyle} onClick={handleSendEmail}>
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
        <button type="button" style={buttonStyle} onClick={handleVerifyCode}>
          확인
        </button>
      </div>

      {/* 최종 가입 버튼 */}
      <div style={{ marginTop: '2rem' }}>
        <button
          type="submit"
          style={SignUpButtonStyle}
        >
          회원가입
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
