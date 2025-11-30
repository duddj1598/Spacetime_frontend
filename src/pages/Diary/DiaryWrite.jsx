// src/pages/Diary/DiaryWrite.jsx

import React, { useState, useRef } from "react";
import { Calendar, Camera } from "lucide-react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import LocationPickerModal from "../../components/diary/LocationPickerModal";

const API_BASE_URL = "http://localhost:8000";
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function DiaryWrite() {
  const { diary_id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [date, _setDate] = useState("");

  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [openLocationModal, setOpenLocationModal] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const handleOpenFile = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...urls]);
  };

const handleSubmit = async () => {
  if (!title.trim() || !content.trim()) {
    alert("제목과 내용을 입력해 주세요.");
    return;
  }

  try {
    await axios.post(`${API_BASE_URL}/api/folder/create`, {
      folder_id: Number(diary_id),
      title,
      content,
      photos,
      theme: "default",
      location: selectedLocation,
    });

    alert("일기가 등록되었습니다.");
    navigate(-1);
  } catch (err) {
    console.error(err);
    alert("일기 등록 중 오류가 발생했습니다.");
  }
};

  return (
    <div className="diary-container">
      {/* ----- 왼쪽: 지도 + 날짜/공개하기 ----- */}
      <div className="diary-left">

        <div className="diary-map-wrapper">

          {/* 지도 */}
          <div className="diary-map-container">
            {isLoaded && (
              <GoogleMap
                mapContainerClassName="diary-google-map"
                center={selectedLocation || { lat: 20, lng: 0 }}
                zoom={selectedLocation ? 10 : 2}
                options={{ disableDefaultUI: true }}
                onClick={() => setOpenLocationModal(true)}
              >
                {selectedLocation && <Marker position={selectedLocation} />}
              </GoogleMap>
            )}
          </div>

          {/* 날짜 + 공개/비공개 라디오 버튼 */}
          <div className="diary-left-bottom">
            <button className="date-btn">
              <Calendar size={20} /> {date || "날짜 선택"}
            </button>
            <div className="radio-group" style={{ marginTop: "12px" }}>
              <label>
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === "public"}
                  onChange={(e) => setVisibility(e.target.value)}
                />
                공개
              </label>

              <label>
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === "private"}
                  onChange={(e) => setVisibility(e.target.value)}
                />
                비공개
              </label>
            </div>

            <p className="public-help">
              공개하기를 선택하지 않으면 나만 보기로 자동 설정됩니다.
            </p>
          </div>

        </div>
      </div>

      {/* ----- 오른쪽: 제목 / 사진 / 텍스트 / 등록 ----- */}
      <div className="diary-right">

        {/* 제목 */}
        <div className="input-box">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="일기 제목"
          />
        </div>

        {/* 사진 추가 */}
        <div className="photo-header">
          <button className="photo-btn" onClick={handleOpenFile}>
            <Camera size={20} /> 클릭하여 사진 추가
          </button>

          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handlePhotoChange}
          />
        </div>

        {/* 사진 미리보기 */}
        <div className="photo-preview">
          {photos.length === 0 ? (
            <span className="photo-help">
              첫 번째로 추가한 사진이 지도의 대표 사진으로 표시됩니다.
            </span>
          ) : (
            photos.map((src, idx) => <img key={idx} src={src} alt="preview" />)
          )}
        </div>

        {/* 내용 */}
        <textarea
          className="content-textarea"
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="오늘의 기록을 작성해 보세요..."
        />

        {/* 등록 버튼 */}
        <div className="right-bottom">
          <button className="submit-btn" onClick={handleSubmit}>
            등록
          </button>
        </div>
      </div>

      {/* 위치 선택 모달 */}
      {openLocationModal && (
        <LocationPickerModal
          isOpen={openLocationModal}
          onClose={() => setOpenLocationModal(false)}
          onSelect={(loc) => {
            setSelectedLocation(loc);
            setOpenLocationModal(false);
          }}
        />
      )}
    </div>
  );
}
