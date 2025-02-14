import React from "react";
import { Link } from "react-router-dom";
import "./styles/CartInfo.css";

export interface CartItem {
    id: number;
    name: string;
    quantity: number;
    total: number;
}

interface CartInfoProps {
    cartItems: CartItem[];
    total: number;
    removeFromCart: (cartItemId: number) => void;
    clearCart: () => void;
}

const CartInfo: React.FC<CartInfoProps> = ({ cartItems, total, removeFromCart, clearCart }) => {
    return (
        <div className="cart-container-main">
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
    );
};

export default CartInfo;
