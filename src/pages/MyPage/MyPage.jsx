// src/pages/MyPage/MyPage.jsx

import { useEffect, useState } from "react";
import axios from "axios";

// 컴포넌트
import Sidebar from "../../components/layout/Sidebar";
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">사용자 정보를 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      
      {/* 1. 사이드바 */}
      <Sidebar />
      
      {/* 2. 메인 콘텐츠 영역 - 간격 옵션 */}
      {/* 
        ml-20 = 80px (기존)
        ml-24 = 96px
        ml-28 = 112px
        ml-32 = 128px (현재)
        ml-36 = 144px
        ml-40 = 160px
        
        또는 직접 px 값 사용:
        style={{ marginLeft: '120px' }}
      */}
      <main className="flex-grow ml-32 p-8 pl-12">
        
        {/* 상단 유저 정보 + 로그아웃 */}
        <header className="flex items-center justify-between mb-8 p-4 bg-white rounded-lg shadow-md border border-gray-100">
          
          <UserProfile 
            nickname={user.nickname}
            profileImage={user.profile_image}
            friendCount={user.friend_count}
          /> 
          
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="text-red-500 hover:text-red-600 text-sm font-semibold p-2 border border-red-500 rounded-full px-4 transition-colors"
          >
            로그아웃
          </button>
        </header>

        {/* 나의 기록 모아보기 */}
        <section className="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6 border-b pb-2">나의 기록 모아보기</h3>
          
          <div className="flex space-x-6 overflow-x-auto pb-4">
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
              <div className="text-gray-500 py-8">
                아직 작성한 기록이 없습니다. 첫 여행을 기록해보세요! ✈️
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
    </div>
  );
}