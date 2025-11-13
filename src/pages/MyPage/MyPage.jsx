// src/pages/MyPage/MyPage.jsx


// 경로 수정
import Sidebar from '../../components/layout/Sidebar';
import RecordCard from '../../components/main/RecordCard';
import StatSummary from '../../components/common/StatSummary';
import MonthlyRecord from '../../components/main/MonthlyRecord';
import UserProfile from '../../components/common/UserProfile'; 

const records = [
  { imageUrl: "/hongkong.png", title: "홍콩 탐방기", location: "홍콩", date: "2025.02.15" },
  { imageUrl: "/jeju.png", title: "떠나요~ 제주도 같이!!", location: "제주도", date: "2024.12.08" },
];

export default function MyPage() { 
  return (
    <div className="flex bg-gray-50 min-h-screen">
      
      {/* 1. 사이드바 */}
      <Sidebar />
      
      {/* 2. 메인 콘텐츠 영역 (사이드바 폭만큼 마진을 줍니다) */}
      <main className="flex-grow ml-20 p-8">
        
        {/* 상단 프로필 및 로그아웃 */}
        <header className="flex items-center justify-between mb-8 p-4 bg-white rounded-lg shadow-md border border-gray-100">
          
          {/* UserProfile 컴포넌트 */}
          <UserProfile /> 
          
          <button className="text-red-500 hover:text-red-600 text-sm font-semibold p-2 border border-red-500 rounded-full px-4 transition-colors">
            로그아웃
          </button>
        </header>

        {/* '나의 기록 모아보기' 섹션 */}
        <section className="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6 border-b pb-2">나의 기록 모아보기</h3>
          
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {/* 데이터 기반 카드 출력 */}
            {records.map((record, index) => (
              <RecordCard 
                key={index} 
                imageUrl={record.imageUrl} 
                title={record.title} 
                location={record.location} 
                date={record.date}
              />
            ))}
            {/* 마지막 '나만보기' 카드 */}
            <RecordCard 
              imageUrl="/방어.png" 
              title="기다리고 기다리던 방어 먹방"
              date="2024.11.30"
              location=""
              isPlaceholder={true}
            />
          </div>
        </section>

        {/* '이번 달의 한 줄 기록' 및 '여행 통계' 섹션 */}
        <section className="flex space-x-6">
          
          {/* 한 줄 기록 카드 */}
          <div className="w-3/5"> 
            <MonthlyRecord /> 
          </div>
          
          {/* 여행 통계 요약 */}
          <div className="w-2/5">
            <StatSummary />
          </div>
          
        </section>
      </main>
    </div>
  );
}