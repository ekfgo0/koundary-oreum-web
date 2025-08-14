import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');

    const handleCancel = () => navigate('/myprofile');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!current || !newPw || !confirmPw) {
        alert('모든 항목을 입력해주세요.');
        return;
      }
      if (newPw !== confirmPw) {
        alert('새 비밀번호가 일치하지 않습니다.');
        return;
      }
      // API 요청 연결 예정
      alert('비밀번호 변경 완료 (가상)');
    };
  return (
    <div>
      <Header title="비밀번호 변경" />
      <main className="max-w-screen-sm mx-auto px-4 py-12">

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* 현재 비밀번호 */}
          <div>
            <label className="block mb-2 text-sm">현재 비밀번호</label>
            <input
              type="password"
              className="w-full px-4 py-2 border-b focus:outline-none bg-gray-100"
              placeholder="현재 비밀번호 입력"
            />
          </div>

          {/* 새 비밀번호 */}
          <div>
            <label className="block mb-2 text-sm">새 비밀번호</label>
            <input
              type="password"
              className="w-full px-4 py-2 border-b focus:outline-none bg-gray-100"
              placeholder="새 비밀번호 입력"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
            />
          </div>

          {/* 새 비밀번호 확인 */}
          <div>
            <label className="block mb-2 text-sm">새 비밀번호 확인</label>
            <input
              type="password"
              className="w-full px-4 py-2 border-b focus:outline-none bg-gray-100"
              placeholder="새 비밀번호 확인"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
            />
          </div>

          {/* 버튼 */}
          <div className="flex flex-col gap-3 pt-6">
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded"
            >
              비밀번호 변경
            </button>
            <button
              type="button"
              className="w-full py-2 bg-blue-100 text-blue-700 rounded"
               onClick={handleCancel}
            >
              취소
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ChangePassword;
