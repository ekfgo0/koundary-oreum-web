import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import MyProfile from './pages/MyProfile/MyProfile';
import SignUp from './pages/SignUp/SignUp';
import Main from './pages/MainBoard/Main';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import Posts from "./pages/Posts/Posts";
import BoardList from './pages/BoardList/BoardList';
// import PostDetail from './pages/BoardList/PostDetail'; // 상세가 있으면 추가
import MyPost from "./pages/MyPost/MyPost";
import YourPost from "./pages/YourPost/YourPost";

function App() {
  return (
    <Routes>
      {/* 기본 진입은 자유게시판으로 */}
      <Route path="/" element={<Navigate to="/board/free" replace />} />

      {/* 인증/기타 페이지 */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/myprofile" element={<MyProfile />} />
      <Route path="/changepassword" element={<ChangePassword />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/main" element={<Main />} />

      {/* 게시판 목록 (카테고리 라우트) */}
      <Route path="/board/:category" element={<BoardList />} />
      {/* /board 단독 접근 시 기본 카테고리로 */}
      <Route path="/board" element={<Navigate to="/board/free" replace />} />
      {/* 예전 경로 호환 */}
      <Route path="/boardlist" element={<Navigate to="/board/free" replace />} />

      {/* (선택) 게시글 상세 */}
      {/* <Route path="/post/:id" element={<PostDetail />} /> */}

      {/* 그 외 전부 기본으로 */}
      <Route path="*" element={<Navigate to="/board/free" replace />} />
      <Route path="/mypost/:postId" element={<MyPost />} />
      <Route path="/yourpost/:postId" element={<YourPost />} />
    </Routes>
  );
}

export default App;

