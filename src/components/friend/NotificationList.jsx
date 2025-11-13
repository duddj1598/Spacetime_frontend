import React, { useState } from 'react';
import NotificationItem from './NotificationItem'; 
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 훅 임포트 (가정)

// 초기 알림 데이터
const initialNotifications = [
    {
        id: 1, // 고유 ID
        type: 'friendRequest',
        username: '여행마스터',
        icon: '👤',
        status: 'pending', 
    },
    {
        id: 2,
        type: 'newPost',
        username: '제주도민',
        icon: '👤',
        status: 'view', 
        postLink: '/post/jejudomin-latest', // 보러가기 링크
    },
    {
        id: 3,
        type: 'friendRequest',
        username: '캠핑조아',
        icon: '👤',
        status: 'pending',
    },
];

const NotificationList = () => {
    // 알림 데이터를 상태로 관리
    const [notifications, setNotifications] = useState(initialNotifications);
    const navigate = useNavigate(); // 페이지 이동 훅 사용 (가정)

    // 친구 요청 수락 처리 함수: 알림 항목을 '새 포스트 알림'으로 변경
    const handleAcceptRequest = (id, username) => {
        setNotifications(prevNotifications => 
            prevNotifications.map(notif => {
                if (notif.id === id) {
                    // ⭐️ 요청 알림을 새 포스트 알림으로 변경
                    return {
                        ...notif,
                        type: 'newPost', // 타입 변경
                        status: 'view', // 상태 변경
                        postLink: `/post/${username.toLowerCase()}-latest`, // 새 포스트 링크 설정
                    };
                }
                return notif;
            })
        );
    };
    
    // 알림 항목 제거 함수 (요청 거절 시 사용 가능)
    const handleRemoveNotification = (id) => {
        setNotifications(prevNotifications => 
            prevNotifications.filter(notif => notif.id !== id)
        );
    };

    // '보러가기' 클릭 처리 함수
    const handleViewPost = (postLink, id) => {
        console.log(`포스트 보러가기 클릭: ${postLink}`);
        navigate(postLink); 
        // handleRemoveNotification(id); // 보러가기 후 알림을 지우고 싶다면 주석 해제
    };

    return (
        <div className="p-4 bg-gray-200/50 rounded-xl shadow-inner border border-gray-300">
            <div className="space-y-3">
                {notifications.map((notif) => (
                    <NotificationItem 
                        key={notif.id} 
                        notification={notif} 
                        
                        // ⭐️ 수락 함수 연결: 알림을 포스트 알림으로 변경
                        onAccept={() => handleAcceptRequest(notif.id, notif.username)}
                        
                        // 거절 함수 연결: 알림 제거
                        onReject={() => handleRemoveNotification(notif.id)}
                        
                        // '보러가기' 함수 연결
                        onViewPost={notif.type === 'newPost' 
                                    ? () => handleViewPost(notif.postLink, notif.id) 
                                    : null}
                    />
                ))}
            </div>
        </div>
    );
};

export default NotificationList;