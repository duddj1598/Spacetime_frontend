import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock as LockIcon } from "lucide-react"; 

// 임시 인증번호 (실제 API에서는 서버에서 생성 및 전송)
const MOCK_AUTH_CODE = "123456";

// 상태 정의를 위한 ENUM/객체
const STEPS = {
  EMAIL_INPUT: 1,      // 1단계: 이메일 입력 및 인증번호 발송 대기
  CODE_VERIFICATION: 2,  // 2단계: 인증번호 입력 및 확인
  PASSWORD_RESET: 3    // 3단계: 새 비밀번호 설정
};

export default function FindPasswordPage() {
  const navigate = useNavigate();

  // 현재 진행 단계
  const [currentStep, setCurrentStep] = useState(STEPS.EMAIL_INPUT);
  
  // 입력 상태
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState(""); // 사용자가 입력할 인증번호
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 이메일 입력 및 인증번호 발송 처리
  const handleSendAuthCode = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    if (currentStep !== STEPS.EMAIL_INPUT) return;

    if (!email) {
      alert("이메일을 입력해 주세요.");
      return;
    }

    // TODO: 실제 인증 이메일 발송 API 호출
    console.log("인증 이메일 발송 시도:", { email });
    alert(`인증번호 [${MOCK_AUTH_CODE}]가 ${email}로 발송되었습니다.`);
    
    setCurrentStep(STEPS.CODE_VERIFICATION);
  };

  // 최종 폼 제출 핸들러 (단계별 로직 처리)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentStep === STEPS.CODE_VERIFICATION) {
      // 2단계: 인증번호 확인
      if (authCode === MOCK_AUTH_CODE) {
        setCurrentStep(STEPS.PASSWORD_RESET);
      } else {
        alert("인증번호가 일치하지 않습니다. 다시 확인해 주세요.");
      }
    } else if (currentStep === STEPS.PASSWORD_RESET) {
      // 3단계: 비밀번호 재설정
      if (newPassword !== confirmPassword) {
        alert("새 비밀번호가 일치하지 않습니다.");
        return;
      }
  
      // TODO: 실제 비밀번호 재설정 API 호출
      console.log("비밀번호 재설정 시도:", { email, newPassword });
      alert("비밀번호 재설정이 완료되었습니다!");
      navigate("/"); // 재설정 후 로그인 화면으로 이동
    } else {
        // 1단계에서는 '인증번호 받기' 버튼으로 처리되므로, 폼 제출은 불가능하게 설정 (예외처리)
        alert("인증번호를 먼저 받아주세요.");
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa]">
      <div className="w-[360px] bg-[#f9f7f3] shadow-md rounded-2xl p-8">
        <h1 className="text-center text-2xl font-semibold mb-6 text-[#222]">
          비밀번호 찾기
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* 1. 이메일 입력 + 인증번호 받기 버튼 */}
          <div className="relative flex items-center">
            {/* 이메일 입력 필드 */}
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // 인증번호 받기 버튼 공간 확보를 위해 pr-[120px] 적용
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-gray-500 pr-[120px]" 
              required
              disabled={currentStep !== STEPS.EMAIL_INPUT} 
            />
            {/* 인증번호 받기 버튼 */}
            <button
              type="button" 
              onClick={handleSendAuthCode}
              disabled={currentStep !== STEPS.EMAIL_INPUT}
              className={`absolute right-1 top-1 bottom-1 text-xs px-2 rounded-md transition 
                          ${currentStep === STEPS.EMAIL_INPUT 
                            ? 'bg-[#d8d0c0] text-[#222] hover:bg-[#cbbfa8]' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
            >
              인증번호 받기
            </button>
            <Mail // 이미지에 이메일 아이콘이 입력창 바깥에 붙어있으므로, 레이아웃에 맞춰 Mail 아이콘을 적절히 배치해야 하지만, 현재 코드 구조에서는 생략하고 진행합니다.
              className="absolute left-3 top-2.5 text-gray-400 opacity-0" // 임시로 투명 처리
              size={18}
            />
          </div>

          {/* 2. 인증번호 입력 필드 (2단계 이상일 때 표시) */}
          {currentStep >= STEPS.CODE_VERIFICATION && (
            <div className="relative">
              <input
                type="text"
                placeholder="인증번호"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-gray-500"
                required
                disabled={currentStep === STEPS.PASSWORD_RESET}
              />
            </div>
          )}

          {/* 3. 비밀번호 재설정 입력 필드 (3단계일 때 표시) */}
          {currentStep === STEPS.PASSWORD_RESET && (
            <>
              {/* 새 비밀번호 입력 */}
              <div className="relative">
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-10 text-sm focus:outline-none focus:border-gray-500"
                  required
                />
                <LockIcon // 잠금 아이콘
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>

              {/* 새 비밀번호 확인 */}
              <div className="relative">
                <input
                  type="password"
                  placeholder="비밀번호 확인"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-10 text-sm focus:outline-none focus:border-gray-500"
                  required
                />
                <LockIcon // 잠금 아이콘
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>
            </>
          )}

          {/* 메인 버튼 (1단계에서는 숨김) */}
          {currentStep > STEPS.EMAIL_INPUT && (
             <button
                type="submit"
                className="w-full bg-[#d8d0c0] text-[#222] font-medium py-2 rounded-md hover:bg-[#cbbfa8] transition"
             >
                {currentStep === STEPS.CODE_VERIFICATION ? "인증번호 확인" : "비밀번호 재설정"}
            </button>
          )}

          {/* 하단 링크 */}
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