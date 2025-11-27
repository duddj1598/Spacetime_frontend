// src/components/friend/NotificationList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import NotificationItem from "./NotificationItem";

const API_BASE_URL = "http://localhost:8000";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // ✅ 이름 확인!

        if (!token) {
          console.warn("JWT 토큰 없음 → 로그인 필요");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/api/notification/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("🔔 알림 응답:", res.data);
        setNotifications(res.data.notification || []);
      } catch (err) {
        console.error("알림 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        알림을 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-200/50 rounded-xl shadow-inner border border-gray-300">
      {notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          아직 도착한 알림이 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <NotificationItem key={notif.noti_id} notification={notif} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;
