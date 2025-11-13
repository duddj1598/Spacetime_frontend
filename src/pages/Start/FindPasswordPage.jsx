import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock as LockIcon } from "lucide-react";

const MOCK_AUTH_CODE = "123456";

const STEPS = {
  EMAIL_INPUT: 1,
  CODE_VERIFICATION: 2,
  PASSWORD_RESET: 3,
};

export default function FindPasswordPage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(STEPS.EMAIL_INPUT);
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /** 인증번호 발송 */
  const handleSendAuthCode = (e) => {
    e.preventDefault();

    if (!email) {
      alert("이메일을 입력해 주세요.");
      return;
    }

    alert(`인증번호 [${MOCK_AUTH_CODE}]가 ${email}로 발송되었습니다.`);
    setCurrentStep(STEPS.CODE_VERIFICATION);
  };

  /** 최종 제출 */
  const handleSubmit = async (e) => {
    e.preventDefault();

    /* 2단계: 인증번호 확인 */
    if (currentStep === STEPS.CODE_VERIFICATION) {
      if (authCode === MOCK_AUTH_CODE) {
        setCurrentStep(STEPS.PASSWORD_RESET);
      } else {
        alert("인증번호가 일치하지 않습니다.");
      }
      return;
    }

    /* 3단계: 비밀번호 재설정 */
    if (currentStep === STEPS.PASSWORD_RESET) {
      if (newPassword !== confirmPassword) {
        alert("새 비밀번호가 일치하지 않습니다.");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/auth/password/reset", {
          method: "PUT",  // 🔥 백엔드에 맞게 PUT 사용
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, new_password: newPassword }),
        });

        const data = await response.json();

        if (data.status === 200) {
          alert("비밀번호 재설정이 완료되었습니다!");
          navigate("/");   // 홈(로그인 화면)으로 이동
        } else {
          alert(data.message || "비밀번호 변경 실패");
        }
      } catch (error) {
        console.error("비밀번호 재설정 오류:", error);
        alert("서버 오류가 발생했습니다.");
      }

      return;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa]">
      <div className="w-[360px] bg-[#f9f7f3] shadow-md rounded-2xl p-8">
        <h1 className="text-center text-2xl font-semibold mb-6 text-[#222]">
          비밀번호 찾기
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* 이메일 입력 */}
          <div className="relative flex items-center">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-gray-500 pr-[120px]"
              required
              disabled={currentStep !== STEPS.EMAIL_INPUT}
            />

            <button
              type="button"
              onClick={handleSendAuthCode}
              disabled={currentStep !== STEPS.EMAIL_INPUT}
              className={`absolute right-1 top-1 bottom-1 text-xs px-2 rounded-md transition 
                ${
                  currentStep === STEPS.EMAIL_INPUT
                    ? "bg-[#d8d0c0] text-[#222] hover:bg-[#cbbfa8]"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
            >
              인증번호 받기
            </button>

            <Mail className="absolute left-3 top-2.5 text-gray-400 opacity-0" size={18} />
          </div>

          {/* 인증번호 입력 */}
          {currentStep >= STEPS.CODE_VERIFICATION && (
            <input
              type="text"
              placeholder="인증번호"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-gray-500"
              required
              disabled={currentStep === STEPS.PASSWORD_RESET}
            />
          )}

          {/* 비밀번호 설정 */}
          {currentStep === STEPS.PASSWORD_RESET && (
            <>
              <div className="relative">
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-10 text-sm focus:outline-none focus:border-gray-500"
                  required
                />
                <LockIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>

              <div className="relative">
                <input
                  type="password"
                  placeholder="비밀번호 확인"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-10 text-sm focus:outline-none focus:border-gray-500"
                  required
                />
                <LockIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </>
          )}

          {currentStep > STEPS.EMAIL_INPUT && (
            <button
              type="submit"
              className="w-full bg-[#d8d0c0] text-[#222] font-medium py-2 rounded-md hover:bg-[#cbbfa8] transition"
            >
              {currentStep === STEPS.CODE_VERIFICATION
                ? "인증번호 확인"
                : "비밀번호 재설정"}
            </button>
          )}

          <p className="text-xs text-gray-600 text-center mt-2">
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
