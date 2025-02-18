import React from 'react';
import '../components/styles/WelcomePage.css';
import Header from "../components/Header";
import Footer from "../components/Footer";
import SliderComponent from "../components/SliderComponent";
import { Link } from "react-router-dom";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import SliderTopProducts from "../components/SliderTopProducts";
import FeedbackForm from "../components/FeedbackForm";
import CookieConsent from "../components/CookieConsent";
import DevelopmentPopup from "../components/DevelopmentPopup";

const WelcomePage: React.FC = () => {
    return (
        <div className="welcome-page">
            <Header/>
            <div className="welcome-page-container">
                <DevelopmentPopup/>
                <CookieConsent />
                {/* Слайдер */}
                <div className="welcome-page-slider-main">
                    <SliderComponent/>
                </div>
                {/* Категории товаров */}
                <div className="welcome-page-content-main">

                    {[
                        {name: "Весенние букеты", img: "https://s3.timeweb.cloud/84163e07-decor-fleurs-s3/15.jpg"},
                        {name: "Букеты на 8 марта", img: "https://s3.timeweb.cloud/84163e07-decor-fleurs-s3/16.jpg"},
                        {name: "Коробки с цветами", img: "https://s3.timeweb.cloud/84163e07-decor-fleurs-s3/17.jpg"},
                        {name: "Свадебные букеты", img: "https://s3.timeweb.cloud/84163e07-decor-fleurs-s3/16.jpg"},
                        {name: "Композиции из цветов", img: "https://s3.timeweb.cloud/84163e07-decor-fleurs-s3/17.jpg"},
                        {name: "Монобукеты", img: "https://s3.timeweb.cloud/84163e07-decor-fleurs-s3/15.jpg"}
                    ].map((category, index) => (
                        <div className="category-card" key={index}>
                            <img src={category.img} alt={category.name} className="category-image"/>
                            <p>{category.name}</p>
                            <Link to="/products" className="category-button">Перейти в каталог</Link>
                        </div>
                    ))}
                </div>


                {/* Кнопка просмотра всех категорий */}
                <div className="welcome-page-button">
                    <Link to="/products" className="all-categories-button">Посмотреть все категории</Link>
                </div>

                {/* Топ товары */}
                <div className="welcome-page-top">
                    <h2>Популярные товары</h2>
                    <div className="welcome-page-top-slider">
                        <SliderTopProducts/>
                    </div>
                </div>

                {/* Индивидуальный букет */}
                <div className="welcome-page-individual">
                    <div className="welcome-page-individual-photo">
                        <img src="https://s3.timeweb.cloud/84163e07-decor-fleurs-s3/19.jpg" alt="Индивидуальный букет"/>
                    </div>
                    <div className="welcome-page-individual-text">
                        <h2>Вы листаете каталог и не находите «тот самый букет»?</h2>
                        <p>Опишите пожелания, и наш флорист создаст индивидуальный букет!</p>
                        <FeedbackForm />
                    </div>
                </div>

                {/* Корпоративные букеты */}
                <div className="welcome-page-corp">
                    <div className="welcome-page-corp-text">
                        <h2>Поздравим ваших партнеров и коллег</h2>
                        <p>Создадим букеты в фирменном стиле вашей компании.</p>
                        <FeedbackForm />
                    </div>
                    <div className="welcome-page-corp-photo">
                        <img src="https://s3.timeweb.cloud/84163e07-decor-fleurs-s3/18.jpg" alt="Корпоративные букеты"/>
                    </div>
                </div>

                {/* Способы связи */}
                <div className="welcome-page-communication">
                    <h2>Связаться с нами удобным способом</h2>
                    <div className="welcome-page-communication-methods">
                        <div className="contact-method">
                            <FaPhone size={30}/>
                            <p>+7(903) 44 77 333</p>
                        </div>
                        <div className="contact-method">
                            <FaEnvelope size={30}/>
                            <p>info@decorfleurs.ru</p>
                        </div>
                        <div className="contact-method">
                            <FaMapMarkerAlt size={30}/>
                            <p>г. Краснодар, ул. Гидростроителей 62к1</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    );
};

export default WelcomePage;
