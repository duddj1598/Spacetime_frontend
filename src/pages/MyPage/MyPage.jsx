// src/pages/MyPage/MyPage.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { LogOut, Camera } from "lucide-react";

// 컴포넌트
import BottomNavigation from "../../components/layout/BottomNavigation";
import RecordCard from "../../components/main/RecordCard";
import MonthlyRecord from "../../components/main/MonthlyRecord";
import UserProfile from "../../components/common/UserProfile"; 

export default function MyPage() {
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPageData();
  }, []);

  // 마이페이지 전체 데이터 가져오기
  const fetchMyPageData = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.log("❌ 토큰 없음, 로그인 필요");
        window.location.href = "/login";
        return;
      }

      // 1. 사용자 정보 조회
      const userRes = await axios.get("http://localhost:8000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ 사용자 정보:", userRes.data);
      setUser(userRes.data.data);

      // 2. 나의 기록 모아보기 데이터 조회
      const recordsRes = await axios.get("http://localhost:8000/api/user/my-diaries", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ 나의 기록:", recordsRes.data);
      
      // 모든 폴더의 일기를 평면화하여 RecordCard에 전달
      const allDiaries = recordsRes.data.data.flatMap(folder => 
        folder.diaries.map(diary => ({
          diary_id: diary.diary_id,
          title: diary.title,
          imageUrl: diary.main_photo || "/placeholder.png",
          location: diary.location ? `${diary.location.lat}, ${diary.location.lng}` : "",
          theme: diary.theme
        }))
      );

      setRecords(allDiaries);

    } catch (err) {
      console.error("❌ 마이페이지 데이터 조회 실패:", err);
      
      if (err.response?.status === 401) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.clear();
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  // 한 줄 기록 업데이트 콜백
  const handleMonthlyNoteUpdate = (newNote) => {
    setUser(prev => ({
      ...prev,
      monthly_note: newNote
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-rose-50/50">
        <div className="text-xl text-gray-600 italic" style={{ fontFamily: 'Georgia, serif' }}>
          Loading your memories...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-rose-50/50">
        <div className="text-xl text-red-600">사용자 정보를 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-rose-50/50 min-h-screen pb-20">
      
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-64 h-64 bg-amber-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-rose-200/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-orange-200/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* 2. 메인 콘텐츠 영역 */}
      <main className="relative z-10 flex-grow p-6 pt-8 max-w-screen-xl mx-auto w-full">
        
        {/* 상단 유저 정보 + 로그아웃 */}
        <header className="flex items-center justify-between mb-10 p-6 bg-white/90 backdrop-blur-sm rounded-sm border border-amber-100/50"
                style={{ boxShadow: '0 4px 20px rgba(251, 191, 36, 0.08)' }}>
          
          <UserProfile 
            nickname={user.nickname}
            profileImage={user.profile_image}
            friendCount={user.friend_count}
          /> 
          
          <button
            onClick={() => {
              if (window.confirm("로그아웃 하시겠습니까?")) {
                localStorage.clear();
                window.location.href = "/";
              }
            }}
            className="flex items-center gap-2 text-red-500 hover:text-white bg-white hover:bg-red-500 text-sm font-medium px-5 py-2.5 border-2 border-red-500 rounded-sm transition-all shadow-sm hover:shadow-md"
          >
            <LogOut size={16} strokeWidth={1.5} />
            로그아웃
          </button>
        </header>

        {/* 나의 기록 모아보기 */}
        <section className="bg-white/90 backdrop-blur-sm rounded-sm border border-amber-100/50 p-8 mb-8"
                 style={{ boxShadow: '0 4px 20px rgba(251, 191, 36, 0.08)' }}>
          
          {/* 섹션 헤더 */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <Camera className="text-amber-600" size={24} strokeWidth={1.5} />
            <h3 className="text-2xl font-light text-gray-800 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
              나의 기록 모아보기
            </h3>
          </div>
          
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {records.length > 0 ? (
              records.map((record) => (
                <RecordCard 
                  key={record.diary_id}
                  imageUrl={record.imageUrl}
                  title={record.title}
                  location={record.location}
                  date=""
                  onClick={() => {
                    window.location.href = `/diary/${record.diary_id}`;
                  }}
                />
              ))
            ) : (
              <div className="w-full text-center py-16">
                <div className="inline-block p-6 bg-amber-50/50 rounded-sm border-2 border-dashed border-amber-200">
                  <Camera className="text-amber-400 mx-auto mb-3" size={48} strokeWidth={1} />
                  <p className="text-gray-500 italic" style={{ fontFamily: 'Georgia, serif' }}>
                    아직 작성한 기록이 없습니다.
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    첫 여행을 기록해보세요! ✈️
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 이번 달 한 줄 기록 */}
        <section className="flex space-x-6">
          <div className="w-3/5"> 
            <MonthlyRecord 
              monthlyNote={user.monthly_note}
              onUpdate={handleMonthlyNoteUpdate}
            /> 
          </div>
        </section>

      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />

      {/* 스크롤바 숨김 스타일 */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}