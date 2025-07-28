import React from 'react';

function AccountInfoCard({ user }) {
  const handleEditPassword = () => {
    alert('비밀번호 수정 모달 뜨게 연결하면 됨!');
  };

  const handleDeleteAccount = () => {
    const confirm = window.confirm('정말 탈퇴하시겠습니까?');
    if (confirm) {
      alert('회원 탈퇴 처리!');
    }
  };

  return (
    <div className="w-[250px] p-4 border rounded-md flex flex-col gap-3">
      <h3 className="font-semibold text-base">계정 정보</h3>

      <div className="text-sm flex flex-col gap-1">
        <p>
          <span className="font-medium">아이디 </span>
          {user?.id || '없음'}
        </p>

        <div className="flex items-center gap-2">
          <span className="font-medium">비밀번호</span>
          <button
            onClick={handleEditPassword}
            className="px-2 py-0.5 text-xs border rounded hover:bg-gray-100"
          >
            수정
          </button>
        </div>
      </div>

      <button
        onClick={handleDeleteAccount}
        className="text-red-500 text-sm underline mt-4 self-start"
      >
        삭제
      </button>
    </div>
  );
}

export default AccountInfoCard;
