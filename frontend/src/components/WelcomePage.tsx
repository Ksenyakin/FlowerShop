import React from 'react';
import UserDropdown from './UserDropdown';
import "./WelcomePage.css"
import logo from './logo.png';

const WelcomePage: React.FC = () => {
    return (
        <div className="welcome-page">
            <header className="header">
                {/*<div className="logo">*/}
                {/*    <img src={logo} alt="Логотип компании"/>*/}
                {/*</div>*/}
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
                <h2>Добро пожаловать в наш цветочный магазин!</h2>
                <p>Здесь вы найдете лучшие цветы и подарки для ваших близких.</p>
            </main>
        </div>
    );
};

export default WelcomePage;