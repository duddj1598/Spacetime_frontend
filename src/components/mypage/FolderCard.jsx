// src/components/mypage/FolderCard.jsx

import { useState } from "react";
import { Globe, Lock, Camera } from "lucide-react";
import axios from "axios";

export default function FolderCard({ 
  folderId, 
  title, 
  mainImage, 
  diaryCount, 
  isPublic, 
  onClick,
  onTogglePublic 
}) {
  const [isTogglingPublic, setIsTogglingPublic] = useState(false);
  const [currentIsPublic, setCurrentIsPublic] = useState(isPublic);

  const handleToggle = async (e) => {
    e.stopPropagation();

    setIsTogglingPublic(true);
    try {
      const token = localStorage.getItem("accessToken");
      const newIsPublic = !currentIsPublic;

      await axios.put(
        `http://localhost:8000/api/folder/${folderId}/visibility`,
        { is_public: newIsPublic },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCurrentIsPublic(newIsPublic);
      if (onTogglePublic) {
        onTogglePublic(folderId, newIsPublic);
      }
    } catch (err) {
      console.error("❌ 공개 설정 변경 실패:", err);
      alert("공개 설정 변경에 실패했습니다.");
    } finally {
      setIsTogglingPublic(false);
    }
  };

  return (
    <div
      onClick={onClick}
      className="relative flex-shrink-0 w-64 bg-white/90 backdrop-blur-sm rounded-sm border border-amber-100/50 overflow-hidden cursor-pointer hover:shadow-lg transition-all"
      style={{ boxShadow: '0 4px 20px rgba(251, 191, 36, 0.08)' }}
    >
      {/* 대표 이미지 */}
      <div className="relative h-40 bg-gradient-to-br from-amber-50 to-orange-50">
        {mainImage ? (
          <img
            src={mainImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera size={48} strokeWidth={1} className="text-amber-300" />
          </div>
        )}
        
        {/* 공개/비공개 토글 */}
        <button
          onClick={handleToggle}
          disabled={isTogglingPublic}
          className={`absolute top-2 right-2 p-2 rounded-full shadow-lg transition-all ${
            isTogglingPublic 
              ? 'bg-gray-300 cursor-not-allowed' 
              : currentIsPublic
                ? 'bg-gradient-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600'
                : 'bg-gradient-to-br from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'
          }`}
          title={currentIsPublic ? "공개 중" : "비공개 중"}
        >
          {isTogglingPublic ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : currentIsPublic ? (
            <Globe size={20} className="text-white" />
          ) : (
            <Lock size={20} className="text-white" />
          )}
        </button>
      </div>

      {/* 폴더 정보 */}
      <div className="p-4">
        <h4 className="text-lg font-medium text-gray-800 mb-2 truncate" 
            style={{ fontFamily: 'Georgia, serif' }}>
          {title}
        </h4>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>일기 {diaryCount}개</span>
          <span className={`px-2 py-1 rounded-sm text-xs font-semibold border ${
            currentIsPublic 
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200' 
              : 'bg-gray-100 text-gray-700 border-gray-200'
          }`}>
            {currentIsPublic ? '🌍 공개' : '🔒 비공개'}
          </span>
        </div>
      </div>
    </div>
  );
}