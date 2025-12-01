import React, { useState, useCallback, useEffect } from 'react';
import { Plus, X, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"; 
import axios from 'axios';

// ⭐️ Sidebar 추가
import Sidebar from '../../components/layout/Sidebar';
import LocationPickerModal from '../../components/diary/LocationPickerModal'; 

// API 및 지도 설정 상수
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; 
const LIBRARIES = ['places']; 

const API_BASE_URL = "http://localhost:8000";
const containerStyle = { width: '100%', height: '100%' };
const defaultCenter = { lat: 37.5665, lng: 126.9780 };


// --- DiaryAddModal 컴포넌트 ---
const DiaryAddModal = ({ isOpen, onClose, folderTitle, onDiaryCreate, onOpenLocationPicker, selectedLocation }) => {
    const [diaryTitle, setDiaryTitle] = useState(''); 

    if (!isOpen) return null;

    const handleCreate = () => {
        if (diaryTitle.length === 0) {
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
                
                <button 
                    onClick={onOpenLocationPicker}
                    className={`w-full p-2 border rounded mb-4 flex items-center justify-center space-x-2 transition-colors 
                               ${selectedLocation ? 'border-green-500 text-green-700 font-bold bg-green-50' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                    <MapPin size={20} /> <span>{selectedLocation ? "위치 선택됨" : "위치 추가"}</span>
                </button>
                
                <button 
                    onClick={handleCreate}
                    disabled={diaryTitle.length === 0 || !selectedLocation}
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
    
    const [isDiaryModalOpen, setIsDiaryModalOpen] = useState(false);
    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false); 
    const [selectedCreationLocation, setSelectedCreationLocation] = useState(null);

    const [diaries, setDiaries] = useState([]);
    const [folderTitle, setFolderTitle] = useState(`폴더 ${folderId} 로드 중...`); 
    const [isLoading, setIsLoading] = useState(true);
    
    // Google Maps 로더 초기화
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES, 
    });

    // 폴더 정보 가져오기
    const fetchFolder = useCallback(async () => {
        if (!folderId) {
            console.error("❌ folderId가 없습니다.");
            setIsLoading(false);
            return;
        }

        try {
            console.log(`🔥 폴더 정보 조회 시작: folderId=${folderId}`);
            
            const response = await axios.get(`${API_BASE_URL}/api/folder/detail`, {
                params: { folder_id: folderId }
            });

            console.log("✅ 폴더 정보 응답:", response.data);

            if (response.data.status === 200) {
                const folderData = response.data.folder;
                
                setFolderTitle(folderData.title);
                setDiaries(folderData.diaries || []);
                
                console.log(`✅ 폴더 로드 완료: ${folderData.title}, 일기 ${folderData.diaries?.length || 0}개`);
            } else {
                throw new Error("폴더 정보를 불러올 수 없습니다.");
            }
        } catch (error) {
            console.error("❌ 폴더 조회 실패:", error);
            
            if (error.response) {
                console.error("응답 상태:", error.response.status);
                console.error("응답 데이터:", error.response.data);
                
                if (error.response.status === 404) {
                    alert("폴더를 찾을 수 없습니다.");
                    navigate('/main');
                } else {
                    alert(`폴더 조회 실패: ${error.response.data.detail || error.message}`);
                }
            } else {
                alert("서버와 연결할 수 없습니다.");
            }
            
            setFolderTitle(`폴더 ${folderId} (로드 실패)`);
        } finally {
            setIsLoading(false);
        }
    }, [folderId, navigate]);

    useEffect(() => { 
        fetchFolder(); 
    }, [fetchFolder]);

    // 최종 네비게이션 함수
    const handleDiaryCreationSuccess = (folderTitle, diaryTitle, location) => {
        navigate(`/diary/write?folderId=${folderId}&title=${encodeURIComponent(diaryTitle)}&lat=${location.lat}&lng=${location.lng}`); 
    };

    // 지도 중심 좌표 계산
    const mapCenter = (selectedCreationLocation) 
        ? selectedCreationLocation
        : (diaries.length > 0 && diaries[0].location) 
            ? { lat: diaries[0].location.lat, lng: diaries[0].location.lng }
            : defaultCenter;

    return (
        // ⭐️ Sidebar 추가 - flex 레이아웃 사용
        <div className="flex min-h-screen bg-gray-50">
            
            {/* ⭐️ Sidebar 컴포넌트 */}
            <Sidebar />

            {/* ⭐️ 메인 콘텐츠 영역 - ml-32로 사이드바 공간 확보 */}
            <main className="flex-grow ml-32 p-8">
                
                <h1 className="text-2xl font-bold mb-4">
                    📁 {isLoading ? "로딩 중..." : folderTitle}
                </h1>
                
                {/* 지도 영역 */}
                <div className="relative border-4 border-gray-300 h-[600px] bg-white rounded-lg overflow-hidden shadow-md">
                    
                    {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={mapCenter} 
                            zoom={diaries.length > 0 || selectedCreationLocation ? 10 : 3}
                            options={{ disableDefaultUI: true }}
                        >
                            {/* 기존 일기들의 위치 마커 */}
                            {diaries.map((diary) => (
                                diary.location ? (
                                    <Marker 
                                        key={diary.diary_id} 
                                        position={diary.location}
                                        title={diary.title}
                                    />
                                ) : null
                            ))}
                            
                            {/* 임시 선택된 위치 마커 */}
                            {selectedCreationLocation && (
                                <Marker 
                                    position={selectedCreationLocation} 
                                    icon={{
                                        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                                    }}
                                />
                            )}
                        </GoogleMap>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                            Google 지도를 로드 중...
                        </div>
                    )}

                    {/* (+) 버튼 */}
                    <button 
                        onClick={() => setIsDiaryModalOpen(true)}
                        className="absolute bottom-5 right-5 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors z-10" 
                        disabled={isLoading}
                    >
                        <Plus size={30} />
                    </button>
                </div>
                
                {/* 일기 목록 표시 */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-3">이 폴더의 일기 ({diaries.length}개)</h2>
                    {diaries.length === 0 ? (
                        <p className="text-gray-500">아직 일기가 없습니다. + 버튼을 눌러 첫 일기를 추가해보세요!</p>
                    ) : (
                        <div className="grid grid-cols-3 gap-4">
                            {diaries.map((diary) => (
                                <div 
                                    key={diary.diary_id} 
                                    className="p-4 bg-white rounded-lg shadow border cursor-pointer hover:shadow-lg transition"
                                    onClick={() => navigate(`/diary/${diary.diary_id}`)}
                                >
                                    {diary.main_photo && (
                                        <img 
                                            src={diary.main_photo} 
                                            alt={diary.title} 
                                            className="w-full h-32 object-cover rounded mb-2"
                                        />
                                    )}
                                    <h3 className="font-semibold truncate">{diary.title}</h3>
                                    {diary.location && (
                                        <p className="text-sm text-gray-500">
                                            📍 {diary.location.lat.toFixed(2)}, {diary.location.lng.toFixed(2)}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
            </main>

            {/* DiaryAddModal */}
            <DiaryAddModal 
                isOpen={isDiaryModalOpen} 
                onClose={() => setIsDiaryModalOpen(false)} 
                folderTitle={folderTitle}
                onDiaryCreate={handleDiaryCreationSuccess}
                onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
                selectedLocation={selectedCreationLocation}
            />

            {/* LocationPickerModal */}
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
        </div>
    );
}