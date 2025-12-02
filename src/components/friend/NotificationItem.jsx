// src/components/friend/NotificationItem.jsx

/* 
  백엔드에서 온 알림 객체 예:
  {
    noti_id: 1,
    content: "친구 요청이 도착했습니다!",
    created_at: "2025-11-27T06:40:00"
  }
*/

const NotificationItem = ({ notification }) => {
  const createdAt = notification.created_at
    ? new Date(notification.created_at)
    : null;

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-gray-200">
      {/* 왼쪽: 내용 */}
      <div className="flex flex-col">
        <span className="text-sm text-gray-900">
          {notification.content || "알림 내용이 없습니다."}
        </span>
        {createdAt && (
          <span className="text-xs text-gray-400 mt-1">
            {createdAt.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
