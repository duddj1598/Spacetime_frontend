// ----------------------------------------------------
// 2. React 프론트엔드 코드 (App.jsx)
// ----------------------------------------------------
import React, { useState } from 'react';

// FastAPI 서버 주소 및 엔드포인트 (8080 포트 사용)
const API_URL = 'http://localhost:8080/api/check';

const App = () => {
  const [status, setStatus] = useState('대기 중');
  const [message, setMessage] = useState('버튼을 눌러 서버 연동을 확인하세요.');
  const [isLoading, setIsLoading] = useState(false);
  const userName = 'React 클라이언트'; 

  const handleConnectionCheck = async () => {
    setIsLoading(true);
    setStatus('연결 시도 중...');
    setMessage('FastAPI 서버에 요청을 보내고 있습니다...');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 서버에 데이터 전송
        body: JSON.stringify({ name: userName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP 상태 코드 오류: ${response.status}`);
      }

      const data = await response.json();
      
      // 서버 응답이 성공적일 경우 상태 업데이트
      setStatus('🟢 연동 성공');
      setMessage(data.message); 

    } catch (error) {
      // 연결 실패 또는 응답 오류 시
      console.error('연결 오류:', error);
      setStatus('🔴 연동 실패');
      setMessage(`서버에 연결할 수 없습니다. FastAPI 서버가 8080 포트에서 실행 중인지 확인해 주세요. (에러: ${error.message})`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl border-t-8 border-indigo-600">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          FastAPI (8080 Port) ⇄ React 연동 테스트
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          아래 버튼은 **{API_URL}** 엔드포인트로 POST 요청을 보냅니다.
        </p>

        <button
          onClick={handleConnectionCheck}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition duration-200 ease-in-out shadow-md ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 transform hover:scale-[1.01]'
          }`}
        >
          {isLoading ? '연동 테스트 중...' : 'FastAPI 서버 연동 확인하기'}
        </button>

        <div className="mt-8 p-6 bg-indigo-50 rounded-lg border border-indigo-200">
          <h2 className="text-xl font-bold text-indigo-800 mb-2">현재 상태</h2>
          <p className="text-lg font-medium text-gray-800 break-words">
            {status}
          </p>
          <div className="mt-4 pt-3 border-t border-indigo-300">
             <h3 className="text-sm font-semibold text-indigo-700 mb-1">응답 메시지:</h3>
             <p className="text-gray-700 italic text-base break-words">
                {message}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;