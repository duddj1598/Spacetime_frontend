import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock as LockIcon, Camera } from "lucide-react";

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-rose-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-orange-200/20 rounded-full blur-2xl"></div>
      </div>

      {/* 폴라로이드 프레임 스타일 비밀번호 찾기 박스 */}
      <div className="relative z-10 w-[420px] bg-white shadow-2xl rounded-sm p-6 pb-20" 
           style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)' }}>
        
        {/* 상단 브랜드 영역 */}
        <div className="text-center mb-8 pt-4">
          <div className="inline-flex items-center justify-center mb-3">
            <Camera className="text-amber-600" size={32} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-light tracking-wide text-gray-800 mb-1" 
              style={{ fontFamily: 'Georgia, serif' }}>
            비밀번호 찾기
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* 이메일 입력 + 인증번호 받기 버튼 */}
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-amber-600/60 z-10" size={18} strokeWidth={1.5} />
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b-2 border-gray-300 bg-transparent py-3 pl-12 pr-32 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-amber-600 transition-colors"
              required
              disabled={currentStep !== STEPS.EMAIL_INPUT}
            />

            <button
              type="button"
              onClick={handleSendAuthCode}
              disabled={currentStep !== STEPS.EMAIL_INPUT}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-xs px-4 py-2 rounded-sm transition-all
                ${
                  currentStep === STEPS.EMAIL_INPUT
                    ? "bg-amber-500 text-white hover:bg-amber-600 shadow-sm"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              인증번호 받기
            </button>
          </div>

          {/* 인증번호 입력 */}
          {currentStep >= STEPS.CODE_VERIFICATION && (
            <div className="relative">
              <input
                type="text"
                placeholder="인증번호"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                className="w-full border-b-2 border-gray-300 bg-transparent py-3 px-4 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-amber-600 transition-colors"
                required
                disabled={currentStep === STEPS.PASSWORD_RESET}
              />
            </div>
          )}

          {/* 비밀번호 설정 */}
          {currentStep === STEPS.PASSWORD_RESET && (
            <>
              <div className="relative">
                <LockIcon className="absolute left-4 top-3.5 text-amber-600/60" size={18} strokeWidth={1.5} />
                <input
                  type="password"
                  placeholder="새 비밀번호"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border-b-2 border-gray-300 bg-transparent py-3 pl-12 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-amber-600 transition-colors"
                  required
                />
              </div>

              <div className="relative">
                <LockIcon className="absolute left-4 top-3.5 text-amber-600/60" size={18} strokeWidth={1.5} />
                <input
                  type="password"
                  placeholder="새 비밀번호 확인"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border-b-2 border-gray-300 bg-transparent py-3 pl-12 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-amber-600 transition-colors"
                  required
                />
              </div>
            </>
          )}

          {currentStep > STEPS.EMAIL_INPUT && (
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium py-3.5 rounded-sm hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-2"
            >
              {currentStep === STEPS.CODE_VERIFICATION
                ? "인증번호 확인"
                : "비밀번호 재설정"}
            </button>
          )}

          {/* 구분선 */}
          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
          </div>

          {/* 로그인으로 돌아가기 */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 font-medium py-3.5 rounded-sm hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50/30 transition-all"
          >
            로그인으로 돌아가기
          </button>
        </form>

        {/* 폴라로이드 하단 여백 효과 */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-center">
        </div>
      </div>
    </div>
  );
}