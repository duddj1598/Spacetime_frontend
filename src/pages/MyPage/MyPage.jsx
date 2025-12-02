// ==============================
// 📌 MyPage.jsx — 디자인 + 기능 병합 버전
// ==============================
import { useEffect, useState } from "react";
import axios from "axios";
import { LogOut, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

import BottomNavigation from "../../components/layout/BottomNavigation";
import FolderCard from "../../components/mypage/FolderCard";
import MonthlyRecord from "../../components/main/MonthlyRecord";
import UserProfile from "../../components/common/UserProfile"; 

export default function MyPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [folders, setFolders] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPageData();
  }, []);

  // ⭐ 기능: 마이페이지 전체 데이터 가져오기
  const fetchMyPageData = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.log("❌ 토큰 없음");
        navigate("/login");
        return;
      }

      // 1) 사용자 정보
      const userRes = await axios.get("http://localhost:8000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data.data);

      // 2) 폴더 + 일기 정보
      const foldersRes = await axios.get(
        "http://localhost:8000/api/user/my-diaries",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const folderList = foldersRes.data.data.map(folder => ({
        folder_id: folder.folder_id,
        title: folder.title,
        is_public: folder.is_public,
        diary_count: folder.diaries.length,
        mainImage:
          folder.main_folder_img ||
          folder.diaries[0]?.main_photo ||
          "/placeholder.png",
      }));

      setFolders(folderList);
    } catch (err) {
      console.error("❌ 마이페이지 데이터 조회 실패:", err);
      if (err.response?.status === 401) {
        alert("로그인이 만료되었습니다.");
        localStorage.clear();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // ⭐ 기능: 이번달 한 줄 기록 업데이트
  const handleMonthlyNoteUpdate = (newNote) => {
    setUser(prev => ({ ...prev, monthly_note: newNote }));
  };

  // ⭐ 기능: 폴더 공개/비공개 토글
  const handleTogglePublic = (folderId, newIsPublic) => {
    setFolders(prev =>
      prev.map(folder =>
        folder.folder_id === folderId
          ? { ...folder, is_public: newIsPublic }
          : folder
      )
    );
  };

  // ==============================
  // 로딩 상태 UI
  // ==============================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-rose-50/50">
        <div className="text-xl text-gray-600 italic">Loading your memories...</div>
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

  // ==============================
  // 메인 UI 렌더링
  // ==============================
  return (
    <div className="flex flex-col bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-rose-50/50 min-h-screen pb-20">

      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-64 h-64 bg-amber-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-rose-200/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-orange-200/10 rounded-full blur-3xl"></div>
      </div>

      <main className="relative z-10 flex-grow p-6 pt-8 max-w-screen-xl mx-auto w-full">

        {/* 유저정보 + 로그아웃 */}
        <header className="flex items-center justify-between mb-10 p-6 bg-white/90 backdrop-blur-sm rounded-sm border border-amber-100/50 shadow">

          <UserProfile
            nickname={user.nickname}
            profileImage={user.profile_image}
            friendCount={user.friend_count}
          />

          <button
            onClick={() => {
              if (window.confirm("로그아웃 하시겠습니까?")) {
                localStorage.clear();
                navigate("/");
              }
            }}
            className="flex items-center gap-2 text-red-500 hover:text-white bg-white hover:bg-red-500 text-sm px-5 py-2.5 border-2 border-red-500 rounded-sm transition-all shadow-sm hover:shadow-md"
          >
            <LogOut size={16} />
            로그아웃
          </button>
        </header>

        {/* 나의 기록 모아보기 (FolderCard 버전) */}
        <section className="bg-white/90 backdrop-blur-sm rounded-sm border border-amber-100/50 p-8 mb-8 shadow">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <Camera className="text-amber-600" size={24} />
            <h3 className="text-2xl font-light text-gray-800 tracking-wide">
              나의 기록 모아보기
            </h3>
            <span className="text-sm text-gray-500 ml-auto">
              총 {folders.length}개 폴더
            </span>
          </div>

          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {folders.length > 0 ? (
              folders.map((folder) => (
                <FolderCard
                  key={folder.folder_id}
                  folderId={folder.folder_id}
                  title={folder.title}
                  mainImage={folder.mainImage}
                  diaryCount={folder.diary_count}
                  isPublic={folder.is_public}
                  onTogglePublic={handleTogglePublic}
                  onClick={() => navigate(`/folder/${folder.folder_id}`)}
                />
              ))
            ) : (
              <div className="w-full text-center py-16">
                <p className="text-gray-500 italic">아직 작성한 폴더가 없습니다.</p>
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

      {/* 스크롤바 숨김 */}
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
