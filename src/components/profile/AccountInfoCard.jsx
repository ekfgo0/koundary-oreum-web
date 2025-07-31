import React from 'react';

const AccountInfoCard = ({ userId = 'abcd123', onEditPassword, onDeleteAccount }) => {
  return (
    <div className="border p-6 w-full max-w-md">
      <h3 className="text-xl font-bold mb-4">계정 정보</h3>

      <div className="mb-3">
        <span className="font-semibold">아이디 </span>
        <span className="ml-4 text-gray-600">{userId}</span>
      </div>

      <div className="mb-3">
        <span className="font-semibold">비밀번호 </span>
        <button
          onClick={onEditPassword}
          className="ml-4 bg-black text-white text-sm px-2 py-1 rounded"
        >
          수정
        </button>
      </div>

      <button
        onClick={onDeleteAccount}
        className="mt-4 underline text-red-600 text-sm"
      >
        회원 탈퇴
      </button>
    </div>
  );
};

export default AccountInfoCard; 