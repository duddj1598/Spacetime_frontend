import React, { useEffect, useState } from "react";
import { Search, Plus, Calendar, MapPin, Globe, Lock, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BottomNavigation from "../../components/layout/BottomNavigation";

const API_BASE_URL = "http://localhost:8000/api/folder";

const getCurrentUserId = () => {
  return localStorage.getItem("userId") || "test@user.com";
};

/* ===========================
      📌 폴더 생성 팝업
=========================== */
const FolderAddModal = ({ isOpen, onClose, onFolderCreated }) => {
  const [title, setTitle] = useState("");

  if (!isOpen) return null;

  const createFolder = async () => {
    if (title.length < 2) {
      alert("2글자 이상 입력해주세요");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}`, {
        title,
        user_id: getCurrentUserId(),
        is_public: false,
        main_folder_img: "",
      });

      const newFolderId = res.data.folder_id;

      onFolderCreated(newFolderId);
      onClose();
      setTitle("");
    } catch (err) {
      console.error(err);
      alert("폴더 생성 실패");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-bold">나의 기록 폴더 추가</h3>
          <button onClick={onClose}>
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="px-6 py-4">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            폴더 제목
          </label>
          <input
            type="text"
            placeholder="2글자 이상 적어주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-sm border-gray-300"
          />
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={createFolder}
            disabled={title.length < 2}
            className={`w-full py-3 rounded-xl font-bold text-white shadow-md ${
              title.length >= 2
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            생성하기
          </button>
        </div>
      </div>
    </div>
  );
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
   ⭐ MyRecordCard
------------------------------------------------- */
const MyRecordCard = ({ record }) => {
  const VisibilityIcon = record.is_public ? Globe : Lock;

  return (
    <div
      className="bg-white rounded-sm overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      style={{
        boxShadow:
          "0 4px 15px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)",
      }}
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

        <span className="absolute top-3 right-3 text-xs bg-white/95 px-3 py-1.5 rounded-sm shadow-md flex items-center backdrop-blur-sm">
          <Calendar size={12} className="mr-1.5 text-amber-600" />
          폴더
        </span>
      </div>

      <div className="p-5 pb-6 bg-white">
        <h3 className="text-base font-medium text-gray-800 mb-3 truncate">
          {record.title}
        </h3>

        <div className="flex justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <VisibilityIcon size={13} className="text-amber-600/70" />
            <span>{record.is_public ? "공개" : "비공개"}</span>
          </div>
          <span>일기 {record.diary_count || 0}개</span>
        </div>
      </div>
    </div>
  );
};

export default function MainPage() {
  const navigate = useNavigate();

  const [myRecords, setMyRecords] = useState([]);
  const [friendRecords, setFriendRecords] = useState([]);

  const [isLoadingMy, setIsLoadingMy] = useState(true);
  const [isLoadingFriends, setIsLoadingFriends] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMyRecords = async () => {
    setIsLoadingMy(true);
    try {
      const userId = getCurrentUserId();
      const res = await axios.get(`${API_BASE_URL}/list/me?user_id=${userId}`);
      setMyRecords(res.data.folders || []);
    } catch (e) {
      console.error("내 폴더 로드 실패", e);
    } finally {
      setIsLoadingMy(false);
    }
  };

  const fetchFriendRecords = async () => {
    setIsLoadingFriends(true);
    try {
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

  useEffect(() => {
    fetchMyRecords();
    fetchFriendRecords();
  }, []);

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-rose-50/50 pb-20">

      <main className="relative z-10 flex-grow p-8 max-w-screen-xl mx-auto">

        {/* 상단 로고 */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
            <span className="text-2xl">📸</span>
          </div>
          <div>
            <h1 className="text-xl font-light text-gray-800 tracking-wide leading-tight">
              Spacetime Polaroid
            </h1>
            <p className="text-xs text-gray-500">당신의 여행 이야기</p>
          </div>
        </div>

        {/* 폴더 목록 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* 나의 기록 */}
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

          {/* 친구의 기록 */}
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

      {/* ⭐ 폴더 생성 모달 */}
      <FolderAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFolderCreated={(id) => navigate(`/folder/${id}`)}
      />

      {/* ⭐ 하단 네비게이션 */}
      <BottomNavigation onPlusClick={() => setIsModalOpen(true)} />
    </div>
  );
}
