// src/pages/Friend/AlarmPage.jsx

// 경로 수정
import Sidebar from '../../components/layout/Sidebar';
import NotificationList from '../../components/friend/NotificationList'; 

export default function AlarmPage() {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      
      {/* 1. 사이드바 */}
      <Sidebar />
      
      {/* 2. 메인 콘텐츠 영역 (사이드바 폭만큼 마진을 줍니다) */}
      <main className="flex-grow ml-20 p-8">
        
        {/* 페이지 제목 */}
        <h1 className="text-2xl font-bold text-gray-800 mb-8">알림 페이지</h1>
        
        {/* 알림 수신함 컴포넌트 배치 */}
        <div className="max-w-xl">
          <h2 className="text-xl font-bold text-gray-700 mb-4">수신함</h2>
          <NotificationList />
        </div>
        
      </main>
    </div>
  );
}