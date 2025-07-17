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
              height: "auto",
              width: "300px",
              objectFit: "contain",
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>

        {/* 국적 선택 */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">국적</label>
        </div>

        <div>
          <select
            className="border px-3 py-2 rounded text-gray-700"
            style={{ width: "310px", height: "40px" }}
          >
            <option>선택하세요</option>
          </select>
        </div>


        {/* 소속대학 선택 */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">소속대학</label>
        </div>

        <div>
          <select
            className="border px-3 py-2 rounded text-gray-700"
            style={{ width: "310px", height: "40px" }}
          >
            <option>선택하세요</option>
          </select>
        </div>


        {/* 닉네임 */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">닉네임</label>
        </div>

        <div className="flex justify-between">
          <input
            type="text"
            className="border px-3 py-2 rounded"
            style={{ width: "300px", height: "35px"}}
          />
          <button
            className="border px-3 py-2 rounded text-blue-500 border-blue-400"
            style={{ width: "100px" }}
          >
            중복 확인
          </button>
        </div>


        {/* 아이디 */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">아이디</label>
        </div>

        <div className="flex justify-between">
          <input
            type="text"
            className="border px-3 py-2 rounded"
            style={{ width: "300px", height: "35px"}}
          />
          <button
            className="border px-3 py-2 rounded text-blue-500 border-blue-400"
            style={{ width: "100px" }}
          >
            중복 확인
          </button>
        </div>


        {/* 비밀번호 */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">비밀번호</label>
        </div>

        <div>
          <input
            type="password"
            className="border px-3 py-2 rounded"
            style={{ width: "300px", height: "35px" }}
          />
        </div>


        {/* 비밀번호 확인 */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">비밀번호 확인</label>
        </div>

        <div>
          <input
            type="password"
            className="border px-3 py-2 rounded"
            style={{ width: "300px", height: "35px" }}
          />
        </div>


        {/* 본인 대학 이메일 */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">본인대학 이메일</label>
        </div>

        <div className="flex gap-2" style={{ width: "100%" }}>
          <input
            type="email"
            className="border px-3 py-2 rounded"
            style={{ width: "300px", height: "35px" }}
          />
          <button
            className="border px-3 py-2 rounded text-blue-500 border-blue-400"
            style={{ width: "100px" }}
          >
            전송
          </button>
        </div>


        {/* 인증번호 */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">인증번호</label>
        </div>


        <div className="flex gap-2" style={{ width: "100%" }}>
          <input
            type="text"
            className="border px-3 py-2 rounded"
            style={{ width: "300px", height: "35px" }}
          />
          <button
            className="border px-3 py-2 rounded text-blue-500 border-blue-400"
            style={{ width: "100px" }}
          >
              전송
          </button>
        </div>


        {/* 가입 버튼 */}
        <button
          className="bg-blue-500 text-white py-2 rounded mt-2"
          style={{ width: "310px", height: "35px" }}
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default Signup;
