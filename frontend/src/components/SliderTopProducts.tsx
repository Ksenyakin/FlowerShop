import React, { forwardRef } from "react";
import Slider, { Settings } from "react-slick";
import './SliderTopProducts.css';


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const slide1 = "https://s3.timeweb.cloud/84163e07-decor-fleurs-s3/15.jpg";
const slide2 = "https://s3.timeweb.cloud/84163e07-decor-fleurs-s3/16.jpg";
const slide3 = "https://s3.timeweb.cloud/84163e07-decor-fleurs-s3/17.jpg";
const slide4 = "https://s3.timeweb.cloud/84163e07-decor-fleurs-s3/15.jpg";
const slide5 = "https://s3.timeweb.cloud/84163e07-decor-fleurs-s3/16.jpg";
const slide6 = "https://s3.timeweb.cloud/84163e07-decor-fleurs-s3/17.jpg";

// Оборачиваем Slider в forwardRef с явной типизацией.
// Используем ts-ignore для подавления ошибки TS2786.
const SlickSlider = forwardRef<any, Settings>((props, ref) => {
    // @ts-ignore
    return <Slider ref={ref} {...props} />;
});

const SliderTopProducts: React.FC = () => {
    const settings: Settings = {
        dots: true,          // Показывать точки навигации
        infinite: true,      // Бесконечный цикл
        speed: 500,          // Скорость анимации
        slidesToShow: 3,     // Сколько слайдов показывать
        slidesToScroll: 1,   // Сколько слайдов прокручивать
        autoplay: false,      // Авто-прокрутка
        autoplaySpeed: 7000, // Скорость смены слайдов (мс)
        arrows: true,        // Стрелки навигации
    };

    return (
        <div className="slider-container">
            <SlickSlider {...settings}>
                <div className="slide">
                    <div className="slide-content">
                        <h2>Сезонные цветы</h2>
                        <img src={slide1} alt="Слайд 1" className="slide-image"/>
                    </div>
                </div>
                <div className="slide">
                    <div className="slide-content">
                        <h2>Лучшие букеты</h2>
                        <img src={slide2} alt="Слайд 2" className="slide-image"/>
                    </div>
                </div>
                <div className="slide">
                    <div className="slide-content">
                        <h2>Цветы к праздникам</h2>
                        <img src={slide3} alt="Слайд 3" className="slide-image"/>
                    </div>
                </div>
                <div className="slide">
                    <div className="slide-content">
                        <h2>Цветы к праздникам</h2>
                        <img src={slide4} alt="Слайд 3" className="slide-image"/>
                    </div>
                </div>
                <div className="slide">
                    <div className="slide-content">
                        <h2>Цветы к праздникам</h2>
                        <img src={slide5} alt="Слайд 3" className="slide-image"/>
                    </div>
                </div>
                <div className="slide">
                    <div className="slide-content">
                        <h2>Цветы к праздникам</h2>
                        <img src={slide6} alt="Слайд 3" className="slide-image"/>
                    </div>
                </div>

            </SlickSlider>
        </div>

    );
};

export default SliderTopProducts;
