import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/Start/LoginPage.jsx";
import SignupPage from "../pages/Start/SignupPage.jsx";
import FindPassword from "../pages/Start/FindPasswordPage.jsx";
import AlarmPage from '../pages/Friend/AlarmPage.jsx'; 
import MyPage from '../pages/MyPage/MyPage.jsx';
import Friend from '../pages/Friend/FriendsAdd.jsx';
import Diary from "../pages/Diary/DiaryWrite.jsx";
import App from "../App.jsx";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />   {/* 첫 화면 */}
        <Route path="findpassword" element={<FindPassword />} /> {/* 비밀번호 찾기 */}
        <Route path="/signup" element={<SignupPage />} /> {/* 회원가입 */}
        {/* 로그인 성공 후 */}
        <Route path="/alarm" element={<AlarmPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/friend" element={<Friend />} />
        <Route path="/diary" element={<Diary />} />
      </Routes>
    </Router>
  );
}
