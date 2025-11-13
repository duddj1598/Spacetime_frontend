import React, { createContext, useState, useContext } from 'react';

// Context 객체 생성
const NotificationContext = createContext();

// Context를 사용하기 위한 커스텀 훅
export const useNotifications = () => {
    return useContext(NotificationContext);
};

// Provider 컴포넌트: 알림 상태 관리 및 공유
export const NotificationProvider = ({ children }) => {
    // 초기 알림 상태 설정 (스크린샷 기반)
    const [notifications, setNotifications] = useState([
        // type: 'request'는 친구 요청, type: 'post'는 새 포스트 알림
        // postLink는 'post' 타입에만 필요
        { id: 1, type: 'request', name: '여행마스터', status: 'pending' },
        { id: 2, type: 'post', name: '제주도민', postLink: '/post/jejudomin' },
        { id: 3, type: 'request', name: '캠핑조아', status: 'pending' },
    ]);

    // 새로운 알림을 목록에 추가하는 함수 (FriendsAdd에서 사용)
    const addNotification = (friendName, postLink) => {
        const newNotification = {
            id: Date.now(),
            type: 'post', 
            name: friendName, // NotificationItem의 'username' 대신 'name' 사용
            postLink: postLink,
        };
        // 최신 알림을 가장 위(앞)에 추가
        setNotifications(prev => [newNotification, ...prev]);
    };
    
    // 알림을 삭제하는 함수 (요청 수락/거절이나 보러가기 후 사용)
    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    const value = {
        notifications,
        addNotification,
        removeNotification,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};