import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// ⭐️ 메인 페이지 컴포넌트 임포트 (경로 확인: './Main/MainPage'로 가정)
import MainPage from './pages/Main/MainPage';

// ⭐️ MyPage 및 AlarmPage 임포트 (경로 확인 및 수정 필요!)
// 파일 구조에 맞게 경로는 '../../' 대신 './' 또는 './pages/...' 등을 사용해야 합니다.
import MyPage from './pages/MyPage/MyPage'; 
import AlarmPage from './pages/Friend/AlarmPage'; 

const API_URL = 'http://localhost:8000/api/check';

// ----------------------------------------------------
// ConnectionTest 컴포넌트
// ----------------------------------------------------
const ConnectionTest = ({ apiUrl }) => {
    const [status, setStatus] = useState('대기 중');
    const [message, setMessage] = useState('버튼을 눌러 서버 연동을 확인하세요.');
    const [isLoading, setIsLoading] = useState(false);
    const userName = 'React 클라이언트'; 

    const handleConnectionCheck = async () => {
        setIsLoading(true);
        setStatus('연결 시도 중...');
        setMessage('FastAPI 서버에 요청을 보내고 있습니다...');

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: userName }),
            });

            if (!response.ok) {
                throw new Error(`HTTP 상태 코드 오류: ${response.status}`);
            }

            const data = await response.json();
            
            setStatus('🟢 연동 성공');
            setMessage(data.message); 

        } catch (error) {
            console.error('연결 오류:', error);
            setStatus('🔴 연동 실패');
            setMessage(`서버에 연결할 수 없습니다. FastAPI 서버가 8000 포트에서 실행 중인지 확인해 주세요. (에러: ${error.message})`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const port = apiUrl.includes('8000') ? 8000 : 8080;
    
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl border-t-8 border-indigo-600">
                
                {/* ⭐️ 새로운 페이지 이동 링크 추가 ⭐️ */}
                <div className="flex justify-center space-x-4 mb-4 text-sm font-medium">
                    <Link to="/main" className="text-indigo-600 hover:text-indigo-800 underline">
                        메인 (/main)
                    </Link>
                    <Link to="/mypage" className="text-green-600 hover:text-green-800 underline">
                        마이페이지 (/mypage)
                    </Link>
                    <Link to="/alarm" className="text-red-600 hover:text-red-800 underline">
                        알림 (/alarm)
                    </Link>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    FastAPI ({port} Port) ⇄ React 연동 테스트
                </h1>
                <p className="text-gray-600 mb-8 text-center">
                    아래 버튼은 **{apiUrl}** 엔드포인트로 POST 요청을 보냅니다.
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

// ----------------------------------------------------
// 메인 App 컴포넌트 (라우터 정의)
// ----------------------------------------------------
const App = () => {
    return (
        <Routes>
            <Route path="/" element={<ConnectionTest apiUrl={API_URL} />} />
            
            <Route path="/main" element={<MainPage />} />
            
            {/* ⭐️ MyPage 및 AlarmPage 경로 추가 ⭐️ */}
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/alarm" element={<AlarmPage />} />
            
            <Route path="*" element={<div>경로를 찾을 수 없습니다 (404)</div>} />
        </Routes>
    );
};

export default App;