// src/components/common/Header.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import koundaryLogo from '../../components/common/Koundarylogo.png';

const BRAND = '#2e8ada';
// 버튼을 노출할 경로 prefix 목록 (필요에 맞게 수정)
const SHOW_BUTTONS_PATHS = ['/main', '/board'];

const Header = ({ title = '' /* 필요 없으면 '' */ , showActions /* 강제 표시/숨김용 선택 프롭 */ }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 경로 기반 자동표시: /main, /board, /board/123 ... 에서 true
  const routeWantsButtons = SHOW_BUTTONS_PATHS.some(p =>
    location.pathname.startsWith(p)
  );

  // showActions 프롭이 있으면 우선, 없으면 경로 규칙 사용
  const shouldShowActions = typeof showActions === 'boolean' ? showActions : routeWantsButtons;

  const handleLogout = () => {
    // localStorage.clear() 대신 필요한 키만 제거 권장
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-screen-lg mx-auto px-4 py-3 flex items-center justify-between">
        {/* 로고(홈 이동) + 선택적 타이틀 */}
        <div className="flex items-center gap-2">
          <img
            src={koundaryLogo}
            alt="Koundary Logo"
            className="h-8 object-contain cursor-pointer"
            onClick={() => navigate('/main')}
          />
          {title && <span className="text-lg md:text-xl font-semibold">{title}</span>}
        </div>

        {/* 내 프로필 / 로그아웃 - 조건부 렌더링 */}
        {shouldShowActions && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/myprofile')}
              className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded hover:bg-gray-100 transition"
            >
              내 프로필
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm font-medium text-white rounded transition"
              style={{ backgroundColor: BRAND }}
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
