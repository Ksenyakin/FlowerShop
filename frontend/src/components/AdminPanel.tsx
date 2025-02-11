import React, { useEffect, useState } from 'react';
import './AdminPanel.css';

// Определяем базовый URL для API из переменной окружения (или используем значение по умолчанию)

interface User {
    id: number;
    email: string;
    name?: string;
    phone?: string;
    address?: string;
    birthday?: string;
    loyalty_level: number;
    points: number;
    total_purchases: number;
    last_purchase_date?: string;
    created_at?: string;
    updated_at?: string;
}

const AdminPanel: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [token, setToken] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                throw new Error('Неверный логин или пароль');
            }
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('adminToken', data.token);
                setToken(data.token);
                setIsLoggedIn(true);
                setError(null);
            } else {
                throw new Error('Ошибка авторизации');
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const loadUsers = async () => {
        if (!token) return;
        try {
            const response = await fetch('/admin/users', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            });
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }
            const data = await response.json();
            setUsers(data);
        } catch (err: any) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            loadUsers();
        }
    }, [isLoggedIn, token]);

    if (!isLoggedIn) {
        return (
            <div className="admin-panel">
                <h1>Вход в админ-панель</h1>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Войти</button>
                </form>
            </div>
        );
    }

    return (
        <div className="admin-panel">
            <h1>Админ-панель</h1>
            {error && <p className="error">{error}</p>}
            <h2>Список пользователей</h2>
            {users.length === 0 ? (
                <p>Пользователей не найдено.</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Имя</th>
                        <th>Телефон</th>
                        <th>Адрес</th>
                        <th>День рождения</th>
                        <th>Уровень</th>
                        <th>Баллы</th>
                        <th>Сумма покупок</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>{user.name || '-'}</td>
                            <td>{user.phone || '-'}</td>
                            <td>{user.address || '-'}</td>
                            <td>{user.birthday || '-'}</td>
                            <td>{user.loyalty_level}</td>
                            <td>{user.points}</td>
                            <td>{user.total_purchases}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminPanel;
