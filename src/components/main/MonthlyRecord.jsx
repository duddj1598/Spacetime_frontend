// src/components/main/MonthlyRecord.jsx

import { useState } from "react";
import axios from "axios";

export default function MonthlyRecord({ monthlyNote, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState(monthlyNote || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!noteText.trim()) {
      alert("한 줄 기록을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken");

      await axios.put(
        "http://localhost:8000/api/user/monthly-note",
        { monthly_note: noteText },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("✅ 이번 달의 한 줄 기록이 수정되었습니다.");
      setIsEditing(false);
      
      // 부모 컴포넌트에 업데이트 알림
      if (onUpdate) {
        onUpdate(noteText);
      }

    } catch (err) {
      console.error("❌ 한 줄 기록 수정 실패:", err);
      alert("수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setNoteText(monthlyNote || "");
    setIsEditing(false);
  };

  return (
    <section className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <span>✍️</span>
        이번 달의 한 줄 기록
      </h3>
      
      <p className="text-sm text-gray-600 mb-4">
        이번 달, {/* 여기에 일기 개수를 표시할 수 있습니다 */}개의 여정을 기록했어요.
      </p>

      {isEditing ? (
        <div className="space-y-4">
          <div className="relative bg-[#FFF8F0] p-4 rounded-lg border-2 border-dashed border-gray-300">
            <input
              type="text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="바람이 나를 다시 바다로 이끌었다."
              maxLength={100}
              className="w-full bg-transparent border-none outline-none text-gray-800 text-center italic"
              autoFocus
            />
            <div className="text-xs text-gray-500 text-right mt-2">
              {noteText.length} / 100
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#8B4513] text-white rounded-full hover:bg-[#6B3410] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "수정 중..." : "수정"}
            </button>
          </div>
        </div>
      ) : (
        <div className="relative bg-[#FFF8F0] p-6 rounded-lg min-h-[120px] flex items-center justify-center">
          <p className="text-gray-800 text-lg italic text-center">
            {monthlyNote ? (
              `" ${monthlyNote} "`
            ) : (
              <span className="text-gray-400">
                이번 달의 한 줄 기록을 작성해보세요
              </span>
            )}
          </p>

          <button
            onClick={() => setIsEditing(true)}
            className="absolute bottom-4 right-4 px-4 py-2 bg-white text-[#8B4513] border border-[#8B4513] rounded-full hover:bg-[#8B4513] hover:text-white transition-colors text-sm"
          >
            {monthlyNote ? "수정하기" : "작성하기"}
          </button>
        </div>
      )}
    </section>
  );
}