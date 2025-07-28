import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import MyProfile from './pages/MyProfile/MyProfile';
import SignUp from "./pages/SignUp/SignUp";
import Main from "./pages/MainBoard/Main";


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/myprofile" element={<MyProfile />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/main" element={<Main />} />
    </Routes>
  )
}

 export default App;
