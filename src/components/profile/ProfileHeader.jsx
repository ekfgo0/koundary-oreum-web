import React from 'react';
import { useNavigate } from 'react-router-dom';
import KoundaryLogo from '../../components/common/Koundarylogo.png'; // ✅ 이미지 경로 주의

function ProfileHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
      {/* 왼쪽 로고 이미지 */}
      <img
        src={KoundaryLogo}
        alt="Koundary Logo"
        className="h-8 cursor-pointer"
        onClick={() => navigate('/')}
      />

      {/* 가운데 타이틀 */}
      <h2 className="text-lg font-semibold">내 프로필</h2>

      {/* 오른쪽 로그아웃 */}
      <button
        className="border px-4 py-1 rounded-md text-sm hover:bg-gray-100"
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </header>
  );
}

export default ProfileHeader