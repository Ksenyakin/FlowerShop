import React, { useEffect, useState } from 'react';
import './UserDropdown.css';


const UserDropdown: React.FC = () => {
    const [userInfo, setUserInfo] = useState<{ name: string } | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch('/api/userinfo', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Ошибка при получении информации о пользователе');
                }

                const data = await response.json();
                setUserInfo(data);
            } catch (error) {
                console.error('Ошибка:', error);
            }
        };

        fetchUserInfo();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <div
            className="user-dropdown"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <span className="username">{userInfo ? userInfo.name : 'Загрузка...'}</span>
            {isOpen && (
                <div className="dropdown-menu">
                    <a href="/profile">Профиль</a>
                    <a href="/orders">Заказы</a>
                    <a href="/favorites">Избранное</a>
                    <button onClick={handleLogout}>Выйти</button>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
