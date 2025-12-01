// src/components/layout/BottomNavigation.jsx

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, UserPlus, Bell, User, Plus } from "lucide-react";

// 전체 네비게이션 항목
const navItems = [
  { href: "/main", icon: Home, label: "홈" },
  { href: "/friend", icon: UserPlus, label: "친구" },

  // ⭐ 메인에서만 나타날 중앙 버튼
  { icon: Plus, label: "작성", isCenter: true },

  { href: "/alarm", icon: Bell, label: "알림" },
  { href: "/mypage", icon: User, label: "마이" },
];

export default function BottomNavigation({ onPlusClick }) {
  const { pathname } = useLocation();

  // ⭐ 메인에서만 + 버튼 표시
  const showPlus = pathname === "/main";

  // ⭐ 메인이 아닐 때는 중앙 버튼 제거 → 자연스럽게 가운데로 모임
  const filteredItems = showPlus
    ? navItems
    : navItems.filter((item) => !item.isCenter);

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 
        bg-white/95 backdrop-blur-md border-t border-gray-200 
        z-50 transition-all duration-300
      "
      style={{ boxShadow: "0 -2px 10px rgba(0,0,0,0.05)" }}
    >
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-around h-16 transition-all duration-300">
          {filteredItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            // ⭐ 중앙 + 버튼 (메인에서만 존재)
            if (item.isCenter) {
              return (
                <button
                  key="center-plus"
                  onClick={onPlusClick}
                  className="
                    flex flex-col items-center justify-center -mt-6
                    transition-all duration-300
                    animate-[fadeInUp_0.35s_ease-out]
                  "
                >
                  <div
                    className="
                      w-14 h-14 rounded-full 
                      bg-gradient-to-br from-amber-400 to-orange-500
                      flex items-center justify-center shadow-lg
                      transition-all duration-300
                    "
                  >
                    <Icon size={28} className="text-white" strokeWidth={2} />
                  </div>

                  <span
                    className="
                      text-[10px] text-gray-600 mt-1 font-medium
                      transition-opacity duration-300
                    "
                  >
                    {item.label}
                  </span>
                </button>
              );
            }

            // ⭐ 일반 버튼
            return (
              <Link key={item.href || index} to={item.href}>
                <button className="flex flex-col items-center justify-center py-2 px-3 min-w-[60px] group transition-all duration-300">
                  <Icon
                    size={24}
                    className={`
                      transition-all duration-300
                      ${
                        isActive
                          ? "text-amber-600"
                          : "text-gray-400 group-hover:text-amber-500"
                      }
                    `}
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                  <span
                    className={`
                      text-[10px] mt-1 font-medium transition-all duration-300
                      ${
                        isActive
                          ? "text-amber-600"
                          : "text-gray-500 group-hover:text-amber-500"
                      }
                    `}
                  >
                    {item.label}
                  </span>
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}