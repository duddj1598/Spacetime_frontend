// src/components/layout/Sidebar.jsx
// src/components/layout/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, UserPlus, Bell, User } from 'lucide-react';
import './Diary.css'; // 너의 디자인 CSS 유지

const navItems = [
  { href: '/main', icon: <Home size={24} />, label: '홈' },
  { href: '/friend', icon: <UserPlus size={24} />, label: '친구 추가' },
  { href: '/alarm', icon: <Bell size={24} />, label: '알림' },
  { href: '/mypage', icon: <User size={24} />, label: '마이페이지' },
];

export default function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="sidebar">
      {navItems.map((item) => (
        <Link key={item.href} to={item.href} style={{ textDecoration: 'none' }}>
          <button
            className={`sidebar-icon ${
              pathname === item.href ? 'active' : ''
            }`}
            title={item.label}
          >
            {item.icon}
          </button>
        </Link>
      ))}
    </div>
  );
}