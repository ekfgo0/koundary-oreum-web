// src/components/common/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import koundaryLogo from './Koundarylogo.png';

const Header = ({ 
  title = "Koundary", 
  showLogo = true, 
  onLogoClick,
  showUserActions = true 
}) => {
  const navigate = useNavigate();
  
  const handleProfileClick = () => {
    // 프로필 페이지로 이동
    navigate('/profile');
  };

  const handleLogout = () => {
    // 로그아웃 로직
    if (window.confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('authToken');
      navigate('/login');
    }
  };

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      navigate('/main');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b py-4">
      <div className="max-w-screen-lg mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {showLogo && (
            <div 
              onClick={handleLogoClick} 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <img 
                src={koundaryLogo} 
                alt="Koundary Logo" 
                className="h-8 object-contain"
                onError={(e) => {
                  console.error('이미지 로드 실패:', e.target.src);
                  // 이미지 로드 실패 시 대체 로고 표시
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div 
                className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold" 
                style={{ display: 'none' }}
              >
                K
              </div>
            </div>
          )}
          <span className="text-xl font-semibold">{title}</span>
        </div>
        
        {showUserActions && (
          <div className="flex gap-2">
            <button 
              onClick={handleProfileClick}
              className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition-all"
            >
              내 프로필
            </button>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition-all"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;