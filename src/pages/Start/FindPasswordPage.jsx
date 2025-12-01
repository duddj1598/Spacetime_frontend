import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock as LockIcon, Camera } from "lucide-react";

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

  /* -----------------------------
      1) 인증번호 발송
  ------------------------------*/
  const handleSendAuthCode = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("이메일을 입력해 주세요.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/auth/send-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.status === 200) {
        alert("인증번호가 이메일로 발송되었습니다.");
        setCurrentStep(STEPS.CODE_VERIFICATION);
      } else {
        alert(data.detail || "이메일 전송 실패");
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  /* -----------------------------
      2) 인증번호 확인
  ------------------------------*/
  const handleVerifyCode = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: authCode }),
      });

      const data = await res.json();

      if (data.status === 200 && data.verified) {
        alert("인증 성공!");
        setCurrentStep(STEPS.PASSWORD_RESET);
      } else {
        alert("인증번호가 일치하지 않습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  /* -----------------------------
      3) 비밀번호 재설정
  ------------------------------*/
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/auth/password/reset", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, new_password: newPassword }),
      });

      const data = await res.json();

      if (data.status === 200) {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        navigate("/");
      } else {
        alert(data.detail || "변경 실패");
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  /* -----------------------------
      UI 렌더링
  ------------------------------*/
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <div className="relative z-10 w-[420px] bg-white shadow-2xl rounded-sm p-6 pb-20">

        {/* 상단 브랜드 */}
        <div className="text-center mb-8 pt-4">
          <h1 className="text-3xl">비밀번호 찾기</h1>
        </div>

        <form className="flex flex-col gap-5">

          {/* STEP 1: 이메일 입력 */}
          {currentStep === STEPS.EMAIL_INPUT && (
            <>
              <input
                type="email"
                placeholder="이메일 입력"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-b p-3"
              />

              <button
                type="button"
                onClick={handleSendAuthCode}
                className="bg-amber-500 text-white py-3 rounded-sm"
              >
                인증번호 받기
              </button>
            </>
          )}

          {/* STEP 2: 인증번호 확인 */}
          {currentStep === STEPS.CODE_VERIFICATION && (
            <>
              <input
                type="text"
                placeholder="인증번호 입력"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                className="border-b p-3"
              />

              <button
                type="button"
                onClick={handleVerifyCode}
                className="bg-amber-500 text-white py-3 rounded-sm"
              >
                인증번호 확인
              </button>
            </>
          )}

          {/* STEP 3: 비밀번호 재설정 */}
          {currentStep === STEPS.PASSWORD_RESET && (
            <>
              <input
                type="password"
                placeholder="새 비밀번호"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border-b p-3"
              />

              <input
                type="password"
                placeholder="새 비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-b p-3"
              />

              <button
                type="button"
                onClick={handleResetPassword}
                className="bg-amber-500 text-white py-3 rounded-sm"
              >
                비밀번호 재설정
              </button>
            </>
          )}

          {/* 로그인으로 돌아가기 */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-white border py-3 rounded-sm"
          >
            로그인으로 돌아가기
          </button>
        </form>
      </div>
    </div>
  );
}
