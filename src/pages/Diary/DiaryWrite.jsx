import React, { useState, useRef } from "react";
import { Calendar, Camera, MapPin } from "lucide-react"; 
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import LocationPickerModal from "../../components/diary/LocationPickerModal";

const API_BASE_URL = "http://localhost:8000";
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const LIBRARIES = ['places']; // ⭐️ 통일

export default function DiaryWrite() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const initialFolderId = searchParams.get('folderId');
  const initialDiaryTitle = searchParams.get('title') || '';
  const initialLat = searchParams.get('lat');
  const initialLng = searchParams.get('lng');
  
  const initialLocation = (initialLat && initialLng) 
    ? { lat: parseFloat(initialLat), lng: parseFloat(initialLng) }
    : null;
    
  const [title, setTitle] = useState(initialDiaryTitle);
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [date, _setDate] = useState("");
  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [openLocationModal, setOpenLocationModal] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
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

    if (!initialFolderId) {
      alert("폴더 정보가 없습니다.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/folder/create`, {
        folder_id: Number(initialFolderId),
        title,
        content,
        photos,
        theme: "default",
        location: selectedLocation,
      });

      alert("일기가 등록되었습니다.");
      navigate(`/folder/${initialFolderId}`);
    } catch (err) {
      console.error("❌ 일기 등록 실패:", err);
      alert("일기 등록 중 오류가 발생했습니다.");
    }
  };

  const mapCenter = selectedLocation || { lat: 20, lng: 0 };

  return (
    <div className="diary-container">
      <div className="diary-left">
        <div className="diary-map-wrapper">
          <div className="diary-map-container">
            {isLoaded && (
              <GoogleMap
                mapContainerClassName="diary-google-map"
                center={mapCenter}
                zoom={selectedLocation ? 10 : 2}
                options={{ disableDefaultUI: true }}
                onClick={() => setOpenLocationModal(true)} 
              >
                {selectedLocation && <Marker position={selectedLocation} />}
              </GoogleMap>
            )}
          </div>

          <div className="diary-left-bottom">
            <button className="date-btn">
              <Calendar size={20} /> {date || "날짜 선택"}
            </button>
            
            <button 
              className="location-btn" 
              onClick={() => setOpenLocationModal(true)} 
              style={{ marginTop: "12px", border: "1px solid #ccc", padding: "8px", borderRadius: "4px" }} 
            >
              <MapPin size={20} /> {selectedLocation ? "위치 변경됨" : "위치 추가"}
            </button>

            <div className="radio-group" style={{ marginTop: "12px" }}>
              <label>
                <input type="radio" name="visibility" value="public"
                  checked={visibility === "public"}
                  onChange={(e) => setVisibility(e.target.value)} />
                공개
              </label>
              <label>
                <input type="radio" name="visibility" value="private"
                  checked={visibility === "private"}
                  onChange={(e) => setVisibility(e.target.value)} />
                비공개
              </label>
            </div>

            <p className="public-help">
              공개하기를 선택하지 않으면 나만 보기로 자동 설정됩니다.
            </p>
          </div>
        </div>
      </div>

      <div className="diary-right">
        <div className="input-box">
          <input type="text" value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="일기 제목" />
        </div>

        <div className="photo-header">
          <button className="photo-btn" onClick={handleOpenFile}>
            <Camera size={20} /> 클릭하여 사진 추가
          </button>
          <input type="file" multiple accept="image/*" ref={fileInputRef}
            style={{ display: "none" }} onChange={handlePhotoChange} />
        </div>

        <div className="photo-preview">
          {photos.length === 0 ? (
            <span className="photo-help">
              첫 번째로 추가한 사진이 지도의 대표 사진으로 표시됩니다.
            </span>
          ) : (
            photos.map((src, idx) => <img key={idx} src={src} alt="preview" />)
          )}
        </div>

        <textarea className="content-textarea" rows={12} value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="오늘의 기록을 작성해 보세요..." />

        <div className="right-bottom">
          <button className="submit-btn" onClick={handleSubmit}>등록</button>
        </div>
      </div>

      {openLocationModal && (
        <LocationPickerModal
          isOpen={openLocationModal}
          onClose={() => setOpenLocationModal(false)}
          onSelect={(loc) => { 
            setSelectedLocation(loc);
            setOpenLocationModal(false);
          }}
          isMapLoaded={isLoaded}
        />
      )}
    </div>
  );
}