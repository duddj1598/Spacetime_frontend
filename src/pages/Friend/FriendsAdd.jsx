import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";

const API_BASE = "http://localhost:8000/api/friend";

export default function FriendsAdd() {
  const userId = localStorage.getItem("userId");

  const [query, setQuery] = useState("");
  const [friends, setFriends] = useState([]);     // accepted
  const [pending, setPending] = useState([]);     // pending
  const [filter, setFilter] = useState("전체");

  // 1️⃣ 수락된 친구 목록
  const fetchFriends = async () => {
    try {
      const res = await axios.get(`${API_BASE}/list?user_id=${userId}`);

      const accepted = res.data.friends.map((f) => ({
        id: f.friend_id,
        name: f.nickname,
        status: "친구",
      }));

      setFriends(accepted);
    } catch (err) {
      console.error("친구 목록 오류:", err);
    }
  };

  // 2️⃣ 요청 중 목록
  const fetchPending = async () => {
    try {
      const res = await axios.get(`${API_BASE}/pending?user_id=${userId}`);

      const pendingList = res.data.pending.map((p) => ({
        id: p.friend_id,
        name: p.nickname,
        status: p.type === "sent" ? "요청중" : "받은요청",
      }));

      setPending(pendingList);
    } catch (err) {
      console.error("요청 중 목록 오류:", err);
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchPending();
  }, []);

  // 3️⃣ 친구 요청 보내기
  const sendFriendRequest = async () => {
    if (!query.trim()) {
      alert("닉네임을 입력하세요.");
      return;
    }

    try {
      await axios.post(
        `${API_BASE}/request?sender_id=${userId}`,
        { target_nickname: query }
      );

      alert(`"${query}" 님에게 친구 요청을 보냈습니다!`);
      setQuery("");
      fetchPending(); // 요청 목록 갱신
    } catch (err) {
      alert(err.response?.data?.detail || "친구 요청 실패");
    }
  };

  // 4️⃣ 친구 요청 수락/거절
  const handleAccept = async (id, action) => {
    try {
      await axios.put(
        `${API_BASE}/accept?receiver_id=${userId}`,
        { action }
      );

      alert(action === "accept" ? "친구 수락 완료" : "요청 거절됨");
      fetchFriends();
      fetchPending();
    } catch (err) {
      alert("처리 실패");
    }
  };

  // 5️⃣ 필터링
  const allList = [...pending, ...friends];

  const filtered = (filter) => {
    const list = filter === "전체"
      ? allList
      : filter === "친구"
      ? friends
      : pending; // 요청중 + 받은요청

    return list.filter((f) =>
      f.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const displayList = filtered(filter);

  return (
    <div className="friends-container w-full max-w-lg">
      {/* 🔍 검색 */}
      <div className="friends-header mb-4">
        <div className="search-box flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm">
          <Search size={20} className="text-gray-400 mr-2" />
          <input
            placeholder="닉네임 검색 또는 친구 요청"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>

        {/* 검색 → 친구 요청 보내기 */}
        {query.trim() && (
          <button
            onClick={sendFriendRequest}
            className="mt-3 w-full bg-[#d8d0c0] text-[#333] py-2 rounded-lg shadow hover:bg-[#c9bea5] transition"
          >
            "{query}" 친구 요청 보내기
          </button>
        )}
      </div>

      {/* 필터 */}
      <div className="friends-filter flex gap-2 mb-4">
        {["전체", "요청 중", "친구"].map((label) => (
          <button
            key={label}
            onClick={() => setFilter(label)}
            className={`px-3 py-1 rounded-xl text-sm ${
              filter === label
                ? "bg-[#d8d0c0] text-[#222]"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 설명 */}
      <p className="text-sm text-gray-500 mb-4">
        친구 상태를 확인하거나 새로운 친구를 추가하세요.
      </p>

      {/* 목록 */}
      <div className="friends-grid grid grid-cols-2 gap-4">
        {displayList.map((f) => (
          <div
            key={f.id}
            className="friend-card bg-white p-4 rounded-2xl shadow flex flex-col items-center"
          >
            <div className="avatar w-16 h-16 rounded-full bg-gray-300 mb-2" />
            <div className="friend-name font-semibold">{f.name}</div>

            {/* 상태별 버튼 */}
            {f.status === "친구" && (
              <button
                className="friend-btn bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm mt-2"
                disabled
              >
                친구
              </button>
            )}

            {f.status === "요청중" && (
              <button
                className="friend-btn bg-yellow-300 text-gray-800 px-3 py-1 rounded-lg text-sm mt-2"
                disabled
              >
                요청 중
              </button>
            )}

            {f.status === "받은요청" && (
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-green-400 px-3 py-1 rounded text-sm"
                  onClick={() => handleAccept(f.id, "accept")}
                >
                  수락
                </button>
                <button
                  className="bg-red-400 px-3 py-1 rounded text-sm"
                  onClick={() => handleAccept(f.id, "reject")}
                >
                  거절
                </button>
              </div>
            )}
          </div>
        ))}

        {displayList.length === 0 && (
          <p className="text-gray-500 mt-4 col-span-2 text-center">
            검색 결과가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
