import React, { useState, useEffect } from 'react';
import { Search, Plus, Calendar, MapPin, Globe, Lock, X } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Sidebar 컴포넌트 임포트 (경로: src/pages/Main/MainPage.jsx 기준)
import Sidebar from '../../components/layout/Sidebar'; 

const API_BASE_URL = "http://localhost:8000/api/folder"; 
const currentUserId = "test@user.com"; 

// --- API 호출 실패 시 사용될 목업 데이터 ---
const FALLBACK_RECORDS = [
    { id: 99, title: "여행 기록 없음", date: "N/A", visibility: "public", location: "시작하세요", imgUrl: "https://via.placeholder.com/300x200?text=Start+Here" },
];

const FRIEND_RECORDS = [
    { id: 1, friend: "이지우", date: "2024.11.04", caption: "나도 왔다 디즈니씨", imgUrl: "https://via.placeholder.com/150x150?text=Friend1", avatar: "👤" },
    { id: 2, friend: "백도윤", date: "2024.10.25", caption: "이 맛에 새우 먹지~", imgUrl: "https://via.placeholder.com/150x150?text=Friend2", avatar: "👤" },
    { id: 3, friend: "김하윤", date: "2024.09.04", caption: "돌하르방반방", imgUrl: "https://via.placeholder.com/150x150?text=Friend3", avatar: "👤" },
    { id: 4, friend: "정하준", date: "2024.09.01", caption: "여행 싱글 챌린지", imgUrl: "https://via.placeholder.com/150x150?text=Friend4", avatar: "👤" },
    { id: 5, friend: "백서아", date: "2024.08.25", caption: "이게 대한민국 바다라구?", imgUrl: "https://via.placeholder.com/150x150?text=Friend5", avatar: "👤" },
    { id: 6, friend: "이재원", date: "2024.05.13", caption: "에펠탑 심쿵 실물", imgUrl: "https://via.placeholder.com/150x150?text=Friend6", avatar: "👤" },
];

// --- ⭐️ FolderAddModal 컴포넌트 (STEP 1: API 호출 및 ID 반환) ⭐️ ---
const FolderAddModal = ({ isOpen, onClose, onFolderCreated }) => {
    const [folderTitle, setFolderTitle] = useState(''); 
    const navigate = useNavigate(); 

    if (!isOpen) return null;
    
    const handleCreate = async () => {
        if (folderTitle.length < 2) {
            alert("폴더 제목을 2글자 이상 입력해주세요.");
            return;
        }

        try {
            // 1. ⭐️ API 호출: 새 폴더 생성 (POST /api/folder) ⭐️
            const response = await axios.post(`${API_BASE_URL}`, {
                title: folderTitle,
                user_id: currentUserId, 
                is_public: true, 
                main_folder_img: "", 
            });

            const newFolderId = response.data.folder_id;
            
            if (!newFolderId) throw new Error("서버에서 folder_id를 받지 못했습니다.");

            onClose(); 
            
            // 2. ⭐️ 생성 성공 후 콜백 실행 (MainPage에서 목록 갱신 및 네비게이션 담당) ⭐️
            onFolderCreated(newFolderId); 

        } catch (error) {
            console.error("폴더 생성 실패:", error);
            alert("폴더 생성 중 오류가 발생했습니다. 서버 상태를 확인하세요."); 
        } finally {
            setFolderTitle('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100">
                
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">나의 기록 폴더 추가</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        폴더 제목
                    </label>
                    <input
                        type="text"
                        value={folderTitle}
                        onChange={(e) => setFolderTitle(e.target.value)}
                        placeholder="2글자 이상 적어주세요."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        minLength={2}
                    />
                </div>

                <div className="p-6 pt-0">
                    <button
                        onClick={handleCreate}
                        disabled={folderTitle.length < 2}
                        className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-md ${
                            folderTitle.length >= 2 
                                ? 'bg-indigo-600 hover:bg-indigo-700'
                                : 'bg-gray-300 cursor-not-allowed text-gray-600'
                        } border border-gray-300`} 
                    >
                        생성하기
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- 서브 컴포넌트 ---
const CalendarHeader = ({ title, showAddButton = false, onAddClick }) => (
    <div className="relative flex justify-between w-full pb-2 mb-4 border-b border-gray-300">
        <h2 className="text-xl font-bold text-gray-700">{title}</h2>
        
        {showAddButton && (
            <button 
                className="text-gray-700 hover:text-black transition-colors"
                onClick={onAddClick}
            >
                <Plus size={24} />
            </button>
        )}
    </div>
);

const MyRecordCard = ({ record }) => {
    const visibilityStatus = record.visibility || (record.is_public ? 'public' : 'private');
    const VisibilityIcon = visibilityStatus === 'public' ? Globe : Lock; 
    
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="relative">
                <img src={record.imgUrl || record.main_folder_img || "placeholder-url"} alt={record.title} className="w-full h-40 object-cover" />
                <span className="absolute top-2 right-2 text-sm bg-black bg-opacity-50 text-white px-2 py-0.5 rounded-full flex items-center">
                    <Calendar size={12} className="mr-1" /> {record.date ? record.date.split('.').slice(0, 2).join('.') : "N/A"}
                </span>
            </div>
            <div className="p-4">
                <h3 className="text-base font-semibold text-gray-800 mb-2 truncate">{record.title}</h3>
                <div className="flex justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                        <VisibilityIcon size={12} />
                        <span>{visibilityStatus}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <MapPin size={12} />
                        <span className="truncate max-w-[100px]">{record.location || '위치 정보 없음'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FriendPostTile = ({ post }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 cursor-pointer hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
                <span className="text-lg mr-2">{post.avatar}</span>
                <span className="text-xs font-semibold text-gray-800">{post.friend}</span>
            </div>
            <span className="text-[10px] text-gray-500">{post.date}</span>
        </div>
        
        <img src={post.imgUrl} alt={post.caption} className="w-full h-24 object-cover rounded mb-2" />
        
        <p className="text-xs text-gray-600 truncate">{post.caption}</p>
    </div>
);


// --- 메인 컴포넌트 ---
export default function MainPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // ⭐️ API 데이터를 저장할 상태 ⭐️
    const [myRecords, setMyRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // ⭐️ 데이터 로드 함수 ⭐️
    const fetchMyRecords = async () => {
        setIsLoading(true);
        try {
            // 405 오류 해결: API 경로 '/list/me' 사용
            const response = await axios.get(`${API_BASE_URL}/list/me?user_id=${currentUserId}`);
            
            setMyRecords(response.data.folders || response.data); 
        } catch (error) {
            console.error("폴더 리스트 로드 실패:", error);
            setMyRecords(FALLBACK_RECORDS); // 실패 시 목업 데이터 사용
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyRecords();
    }, []); 

    // ⭐️ 폴더 생성 성공 후: 목록 갱신 및 ID 기반 페이지 이동 ⭐️
    const handleModalCreationSuccess = (newFolderId) => {
        // 1. 목록 갱신 (새 폴더가 메인 화면에 보이도록)
        fetchMyRecords(); 
        // 2. ⭐️ 폴더 ID 기반 페이지로 이동 (http://localhost:5173/folder/ID) ⭐️
        navigate(`/folder/${newFolderId}`);
    };

    return (
        <div className="relative flex min-h-screen bg-gray-50 pt-2 pb-10">
            
            <Sidebar />
            
            <main className="flex-grow ml-20 p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    {/* 나의 기록 섹션 */}
                    <section>
                        <div className="relative flex justify-between w-full pb-2 mb-4 border-b border-gray-300">
                            <h2 className="text-xl font-bold text-gray-700">나의 기록</h2>
                            <button 
                                className="text-gray-700 hover:text-black transition-colors"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <Plus size={24} />
                            </button>
                        </div>

                        {isLoading ? (
                            <p className="mt-4 text-center text-gray-500">기록을 불러오는 중...</p>
                        ) : (
                            <div className="mt-4 space-y-6">
                                {myRecords.length === 0 ? (
                                    <p className="text-center text-gray-500">아직 기록된 폴더가 없습니다.</p>
                                ) : (
                                    myRecords.map(record => (
                                        <div 
                                            key={record.id || record.folder_id} 
                                            // 폴더를 클릭하면 해당 폴더 페이지로 이동
                                            onClick={() => navigate(`/folder/${record.id || record.folder_id}`)}
                                        >
                                            <MyRecordCard record={record} /> 
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </section>
                    
                    {/* 남의 기록 섹션 (유지) */}
                    <section>
                        <CalendarHeader title="남의 기록" />
                        
                        <div className="flex items-center border border-gray-300 rounded-full p-2 mt-4 mb-6 bg-white shadow-sm">
                            <Search size={18} className="text-gray-500 ml-2" />
                            <input 
                                type="text" 
                                placeholder="해시태그 검색" 
                                className="w-full px-3 py-1 focus:outline-none text-sm text-gray-700"
                            />
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-700 mb-4">친구의 기록</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {FRIEND_RECORDS.map(post => (
                                <FriendPostTile key={post.id} post={post} />
                            ))}
                        </div>
                    </section>
                </div>
            </main>
            
            {/* ⭐️ FolderAddModal 호출 및 onFolderCreated prop 연결 ⭐️ */}
            <FolderAddModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onFolderCreated={handleModalCreationSuccess}
            />
        </div>
    );
}