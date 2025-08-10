import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import MyProfile from './pages/MyProfile/MyProfile';
import SignUp from "./pages/SignUp/SignUp";
import Main from "./pages/MainBoard/Main";
import Posts from "./pages/Posts/Posts";
import MyPost from "./pages/MyPost/MyPost";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/myprofile" element={<MyProfile />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/main" element={<Main />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/mypost/:postId" element={<MyPost />} />
    </Routes>
  );
}

export default App;