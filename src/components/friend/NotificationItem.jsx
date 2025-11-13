// src/components/friend/NotificationItem.jsx

import { useState } from 'react';

// ⭐️ onAccept, onReject, onViewPost prop 추가
const NotificationItem = ({ notification, onAccept, onReject, onViewPost }) => {
    const [isDismissed] = useState(false);
    
    // 알림 내용 설정
    let content = '';
    // notification.type이 'friendRequest' 일 때
    if (notification.type === 'friendRequest') {
        content = `[${notification.username}] 님으로부터 친구요청`;
    // notification.type이 'newPost' 일 때
    } else if (notification.type === 'newPost') {
        content = `친구 [${notification.username}] 님의 포스트가 올라왔어요`;
    }

    // 알림 처리 버튼 설정
    let actions;
    if (notification.status === 'pending') {
        // 친구 요청 처리 버튼 (수락/거절)
        actions = (
            <div className="flex space-x-2">
                <button 
                    className="text-green-600 hover:text-green-700 font-bold"
                    onClick={onAccept} // ⭐️ 수락 함수 연결
                >
                    <span role="img" aria-label="Accept">✔️</span>
                </button>
                <button 
                    className="text-red-600 hover:text-red-700 font-bold"
                    onClick={onReject} // 거절 함수 연결
                >
                    <span role="img" aria-label="Reject">❌</span>
                </button>
            </div>
        );
    } else if (notification.status === 'view') {
        // 새 포스트 '보러가기' 버튼
        actions = (
            <button 
                className="text-sm font-semibold text-gray-700 hover:text-black transition-colors"
                onClick={onViewPost} // ⭐️ 보러가기 함수 연결
            >
                보러가기
            </button>
        );
    }

    if (isDismissed) return null;

    return (
        <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
                {/* 유저 아이콘 */}
                <span className="text-xl mr-3 text-gray-600">{notification.icon}</span>
                {/* 알림 내용 */}
                <p className="text-sm text-gray-700">
                    {content}
                </p>
            </div>
            
            {/* 알림 처리 액션 */}
            {actions}
            
        </div>
    );
};

export default NotificationItem;