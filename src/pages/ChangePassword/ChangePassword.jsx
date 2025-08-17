import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import { changePassword } from '../../api/auth'; // auth.js에서 함수 import

const ChangePassword = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [loading, setLoading] = useState(false); // 로딩 상태 추가

    const handleCancel = () => navigate('/myprofile');

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // 입력값 검증
      if (!current || !newPw || !confirmPw) {
        alert('모든 항목을 입력해주세요.');
        return;
      }
      if (newPw !== confirmPw) {
        alert('새 비밀번호가 일치하지 않습니다.');
        return;
      }
      
      setLoading(true); // 로딩 시작
      
      try {
        // auth.js의 changePassword 함수 호출
        await changePassword(current, newPw);
        alert('비밀번호가 성공적으로 변경되었습니다.');
        navigate('/myprofile'); // 성공 시 프로필 페이지로 이동
      } catch (error) {
        console.error('비밀번호 변경 오류:', error);
        alert('비밀번호 변경에 실패했습니다: ' + (error.message || '알 수 없는 오류'));
      } finally {
        setLoading(false); // 로딩 끝
      }
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
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          {/* 버튼 */}
          <div className="flex flex-col gap-3 pt-6">
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? '변경 중...' : '비밀번호 변경'}
            </button>
            <button
              type="button"
              className="w-full py-2 bg-blue-100 text-blue-700 rounded disabled:bg-gray-200"
              onClick={handleCancel}
              disabled={loading}
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