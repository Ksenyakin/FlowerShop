import React, { useEffect, useState, forwardRef } from "react";
import Slider, { Settings } from "react-slick";
import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import "./styles/SliderTopProducts.css";
import { IProduct } from "../types";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


// Оборачиваем Slider в forwardRef с явной типизацией.
// Используем @ts-ignore для подавления ошибки TS2786.
const SlickSlider = forwardRef<any, Settings>((props, ref) => {
    // @ts-ignore
    return <Slider ref={ref} {...props} />;
});

const SliderTopProducts: React.FC = () => {
    const [products, setProducts] = useState<IProduct[]>([]);

    useEffect(() => {
        fetch("/api/products")
            .then((response) => response.json())
            .then((data: IProduct[]) => {
                console.log("Все товары:", data);
                // Фильтруем товары, где top_product === true или "true"
                const topProducts = data.filter(
                    (product) =>
                        product.top_product === true ||
                        product.top_product === "true"
                );
                console.log("Топ товары:", topProducts);
                setProducts(topProducts);
            })
            .catch((error) => {
                console.error("Ошибка получения данных:", error);
                // Если произошла ошибка, задаём дефолтные данные для демонстрации
                setProducts([
                    {
                        id: 1,
                        name: "Сезонные цветы",
                        image_url: "https://s3.timeweb.cloud/84163e07-decor-fleurs-s3/15.jpg",
                        top_product: true,
                        price: 1000,
                    },
                    {
                        id: 2,
                        name: "Лучшие букеты",
                        image_url: "https://s3.timeweb.cloud/84163e07-decor-fleurs-s3/16.jpg",
                        top_product: true,
                        price: 2000,
                    },
                    {
                        id: 3,
                        name: "Цветы к праздникам",
                        image_url: "https://s3.timeweb.cloud/84163e07-decor-fleurs-s3/17.jpg",
                        top_product: true,
                        price: 1500,
                    },
                ]);
            });
    }, []);

    const settings: Settings = {
        dots: true,           // Показываем точки навигации
        infinite: false,      // Отключаем бесконечный цикл, чтобы не было "лишнего" слайда
        speed: 500,           // Скорость анимации
        slidesToShow: 3,      // Показываем ровно 3 слайда
        slidesToScroll: 3,    // Прокручиваем по 3 товара сразу
        autoplay: false,      // Авто-прокрутка отключена
        autoplaySpeed: 7000,  // Скорость смены слайдов (если включена автопрокрутка)
        arrows: true,         // Стрелки навигации
    };

    return (
        <div className="slider-container">
            <SlickSlider {...settings}>
                {products.map((product, index) => (
                    <div className="slide" key={product.id}>
                        <div className="slide-content">
                            <h2>{product.name}</h2>
                            <img
                                src={product.image_url}
                                alt={`Слайд ${index + 1}`}
                                className="slide-image"
                            />
                            <Link to={`/products/${product.id}`} className="category-button">
                                Перейти в каталог
                            </Link>
                            <AddToCartButton product={product} />
                        </div>
                    </div>
                ))}
            </SlickSlider>
        </div>
    );
};

export default SliderTopProducts;
