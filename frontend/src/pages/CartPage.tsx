import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../components/styles/CartPage.css";
import CartInfo, { CartItem } from "../components/CartInfo";
import DeliveryInfo from "../components/DeliveryInfo";

const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);
    const [userId, setUserId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            authenticateUser(token);
        } else {
            loadCart();
        }
    }, []);

    const authenticateUser = async (token: string) => {
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
                loadCart();
            }
        } catch (error) {
            console.error("Ошибка при аутентификации:", error);
            loadCart();
        }
    };

    // Загрузка корзины из localStorage и cookies
    const loadCart = () => {
        let items: CartItem[] = [];
        const localCart = localStorage.getItem("cart");
        if (localCart) {
            try {
                items = JSON.parse(localCart);
            } catch (err) {
                console.error("Ошибка парсинга корзины из localStorage", err);
            }
        }
        if (!items || items.length === 0) {
            items = getCartFromCookie();
        }
        setCartItems(items);
        calculateTotal(items);
    };

    // Функция для получения корзины из cookies
    const getCartFromCookie = (): CartItem[] => {
        const name = "cart=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(";");
        for (let c of ca) {
            c = c.trim();
            if (c.indexOf(name) === 0) {
                try {
                    return JSON.parse(c.substring(name.length));
                } catch (err) {
                    console.error("Ошибка парсинга корзины из cookie", err);
                    return [];
                }
            }
        }
        return [];
    };

    const fetchCartItems = async (userId: number) => {
        try {
            const response = await fetch(`/api/cart/${userId}/view`);
            if (!response.ok) {
                throw new Error("Ошибка при получении корзины");
            }
            const text = await response.text();
            let data: CartItem[] = [];
            if (text) {
                data = JSON.parse(text);
            }
            setCartItems(data);
            calculateTotal(data);
        } catch (error) {
            console.error("Ошибка при получении корзины:", error);
            setCartItems([]);
            setTotal(0);
        }
    };

    const calculateTotal = (items: CartItem[]) => {
        const totalAmount = items.reduce((acc, item) => acc + item.total, 0);
        setTotal(totalAmount);
    };

    const removeFromCart = async (cartItemId: number) => {
        if (userId) {
            try {
                const response = await fetch(`/api/cart/remove/${cartItemId}`, {
                    method: "DELETE",
                });
                if (!response.ok) {
                    throw new Error("Ошибка при удалении товара из корзины");
                }
                fetchCartItems(userId);
            } catch (error) {
                console.error("Ошибка при удалении товара:", error);
            }
        } else {
            const updatedCart = cartItems.filter((item) => item.id !== cartItemId);
            setCartItems(updatedCart);
            calculateTotal(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
        }
    };

    const clearCart = async () => {
        if (userId) {
            try {
                const response = await fetch(`/api/cart/${userId}/clear`, {
                    method: "POST",
                });
                if (!response.ok) {
                    throw new Error("Ошибка при очистке корзины");
                }
                setCartItems([]);
                setTotal(0);
            } catch (error) {
                console.error("Ошибка при очистке корзины:", error);
            }
        } else {
            setCartItems([]);
            setTotal(0);
            localStorage.removeItem("cart");
        }
    };

    const handleDeliverySubmit = (deliveryData: {
        address: string;
        phone: string;
        deliveryDate: string;
        timeSlot: string;
    }) => {
        console.log("Данные доставки сохранены:", deliveryData);
        // Здесь можно отправить данные доставки на сервер
    };

    return (
        <div className="cart-page">
            <Header />
            <div className="cart-container">
                <CartInfo
                    cartItems={cartItems}
                    total={total}
                    removeFromCart={removeFromCart}
                    clearCart={clearCart}
                />
                <DeliveryInfo onSubmit={handleDeliverySubmit} />
            </div>
            <Footer />
        </div>
    );
};

export default CartPage;
