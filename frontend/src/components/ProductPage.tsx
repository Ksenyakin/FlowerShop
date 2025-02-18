import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "./ProductPage.css";
import AddToCartButton from "./AddToCartButton";
import {IProduct} from "../types";

const ProductPage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [userId, setUserId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProduct();
        fetchUserId();
    }, []);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/products/${id}`);
            if (!response.ok) {
                throw new Error("Ошибка загрузки товара");
            }
            const data = await response.json();
            setProduct(data);
            console.log("Товар загружен:", data);
        } catch (error) {
            setError("Ошибка загрузки товара. Пожалуйста, попробуйте позже.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserId = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.warn("Токен отсутствует, пользователь не авторизован");
            return;
        }
        try {
            const response = await fetch("/api/userinfo", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Ошибка получения информации о пользователе");
            }
            const userData = await response.json();
            if (userData.user_id) {
                setUserId(userData.user_id);
                console.log("userId получен:", userData.user_id);
            } else {
                console.error("Ошибка: user_id отсутствует в данных пользователя");
            }
        } catch (error) {
            console.error("Ошибка при загрузке userId:", error);
        }
    };

    if (loading) return <div className="loading">Загрузка товара...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!product) return <div className="error">Товар не найден</div>;

    return (
        <div>
            <div className="product-page">
                <Header/>
                <div className="product-page-container">
                    <div className="product-image-container">
                        <img src={product.image_url} alt={product.name} className="product-image-page"/>
                    </div>
                    <div className="product-details">
                        <h1 className="product-name">{product.name}</h1>
                        <p className="product-description">{product.description}</p>
                        <p className="product-price">{product.price} ₽</p>
                        <p className="product-stock">В наличии: {product.stock} шт.</p>
                        <div className="quantity-container">
                            <label htmlFor="quantity">Количество:</label>
                            <input
                                type="number"
                                id="quantity"
                                value={quantity}
                                min="1"
                                max={product.stock}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                            />
                        </div>
                        <AddToCartButton product={product} quantity={quantity}/>
                    </div>
                </div>
                <Footer/>
            </div>
        </div>
    );
};

export default ProductPage;
