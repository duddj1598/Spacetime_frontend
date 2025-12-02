// src/pages/FriendsAddPage.jsx
import BottomNavigation from "../../components/layout/BottomNavigation";
import FriendsAdd from "./FriendsAdd";
import { UserPlus } from "lucide-react";

export default function FriendsAddPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-rose-50/50 pb-20">
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-64 h-64 bg-amber-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-rose-200/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-orange-200/10 rounded-full blur-3xl"></div>
      </div>

      <main className="relative z-10 flex-grow flex flex-col px-6 py-8 max-w-screen-xl mx-auto w-full">
        {/* 페이지 헤더 - 왼쪽 정렬 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
              <UserPlus className="text-white" size={24} strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-light text-gray-800 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
              친구 추가
            </h2>
          </div>
          <p className="text-sm text-gray-500 ml-14 tracking-wide">
            여행의 추억을 함께 나눌 친구를 찾아보세요
          </p>
        </div>

        <FriendsAdd />
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}