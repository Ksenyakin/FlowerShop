import React, { forwardRef } from "react";
import Slider, { Settings } from "react-slick";
import './SliderComponent.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const slide1 = "/slider1.jpg";
const slide2 = "https://s3.timeweb.cloud/84163e07-decor-fleurs-s3/20.jpg";
const slide3 = "/slider1.jpg";

// Оборачиваем Slider в forwardRef с явной типизацией.
// Используем ts-ignore для подавления ошибки TS2786.
const SlickSlider = forwardRef<any, Settings>((props, ref) => {
    // @ts-ignore
    return <Slider ref={ref} {...props} />;
});

const SliderComponent: React.FC = () => {
    const settings: Settings = {
        dots: true,          // Показывать точки навигации
        infinite: true,      // Бесконечный цикл
        speed: 500,          // Скорость анимации
        slidesToShow: 1,     // Сколько слайдов показывать
        slidesToScroll: 1,   // Сколько слайдов прокручивать
        autoplay: true,      // Авто-прокрутка
        autoplaySpeed: 7000, // Скорость смены слайдов (мс)
        arrows: true,        // Стрелки навигации
    };

    return (
        <div className="slick-slider-container">
            <SlickSlider {...settings}>
                <div className="slick-slide">
                    <div className="slick-slide-content">
                        <h2>Сезонные цветы</h2>
                        <img src={slide1} alt="Слайд 1" className="slick-slide-image"/>
                    </div>
                </div>
                <div className="slick-slide">
                    <div className="slick-slide-content">
                        <h2>Лучшие букеты</h2>
                        <img src={slide2} alt="Слайд 2" className="slick-slide-image"/>
                    </div>
                </div>
                <div className="slick-slide">
                    <div className="slick-slide-content">
                        <h2>Цветы к праздникам</h2>
                        <img src={slide3} alt="Слайд 3" className="slick-slide-image"/>
                    </div>
                </div>
            </SlickSlider>
        </div>

    );
};

export default SliderComponent;
