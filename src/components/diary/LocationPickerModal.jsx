import React, { useCallback, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: "90vw",
  maxWidth: "400px",
  height: "300px",
  borderRadius: "16px",
  overflow: "hidden",
};

const defaultCenter = { lat: 37.5665, lng: 126.9780 }; // 서울

export default function LocationPickerModal({ onClose, onSelect }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const [selected, setSelected] = useState(null);

  const handleMapClick = useCallback((e) => {
    setSelected({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  }, []);

  const handleConfirm = () => {
    if (!selected) {
      alert("지도를 클릭해서 위치를 선택해주세요.");
      return;
    }
    onSelect(selected);
  };

  return (
    <div className="diary-modal-backdrop">
      <div className="location-modal">
        <div className="location-modal-header">
          <span>위치 선택</span>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="location-modal-body">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={defaultCenter}
              zoom={5}
              onClick={handleMapClick}
            >
              {selected && <Marker position={selected} />}
            </GoogleMap>
          ) : (
            <p>지도를 불러오는 중...</p>
          )}
        </div>

        <div className="location-modal-footer">
          <button onClick={handleConfirm}>이 위치로 선택하기</button>
        </div>
      </div>
    </div>
  );
}
