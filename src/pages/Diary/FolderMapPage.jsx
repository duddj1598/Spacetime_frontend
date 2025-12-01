import React, { useState, useCallback, useEffect } from 'react';
import { Plus, X, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"; 
import axios from 'axios';

// Sidebar 추가
import Sidebar from '../../components/layout/Sidebar';
import LocationPickerModal from '../../components/diary/LocationPickerModal'; 

// API 및 지도 설정 상수
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; 
const LIBRARIES = ['places']; 

const API_BASE_URL = "http://localhost:8000";
const containerStyle = { width: '100%', height: '100%' };
const defaultCenter = { lat: 37.5665, lng: 126.9780 };


// --- DiaryAddModal 컴포넌트 (폴라로이드 디자인 적용) ---
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
            <div className="bg-white rounded-sm shadow-2xl w-full max-w-sm overflow-hidden p-6 relative"
                 style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)' }}>
                <div className="flex justify-between items-center border-b border-amber-100 pb-3 mb-4">
                    <h3 className="text-lg font-light text-gray-800 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
                        [{folderTitle}]에 일기 추가
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>
                
                <label className="block text-sm font-medium text-gray-700 mb-2">일기 제목</label>
                <input 
                    placeholder="일기 제목" 
                    value={diaryTitle}
                    onChange={(e) => setDiaryTitle(e.target.value)}
                    className="w-full p-2 border-b-2 border-gray-300 bg-transparent focus:border-amber-600 focus:outline-none transition-colors mb-3" 
                />
                
                <button 
                    onClick={onOpenLocationPicker}
                    className={`w-full p-2 border rounded-sm mb-4 flex items-center justify-center space-x-2 transition-colors 
                               ${selectedLocation ? 'border-green-500 text-green-700 font-medium bg-green-50' : 'text-gray-700 hover:bg-amber-50/30 border-gray-300'}`}
                >
                    <MapPin size={20} /> <span>{selectedLocation ? "위치 선택됨" : "위치 추가"}</span>
                </button>
                
                <button 
                    onClick={handleCreate}
                    disabled={diaryTitle.length === 0 || !selectedLocation}
                    className={`w-full py-3 rounded-sm font-medium text-white transition-all shadow-md ${
                        diaryTitle.length === 0 || !selectedLocation
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:shadow-lg' 
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

    // fetchFolder 함수
    const fetchFolder = useCallback(async () => {
        if (!folderId) {
            console.error("❌ folderId가 없습니다.");
            setIsLoading(false);
            return;
        }

        try {
            console.log(`📥 폴더 정보 조회 시작: folderId=${folderId}`);
            
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
        <div className="flex min-h-screen bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-rose-50/50">
            
            {/* 배경 장식 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-40 left-20 w-64 h-64 bg-amber-200/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-40 right-20 w-80 h-80 bg-rose-200/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-orange-200/10 rounded-full blur-3xl"></div>
            </div>
            
            <Sidebar />
            
            <main className="relative z-10 flex-grow ml-32 p-8">
                
                <h1 className="text-3xl font-light tracking-wide text-gray-800 mb-6" 
                    style={{ fontFamily: 'Georgia, serif' }}>
                    📁 {isLoading ? "로딩 중..." : folderTitle}
                </h1>
                
                {/* 지도 영역 */}
                <div className="relative bg-white/90 backdrop-blur-sm rounded-sm border border-amber-100/50 h-[600px] overflow-hidden"
                     style={{ boxShadow: '0 4px 20px rgba(251, 191, 36, 0.08)' }}>
                    
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
                            <span className="italic" style={{ fontFamily: 'Georgia, serif' }}>Google 지도를 로드 중...</span>
                        </div>
                    )}

                    {/* (+) 버튼 - 폴라로이드 스타일 */}
                    <button 
                        onClick={() => setIsDiaryModalOpen(true)}
                        className="absolute bottom-5 right-5 p-3 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-full shadow-lg hover:from-amber-500 hover:to-orange-600 transform hover:scale-105 transition-all z-10" 
                        disabled={isLoading}
                    >
                        <Plus size={30} />
                    </button>
                </div>
                
                {/* 일기 목록 표시 */}
                <div className="mt-6">
                    <h2 className="text-2xl font-light text-gray-800 mb-4 tracking-wide" 
                        style={{ fontFamily: 'Georgia, serif' }}>
                        이 폴더의 일기 ({diaries.length}개)
                    </h2>
                    {diaries.length === 0 ? (
                        <div className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-sm border border-amber-100/50 p-8"
                             style={{ boxShadow: '0 4px 20px rgba(251, 191, 36, 0.08)' }}>
                            <p className="text-gray-500 italic" style={{ fontFamily: 'Georgia, serif' }}>
                                아직 일기가 없습니다. + 버튼을 눌러 첫 일기를 추가해보세요!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-4">
                            {diaries.map((diary) => (
                                <div 
                                    key={diary.diary_id} 
                                    className="p-4 bg-white/90 backdrop-blur-sm rounded-sm border border-amber-100/50 cursor-pointer hover:shadow-lg transition"
                                    style={{ boxShadow: '0 2px 10px rgba(251, 191, 36, 0.06)' }}
                                    onClick={() => navigate(`/diary/${diary.diary_id}`)}
                                >
                                    {diary.main_photo && (
                                        <img 
                                            src={diary.main_photo} 
                                            alt={diary.title} 
                                            className="w-full h-32 object-cover rounded-sm mb-2"
                                        />
                                    )}
                                    <h3 className="font-medium truncate text-gray-800" 
                                        style={{ fontFamily: 'Georgia, serif' }}>
                                        {diary.title}
                                    </h3>
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