// src/components/layout/Sidebar.jsx

import { Link } from 'react-router-dom'; // React Router Dom Link 사용
import { useLocation } from 'react-router-dom'; // React Router Dom useLocation 사용

// 아이콘 및 경로 데이터
const navItems = [
  { href: '/main', icon: '🏠', label: '홈' },
  { href: '/friend', icon: '👤', label: '친구 관리' },
  { href: '/diary', icon: '➕', label: '기록 작성' },
  { href: '/alarm', icon: '🔔', label: '알림' }, 
  { href: '/mypage', icon: '🧑', label: '마이 페이지' }, // 마이 페이지 경로
];

const Sidebar = () => {
  const location = useLocation(); // usePathname 대신 사용
  const pathname = location.pathname;

  return (
    <aside className="fixed left-0 top-0 h-full w-20 bg-white shadow-xl flex flex-col items-center justify-center p-4 border-r border-gray-100">
      <nav className="flex flex-col space-y-8">
        {navItems.map((item) => (
          <Link key={item.href} to={item.href}> 
            <div
              // 현재 경로에 따라 아이콘 색상 변경
              className={`text-3xl p-2 rounded-full transition-colors ${
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