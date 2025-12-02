// src/pages/Diary/DiaryDetailPage.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, MapPin, Calendar, Edit, Trash2, Camera } from "lucide-react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import BottomNavigation from "../../components/layout/BottomNavigation";

const API_BASE_URL = "http://localhost:8000";
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function DiaryDetailPage() {
  const { diaryId } = useParams();
  const navigate = useNavigate();
  
  const [diary, setDiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  useEffect(() => {
    fetchDiaryDetail();
  }, [diaryId]);

  // 일기 상세 조회
  const fetchDiaryDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/diary/detail`, {
        params: { diary_id: diaryId }
      });

      console.log("✅ 일기 상세 조회 성공:", response.data);
      setDiary(response.data.diary);
    } catch (err) {
      console.error("❌ 일기 조회 실패:", err);
      setError(err.response?.data?.detail || "일기를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-rose-50/50">
        <div className="text-xl text-gray-600 italic" style={{ fontFamily: 'Georgia, serif' }}>
          Loading your memory...
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !diary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-rose-50/50">
        <div className="text-xl text-red-600 mb-4">{error || "일기를 찾을 수 없습니다."}</div>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-sm"
        >
          돌아가기
        </button>
      </div>
    );
  }

  // 지도 중심 좌표
  const mapCenter = diary.location || { lat: 37.5665, lng: 126.9780 }; // 서울 기본값

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-rose-50/50 pb-20">
      
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-64 h-64 bg-amber-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-rose-200/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-orange-200/10 rounded-full blur-3xl"></div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="relative z-10 flex-grow p-6 pt-8 max-w-5xl mx-auto w-full">
        
        {/* 상단 헤더 */}
        <header className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium" style={{ fontFamily: 'Georgia, serif' }}>돌아가기</span>
          </button>
        </header>

        {/* 본문 카드 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-sm border border-amber-100/50 overflow-hidden"
             style={{ boxShadow: '0 4px 20px rgba(251, 191, 36, 0.08)' }}>
          
          {/* 사진 섹션 */}
          {diary.photos && diary.photos.length > 0 && (
            <div className="relative h-96 bg-gray-100">
              <img
                src={diary.photos[0]}
                alt={diary.title}
                className="w-full h-full object-cover"
              />
              {diary.photos.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  <Camera size={14} className="inline mr-1" />
                  {diary.photos.length} 장
                </div>
              )}
            </div>
          )}

          {/* 제목 & 메타 정보 */}
          <div className="p-8">
            <h1 className="text-3xl font-light text-gray-800 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              {diary.title}
            </h1>

            {/* 메타 정보 */}
            <div className="flex items-center gap-6 text-sm text-gray-600 mb-6 pb-6 border-b border-amber-100/50">
              {diary.location && (  
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-amber-600" />
                  <span>위치: {diary.location.lat.toFixed(4)}, {diary.location.lng.toFixed(4)}</span>
                </div>
              )}
            </div>

            {/* 본문 내용 */}
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Georgia, serif' }}>
                {diary.content}
              </p>
            </div>

            {/* 사진 갤러리 (2장 이상일 때) */}
            {diary.photos && diary.photos.length > 1 && (
              <div className="mt-8 pt-8 border-t border-amber-100/50">
                <h3 className="text-xl font-light text-gray-800 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  더 많은 사진
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {diary.photos.slice(1).map((photo, index) => (
                    <div key={index} className="relative aspect-square bg-gray-100 rounded-sm overflow-hidden">
                      <img
                        src={photo}
                        alt={`${diary.title} - ${index + 2}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 지도 섹션 */}
        {diary.location && isLoaded && (
          <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-sm border border-amber-100/50 p-6"
               style={{ boxShadow: '0 4px 20px rgba(251, 191, 36, 0.08)' }}>
            <h3 className="text-xl font-light text-gray-800 mb-4 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
              <MapPin size={20} className="text-amber-600" />
              여행 위치
            </h3>
            <div className="h-80 rounded-sm overflow-hidden">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={mapCenter}
                zoom={12}
                options={{ disableDefaultUI: false }}
              >
                <Marker position={mapCenter} />
              </GoogleMap>
            </div>
          </div>
        )}

      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}