// src/components/main/MonthlyRecord.jsx

// 'use client' 제거됨
import { useState } from 'react';

// 초기 기록 문구
const INITIAL_RECORD = "이번 달의 한 줄 기록 추가하기";

const MonthlyRecord = () => {
  // 1. 현재 기록 텍스트 상태
  const [recordText, setRecordText] = useState(INITIAL_RECORD);
  // 2. 수정 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  // 3. 임시 입력 값 상태
  const [tempInput, setTempInput] = useState(INITIAL_RECORD);

  // Enter 키를 눌렀을 때 실행되는 함수
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      saveRecord();
    }
  };

  // 저장 함수
  const saveRecord = () => {
    setRecordText(tempInput); // 임시 값을 최종 기록 텍스트로 저장
    setIsEditing(false); // 수정 모드 종료
  };
  
  // 수정 시작 함수
  const startEditing = () => {
    setTempInput(recordText); // 현재 기록을 임시 값으로 설정
    setIsEditing(true); // 수정 모드 시작
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-md p-4 shadow-sm">
      <h3 className="text-base font-semibold border-b pb-2 mb-3 flex items-center">
        <span className="mr-2">📝</span>이번 달의 한 줄 기록
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        이번 달, 2개의 여정을 기록했어요.
      </p>
      
      {/* 수정 모드와 보기 모드를 조건부 렌더링 */}
      {isEditing ? (
        // ********** 🛠️ 수정 모드 (Input Field) **********
        <div className="border border-blue-500 rounded-md p-2 flex justify-between items-center bg-white shadow-inner">
          <input
            type="text"
            value={tempInput}
            onChange={(e) => setTempInput(e.target.value)}
            onKeyDown={handleKeyDown} // Enter 키 감지
            className="w-full focus:outline-none text-gray-700 italic"
            autoFocus // 자동으로 포커스 이동
          />
          <button 
            onClick={saveRecord}
            className="text-blue-600 text-xs font-semibold hover:underline ml-2"
          >
            저장
          </button>
        </div>
      ) : (
        // ********** 👓 보기 모드 (Display Text) **********
        <div className="border border-gray-300 rounded-md p-3 flex justify-between items-center bg-gray-50">
          <p className="italic text-gray-700">
            “{recordText}“
          </p>
          <button 
            onClick={startEditing}
            className="text-blue-600 text-xs font-semibold hover:underline"
          >
            수정
          </button>
        </div>
      )}
    </div>
  );
};

export default MonthlyRecord;