import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHeader.css";

const AdminHeader: React.FC<{ title: string }> = ({ title }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <header className="admin-header">
            <h1>{title}</h1>
            <nav>
                <button onClick={() => navigate("/admin/products")}>📦 Товары</button>
                <button onClick={() => navigate("/admin/categories")}>📂 Категории</button>
                <button onClick={() => navigate("/")}>🏠 На сайт</button>
                <button onClick={handleLogout} className="logout-btn">🚪 Выйти</button>
            </nav>
        </header>
    );
};

export default AdminHeader;
