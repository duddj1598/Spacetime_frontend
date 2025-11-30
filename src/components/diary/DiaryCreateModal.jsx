import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJsApiLoader } from "@react-google-maps/api"; // ⭐️ 추가
import axios from "axios";
import LocationPickerModal from "./LocationPickerModal";
import "./DiaryCreateModal.css";

const API_BASE_URL = "http://localhost:8000";
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const LIBRARIES = ['places']; // ⭐️ 통일

export default function DiaryCreateModal({
  folderId,
  folderTitle,
  onClose,
  onCreated,
}) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content] = useState("");
  const [location, setLocation] = useState(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // ⭐️ Google Maps 로더 추가 ⭐️
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

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

      const diaryId = res.data.diary_id;

      if (onCreated) onCreated(res.data);

      onClose();

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
      <div className="diary-modal-backdrop">
        <div className="diary-modal">
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

          <div className="diary-modal-footer">
            <button className="diary-create-button" onClick={handleSubmit}>
              생성하기
            </button>
          </div>
        </div>
      </div>

      {/* ⭐️ isMapLoaded 전달 ⭐️ */}
      {showLocationPicker && (
        <LocationPickerModal
          onClose={() => setShowLocationPicker(false)}
          onSelect={(loc) => {
            setLocation(loc);
            setShowLocationPicker(false);
          }}
          isMapLoaded={isLoaded}
        />
      )}
    </>
  );
}