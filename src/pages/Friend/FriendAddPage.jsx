// src/pages/FriendsAddPage.jsx
import Sidebar from "../../components/layout/Sidebar";
import FriendsAdd from "./FriendsAdd";

export default function FriendsAddPage() {
  return (
    <div className="flex min-h-screen bg-[#fcf9f0] relative">
      <Sidebar />
      <main className="flex-grow flex flex-col justify-center items-center ml-[100px] px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">친구 추가</h2>
        <FriendsAdd />
      </main>
    </div>
  );
}
