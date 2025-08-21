import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import FindID from './pages/FindAccount/FindID';
import ResetPassword from './pages/FindAccount/ResetPassword';
import MyProfile from './pages/MyProfile/MyProfile';
import SignUp from './pages/SignUp/SignUp';
import Main from './pages/MainBoard/Main';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import Posts from "./pages/Posts/Posts";
import BoardList from './pages/BoardList/BoardList';
import MyActivity from './pages/MyActivity/MyActivity';
import PostDetail from './pages/PostDetail/PostDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/findid" element={<FindID />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
      <Route path="/myprofile" element={<MyProfile />} />
      <Route path="/my-activity/:activityType" element={<MyActivity />} />
      <Route path="/changepassword" element={<ChangePassword />} />
      <Route path="/posts/:category" element={<Posts />} />
      <Route path="/main" element={<Main />} />
      <Route path="/boards/:category/posts" element={<BoardList />} />
      <Route path="/boards/:category/posts/:postId" element={<PostDetail />} />
  
      <Route path="/board" element={<Navigate to="/boards/FREE/posts" replace />} />
      <Route path="/boardlist" element={<Navigate to="/boards/FREE/posts" replace />} />
      <Route path="/mypost/:postId" element={<Navigate to="/boards/FREE/posts/:postId" replace />} />
      <Route path="/yourpost/:postId" element={<Navigate to="/boards/FREE/posts/:postId" replace />} />
    </Routes>
  );
}

export default App;