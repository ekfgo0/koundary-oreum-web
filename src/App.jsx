import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import MyProfile from './pages/MyProfile/MyProfile';
import SignUp from "./pages/SignUp/SignUp";


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/myprofile" element={<MyProfile />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  )
}

 export default App;
