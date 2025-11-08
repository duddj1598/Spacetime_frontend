// src/components/common/UserProfile.jsx

// 'use client' 제거됨
import { useState, useRef } from 'react';
// import Image from 'next/image'; // Next.js Image 제거됨

// 초기 프로필 상태는 null로 설정하여 아이콘이 표시되도록 합니다.
const INITIAL_PROFILE_IMAGE = null;

const UserProfile = () => {
  // 1. 현재 프로필 사진 URL 상태 (초기값 null)
  const [profileImage, setProfileImage] = useState(INITIAL_PROFILE_IMAGE);
  // 2. 숨겨진 파일 입력 요소에 접근하기 위한 Ref
  const fileInputRef = useRef(null);

  // 프로필 사진 클릭 핸들러
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 파일 선택 변경 핸들러
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center">
      
      {/* ⭐️ 프로필 사진 영역 (클릭 가능) ⭐️ */}
      <div 
        className="relative w-20 h-20 mr-4 cursor-pointer group"
        onClick={handleImageClick}
      >
        {profileImage ? (
          // 1. 프로필 이미지가 있을 때: <Image> 대신 <img> 사용
          <img
            src={profileImage}
            alt="User Profile"
            className="rounded-full border-2 border-white transition-opacity duration-300 group-hover:opacity-80 object-cover w-full h-full"
          />
        ) : (
          // 2. 프로필 이미지가 없을 때 (원래의 회색 아이콘 UI)
          <div className="w-full h-full bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-5xl text-gray-500 transition-opacity duration-300 group-hover:opacity-80">
            👤
          </div>
        )}
        
        {/* 마우스 오버 시 표시될 카메라 아이콘 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-full">
            <span className="text-white text-2xl">📸</span>
        </div>
      </div>
      
      {/* 숨겨진 파일 입력 요소 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      {/* 닉네임 그룹 */}
      <div className="flex flex-col items-start"> 
        <h2 className="text-2xl font-bold">닉네임</h2>
        <p className="text-sm text-gray-500 w-full text-center mt-0.5">
          친구 4명
        </p>
        <div className="flex space-x-4 mt-2 text-xl text-gray-600 self-center"> 
          <span>📸</span>
          <span>🖼️</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;