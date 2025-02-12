import React from 'react';
import './WelcomePage.css';
import Header from "./Header";
import Footer from "./Footer";

const WelcomePage: React.FC = () => {
    return (
        <div className="welcome-page">
            <Header/>
            <div className="banner">
                <h2>Добро пожаловать в Decor Fleurs</h2>
                <p>Лучшие цветочные композиции для особенных моментов</p>
                <a href="/products" className="button">Перейти в каталог</a>
            </div>

            <main>
                <section className="categories">
                    <h2>Популярные категории</h2>
                    <div className="category-list">
                        <div className="category-item">
                            <img src="bouquets.jpg" alt="Букеты" />
                            <p>Букеты</p>
                        </div>
                        <div className="category-item">
                            <img src="roses.jpg" alt="Розы" />
                            <p>Розы</p>
                        </div>
                        <div className="category-item">
                            <img src="gifts.jpg" alt="Подарки" />
                            <p>Подарки</p>
                        </div>
                    </div>
                </section>

                <section className="popular-products">
                    <h2>Популярные товары</h2>
                    <div className="product-list">
                        <div className="product-card">
                            <img src="product1.jpg" alt="Товар 1" />
                            <h3>Букет "Розовая мечта"</h3>
                            <p>2 500 ₽</p>
                            <button className="button">Купить</button>
                        </div>
                        <div className="product-card">
                            <img src="product2.jpg" alt="Товар 2" />
                            <h3>Букет "Красная классика"</h3>
                            <p>3 000 ₽</p>
                            <button className="button">Купить</button>
                        </div>
                        <div className="product-card">
                            <img src="product3.jpg" alt="Товар 3" />
                            <h3>Букет "Весенний привет"</h3>
                            <p>1 800 ₽</p>
                            <button className="button">Купить</button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer/>
        </div>
    );
};

export default WelcomePage;
