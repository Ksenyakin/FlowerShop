import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css"; // Стили для страницы

const AdminDashboard: React.FC = () => {
    const [userRole, setUserRole] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Проверяем токен из localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        fetch("/api/userinfo", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.role !== "admin") {
                    navigate("/");
                } else {
                    setUserRole(data.role);
                }
            })
            .catch(() => navigate("/"));
    }, [navigate]);

    if (!userRole) {
        return <p>Загрузка...</p>;
    }

    return (
        <div className="admin-dashboard">
            <h1>Панель администратора</h1>
            <div className="admin-menu">
                <button onClick={() => navigate("/admin/products")}>Управление товарами</button>
                <button onClick={() => navigate("/admin/categories")}>Категории</button>
                <button onClick={() => navigate("/admin/orders")}>Заказы</button>
            </div>
        </div>
    );
};

export default AdminDashboard;
