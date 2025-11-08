// src/components/common/StatSummary.jsx

const StatSummary = () => {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-md p-4 shadow-sm">
      <h3 className="text-base font-semibold border-b pb-2 mb-3">여행 통계 / 요약</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 flex items-center">
            <span className="mr-2">✈️</span> 총 여행 횟수
          </p>
          <p className="font-bold text-lg text-blue-600">12회</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-600 flex items-center">
            <span className="mr-2">🏢</span> 방문한 도시
          </p>
          <p className="font-bold text-lg text-blue-600">8곳</p>
        </div>
        <div className="flex justify-between items-center pt-1">
          <p className="text-gray-600 flex items-center">
            <span className="mr-2 text-red-500">📍</span> 가장 많이 간 지역
          </p>
          <p className="font-bold text-sm">제주도</p>
        </div>
      </div>
    </div>
  );
};

export default StatSummary;