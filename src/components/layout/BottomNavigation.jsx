import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, UserPlus, Bell, User, Plus } from "lucide-react";

export default function BottomNavigation({ onPlusClick }) {
  const { pathname } = useLocation();

  // 메인 페이지 여부
  const isMain = pathname === "/main";

  // 네비게이션 버튼들
  const navItems = [
    { href: "/main", icon: Home, label: "홈" },
    { href: "/friend", icon: UserPlus, label: "친구" },

    // ⭐ 메인이 아니면 작은 + 버튼
    {
      href: isMain ? null : "/folder-select",
      icon: Plus,
      label: "작성",
      isCenter: true
    },

    { href: "/alarm", icon: Bell, label: "알림" },
    { href: "/mypage", icon: User, label: "마이" },
  ];

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

          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            // ⭐ 중앙 버튼 처리
            if (item.isCenter) {
              // 메인에서는 커다란 버튼
              if (isMain) {
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
                        hover:scale-105 transition-all duration-300
                      "
                    >
                      <Icon size={28} className="text-white" strokeWidth={2} />
                    </div>
                    <span className="text-[10px] text-gray-600 mt-1 font-medium">
                      작성
                    </span>
                  </button>
                );
              }

              // ⭐ 메인이 아닐 때 작은 아이콘 + 자연스러운 유지
              return (
                <Link key="small-plus" to="/main">
                  <button className="flex flex-col items-center justify-center py-2 px-3 min-w-[60px] group transition-all">
                    <Icon
                      size={22}
                      className={`
                        transition-all
                        text-gray-400 group-hover:text-amber-500
                      `}
                      strokeWidth={1.7}
                    />
                    <span className="text-[10px] mt-1 text-gray-500 group-hover:text-amber-500">
                      작성
                    </span>
                  </button>
                </Link>
              );
            }

            // ⭐ 일반 네비게이션 버튼
            return (
              <Link key={item.href || index} to={item.href}>
                <button className="flex flex-col items-center justify-center py-2 px-3 min-w-[60px] group transition-all">
                  <Icon
                    size={24}
                    className={`
                      transition-all
                      ${isActive ? "text-amber-600" : "text-gray-400 group-hover:text-amber-500"}
                    `}
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                  <span
                    className={`
                      text-[10px] mt-1 font-medium transition-all
                      ${isActive ? "text-amber-600" : "text-gray-500 group-hover:text-amber-500"}
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
