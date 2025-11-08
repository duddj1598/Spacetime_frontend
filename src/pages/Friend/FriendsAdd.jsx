import React, { useState } from "react";
import { Search } from "lucide-react";

export default function FriendsAdd() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("전체");

  const friends = [
    { id: 1, name: "하윤", desc: "이번 달 한 줄 기록 표시", status: "없음" },
    { id: 2, name: "지우", desc: "하늘을 좋아하는 여행자", status: "요청" },
    { id: 3, name: "도윤", desc: "하늘을 좋아하는 여행자", status: "수락됨" },
    { id: 4, name: "바람", desc: "하늘을 좋아하는 여행자", status: "요청" },
    { id: 5, name: "가을", desc: "하늘을 좋아하는 여행자", status: "수락됨" },
  ];

  const filtered = friends.filter((f) => {
    if (filter === "전체") return true;
    if (filter === "요청 중") return f.status === "요청";
    if (filter === "친구") return f.status === "수락됨";
    return true;
  });

  return (
    <div className="friends-container">
      <h2 className="friends-title">친구 추가</h2>

      <div className="friends-header">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            placeholder="닉네임 또는 이메일로 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="friends-filter">
        {["전체", "요청 중", "친구"].map((label) => (
          <button
            key={label}
            onClick={() => setFilter(label)}
            className={`filter-btn ${filter === label ? "active" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="friends-desc">함께 여정을 기록할 친구를 찾아보세요.</p>

      <div className="friends-grid">
        {filtered.map((f) => (
          <div key={f.id} className="friend-card">
            <div className="avatar" />
            <div className="friend-name">{f.name}</div>
            <div className="friend-desc">{f.desc}</div>
            <button
              className={`friend-btn ${
                f.status === "수락됨"
                  ? "friend"
                  : f.status === "요청"
                  ? "pending"
                  : "default"
              }`}
            >
              {f.status === "없음"
                ? "요청 보내기"
                : f.status === "요청"
                ? "요청 취소"
                : "친구"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
