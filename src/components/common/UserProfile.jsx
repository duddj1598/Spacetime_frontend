// src/components/common/UserProfile.jsx

export default function UserProfile({ nickname, profileImage, friendCount = 0 }) {
  return (
    <div className="flex items-center space-x-4">
      {/* 프로필 이미지 */}
      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
        {profileImage ? (
          <img 
            src={profileImage} 
            alt={`${nickname}의 프로필`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
            👤
          </div>
        )}
      </div>

      {/* 유저 정보 */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">{nickname || "사용자"}</h2>
        <p className="text-sm text-gray-500">친구 {friendCount}명</p>
      </div>
    </div>
  );
}