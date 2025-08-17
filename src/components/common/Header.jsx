import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import koundaryLogo from '../../components/common/Koundarylogo.png';

const BRAND = '#2e8ada';
const SHOW_BUTTONS_PATHS = ['/main', '/posts', '/board'];

const Header = ({ title = '', showActions, onlyLogout = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const routeWantsButtons = SHOW_BUTTONS_PATHS.some(p =>
    location.pathname.startsWith(p)
  );
  const shouldShowActions =
    typeof showActions === 'boolean' ? showActions : routeWantsButtons;

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-screen-lg mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={koundaryLogo}
            alt="Koundary Logo"
            className="h-8 object-contain cursor-pointer"
            onClick={() => navigate('/main')}
          />
          {title && <span className="text-lg md:text-xl font-semibold">{title}</span>}
        </div>

        {shouldShowActions && (
          <div className="flex items-center gap-2">
            {/* onlyLogout 이면 '내 프로필' 숨김 */}
            {!onlyLogout && (
              <button
                onClick={() => navigate('/myprofile')}
                className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded hover:bg-gray-100 transition"
              >
                내 프로필
              </button>
            )}
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
