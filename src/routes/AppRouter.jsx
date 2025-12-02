import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/Start/LoginPage.jsx";
import SignupPage from "../pages/Start/SignupPage.jsx";
import FindPassword from "../pages/Start/FindPasswordPage.jsx";
import AlarmPage from '../pages/Friend/AlarmPage.jsx'; 
import MyPage from '../pages/MyPage/MyPage.jsx';
import Friend from '../pages/Friend/FriendAddPage.jsx';
import Diary from "../pages/Diary/DiaryPage.jsx";
import Main from "../pages/Main/MainPage.jsx";
import FolderMapPage from "../pages/Diary/FolderMapPage.jsx";
import DiaryWrite from "../pages/Diary/DiaryWrite.jsx";   // ⭐ 추가됨
import DiaryDetailPage from '../pages/Diary/DiaryDetailPage';
import App from "../App.jsx";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="findpassword" element={<FindPassword />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 로그인 후 페이지 */}
        <Route path="/alarm" element={<AlarmPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/friend" element={<Friend />} />
        <Route path="/diary/:diary_id" element={<Diary />} />
        <Route path="/diary/detail/:diaryId" element={<DiaryDetailPage />} />
        <Route path="/folder/:folderId" element={<FolderMapPage />} />
        <Route path="/diary/write" element={<DiaryWrite />} />  {/* ⭐⭐ 추가됨 */}
        <Route path="/main" element={<Main />} />
      </Routes>
    </Router>
  );
}
