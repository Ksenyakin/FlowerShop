import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";


import "./Header.css";

const Header: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem("token"));
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setIsDropdownOpen(false);
    };

    return (
        <header className="header">
            <h1 className="company-name"><Link to="/">DecorFleurs</Link></h1>
            <nav className="nav-links">
                <Link to="/products">Каталог</Link>
                <Link to="/about">О нас</Link>
                <Link to="/delivery">Доставка</Link>
                <Link to="/payment">Оплата</Link>
                <Link to="/warranty">Гарантия</Link>
                <Link to="/contacts">Контакты</Link>
            </nav>
            <div className="header-icons">
                <div className="user-menu" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <FaUserCircle size={30} color={"black"}/>
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            {isLoggedIn ? (
                                <>
                                    <Link to="/profile">Профиль</Link>
                                    <Link to="/orders">Заказы</Link>
                                    <Link to="/favorites">Избранное</Link>
                                    <button onClick={handleLogout}>Выйти</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login">Войти</Link>
                                    <Link to="/register">Регистрация</Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
                <Link to="/cart" className="cart-icon">
                    <FaShoppingCart size={30} color={"black"}/>
                </Link>
            </div>
        </header>
    );
};

export default Header;
