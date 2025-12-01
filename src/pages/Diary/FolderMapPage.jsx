import React, { useState, useCallback, useEffect } from 'react';
import { Plus, X, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"; 
import axios from 'axios';

import BottomNavigation from '../../components/layout/BottomNavigation';
import LocationPickerModal from '../../components/diary/LocationPickerModal'; 

// API 및 지도 설정 상수
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; 
const LIBRARIES = ['places']; 
const API_BASE_URL = "http://localhost:8000";

const containerStyle = { width: '100%', height: '100%' };
const defaultCenter = { lat: 37.5665, lng: 126.9780 };

const DiaryAddModal = ({ isOpen, onClose, folderTitle, onDiaryCreate, onOpenLocationPicker, selectedLocation }) => {
  const [diaryTitle, setDiaryTitle] = useState(''); 

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!diaryTitle) {
      alert("일기 제목을 입력해주세요.");
      return;
    }
    if (!selectedLocation) {
      alert("위치를 추가해주세요.");
      return;
    }
    
    onClose();
    onDiaryCreate(folderTitle, diaryTitle, selectedLocation); 
    setDiaryTitle('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-sm p-6 relative">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-lg font-light text-gray-800 tracking-wide">
            [{folderTitle}] 일기 추가
          </h3>
          <button onClick={onClose}>
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          일기 제목
        </label>
        <input 
          value={diaryTitle}
          onChange={(e) => setDiaryTitle(e.target.value)}
          placeholder="일기 제목 입력"
          className="w-full p-2 border-b-2 border-gray-300 focus:border-amber-600 outline-none mb-3"
        />

        <button 
          onClick={onOpenLocationPicker}
          className={`w-full p-2 border rounded-sm mb-4 flex items-center justify-center gap-2 
            ${selectedLocation ? "border-green-500 bg-green-50 text-green-700" : "border-gray-300 text-gray-600"}`}
        >
          <MapPin size={20} />
          {selectedLocation ? "위치 선택됨" : "위치 추가"}
        </button>

        <button 
          onClick={handleCreate}
          disabled={!diaryTitle || !selectedLocation}
          className={`w-full py-3 rounded-sm text-white shadow-md transition 
            ${(!diaryTitle || !selectedLocation)
              ? "bg-gray-300 cursor-not-allowed" 
              : "bg-gradient-to-r from-amber-500 to-orange-500 hover:scale-105"}`}
        >
          생성하기
        </button>
      </div>
    </div>
  );
};


// ------------------------------------------------------
// 📌 FolderMapPage 메인 컴포넌트
// ------------------------------------------------------
export default function FolderMapPage() {
  const { folderId } = useParams();
  const navigate = useNavigate(); 
  
  const [isDiaryModalOpen, setIsDiaryModalOpen] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false); 
  const [selectedCreationLocation, setSelectedCreationLocation] = useState(null);

  const [diaries, setDiaries] = useState([]);
  const [folderTitle, setFolderTitle] = useState("로딩 중...");
  const [isLoading, setIsLoading] = useState(true);
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES, 
  });

  // 폴더 데이터 불러오기
  const fetchFolder = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/folder/detail`, {
        params: { folder_id: folderId }
      });

      if (res.data.status === 200) {
        const folder = res.data.folder;
        setFolderTitle(folder.title);
        setDiaries(folder.diaries || []);
      } else {
        alert("폴더 정보를 불러올 수 없습니다.");
      }
    } catch (err) {
      alert("서버 오류로 인해 데이터를 불러올 수 없습니다.");
      navigate("/main");
    } finally {
      setIsLoading(false);
    }
  }, [folderId, navigate]);

  useEffect(() => {
    fetchFolder();
  }, [fetchFolder]);


  // 일기 생성 성공 시 이동
  const handleDiaryCreationSuccess = (folderTitle, diaryTitle, loc) => {
    navigate(
      `/diary/write?folderId=${folderId}&title=${encodeURIComponent(diaryTitle)}&lat=${loc.lat}&lng=${loc.lng}`
    );
  };

  const mapCenter = selectedCreationLocation
    ? selectedCreationLocation
    : diaries.length > 0
      ? diaries[0].location
      : defaultCenter;

  return (
    <div className="relative min-h-screen pb-20 bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-rose-50/50">

      {/* 헤더 */}
      <main className="relative z-10 flex-grow p-8 max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-light tracking-wide text-gray-800 mb-6">
          📁 {folderTitle}
        </h1>

        {/* 지도 */}
        <div className="relative bg-white/90 rounded-sm border h-[600px] overflow-hidden shadow">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={diaries.length > 0 ? 10 : 3}
              options={{ disableDefaultUI: true }}
            >
              {diaries.map((d) =>
                d.location ? (
                  <Marker 
                    key={d.diary_id} 
                    position={d.location}
                    title={d.title}
                  />
                ) : null
              )}

              {selectedCreationLocation && (
                <Marker 
                  position={selectedCreationLocation}
                  icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
                />
              )}
            </GoogleMap>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 italic">
              Google 지도를 로드 중...
            </div>
          )}
        </div>

        {/* 일기 리스트 */}
        <div className="mt-6">
          <h2 className="text-2xl font-light text-gray-800 mb-4">
            일기 목록 ({diaries.length}개)
          </h2>

          {diaries.length === 0 ? (
            <div className="text-center py-12 bg-white/90 rounded-sm border">
              <p className="text-gray-500 italic">
                아직 일기가 없습니다. + 버튼을 눌러 추가해보세요!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {diaries.map((d) => (
                <div 
                  key={d.diary_id}
                  onClick={() => navigate(`/diary/${d.diary_id}`)}
                  className="p-4 bg-white/90 rounded-sm border cursor-pointer hover:shadow-lg transition"
                >
                  {d.main_photo && (
                    <img 
                      src={d.main_photo}
                      className="w-full h-32 object-cover rounded-sm mb-2"
                    />
                  )}
                  <h3 className="font-medium truncate">{d.title}</h3>
                  {d.location && (
                    <p className="text-sm text-gray-500">
                      📍 {d.location.lat.toFixed(2)}, {d.location.lng.toFixed(2)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 일기 추가 모달 */}
      <DiaryAddModal 
        isOpen={isDiaryModalOpen}
        onClose={() => setIsDiaryModalOpen(false)}
        folderTitle={folderTitle}
        onDiaryCreate={handleDiaryCreationSuccess}
        onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
        selectedLocation={selectedCreationLocation}
      />

      {/* 위치 선택 모달 */}
      {isLocationPickerOpen && (
        <LocationPickerModal
          isOpen={isLocationPickerOpen}
          onClose={() => setIsLocationPickerOpen(false)}
          onSelect={(loc) => {
            setSelectedCreationLocation(loc);
            setIsLocationPickerOpen(false);
          }}
          isMapLoaded={isLoaded}
        />
      )}

      {/* ⭐ 하단 네비게이션 추가 */}
      <BottomNavigation onPlusClick={() => setIsDiaryModalOpen(true)} />
    </div>
  );
}
