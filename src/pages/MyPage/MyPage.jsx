// src/pages/MyPage/MyPage.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 컴포넌트
import Sidebar from "../../components/layout/Sidebar";
import FolderCard from "../../components/mypage/FolderCard";
import MonthlyRecord from "../../components/main/MonthlyRecord";
import UserProfile from "../../components/common/UserProfile"; 

export default function MyPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [folders, setFolders] = useState([]); // ⭐️ 일기 → 폴더로 변경
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
        navigate("/login");
        return;
      }

      // 1. 사용자 정보 조회
      const userRes = await axios.get("http://localhost:8000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ 사용자 정보:", userRes.data);
      setUser(userRes.data.data);

      // 2. ⭐️ 나의 폴더 목록 조회 (일기 포함)
      const foldersRes = await axios.get("http://localhost:8000/api/user/my-diaries", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ 나의 폴더:", foldersRes.data);
      
      // ⭐️ 폴더 데이터 그대로 사용
      const folderList = foldersRes.data.data.map(folder => ({
        folder_id: folder.folder_id,
        title: folder.title,
        is_public: folder.is_public,
        main_folder_img: folder.main_folder_img,
        diary_count: folder.diaries.length,
        // 첫 번째 일기의 사진을 대표 이미지로 사용
        mainImage: folder.main_folder_img || (folder.diaries[0]?.main_photo) || null
      }));

      setFolders(folderList);

    } catch (err) {
      console.error("❌ 마이페이지 데이터 조회 실패:", err);
      
      if (err.response?.status === 401) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.clear();
        navigate("/login");
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

  // ⭐️ 폴더 공개 설정 변경 콜백
  const handleTogglePublic = (folderId, newIsPublic) => {
    setFolders(prev => 
      prev.map(folder => 
        folder.folder_id === folderId 
          ? { ...folder, is_public: newIsPublic }
          : folder
      )
    );
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
      
      {/* 2. 메인 콘텐츠 영역 */}
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
              navigate("/login");
            }}
            className="text-red-500 hover:text-red-600 text-sm font-semibold p-2 border border-red-500 rounded-full px-4 transition-colors"
          >
            로그아웃
          </button>
        </header>

        {/* ⭐️ 나의 폴더 모아보기 */}
        <section className="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6 border-b pb-2">
            <h3 className="text-xl font-semibold">나의 기록 모아보기</h3>
            <span className="text-sm text-gray-500">
              총 {folders.length}개 폴더
            </span>
          </div>
          
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {folders.length > 0 ? (
              folders.map((folder) => (
                <FolderCard 
                  key={folder.folder_id}
                  folderId={folder.folder_id}
                  title={folder.title}
                  mainImage={folder.mainImage}
                  diaryCount={folder.diary_count}
                  isPublic={folder.is_public}
                  onClick={() => navigate(`/folder/${folder.folder_id}`)}
                  onTogglePublic={handleTogglePublic}
                />
              ))
            ) : (
              <div className="w-full text-center text-gray-500 py-12">
                <p className="text-lg mb-2">아직 작성한 폴더가 없습니다.</p>
                <p className="text-sm">첫 여행 폴더를 만들어보세요! 📁✈️</p>
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