import React from 'react';
import { useNavigate } from 'react-router-dom';
import koundaryLogo from '../../components/common/Koundarylogo.png';

const Header =  ({ title = '내 프로필' }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="border-b py-4">
      <div className="max-w-screen-lg mx-auto px-4 flex justify-between items-center">
        {/* 로고 + 텍스트 */}
        <div className="flex items-center gap-2">
          <img src={koundaryLogo} alt="Koundary Logo" className="h-8 object-contain" />
          <span className="text-xl font-semibold">{title}</span>
        </div>

        {/* 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          className="px-4 py-1 border rounded hover:bg-gray-100"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
};


export default Header;