import React from "react";
import "../components/styles/DeliveryPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CiShop, CiPhone } from "react-icons/ci";
import { AiOutlineClockCircle, AiTwotoneClockCircle  } from "react-icons/ai";
import { TbTruckDelivery } from "react-icons/tb";



const DeliveryPage: React.FC = () => {
    return (
        <div className="delivery-page">
            <Header />

            <div className="delivery-container">
                <h1>Доставка и самовывоз</h1>
                <p>Мы предлагаем несколько способов получения вашего заказа.</p>

                <section className="delivery-info">
                    <ul>
                        <li className="delivery-info-items">
                            <CiShop size={30} />Мы доставляем букеты круглосуточно.
                        </li>
                        <li className="delivery-info-items">
                            <TbTruckDelivery size={30}/>При оформлении заказа до 18:00, доставка в этот же день.
                        </li>
                        <li className="delivery-info-items">
                            <AiOutlineClockCircle size={30} /> Доставка заказа в пределах г. Краснодара с 9:00 до 20:00 – от 300 руб.
                        </li>
                        <li className="delivery-info-items">
                            <AiTwotoneClockCircle size={30} /> Доставка заказа в пределах г. Краснодара с 20:00 до 9:00 – от 400 руб.
                        </li>
                    </ul>
                </section>

                <section className="delivery-details">
                    <div className="delivery-details-name">
                        <h2>Стоимость доставки</h2>
                    </div>
                    <div className="delivery-details-cost">
                        <div className="delivery-details-list">
                            <p>- Пос. Яблоновский – 350 руб.</p>
                            <p>- Хутор Ленина – 600 руб.</p>
                            <p>- Ст. Старокорсунская – 1100 руб.</p>
                            <p>- Ст. Динская – 1100 руб.</p>
                            <p>- Ст. Северская – 1400 руб.</p>
                            <p>- Пос. Афипский – 850 руб.</p>
                            <p>- Пос. Энем – 750 руб.</p>
                            <p>- г. Адыгейск – 950 руб.</p>
                            <p>- Ст. Елизаветинская – 600 руб.</p>
                            <p>- Ст. Новотиторовская – 750 руб.</p>
                        </div>
                        <div className="delivery-details-map">
                            <iframe
                                src="https://yandex.ru/map-widget/v1/?um=constructor%3Aa1ce399a9b56a4233fe54e7894448cc1329d75037c1ec610813034d5bc1c619e&amp;source=constructor"
                                width="500" height="400"></iframe>
                        </div>
                    </div>
                </section>

                <section className="delivery-map">
                    <div className="delivery-shop">
                        <h2>Самовывоз</h2>
                        <p>Забрать букет или композицию можно самостоятельно по адресу
                            Гидростроителей 62к1</p>
                        <div className="delivery-shop-phone">
                            <CiPhone size={30}/>
                            <p>+7 (903) 44 77 333</p>
                        </div>
                    </div>
                    <div className="delivery-shop-photo">
                        <img src="/shop.jpg"></img>
                    </div>
                </section>
            </div>

            <Footer/>
        </div>
    );
};

export default DeliveryPage;
