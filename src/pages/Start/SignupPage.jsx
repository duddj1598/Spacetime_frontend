import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

export default function SignupPage() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // TODO: 실제 회원가입 로직 추가 (API 연결 예정)
    console.log("회원가입 시도:", { nickname, email, password });
    alert("회원가입이 완료되었습니다!");
    navigate("/"); // 가입 후 로그인 화면으로 이동
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa]">
      <div className="w-[360px] bg-[#f9f7f3] shadow-md rounded-2xl p-8">
        <h1 className="text-center text-2xl font-semibold mb-6 text-[#222]">
          회원가입
        </h1>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          {/* 닉네임 입력 */}
          <div className="relative">
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-10 text-sm focus:outline-none focus:border-gray-500"
              required
            />
            <User
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>

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
            <Mail
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
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
            <Lock
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="relative">
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-10 text-sm focus:outline-none focus:border-gray-500"
              required
            />
            <Lock
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            className="w-full bg-[#d8d0c0] text-[#222] font-medium py-2 rounded-md hover:bg-[#cbbfa8] transition"
          >
            회원가입
          </button>

          {/* 하단 링크 */}
          <p className="text-xs text-gray-600 text-center mt-2">
            이미 계정이 있으신가요?{" "}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-gray-500 hover:underline"
            >
              로그인으로 돌아가기
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
