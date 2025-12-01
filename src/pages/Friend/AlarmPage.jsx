// src/pages/Friend/AlarmPage.jsx

import NotificationList from '../../components/friend/NotificationList'; 
import BottomNavigation from '../../components/layout/BottomNavigation';
import { useLocation } from "react-router-dom";
import { Bell, Inbox } from "lucide-react";

export default function AlarmPage() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-rose-50/50 pb-20">
      
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-64 h-64 bg-amber-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-rose-200/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-orange-200/10 rounded-full blur-3xl"></div>
      </div>

      <main className="relative z-10 flex-grow p-6 pt-8 max-w-screen-xl mx-auto w-full">
        
        {/* 페이지 헤더 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
              <Bell className="text-white" size={24} strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-light text-gray-800 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
              알림
            </h1>
          </div>
          <p className="text-sm text-gray-500 ml-14 tracking-wide">
            새로운 소식을 확인하세요
          </p>
        </div>

        {/* 알림 카드 */}
        <div className="w-full">
          <div className="bg-white/90 backdrop-blur-sm rounded-sm border border-amber-100/50 p-8"
               style={{ boxShadow: '0 4px 20px rgba(251, 191, 36, 0.08)' }}>
            
            {/* 수신함 헤더 */}
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <Inbox className="text-amber-600" size={22} strokeWidth={1.5} />
              <h2 className="text-xl font-light text-gray-800 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
                수신함
              </h2>
            </div>

            {/* 알림 리스트 */}
            <NotificationList key={location.pathname} /> 
          </div>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}