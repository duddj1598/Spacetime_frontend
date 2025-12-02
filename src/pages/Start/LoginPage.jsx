import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Camera, Eye, EyeOff } from "lucide-react"; 
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  // 👁 비밀번호 보기/숨기기 상태
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: email,
          password: password,
        }),
      });

      const data = await response.json();
      console.log("login response:", data);

      if (data.status === 200 && data.accessToken) {
        alert("로그인 성공!");

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken || "");

        const decoded = jwtDecode(data.accessToken);
        localStorage.setItem("userId", decoded.sub);

        if (remember) {
          localStorage.setItem("savedEmail", email);
        } else {
          localStorage.removeItem("savedEmail");
        }

        navigate("/main");
      } else {
        alert(data.message || "로그인 실패");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("서버와 연결할 수 없습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-rose-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-orange-200/20 rounded-full blur-2xl"></div>
      </div>

      {/* 로그인 카드 */}
      <div className="relative z-10 w-[420px] bg-white shadow-2xl rounded-sm p-6 pb-20"
           style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)" }}>

        {/* 상단 브랜드 */}
        <div className="text-center mb-8 pt-4">
          <Camera className="text-amber-600 mx-auto mb-3" size={32} strokeWidth={1.5} />
          <h1 className="text-3xl font-light tracking-wide text-gray-800 mb-1" 
              style={{ fontFamily: "Georgia, serif" }}>
            Spacetime Polaroid
          </h1>
          <p className="text-xs text-gray-500">당신의 여정, 당신의 이야기</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          
          {/* 이메일 */}
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-amber-600/60" size={18} strokeWidth={1.5} />
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b-2 border-gray-300 bg-transparent py-3 pl-12 pr-4 text-sm"
              required
            />
          </div>

          {/* 🔥 비밀번호 (눈 아이콘 추가된 버전) */}
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-amber-600/60" size={18} strokeWidth={1.5} />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b-2 border-gray-300 bg-transparent py-3 pl-12 pr-10 text-sm text-gray-700 focus:border-amber-600 transition-colors"
              required
            />

            {/* 🔥 눈 아이콘 버튼 */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-500 hover:text-amber-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff size={20} strokeWidth={1.5} />
              ) : (
                <Eye size={20} strokeWidth={1.5} />
              )}
            </button>
          </div>

          {/* 기타 정보 */}
          <div className="flex justify-between items-center text-xs mt-1 mb-2">
            <label className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 accent-amber-600"
              />
              아이디 저장
            </label>
            <button
              type="button"
              onClick={() => navigate("/findpassword")}
              className="text-gray-500 hover:text-amber-600"
            >
              비밀번호 찾기
            </button>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3.5 rounded-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            로그인
          </button>

          {/* 구분선 */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-4 text-gray-400">또는</span>
            </div>
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3.5 rounded-sm hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50/30 transition-all"
          >
            회원가입
          </button>
        </form>

        {/* 폴라로이드 하단 문구 */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center">
          <p className="text-xs text-gray-400 italic" style={{ fontFamily: "Georgia, serif" }}>
            순간을 기록하세요
          </p>
        </div>
      </div>
    </div>
  );
}
