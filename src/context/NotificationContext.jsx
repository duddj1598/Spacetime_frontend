import React, { createContext, useState, useContext, useEffect } from 'react';

// Context 객체 생성
const NotificationContext = createContext();

// Context를 사용하기 위한 커스텀 훅
export const useNotifications = () => useContext(NotificationContext);

// Provider 컴포넌트
export const NotificationProvider = ({ children }) => {
    
    const [notifications, setNotifications] = useState([]);

    const userId = localStorage.getItem("userId");        // 로그인 API에서 저장한 값
    const token = localStorage.getItem("accessToken");    // JWT

    /** 🔥 1) 알림 목록 가져오기 (로그인 방식과 동일한 fetch) */
    const fetchNotifications = async () => {
        try {
            const res = await fetch(
                `http://localhost:8000/api/notification/list?user_id=${userId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
            console.log("알림 데이터:", data);

            if (data.status === 200) {
                setNotifications(data.notification); // 🔥 백엔드 key 맞춤
            }
        } catch (err) {
            console.error("알림 불러오기 실패:", err);
        }
    };

    /** 🔥 2) 마운트될 때 자동 실행 */
    useEffect(() => {
        if (userId && token) {
            fetchNotifications();
        }
    }, [userId, token]);

    /** 🔥 3) 알림 추가 (백엔드용으로 확장 가능한 구조) */
    const addNotification = (content) => {
        const newNotification = {
            id: Date.now(),
            content: content,
            created_at: new Date().toISOString(),
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    /** 🔥 4) 알림 삭제 */
    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const value = {
        notifications,
        fetchNotifications,
        addNotification,
        removeNotification,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
