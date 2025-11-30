import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Search, X } from "lucide-react";

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 37.5665, // 서울
  lng: 126.9780,
};

export default function LocationPickerModal({ isOpen, onClose, onSelect, isMapLoaded }) {
  const [center, setCenter] = useState(defaultCenter);
  const [selectedPin, setSelectedPin] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); 
  const mapRef = useRef(null);
  
  if (!isOpen) return null;

  const handleMapClick = useCallback((event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setSelectedPin(newLocation);
    setCenter(newLocation); 
  }, []);

  const handleSearch = () => {
    if (!mapRef.current || !searchTerm.trim() || !isMapLoaded) {
      if (!isMapLoaded) alert("Google Map API가 로드되지 않았습니다.");
      return;
    }

    const service = new window.google.maps.places.PlacesService(mapRef.current);
    
    service.textSearch({ query: searchTerm }, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        const firstResult = results[0];
        const newLocation = {
          lat: firstResult.geometry.location.lat(),
          lng: firstResult.geometry.location.lng(),
        };
        mapRef.current.panTo(newLocation); 
        
        setCenter(newLocation);
        setSelectedPin(newLocation); 
      } else {
        alert("검색 결과가 없습니다.");
      }
    });
  };

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const handleConfirm = () => {
    if (!selectedPin) {
      alert("지도에서 위치를 선택해 주세요.");
      return;
    }
    onSelect(selectedPin); 
  };

  return (
    // ⭐️ z-index를 더 높게! DiaryAddModal(z-50)보다 위에 표시 ⭐️
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-xl shadow-2xl">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-xl font-bold">위치 검색 및 선택</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={20} /></button>
        </div>
        
        {/* 검색 입력창 */}
        <div className="flex mb-4 space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            placeholder="장소 이름이나 주소를 검색하세요"
            className="flex-grow p-2 border rounded"
          />
          <button onClick={handleSearch} className="bg-indigo-500 text-white px-4 py-2 rounded flex items-center" disabled={!isMapLoaded}>
            <Search size={18} />
          </button>
        </div>

        {/* 지도 영역 */}
        <div className="map-area">
          {isMapLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={selectedPin ? 15 : 10}
              onLoad={onLoad}
              onClick={handleMapClick} 
            >
              {selectedPin && <Marker position={selectedPin} />}
            </GoogleMap>
          ) : (
            <div style={{...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              Google 지도를 로드 중...
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {selectedPin ? `선택된 위치: Lat ${selectedPin.lat.toFixed(4)}, Lng ${selectedPin.lng.toFixed(4)}` : "지도나 검색으로 위치를 지정해주세요."}
          </p>
          <button onClick={handleConfirm} disabled={!selectedPin} className={`px-4 py-2 rounded font-semibold transition-colors ${
            selectedPin ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}>
            위치 확정
          </button>
        </div>

      </div>
    </div>
  );
}