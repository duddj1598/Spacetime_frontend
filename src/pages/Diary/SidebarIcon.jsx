import React from "react";

export default function SidebarIcon({ icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`sidebar-icon ${active ? 'active' : ''}`}
    >
      {icon}
    </button>
  );
}
