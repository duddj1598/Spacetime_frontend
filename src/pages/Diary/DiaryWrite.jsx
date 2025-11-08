import React, { useState } from "react";
import { Calendar, MapPin, Camera } from "lucide-react";

export default function DiaryWrite() {
  const [title, setTitle] = useState("");
  const [photos] = useState([
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkwkrH8YFP5yNXN8CyPZfOyDeiMf2MU3Maew&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD-BGBHc1kn6SwPRVDfUgr8YJObpJwViM75Q&s",
  ]);
  const [visibility, setVisibility] = useState("public");

  return (
    <div className="diary-container">
      {/* 왼쪽 입력 영역 */}
      <div className="diary-left">
        <div className="top-buttons">
          <button className="small-btn">
            <Calendar size={20} /> 날짜 선택
          </button>
          <button className="small-btn">
            <MapPin size={20} /> 위치 추가
          </button>
        </div>

        <div className="input-box">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="일기 제목"
          />
        </div>

        <textarea rows={12} placeholder="오늘의 기록을 작성하세요..." />
      </div>

      {/* 오른쪽 사진 영역 */}
      <div className="diary-right">
        <div className="photo-header">
          <button className="photo-btn">
            <Camera size={20} /> 클릭하여 사진 추가
          </button>
        </div>

        <div className="photo-preview">
          {photos.map((src, i) => (
            <img key={i} src={src} alt="preview" />
          ))}
        </div>

        <textarea rows={12} placeholder="추가 메모나 감상을 적어보세요..." />

        <div className="bottom-buttons">
          <div className="radio-group">
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

          <button className="submit-btn">등록</button>
        </div>
      </div>
    </div>
  );
}
