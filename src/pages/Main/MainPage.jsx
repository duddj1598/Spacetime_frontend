// ==============================
// 📌 FINAL — API 버전 + 폴라로이드 디자인 MainPage.jsx
// ==============================

import React, { useEffect, useState } from 'react';
import { Search, Plus, Calendar, MapPin, Globe, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BottomNavigation from "../../components/layout/BottomNavigation";

const API_BASE_URL = "http://localhost:8000/api/folder";

const getCurrentUserId = () => {
  return localStorage.getItem("userId") || "test@user.com";
};

/* -------------------------------------------------
   Header 디자인
------------------------------------------------- */
const CalendarHeader = ({ title }) => (
  <div className="relative flex justify-between w-full pb-3 mb-6">
    <h2
      className="text-2xl font-light text-gray-800 tracking-wide"
      style={{ fontFamily: "Georgia, serif" }}
    >
      {title}
    </h2>
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-amber-200 via-orange-200 to-transparent"></div>
  </div>
);

/* -------------------------------------------------
   ⭐ MyRecordCard (API용 + 폴라로이드 스타일)
------------------------------------------------- */
const MyRecordCard = ({ record }) => {
  const VisibilityIcon = record.is_public ? Globe : Lock;

  return (
    <div
      className="bg-white rounded-sm overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)" }}
    >
      <div className="relative">
        <img
          src={
            record.main_folder_img ||
            "https://via.placeholder.com/300x200?text=No+Image"
          }
          alt={record.title}
          className="w-full h-48 object-cover"
        />

        <span className="absolute top-3 right-3 text-xs bg-white/95 text-gray-700 px-3 py-1.5 rounded-sm shadow-md flex items-center backdrop-blur-sm">
          <Calendar size={12} className="mr-1.5 text-amber-600" strokeWidth={1.5} />
          폴더
        </span>
      </div>

      <div className="p-5 pb-6 bg-white">
        <h3
          className="text-base font-medium text-gray-800 mb-3 truncate"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {record.title}
        </h3>

        <div className="flex justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1.5">
            <VisibilityIcon
              size={13}
              className="text-amber-600/70"
              strokeWidth={1.5}
            />
            <span>{record.is_public ? "공개" : "비공개"}</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <MapPin size={13} className="text-amber-600/70" />
            <span>일기 {record.diary_count || 0}개</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------
   친구 포스트 카드
------------------------------------------------- */
const FriendPostTile = ({ post }) => (
  <div
    className="bg-white rounded-sm p-3 pb-4 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
    style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}
  >
    <div className="flex items-center justify-between mb-2.5">
      <div className="flex items-center">
        <span className="text-lg mr-2">👤</span>
        <span className="text-xs font-medium text-gray-800">{post.owner_nickname}</span>
      </div>
    </div>

    <div className="bg-gray-50 p-1 rounded-sm mb-2.5">
      <img
        src={
          post.main_folder_img ||
          "https://via.placeholder.com/150x150?text=Folder"
        }
        className="w-full h-28 object-cover rounded-sm"
      />
    </div>

    <p
      className="text-xs text-gray-600 truncate italic"
      style={{ fontFamily: "Georgia, serif" }}
    >
      {post.title}
    </p>
  </div>
);

/* -------------------------------------------------
   📌 MAIN PAGE
------------------------------------------------- */

export default function MainPage() {
  const navigate = useNavigate();

  const [myRecords, setMyRecords] = useState([]);
  const [friendRecords, setFriendRecords] = useState([]);

  const [isLoadingMy, setIsLoadingMy] = useState(true);
  const [isLoadingFriends, setIsLoadingFriends] = useState(true);

  /* ----------- API: 내 폴더 ----------- */
  const fetchMyRecords = async () => {
    try {
      setIsLoadingMy(true);
      const userId = getCurrentUserId();

      const res = await axios.get(
        `${API_BASE_URL}/list/me?user_id=${userId}`
      );

      setMyRecords(res.data.folders || []);
    } catch (e) {
      console.error("내 폴더 로드 실패", e);
    } finally {
      setIsLoadingMy(false);
    }
  };

  /* ----------- API: 친구 폴더 ----------- */
  const fetchFriendRecords = async () => {
    try {
      setIsLoadingFriends(true);
      const userId = getCurrentUserId();

      const res = await axios.get(
        `${API_BASE_URL}/list/friends?user_id=${userId}`
      );

      setFriendRecords(res.data.folders || []);
    } catch (e) {
      console.error("친구 폴더 로드 실패", e);
    } finally {
      setIsLoadingFriends(false);
    }
  };

  /* ----------- 초기 로드 ----------- */
  useEffect(() => {
    fetchMyRecords();
    fetchFriendRecords();
  }, []);

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-rose-50/50 pb-20">

      {/* 메인 컨텐츠 */}
      <main className="relative z-10 flex-grow p-8 max-w-screen-xl ml-20">

        {/* 앱 상단 */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
            <span className="text-2xl">📸</span>
          </div>
          <div>
            <h1
              className="text-xl font-light text-gray-800 tracking-wide leading-tight"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Spacetime Polaroid
            </h1>
            <p className="text-xs text-gray-500 tracking-wide">
              당신의 여행 이야기
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ------------------ 나의 기록 ------------------ */}
          <section>
            <CalendarHeader title="나의 기록" />

            {isLoadingMy ? (
              <p className="text-gray-500">불러오는 중...</p>
            ) : (
              <div className="mt-6 space-y-6">
                {myRecords.map((record) => (
                  <div
                    key={record.folder_id}
                    onClick={() => navigate(`/folder/${record.folder_id}`)}
                  >
                    <MyRecordCard record={record} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ------------------ 친구의 기록 ------------------ */}
          <section>
            <CalendarHeader title="친구의 기록" />

            {isLoadingFriends ? (
              <p className="text-gray-500">불러오는 중...</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 mt-6">
                {friendRecords.map((post) => (
                  <FriendPostTile
                    key={post.folder_id}
                    post={post}
                    onClick={() => navigate(`/folder/${post.folder_id}`)}
                  />
                ))}
              </div>
            )}
          </section>

        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}
