// src/pages/DiaryPage.jsx
import Sidebar from "../../components/layout/Sidebar";
import DiaryWrite from "./DiaryWrite";

export default function DiaryPage() {
  return (
    <div className="flex min-h-screen bg-[#fcf9f0] relative">
      
      {/* 🔹 왼쪽 사이드바 */}
      <Sidebar />

      {/* 🔸 메인 영역 */}
      <main className="flex-grow flex flex-col justify-center items-center ml-[100px] px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">일기 작성</h2>
        <DiaryWrite />
      </main>
    </div>
  );
}
