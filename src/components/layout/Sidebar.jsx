// src/components/layout/Sidebar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

// 아이콘 및 경로 데이터
const navItems = [
  // ⭐️ 여기를 수정합니다. 홈 버튼을 '/main' 경로로 변경.
  { href: '/main', icon: '🏠', label: '메인 홈' }, 
  { href: '/friend', icon: '👤', label: '친구 관리' },
  { href: '/diary', icon: '➕', label: '기록 작성' },
  { href: '/alarm', icon: '🔔', label: '알림' }, 
  { href: '/mypage', icon: '🧑', label: '마이 페이지' },
];

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <aside className="fixed left-0 top-0 h-full w-20 bg-white shadow-xl flex flex-col items-center justify-center p-4 border-r border-gray-100">
      <nav className="flex flex-col space-y-8">
        {navItems.map((item) => (
          <Link key={item.href} to={item.href}> 
            <div
              // 현재 경로에 따라 아이콘 색상 변경
              className={`text-3xl p-2 rounded-full transition-colors ${
                // 현재 주소와 아이템의 경로가 일치하는지 확인
                pathname === item.href
                  ? 'bg-amber-100 text-amber-700 shadow-inner' // 활성화 상태
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100' // 비활성화 상태
              }`}
              title={item.label}
            >
              {item.icon}
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;