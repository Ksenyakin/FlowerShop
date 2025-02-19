import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IProduct } from "../types";

interface CartItem {
    productId: number;
    quantity: number;
    name: string;
    price: number;
    total: number;
}

const getCartFromLocalStorage = (): CartItem[] => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
};

const saveCartToLocalStorage = (cart: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

const setCartCookie = (cart: CartItem[]) => {
    document.cookie =
        "cart=" +
        encodeURIComponent(JSON.stringify(cart)) +
        "; path=/; max-age=" +
        60 * 60 * 24 * 7;
};

interface AddToCartButtonProps {
    product: IProduct;
    quantity?: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product, quantity = 1 }) => {
    const [userId, setUserId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch("/api/userinfo", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Ошибка получения информации о пользователе");
                    return res.json();
                })
                .then((userData) => {
                    if (userData.user_id) {
                        setUserId(userData.user_id);
                    }
                });
        }
    }, []);

    const addToCart = async () => {
        const token = localStorage.getItem("token");
        if (token && userId) {
            // Пользователь авторизован — сохраняем корзину в БД
            try {
                const response = await fetch(
                    `/api/cart/${userId}/add?product_id=${product.id}&quantity=${quantity}`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Ошибка при добавлении в корзину: ${errorText}`);
                }
            } catch (error) {
                console.error("Ошибка при добавлении товара в корзину (БД):", error);
                alert("Ошибка при добавлении товара. Попробуйте снова.");
            }
        } else {
            // Пользователь не авторизован — сохраняем корзину локально
            let cart = getCartFromLocalStorage();
            const existingIndex = cart.findIndex((item) => item.productId === product.id);
            if (existingIndex >= 0) {
                cart[existingIndex].quantity += quantity;
                cart[existingIndex].total = cart[existingIndex].quantity * cart[existingIndex].price;
            } else {
                cart.push({
                    productId: product.id,
                    quantity: quantity,
                    name: product.name,
                    price: product.price,
                    total: product.price * quantity,
                });
            }
            saveCartToLocalStorage(cart);
            setCartCookie(cart);
        }
    };

    return (
        <button className="product-button" onClick={addToCart}>
            Добавить в корзину
        </button>
    );
};

export default AddToCartButton;
