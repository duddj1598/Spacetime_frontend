import React from 'react';
import { Search, Plus, Calendar, MapPin, Globe, Lock } from 'lucide-react'; 

// Sidebar 컴포넌트 임포트 (경로 확인: src/Main/MainPage.jsx 기준)
import Sidebar from '../components/layout/Sidebar'; 

// --- 목업 데이터 ---
const MY_RECORDS = [
    { id: 1, title: "기다리고 기다린 방어 횟밥", date: "2024.11.25", visibility: "public", location: "부산광역시 남구", imgUrl: "https://via.placeholder.com/300x200?text=Fish+Food" },
    { id: 2, title: "일본에서 가을 느끼기 ~", date: "2023.10.10", visibility: "public", location: "일본, 교토", imgUrl: "https://via.placeholder.com/300x200?text=Autumn+Kyoto" },
    { id: 3, title: "홍콩 맛집 탐방하기", date: "2023.07.21", visibility: "public", location: "홍콩", imgUrl: "https://via.placeholder.com/300x200?text=HongKong+Night" },
];

const FRIEND_RECORDS = [
    { id: 1, friend: "이지우", date: "2024.11.04", caption: "나도 왔다 디즈니씨", imgUrl: "https://via.placeholder.com/150x150?text=Friend1", avatar: "👤" },
    { id: 2, friend: "백도윤", date: "2024.10.25", caption: "이 맛에 새우 먹지~", imgUrl: "https://via.placeholder.com/150x150?text=Friend2", avatar: "👤" },
    { id: 3, friend: "김하윤", date: "2024.09.04", caption: "돌하르방반방", imgUrl: "https://via.placeholder.com/150x150?text=Friend3", avatar: "👤" },
    { id: 4, friend: "정하준", date: "2024.09.01", caption: "여행 싱글 챌린지", imgUrl: "https://via.placeholder.com/150x150?text=Friend4", avatar: "👤" },
    { id: 5, friend: "백서아", date: "2024.08.25", caption: "이게 대한민국 바다라구?", imgUrl: "https://via.placeholder.com/150x150?text=Friend5", avatar: "👤" },
    { id: 6, friend: "이재원", date: "2024.05.13", caption: "에펠탑 심쿵 실물", imgUrl: "https://via.placeholder.com/150x150?text=Friend6", avatar: "👤" },
];

// --- 서브 컴포넌트 ---

const CalendarHeader = ({ title }) => (
    // ⭐️ 수정: 달력 배경과 + 버튼 관련 로직 모두 제거. 제목과 구분선만 남김.
    <div className="relative flex justify-between w-full pb-2 mb-4 border-b border-gray-300">
        <h2 className="text-xl font-bold text-gray-700">{title}</h2>
        {/* + 버튼 로직 삭제됨 */}
    </div>
);

const MyRecordCard = ({ record }) => {
    const VisibilityIcon = record.visibility === 'public' ? Globe : Lock; 
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="relative">
                <img src={record.imgUrl} alt={record.title} className="w-full h-40 object-cover" />
                <span className="absolute top-2 right-2 text-sm bg-black bg-opacity-50 text-white px-2 py-0.5 rounded-full flex items-center">
                    <Calendar size={12} className="mr-1" /> {record.date.split('.').slice(0, 2).join('.')}
                </span>
            </div>
            <div className="p-4">
                <h3 className="text-base font-semibold text-gray-800 mb-2 truncate">{record.title}</h3>
                <div className="flex justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                        <VisibilityIcon size={12} />
                        <span>{record.visibility}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <MapPin size={12} />
                        <span className="truncate max-w-[100px]">{record.location}</span>
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
    return (
        // 전체 컨테이너
        <div className="relative flex min-h-screen bg-gray-50 pt-2 pb-10">
            
            <Sidebar />
            
            {/* 메인 콘텐츠 영역 */}
            <main className="flex-grow ml-20 p-8">
                
                {/* 2단 레이아웃 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    {/* 나의 기록 */}
                    <section>
                        {/* ⭐️ 수정된 CalendarHeader 사용 */}
                        <CalendarHeader title="나의 기록" /> 
                        <div className="mt-4 space-y-6">
                            {MY_RECORDS.map(record => (
                                <MyRecordCard key={record.id} record={record} />
                            ))}
                        </div>
                    </section>
                    
                    {/* 남의 기록 */}
                    <section>
                        {/* ⭐️ 수정된 CalendarHeader 사용 */}
                        <CalendarHeader title="남의 기록" />
                        
                        {/* 해시태그 검색 바 */}
                        <div className="flex items-center border border-gray-300 rounded-full p-2 mt-4 mb-6 bg-white shadow-sm">
                            <Search size={18} className="text-gray-500 ml-2" />
                            <input 
                                type="text" 
                                placeholder="해시태그 검색" 
                                className="w-full px-3 py-1 focus:outline-none text-sm text-gray-700"
                            />
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-700 mb-4">친구의 기록</h3>
                        
                        {/* 친구 포스트 그리드 */}
                        <div className="grid grid-cols-2 gap-4">
                            {FRIEND_RECORDS.map(post => (
                                <FriendPostTile key={post.id} post={post} />
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}