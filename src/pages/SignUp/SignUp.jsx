import React from "react";

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      {/* ✅ 폭 제한 박스 */}
      <div className="w-full max-w-md space-y-4 px-4">
        {/* 로고 */}
        <div className="flex justify-center mb-2">
          <img
            src="/koundary_logo.png"
            alt="Koundary Logo"
            style={{
              height: '40px',
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto'
            }}
          />
        </div>

        {/* ✅ 국적 + 대학 선택 */}
        <div>
        <select className="w-full border px-3 py-2 rounded text-gray-700">
          <option>국적을 선택하세요</option>
        </select>
        </div>

        <div>
        <select className="w-full border px-3 py-2 rounded text-gray-700">
          <option>소속 대학을 선택하세요</option>
        </select>
        </div>

        {/* 닉네임 */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="닉네임"
            className="flex-1 border px-3 py-2 rounded"
          />
          <button className="border px-4 py-2 rounded text-blue-500 border-blue-400">
            중복 확인
          </button>
        </div>

        {/* 아이디 */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="아이디"
            className="flex-1 border px-3 py-2 rounded"
          />
          <button className="border px-4 py-2 rounded text-blue-500 border-blue-400">
            중복 확인
          </button>
        </div>

        {/* 비밀번호 */}
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          className="w-full border px-3 py-2 rounded"
        />

        {/* 이메일 */}
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="본인 대학 이메일"
            className="flex-1 border px-3 py-2 rounded"
          />
          <button className="border px-4 py-2 rounded text-blue-500 border-blue-400">
            전송
          </button>
        </div>

        {/* 인증번호 */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="인증번호"
            className="flex-1 border px-3 py-2 rounded"
          />
          <button className="border px-4 py-2 rounded text-blue-500 border-blue-400">
            전송
          </button>
        </div>

        {/* 회원가입 */}
        <button className="w-full bg-blue-500 text-white py-2 rounded mt-2">
          회원가입
        </button>
      </div>
    </div>
  );
};

export default Signup;
