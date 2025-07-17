import React from "react";

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="space-y-4 px-4" style={{ width: "500px" }}>
        {/* 로고 */}
        <div className="flex justify-center mb-6">
          <img
            src="/koundary_logo.png"
            alt="Koundary Logo"
            style={{
              height: "50px",
              width: "auto",
              objectFit: "contain",
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>

        {/* 국적 선택 */}
        <select
          className="border px-3 py-2 rounded text-gray-700"
          style={{ width: "508px", height: "40px" }}
        >
          <option>국적을 선택하세요</option>
        </select>

        {/* 소속대학 선택 */}
        <select
          className="border px-3 py-2 rounded text-gray-700"
          style={{ width: "508px", height: "40px" }}
        >
          <option>소속 대학을 선택하세요</option>
        </select>

        {/* 닉네임 */}
        <div className="flex gap-2" style={{ width: "100%" }}>
          <input
            type="text"
            placeholder="닉네임"
            className="border px-3 py-2 rounded"
            style={{ width: "500px", height: "40px" }}
          />
          <button
            className="border px-3 py-2 rounded text-blue-500 border-blue-400"
            style={{ width: "120px" }}
          >
            중복 확인
          </button>
        </div>

        {/* 아이디 */}
        <div className="flex gap-2" style={{ width: "100%" }}>
          <input
            type="text"
            placeholder="아이디"
            className="border px-3 py-2 rounded"
            style={{ width: "500px", height: "40px" }}
          />
          <button
            className="border px-3 py-2 rounded text-blue-500 border-blue-400"
            style={{ width: "120px" }}
          >
            중복 확인
          </button>
        </div>

        {/* 비밀번호 */}
        <input
          type="password"
          placeholder="비밀번호"
          className="border px-3 py-2 rounded"
          style={{ width: "500px", height: "40px" }}
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          className="border px-3 py-2 rounded"
          style={{ width: "500px", height: "40px" }}
        />

        {/* 이메일 */}
        <div className="flex gap-2" style={{ width: "100%" }}>
          <input
            type="email"
            placeholder="본인 대학 이메일"
            className="border px-3 py-2 rounded"
            style={{ width: "500px", height: "40px" }}
          />
          <button
            className="border px-3 py-2 rounded text-blue-500 border-blue-400"
            style={{ width: "120px" }}
          >
            전송
          </button>
        </div>

        {/* 인증번호 */}
        <div className="flex gap-2" style={{ width: "100%" }}>
          <input
            type="text"
            placeholder="인증번호"
            className="border px-3 py-2 rounded"
            style={{ width: "500px", height: "40px" }}
          />
          <button
            className="border px-3 py-2 rounded text-blue-500 border-blue-400"
            style={{ width: "120px" }}
          >
            전송
          </button>
        </div>

        {/* 가입 버튼 */}
        <button
          className="bg-blue-500 text-white py-2 rounded mt-2"
          style={{ width: "508px", height: "40px" }}
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default Signup;
