import React, { useEffect, useState } from 'react';
import UserDropdown from './UserDropdown';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/userinfo', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Ошибка при загрузке профиля: ${response.statusText}`);
                }

                const data = await response.json();
                setUserData(data);
                setLoading(false);
            } catch (err) {
                setError((err as Error).message);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <p>Загрузка данных профиля...</p>;
    }

    if (error) {
        return <p className="error-message">Ошибка: {error}</p>;
    }

    if (!userData) {
        return <p>Данные пользователя недоступны</p>;
    }

    return (
        <div className="profile-page">
            <header className="header">
                <h1 className="company-name">Decor Fleurs</h1>
                <nav className="nav">
                    <ul>
                        <li><a href="/catalog">Каталог</a></li>
                        <li><a href="/delivery">Доставка</a></li>
                        <li><a href="/about">О нас</a></li>
                    </ul>
                </nav>
                <div className="auth-buttons">
                    <a href="/register" className="button">Регистрация</a>
                    <a href="/login" className="button">Авторизация</a>
                </div>
                <UserDropdown />
            </header>

            <main>
                <h2>Профиль пользователя</h2>
                <div className="profile-info">
                    <p><strong>Имя:</strong> {userData.name}</p>
                    <p><strong>Телефон:</strong> {userData.phone}</p>
                    <p><strong>Адрес:</strong> {userData.address}</p>
                    <p><strong>Электронная почта:</strong> {userData.email}</p>
                    <p><strong>День рождения:</strong> {userData.birthday}</p>
                    <p><strong>Уровень лояльности:</strong> {userData.loyalty_level}</p>
                    <p><strong>Бонусные баллы:</strong> {userData.points}</p>
                </div>
                <a href="/update-user">Редактировать данные</a>

            </main>
        </div>
    );
};

export default ProfilePage;
