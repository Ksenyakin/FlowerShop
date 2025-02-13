import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CartPage.css";
import Header from "./Header";
import Footer from "./Footer";

interface CartItem {
    id: number;
    name: string;
    quantity: number;
    total: number;
}

const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);
    const [userId, setUserId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        authenticateUser();
    }, []);

    const authenticateUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const response = await fetch("/api/userinfo", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("Ошибка при получении информации о пользователе");
            }

            const data = await response.json();
            if (data.user_id) {
                setUserId(data.user_id);
                fetchCartItems(data.user_id);
            } else {
                console.error("Ошибка: user_id отсутствует в данных пользователя");
            }
        } catch (error) {
            console.error("Ошибка при аутентификации:", error);
            navigate("/login");
        }
    };

    const fetchCartItems = async (userId: number) => {
        try {
            const response = await fetch(`/api/cart/${userId}/view`); // Исправленный URL
            if (!response.ok) {
                throw new Error("Ошибка при получении корзины");
            }
            const data = await response.json();
            setCartItems(data);
            calculateTotal(data);
        } catch (error) {
            console.error("Ошибка при получении корзины:", error);
        }
    };

    const calculateTotal = (items: CartItem[]) => {
        const totalAmount = items.reduce((acc, item) => acc + item.total, 0);
        setTotal(totalAmount);
    };

    const removeFromCart = async (cartItemId: number) => {
        try {
            const response = await fetch(`/api/cart/remove/${cartItemId}`, { method: "DELETE" });
            if (!response.ok) {
                throw new Error("Ошибка при удалении товара из корзины");
            }
            fetchCartItems(userId!);
        } catch (error) {
            console.error("Ошибка при удалении товара:", error);
        }
    };

    const clearCart = async () => {
        if (!userId) return;
        try {
            const response = await fetch(`/api/cart/${userId}/clear`, { method: "POST" }); // Исправленный URL
            if (!response.ok) {
                throw new Error("Ошибка при очистке корзины");
            }
            setCartItems([]);
            setTotal(0);
        } catch (error) {
            console.error("Ошибка при очистке корзины:", error);
        }
    };

    return (
        <div className="cart-page">
            <Header />
            <div className="cart-container">
                <h2>Корзина</h2>
                {cartItems.length === 0 ? (
                    <p className="empty-cart">Ваша корзина пуста</p>
                ) : (
                    <>
                        <ul className="cart-list">
                            {cartItems.map((item) => (
                                <li key={item.id} className="cart-item">
                                    {item.name} - {item.quantity} шт. - {item.total} ₽
                                    <button onClick={() => removeFromCart(item.id)} className="remove-button">
                                        Удалить
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <h3>Общая сумма: {total} ₽</h3>
                        <button onClick={clearCart} className="clear-button">
                            Очистить корзину
                        </button>
                        <Link to="/checkout" className="checkout-button">
                            Оформить заказ
                        </Link>
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default CartPage;
