// src/pages/Friend/AlarmPage.jsx

// 경로 수정
import Sidebar from '../../components/layout/Sidebar';
import NotificationList from '../../components/friend/NotificationList'; 
import { useLocation } from "react-router-dom";

export default function AlarmPage() {
  const location = useLocation();

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-grow ml-40 p-8">
        <h1 className="text-2xl font-bold mb-8">알림 페이지</h1>
        <div className="max-w-xl">
          <h2 className="text-xl font-bold mb-4">수신함</h2>

          <NotificationList key={location.pathname} /> 
        </div>
      </main>
    </div>
  );
}
