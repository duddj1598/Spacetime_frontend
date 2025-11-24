import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LocationPickerModal from "./LocationPickerModal"; // 위치 선택용 서브 모달
import "./DiaryCreateModal.css";


const API_BASE_URL = "http://localhost:8000"; // 백엔드 주소에 맞게 변경

export default function DiaryCreateModal({
  folderId,
  folderTitle,
  onClose,
  onCreated,
}) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content] = useState(""); // 지금은 내용 입력 안 받는 디자인이니까 비워두고, 나중에 확장 가능
  const [location, setLocation] = useState(null); // { lat, lng }
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("일기 제목을 입력해주세요.");
      return;
    }

    if (!location) {
      alert("위치를 추가해주세요.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/folder/create`, {
        folder_id: folderId,
        title: title,
        content,
        photos: [],
        theme: null,
        location: location,
      });

      const diaryId = res.data.diary_id;   // ⬅ 다이어리 ID 가져오기

      if (onCreated) onCreated(res.data);

      onClose();   // 모달 닫기

      // ⬅ 다이어리 상세 페이지로 이동
      if (diaryId) {
        navigate(`/diary/${diaryId}`);
      }

    } catch (err) {
      console.error(err);
      alert("일기를 생성하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      {/* 배경 어둡게 */}
      <div className="diary-modal-backdrop">
        <div className="diary-modal">
          {/* 상단 타이틀 영역 */}
          <div className="diary-modal-header">
            <span className="diary-modal-title">
              [{folderTitle}]에 일기 추가하기
            </span>
            <button className="diary-modal-close" onClick={onClose}>
              ✕
            </button>
          </div>

          <div className="diary-modal-body">
            <label className="diary-label">일기 제목</label>
            <input
              className="diary-input"
              type="text"
              placeholder="오늘은 교토 탐방을 해보자 !"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* 위치 추가 버튼 */}
            <button
              type="button"
              className="location-add-button"
              onClick={() => setShowLocationPicker(true)}
            >
              <span className="location-icon">📍</span>
              <span>
                {location
                  ? `위치 선택됨 (lat: ${location.lat.toFixed(
                      3
                    )}, lng: ${location.lng.toFixed(3)})`
                  : "위치 추가"}
              </span>
            </button>
          </div>

          {/* 하단 생성하기 버튼 */}
          <div className="diary-modal-footer">
            <button className="diary-create-button" onClick={handleSubmit}>
              생성하기
            </button>
          </div>
        </div>
      </div>

      {/* 위치 선택 모달 */}
      {showLocationPicker && (
        <LocationPickerModal
          onClose={() => setShowLocationPicker(false)}
          onSelect={(loc) => {
            setLocation(loc);
            setShowLocationPicker(false);
          }}
        />
      )}
    </>
  );
}
