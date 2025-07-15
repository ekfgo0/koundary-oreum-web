import React, { useState } from 'react';

// 회원가입 폼 컴포넌트 정의
const SignUpForm = () => {
  // 사용자의 입력값을 저장하는 상태
  const [form, setForm] = useState({
    country: '',            // 국적
    university: '',         // 소속 대학
    nickname: '',           // 닉네임
    ID: '',                 // 아이디
    password: '',           // 비밀번호
    confirmPassword: '',    // 비밀번호 확인
    email: '',              // 이메일
    verificationCode: '',   // 인증번호
  });

  // 입력창의 값을 바꿀 때 실행되는 함수
  const handleChange = (e) => {
    const { name, value } = e.target; // input의 name과 value 가져오기
    setForm((prev) => ({ ...prev, [name]: value })); // 기존 값은 유지하고 바뀐 필드만 업데이트
  };

  return (
    <form>
      {/* 제목 */}
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-500">Koundary</h2>

      {/* 국적 선택 */}
      <select name="country" value={form.country} onChange={handleChange}>
        <option value="">국적 선택</option>
        <option value="대한민국">대한민국</option>
        <option value="미국">미국</option>
        <option value="영국">영국</option>
        <option value="케나다">케나다</option>
      </select>

      {/* 소속 대학 선택 */}
      <select name="university" value={form.university} onChange={handleChange}>
        <option value="">소속대학 선택</option>
        {/* 여기서 구현을 어디서 가져와야할지 진짜 하나하나 다 적어야할지.. */}
      </select>

      {/* 닉네임 입력 + 중복확인 버튼 */}
      <div>
        <input
          type="text"
          name="nickname"
          placeholder="닉네임"
          value={form.nickname}
          onChange={handleChange}
        />
        <button type="button">중복확인</button>
      </div>

      {/* 아이디 입력 + 중복확인 버튼 */}
      <div>
        <input
          type="text"
          name="userId"
          placeholder="아이디"
          value={form.userId}
          onChange={handleChange}
        />
        <button type="button">중복확인</button>
      </div>

      {/* 비밀번호 입력 */}
      <input
        type="password"
        name="password"
        placeholder="비밀번호"
        value={form.password}
        onChange={handleChange}
      />

      {/* 비밀번호 확인 */}
      <input
        type="password"
        name="confirmPassword"
        placeholder="비밀번호 확인"
        value={form.confirmPassword}
        onChange={handleChange}
      />

      {/* 이메일 입력 + 전송 버튼 */}
      <div>
        <input
          type="email"
          name="email"
          placeholder="본인대학 이메일"
          value={form.email}
          onChange={handleChange}
        />
        <button type="button">전송</button>
      </div>

      {/* 인증번호 입력 + 확인 버튼 */}
      <div>
        <input
          type="text"
          name="verificationCode"
          placeholder="인증번호"
          value={form.verificationCode}
          onChange={handleChange}
        />
        <button type="button">확인</button>
      </div>

      {/* 회원가입 제출 버튼 */}
      <button type="submit">회원가입</button>
    </form>
  );
};

export default SignUpForm;
