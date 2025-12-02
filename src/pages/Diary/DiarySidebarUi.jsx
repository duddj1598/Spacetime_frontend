import React, { useState } from 'react';
import { Home, UserPlus, Bell, User } from 'lucide-react';
import './Diary.css';

import DiaryWrite from "./DiaryWrite";
import FriendsAdd from "../Friend/FriendsAdd";
import SidebarIcon from "./SidebarIcon";

export default function DiaryWithSidebar() {
  const [page, setPage] = useState('diary');
  return (
    <div className="app-container">
      {/* 사이드바 */}
      <div className="sidebar">
        <SidebarIcon icon={<Home size={24} />} active={page === 'diary'} onClick={() => setPage('diary')} />
        <SidebarIcon icon={<UserPlus size={24} />} active={page === 'friends'} onClick={() => setPage('friends')} />
        <SidebarIcon icon={<Bell size={24} />} />
        <SidebarIcon icon={<User size={24} />} />
      </div>

      {/* 메인 영역 */}
      <div className="main-area">
        {page === 'diary' ? <DiaryWrite /> : <FriendsAdd />}
      </div>
    </div>
  );
}
