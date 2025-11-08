// src/components/friend/NotificationList.jsx

// 임포트 경로 수정:
import NotificationItem from './NotificationItem'; 

// ⭐️ 가상 알림 데이터 ⭐️
const dummyNotifications = [
  {
    type: 'friendRequest',
    username: '여행마스터',
    icon: '👤',
    status: 'pending', // 수락/거절 버튼 표시
  },
  {
    type: 'newPost',
    username: '제주도민',
    icon: '👤',
    status: 'view', // '보러가기' 버튼 표시
  },
  {
    type: 'friendRequest',
    username: '캠핑조아',
    icon: '👤',
    status: 'pending',
  },
];

const NotificationList = () => {
  return (
    <div className="p-4 bg-gray-200/50 rounded-xl shadow-inner border border-gray-300">
      <div className="space-y-3">
        {dummyNotifications.map((notif, index) => (
          <NotificationItem key={index} notification={notif} />
        ))}
      </div>
    </div>
  );
};

export default NotificationList;