import React, { useEffect, useState, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import { useParams } from "react-router-dom";
import DiaryCreateModal from "../../components/diary/DiaryCreateModal";
import "./FolderMapPage.css";

const API_BASE_URL = "http://localhost:8000";
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function FolderMapPage() {
  const { folderId } = useParams();
  const [folder, setFolder] = useState(null);
  const [diaries, setDiaries] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // 폴더 + 일기 데이터 가져오기
  const fetchFolder = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/folder/detail`, {
      params: { folder_id: folderId },
    });
    setFolder(res.data.folder);
    setDiaries(res.data.folder.diaries || []);
  };

  useEffect(() => {
    fetchFolder();
  }, []);

  const onMapLoad = useCallback(
    (map) => {
      if (diaries.length === 0) {
        map.setCenter({ lat: 20, lng: 0 });
        map.setZoom(2);
        return;
      }

      const bounds = new window.google.maps.LatLngBounds();
      diaries.forEach((d) => {
        if (d.location) {
          bounds.extend({ lat: d.location.lat, lng: d.location.lng });
        }
      });
      map.fitBounds(bounds);
    },
    [diaries]
  );

  return (
    <div className="folder-page">

      {/* ---------- 상단 헤더 디자인 유지 ---------- */}
      <div className="folder-header">
        <img
          src="../../assets/folder-icon.png"
          className="folder-icon"
        />
        <div className="folder-title">
          {folder?.title}
        </div>
      </div>

      {/* ---------- 지도 영역 (배경 이미지와 동일 크기) ---------- */}
      <div className="map-container">
        {isLoaded && (
          <GoogleMap
            mapContainerClassName="google-map"
            onLoad={onMapLoad}
            center={{ lat: 20, lng: 0 }}
            zoom={2}
            options={{
              disableDefaultUI: true, // Google 기본 UI 제거 → 세계지도 느낌 그대로
            }}
          >
            {diaries.map((d) =>
              d.location ? (
                <Marker
                  key={d.diary_id}
                  position={{
                    lat: d.location.lat,
                    lng: d.location.lng,
                  }}
                />
              ) : null
            )}
          </GoogleMap>
        )}
      </div>

      {/* ---------- 오른쪽 아래 + 버튼 ---------- */}
      <button className="floating-add" onClick={() => setShowModal(true)}>
        +
      </button>

      {showModal && (
        <DiaryCreateModal
          folderId={folderId}
          onClose={() => setShowModal(false)}
          onCreated={fetchFolder}
        />
      )}
    </div>
  );
}
