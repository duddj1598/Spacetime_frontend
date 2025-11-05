import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("로그인 시도:", { email, password, remember });
    navigate("/main"); // 로그인 성공 시 메인 페이지로 이동
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa]">
      <div className="w-[360px] bg-[#f9f7f3] shadow-md rounded-2xl p-8">
        <h1 className="text-center text-2xl font-semibold mb-6 text-[#222]">
          로그인
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* 이메일 입력 */}
          <div className="relative">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-10 text-sm focus:outline-none focus:border-gray-500"
              required
            />
            <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>

          {/* 비밀번호 입력 */}
          <div className="relative">
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-10 text-sm focus:outline-none focus:border-gray-500"
              required
            />
            <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="w-full bg-[#d8d0c0] text-[#222] font-medium py-2 rounded-md hover:bg-[#cbbfa8] transition"
          >
            로그인
          </button>

          {/* 회원가입 버튼 */}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="w-full bg-[#eae7de] text-[#222] font-medium py-2 rounded-md hover:bg-[#dfd7c8] transition"
          >
            회원가입
          </button>

          {/* 아이디 저장 & 비밀번호 찾기 */}
          <div className="flex justify-between items-center text-xs mt-2 text-gray-600">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-[#6d6d6d]"
              />
              아이디 저장
            </label>
            <button
              type="button"
              onClick={() => alert("비밀번호 찾기 기능은 보류 중입니다.")}
              className="hover:underline text-gray-500"
            >
              비밀번호 찾기 &gt;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
