import React, { useState, useRef } from "react";
import { Calendar, Camera, MapPin } from "lucide-react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import BottomNavigation from "../../components/layout/BottomNavigation";
import LocationPickerModal from "../../components/diary/LocationPickerModal";

const API_BASE_URL = "http://localhost:8000";
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const LIBRARIES = ["places"];

export default function DiaryWrite() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const folderId = searchParams.get("folderId");
  const initialDiaryTitle = searchParams.get("title") || "";
  const initialLat = searchParams.get("lat");
  const initialLng = searchParams.get("lng");

  const initialLocation =
    initialLat && initialLng
      ? { lat: parseFloat(initialLat), lng: parseFloat(initialLng) }
      : null;

  const [title, setTitle] = useState(initialDiaryTitle);
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [openLocationModal, setOpenLocationModal] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const handleOpenFile = () => fileInputRef.current?.click();

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...urls]);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !date) {
      alert("제목, 날짜, 내용을 입력해 주세요.");
      return;
    }

    if (!folderId) {
      alert("폴더 정보가 없습니다.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/folder/create`, {
        folder_id: Number(folderId),
        title,
        content,
        photos,
        date,
        theme: "default",
        location: selectedLocation,
      });

      alert("일기가 등록되었습니다!");
      navigate(`/folder/${folderId}`);
    } catch (err) {
      console.error("❌ 일기 등록 실패:", err);
      alert("일기 등록 중 오류가 발생했습니다.");
    }
  };

  const mapCenter = selectedLocation || { lat: 20, lng: 0 };

  return (
    <div className="relative min-h-screen pb-24 bg-[#f8f4ec]">

      {/* 전체 컨테이너 */}
      <div className="max-w-screen-xl mx-auto p-6 flex gap-8">

        {/* ============================
            LEFT : 지도 + 날짜 선택
        ============================ */}
        <div
          className="w-1/2 bg-white border rounded-xl p-5 shadow"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
        >
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <MapPin /> 위치
          </h2>

          <div className="rounded-lg overflow-hidden h-[300px] border">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={mapCenter}
                zoom={selectedLocation ? 10 : 2}
                options={{ disableDefaultUI: true }}
                onClick={() => setOpenLocationModal(true)}
              >
                {selectedLocation && <Marker position={selectedLocation} />}
              </GoogleMap>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 italic">
                지도를 로드 중...
              </div>
            )}
          </div>

          {/* 날짜 입력 */}
          <div className="mt-6">
            <label className="flex items-center gap-2 text-gray-800 font-medium mb-1">
              <Calendar size={20} /> 날짜 입력
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded-md bg-white"
            />
          </div>
        </div>

        {/* ============================
            RIGHT : 제목, 사진, 내용
        ============================ */}
        <div
          className="w-1/2 bg-white border rounded-xl p-6 shadow"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
        >
          {/* 제목 */}
          <input
            type="text"
            value={title}
            placeholder="제목을 입력하세요"
            className="w-full border-b py-2 text-lg mb-4 outline-none focus:border-[#f4ab5a]"
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* 사진 추가 */}
          <button
            className="flex items-center gap-2 px-3 py-2 rounded border border-gray-300 hover:bg-amber-50/50"
            onClick={handleOpenFile}
          >
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

          {/* 사진 미리보기 */}
          <div className="mt-3 flex gap-3 overflow-x-auto">
            {photos.length === 0 ? (
              <p className="text-gray-400 italic">
                첫 번째 사진이 지도 대표 이미지로 사용됩니다.
              </p>
            ) : (
              photos.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="w-24 h-24 object-cover rounded"
                />
              ))
            )}
          </div>

          {/* 내용 */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘의 기록을 작성해 보세요..."
            rows={12}
            className="w-full border mt-4 p-3 rounded-md outline-none focus:border-[#f4ab5a]"
          />

          {/* 등록 버튼 */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 mt-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-md shadow hover:scale-[1.02] transition"
          >
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
          isMapLoaded={isLoaded}
        />
      )}

      {/* 하단 네비게이션 */}
      <BottomNavigation onPlusClick={() => navigate(`/folder/${folderId}`)} />
    </div>
  );
}
