import React, { useState, useEffect } from 'react';
import { Search, Plus, Calendar, MapPin, Globe, Lock, X } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Sidebar from '../../components/layout/Sidebar'; 

const API_BASE_URL = "http://localhost:8000/api/folder"; 

// ⭐️ JWT에서 userId 가져오기 ⭐️
const getCurrentUserId = () => {
    return localStorage.getItem("userId") || "test@user.com";
};


// --- FolderAddModal 컴포넌트 ---
const FolderAddModal = ({ isOpen, onClose, onFolderCreated }) => {
    const [folderTitle, setFolderTitle] = useState(''); 

    if (!isOpen) return null;
    
    const handleCreate = async () => {
        if (folderTitle.length < 2) {
            alert("폴더 제목을 2글자 이상 입력해주세요.");
            return;
        }

        try {
            const currentUserId = getCurrentUserId();
            
            const response = await axios.post(`${API_BASE_URL}`, {
                title: folderTitle,
                user_id: currentUserId, 
                is_public: false,  // ⭐️ 기본값을 비공개로 변경
                main_folder_img: "", 
            });

            const newFolderId = response.data.folder_id;
            
            if (!newFolderId) throw new Error("서버에서 folder_id를 받지 못했습니다.");

            onClose(); 
            onFolderCreated(newFolderId); 

        } catch (error) {
            console.error("폴더 생성 실패:", error);
            alert("폴더 생성 중 오류가 발생했습니다."); 
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

// ⭐️ 내 폴더 카드 컴포넌트 ⭐️
const MyRecordCard = ({ record }) => {
    const VisibilityIcon = record.is_public ? Globe : Lock; 
    
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="relative">
                <img 
                    src={record.main_folder_img || "https://via.placeholder.com/300x200?text=No+Image"} 
                    alt={record.title} 
                    className="w-full h-40 object-cover" 
                />
                <span className="absolute top-2 right-2 text-xs bg-black bg-opacity-50 text-white px-2 py-1 rounded-full flex items-center gap-1">
                    <VisibilityIcon size={12} />
                    {record.is_public ? '공개' : '비공개'}
                </span>
            </div>
            <div className="p-4">
                <h3 className="text-base font-semibold text-gray-800 mb-2 truncate">{record.title}</h3>
                <div className="flex justify-between text-xs text-gray-500">
                    <span>일기 {record.diary_count || 0}개</span>
                </div>
            </div>
        </div>
    );
};

// ⭐️ 친구 폴더 카드 컴포넌트 ⭐️
const FriendFolderCard = ({ folder, onClick }) => {
    return (
        <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-shadow"
            onClick={onClick}
        >
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-lg">👤</span>
                    <span className="text-xs font-semibold text-gray-800">{folder.owner_nickname}</span>
                </div>
            </div>
            
            {folder.main_folder_img && (
                <img 
                    src={folder.main_folder_img} 
                    alt={folder.title} 
                    className="w-full h-24 object-cover rounded mb-2" 
                />
            )}
            
            <h4 className="text-sm font-semibold text-gray-800 truncate mb-1">{folder.title}</h4>
            <p className="text-xs text-gray-500">일기 {folder.diary_count || 0}개</p>
        </div>
    );
};


// --- 메인 컴포넌트 ---
export default function MainPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const [myRecords, setMyRecords] = useState([]);
    const [friendFolders, setFriendFolders] = useState([]);
    const [isLoadingMy, setIsLoadingMy] = useState(true);
    const [isLoadingFriends, setIsLoadingFriends] = useState(true);
    
    // ⭐️ 내 폴더 목록 로드 ⭐️
    const fetchMyRecords = async () => {
        setIsLoadingMy(true);
        try {
            const currentUserId = getCurrentUserId();
            const response = await axios.get(`${API_BASE_URL}/list/me?user_id=${currentUserId}`);
            
            console.log("✅ 내 폴더 목록:", response.data);
            setMyRecords(response.data.folders || []);
        } catch (error) {
            console.error("❌ 내 폴더 로드 실패:", error);
            setMyRecords([]);
        } finally {
            setIsLoadingMy(false);
        }
    };

    // ⭐️ 친구 폴더 목록 로드 ⭐️
    const fetchFriendFolders = async () => {
        setIsLoadingFriends(true);
        try {
            const currentUserId = getCurrentUserId();
            const response = await axios.get(`${API_BASE_URL}/list/friends?user_id=${currentUserId}`);
            
            console.log("✅ 친구 폴더 목록:", response.data);
            setFriendFolders(response.data.folders || []);
        } catch (error) {
            console.error("❌ 친구 폴더 로드 실패:", error);
            setFriendFolders([]);
        } finally {
            setIsLoadingFriends(false);
        }
    };

    // 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        fetchMyRecords();
        fetchFriendFolders();
    }, []); 

    // 폴더 생성 성공 후 처리
    const handleModalCreationSuccess = (newFolderId) => {
        fetchMyRecords(); 
        navigate(`/folder/${newFolderId}`);
    };

    return (
        <div className="relative flex min-h-screen bg-gray-50 pt-2 pb-10">
            
            <Sidebar />
            
            <main className="flex-grow ml-20 p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    {/* ⭐️ 왼쪽: 나의 기록 섹션 ⭐️ */}
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

                        {isLoadingMy ? (
                            <p className="mt-4 text-center text-gray-500">기록을 불러오는 중...</p>
                        ) : (
                            <div className="mt-4 space-y-6">
                                {myRecords.length === 0 ? (
                                    <p className="text-center text-gray-500">
                                        아직 기록된 폴더가 없습니다.<br/>
                                        + 버튼을 눌러 첫 폴더를 만들어보세요!
                                    </p>
                                ) : (
                                    myRecords.map(record => (
                                        <div 
                                            key={record.folder_id} 
                                            onClick={() => navigate(`/folder/${record.folder_id}`)}
                                        >
                                            <MyRecordCard record={record} /> 
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </section>
                    
                    {/* ⭐️ 오른쪽: 친구의 기록 섹션 ⭐️ */}
                    <section>
                        <CalendarHeader title="친구의 기록" />
                        
                        {isLoadingFriends ? (
                            <p className="mt-4 text-center text-gray-500">친구 폴더를 불러오는 중...</p>
                        ) : (
                            <>
                                {friendFolders.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8">
                                        <p className="mb-2">친구의 공개 폴더가 없습니다.</p>
                                        <p className="text-sm">친구를 추가하거나 친구가 폴더를 공개할 때까지 기다려보세요!</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        {friendFolders.map(folder => (
                                            <FriendFolderCard 
                                                key={folder.folder_id} 
                                                folder={folder}
                                                onClick={() => navigate(`/folder/${folder.folder_id}`)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                </div>
            </main>
            
            <FolderAddModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onFolderCreated={handleModalCreationSuccess}
            />
        </div>
    );
}