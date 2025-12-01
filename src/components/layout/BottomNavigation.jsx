// src/components/layout/BottomNavigation.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, UserPlus, Bell, User, Plus } from 'lucide-react';

const navItems = [
  { href: '/main', icon: Home, label: '홈' },
  { href: '/friend', icon: UserPlus, label: '친구' },
  { href: '/create', icon: Plus, label: '작성', isCenter: true },
  { href: '/alarm', icon: Bell, label: '알림' },
  { href: '/mypage', icon: User, label: '마이' },
];

export default function BottomNavigation() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50"
         style={{ boxShadow: '0 -2px 10px rgba(0,0,0,0.05)' }}>
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            // 중앙 작성 버튼
            if (item.isCenter) {
              return (
                <Link key={item.href} to={item.href}>
                  <button className="flex flex-col items-center justify-center -mt-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                      <Icon size={28} className="text-white" strokeWidth={2} />
                    </div>
                    <span className="text-[10px] text-gray-600 mt-1 font-medium">
                      {item.label}
                    </span>
                  </button>
                </Link>
              );
            }
            
            // 일반 네비게이션 아이템
            return (
              <Link key={item.href} to={item.href}>
                <button className="flex flex-col items-center justify-center py-2 px-3 min-w-[60px] group">
                  <Icon 
                    size={24} 
                    className={`transition-all ${
                      isActive 
                        ? 'text-amber-600' 
                        : 'text-gray-400 group-hover:text-amber-500'
                    }`}
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                  <span 
                    className={`text-[10px] mt-1 font-medium ${
                      isActive 
                        ? 'text-amber-600' 
                        : 'text-gray-500 group-hover:text-amber-500'
                    }`}
                  >
                    {item.label}
                  </span>
                  
                  {/* Active 인디케이터 */}
                  {isActive && (
                    <div className="absolute bottom-0 w-1 h-1 rounded-full bg-amber-600 mt-1"></div>
                  )}
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}