import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import MyProfile from './pages/MyProfile/MyProfile';
import SignUp from './pages/SignUp/SignUp';
import Main from './pages/MainBoard/Main';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import Posts from "./pages/Posts/Posts";
import BoardList from './pages/BoardList/BoardList';
import MyPost from "./pages/MyPost/MyPost";
import YourPost from "./pages/YourPost/YourPost";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/myprofile" element={<MyProfile />} />
      <Route path="/changepassword" element={<ChangePassword />} />
      <Route path="/posts/:category" element={<Posts />} /> 
      <Route path="/main" element={<Main />} />
      <Route path="/board/:category" element={<BoardList />} />
      <Route path="/board" element={<Navigate to="/board/FREE" replace />} />
      <Route path="/boardlist" element={<Navigate to="/board/FREE" replace />} />
      <Route path="/mypost/:postId" element={<MyPost />} />
      <Route path="/yourpost/:postId" element={<YourPost />} />
    </Routes>
  );
}

export default App;