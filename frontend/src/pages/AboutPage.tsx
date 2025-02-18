import React from "react";
import "../components/styles/AboutPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AboutPage = () => {
    return (
        <div className="about-container">
            <Header/>
            <h1 className="about-title">О нас</h1>
            <p className="about-text">Мы - цветочный магазин, который стремится радовать наших клиентов красивыми и свежими цветами.</p>
            <p className="about-text">Наша команда профессионалов тщательно отбирает лучшие цветы, чтобы создавать незабываемые букеты для любых событий.</p>
            <p className="about-text">Мы ценим каждого клиента и гарантируем высокое качество нашей продукции и сервиса.</p>
            <h2 className="about-subtitle">Наши преимущества</h2>
            <ul className="about-list">
                <li className="about-list-item">Свежие цветы каждый день</li>
                <li className="about-list-item">Быстрая доставка</li>
                <li className="about-list-item">Индивидуальный подход</li>
                <li className="about-list-item">Гибкая система скидок</li>
            </ul>
            <h2 className="about-subtitle">Свяжитесь с нами</h2>
            <p className="about-text">Телефон: +7 (903) 44 77 333</p>
            <p className="about-text">Email: info@flowershop.com</p>
            <Footer/>
        </div>
    );
};

export default AboutPage;