import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from '../pages/SignUp/SignUp';
// 다른 페이지들도 여기에 import

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        {/* 다른 라우트들은 여기에 추가하면 됨 */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
