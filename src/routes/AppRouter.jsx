import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/Start/LoginPage.jsx";
import SignupPage from "../pages/Start/SignupPage.jsx";
// import MainPage from "../pages/Main/MainPage.jsx";
import App from "../App.jsx";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />   {/* 첫 화면 */}
        <Route path="/signup" element={<SignupPage />} /> {/* 회원가입 */}
        {/* 로그인 성공 후 */}
        <Route path="/test" element={<App />} /> {/* FastAPI 연결 테스트 */}
      </Routes>
    </Router>
  );
}
