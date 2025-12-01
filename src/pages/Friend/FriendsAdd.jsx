import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, UserPlus } from "lucide-react";

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
      console.error("처리실패:", err);
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
    <div className="w-full bg-white rounded-sm p-8 pb-12"
         style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)' }}>
      
      {/* 🔍 검색 바 */}
      <div className="mb-6">
        <div className="relative flex items-center border-2 border-amber-200/50 rounded-full px-4 py-3 bg-white/80 backdrop-blur-sm shadow-sm hover:border-amber-300/70 transition-colors">
          <Search size={20} className="text-amber-600/60 mr-3" strokeWidth={1.5} />
          <input
            placeholder="닉네임으로 친구 찾기"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full outline-none text-sm text-gray-700 bg-transparent placeholder:text-gray-400"
          />
        </div>

        {/* 검색 → 친구 요청 보내기 */}
        {query.trim() && (
          <button
            onClick={sendFriendRequest}
            className="mt-4 w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-sm shadow-md hover:from-amber-600 hover:to-orange-600 transition-all hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <UserPlus size={18} strokeWidth={1.5} />
            "{query}" 님에게 친구 요청 보내기
          </button>
        )}
      </div>

      {/* 필터 버튼 */}
      <div className="flex gap-3 mb-6 pb-4 border-b border-gray-200">
        {["전체", "요청 중", "친구"].map((label) => (
          <button
            key={label}
            onClick={() => setFilter(label)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              filter === label
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 설명 */}
      <p className="text-sm text-gray-500 mb-6 italic" style={{ fontFamily: 'Georgia, serif' }}>
        친구와 함께 여행의 순간을 공유하세요
      </p>

      {/* 친구 목록 그리드 */}
      <div className="grid grid-cols-2 gap-5">
        {displayList.map((f) => (
          <div
            key={f.id}
            className="bg-white border border-gray-200 p-5 rounded-sm shadow-sm hover:shadow-md transition-all"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
          >
            {/* 아바타 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-200 to-orange-200 mb-3 flex items-center justify-center text-2xl">
                👤
              </div>
              <div className="font-medium text-gray-800 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                {f.name}
              </div>

              {/* 상태별 버튼 */}
              {f.status === "친구" && (
                <div className="w-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-sm text-sm text-center border border-green-200">
                  친구
                </div>
              )}

              {f.status === "요청중" && (
                <div className="w-full bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 px-4 py-2 rounded-sm text-sm text-center border border-amber-200">
                  요청 중
                </div>
              )}

              {f.status === "받은요청" && (
                <div className="flex gap-2 w-full">
                  <button
                    className="flex-1 bg-gradient-to-r from-green-400 to-emerald-400 text-white px-3 py-2 rounded-sm text-sm shadow-sm hover:from-green-500 hover:to-emerald-500 transition-all"
                    onClick={() => handleAccept(f.id, "accept")}
                  >
                    수락
                  </button>
                  <button
                    className="flex-1 bg-gradient-to-r from-red-400 to-rose-400 text-white px-3 py-2 rounded-sm text-sm shadow-sm hover:from-red-500 hover:to-rose-500 transition-all"
                    onClick={() => handleAccept(f.id, "reject")}
                  >
                    거절
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {displayList.length === 0 && (
          <div className="col-span-2 text-center py-12">
            <p className="text-gray-400 text-sm italic" style={{ fontFamily: 'Georgia, serif' }}>
              검색 결과가 없습니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
}