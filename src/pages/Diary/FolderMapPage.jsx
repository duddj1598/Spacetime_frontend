import React, { useState, useCallback, useEffect } from 'react';
import { Plus, X, MapPin } from 'lucide-react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"; 
import axios from 'axios';

// LocationPickerModal 임포트 필요
import LocationPickerModal from './LocationPickerModal'; 

// ⭐️ API 및 지도 설정 상수 (성능 경고 해결) ⭐️
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; 
const LIBRARIES = ['places']; 

const API_BASE_URL = "http://localhost:8000";
const containerStyle = { width: '100%', height: '100%' };
const defaultCenter = { lat: 37.5665, lng: 126.9780 };


// --- DiaryAddModal Definition (STEP 3) ---
// ⭐️ selectedLocation prop 추가 ⭐️
const DiaryAddModal = ({ isOpen, onClose, folderTitle, onDiaryCreate, onOpenLocationPicker, selectedLocation }) => {
    const [diaryTitle, setDiaryTitle] = useState(''); 

    if (!isOpen) return null;

    const handleCreate = () => {
        if (diaryTitle.length === 0) {
            alert("일기 제목을 입력해주세요.");
            return;
        }
        // ⭐️ 위치 데이터 필수 검사 ⭐️
        if (!selectedLocation) {
            alert("위치를 추가해주세요.");
            return;
        }
        
        onClose();
        // ⭐️ 위치 데이터를 포함하여 네비게이션 함수 호출 ⭐️
        onDiaryCreate(folderTitle, diaryTitle, selectedLocation); 
        setDiaryTitle('');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden p-6 relative">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-lg font-bold text-gray-800">[{folderTitle}]에 일기 추가</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
                </div>
                
                <label className="block text-sm font-semibold text-gray-700 mb-2">일기 제목</label>
                <input 
                    placeholder="일기 제목" 
                    value={diaryTitle}
                    onChange={(e) => setDiaryTitle(e.target.value)}
                    className="w-full p-2 border rounded mb-3" 
                />
                
                {/* ⭐️ 위치 추가 버튼: 피커 모달 열기 ⭐️ */}
                <button 
                    onClick={onOpenLocationPicker}
                    // ⭐️ 선택된 위치에 따라 버튼 스타일 변경 ⭐️
                    className={`w-full p-2 border rounded mb-4 flex items-center justify-center space-x-2 transition-colors 
                               ${selectedLocation ? 'border-green-500 text-green-700 font-bold bg-green-50' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                    <MapPin size={20} /> <span>{selectedLocation ? "위치 선택됨" : "위치 추가"}</span>
                </button>
                
                {/* ⭐️ 생성하기 버튼: 일기 제목 및 위치가 모두 있어야 활성화 ⭐️ */}
                <button 
                    onClick={handleCreate}
                    disabled={diaryTitle.length === 0 || !selectedLocation} // 위치가 없으면 비활성화
                    className={`w-full py-3 rounded-xl font-bold text-white transition-all hover:bg-red-600 ${
                        diaryTitle.length === 0 || !selectedLocation
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-red-500' 
                    }`}
                >
                    생성하기
                </button>
            </div>
        </div>
    );
};


// --- 메인 FolderMapPage 컴포넌트 ---
export default function FolderMapPage() {
    const { folderId } = useParams();
    const navigate = useNavigate(); 
    
    // ⭐️ 위치 피커 및 임시 위치 상태 ⭐️
    const [isDiaryModalOpen, setIsDiaryModalOpen] = useState(false);
    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false); 
    const [selectedCreationLocation, setSelectedCreationLocation] = useState(null); // 모달 간 공유 상태

    const [diaries, setDiaries] = useState([]);
    const [folderTitle, setFolderTitle] = useState(`폴더 ${folderId} 로드 중...`); 
    const [isLoading, setIsLoading] = useState(true);
    
    // Google Maps 로더 초기화
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES, 
    });

    const fetchFolder = useCallback(async () => { /* ... API 로직 ... */ }, [folderId]);
    useEffect(() => { fetchFolder(); }, [fetchFolder]);


    // ⭐️ 최종 네비게이션 함수: 위치 데이터를 쿼리 파라미터로 전달 ⭐️
    const handleDiaryCreationSuccess = (folderTitle, diaryTitle, location) => {
        // 새 일기 작성/편집 페이지로 이동
        navigate(`/diary/write?folderId=${folderId}&title=${encodeURIComponent(diaryTitle)}&lat=${location.lat}&lng=${location.lng}`); 
    };

    const mapCenter = (selectedCreationLocation) 
        ? selectedCreationLocation // 새로 선택된 위치 우선
        : (diaries.length > 0 && diaries[0].location) 
            ? { lat: diaries[0].location.lat, lng: diaries[0].location.lng }
            : defaultCenter;


    return (
        <div className="min-h-screen bg-gray-50 p-8 ml-20"> 
            
            <h1 className="text-2xl font-bold mb-4">지도 페이지: {folderTitle}</h1>
            
            {/* 지도 영역 (Google Map) */}
            <div className="relative border-4 border-gray-300 h-[600px] bg-white">
                
                {isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={mapCenter} 
                        zoom={diaries.length > 0 || selectedCreationLocation ? 10 : 3}
                        options={{ disableDefaultUI: true }}
                    >
                        {diaries.map((diary, index) => (
                            diary.location ? (
                                <Marker key={diary.diary_id} position={diary.location} />
                            ) : null
                        ))}
                        {/* ⭐️ 임시 선택된 위치를 지도에 표시 ⭐️ */}
                        {selectedCreationLocation && <Marker position={selectedCreationLocation} />}
                    </GoogleMap>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">Google 지도를 로드 중...</div>
                )}


                {/* (+) 버튼 (DiaryAddModal 트리거) */}
                <button 
                    onClick={() => setIsDiaryModalOpen(true)}
                    className="absolute bottom-5 right-5 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors z-10" 
                >
                    <Plus size={30} />
                </button>
            </div>
            
            {/* DiaryAddModal 렌더링 */}
            <DiaryAddModal 
                isOpen={isDiaryModalOpen} 
                onClose={() => setIsDiaryModalOpen(false)} 
                folderTitle={folderTitle}
                onDiaryCreate={handleDiaryCreationSuccess}
                
                // ⭐️ FIX: 위치 선택 상태를 모달에 전달 ⭐️
                onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
                selectedLocation={selectedCreationLocation} // 현재 선택된 위치 상태 전달
            />

            {/* LocationPickerModal 렌더링 */}
            {isLocationPickerOpen && (
                <LocationPickerModal
                    isOpen={isLocationPickerOpen}
                    onClose={() => setIsLocationPickerOpen(false)}
                    // ⭐️ 피커에서 위치를 선택하면 selectedCreationLocation 상태에 저장 ⭐️
                    onSelect={(loc) => {
                        setSelectedCreationLocation(loc); 
                        setIsLocationPickerOpen(false); 
                    }}
                    isMapLoaded={isLoaded}
                    googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                />
            )}
        </div>
    );
}