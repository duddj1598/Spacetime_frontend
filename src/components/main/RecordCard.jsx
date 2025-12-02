// src/components/main/RecordCard.jsx

// 'use client' 제거됨
// import Image from 'next/image'; // Next.js Image 제거됨
import { useState } from 'react';

const RecordCard = ({ imageUrl, title, location, date, isPlaceholder = false }) => {
  const [isPrivate, setIsPrivate] = useState(true); 

  // '나만보기' (방어 게시물) 카드 디자인
  if (isPlaceholder) {
    return (
      <div className="w-48 h-64 bg-white border border-gray-200 shadow-md relative group">
        {/* 이미지 영역: <Image> 대신 <img> 사용 */}
        <div className="relative h-3/5">
          <img
            src={imageUrl}
            alt={title}
            className="rounded-t-md object-cover w-full h-full" // CSS 스타일 조정
          />
        </div>

        {/* 텍스트 내용 및 나만보기 토글 */}
        <div className="p-2 pt-3 flex flex-col justify-between h-2/5">
          
          {/* 제목을 가장 위로 배치 */}
          <h3 className="text-sm font-semibold truncate">{title}</h3>
          
          <div className="flex flex-col space-y-1"> 
            
            {/* 나만보기 토글 버튼 */}
            <div className="flex items-center justify-start w-full">
              <p className="text-xs text-gray-600 mr-2">나만보기</p>
              <label htmlFor="private-toggle" className="flex items-center cursor-pointer">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    id="private-toggle" 
                    className="sr-only" 
                    checked={isPrivate}
                    onChange={() => setIsPrivate(!isPrivate)}
                  />
                  {/* 토글 배경 */}
                  <div 
                    className={`block w-8 h-4 rounded-full transition-colors ${
                      isPrivate ? 'bg-gray-400' : 'bg-gray-300'
                    }`}
                  ></div>
                  {/* 토글 점 */}
                  <div 
                    className={`absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform ${
                      isPrivate ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  ></div>
                </div>
              </label>
            </div>
            
            {/* 날짜를 가장 아래로 배치 */}
            <p className="text-xs text-gray-500 text-right">{date}</p>
          </div>
        </div>
      </div>
    );
  }

  // 일반 카드 디자인
  return (
    <div className="w-48 h-64 bg-white border border-gray-200 shadow-md relative group">
      
      {/* 이미지 영역: <Image> 대신 <img> 사용 */}
      <div className="relative h-3/5">
        <img 
          src={imageUrl} 
          alt={title} 
          className="rounded-t-md object-cover w-full h-full" 
        />
      </div>

      {/* 텍스트 내용 */}
      <div className="p-2 pt-3 flex flex-col justify-between h-2/5">
        <h3 className="text-sm font-semibold truncate">{title}</h3>
        <div className="text-xs text-gray-500">
          <p className="flex items-center">
            <span className="text-red-500 mr-1">📍</span> {location}
          </p>
          <p className="text-xs text-right mt-1">{date}</p>
        </div>
      </div>
    </div>
  );
};

export default RecordCard;