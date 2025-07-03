import React from "react";
import "./styles/CartInfo.css";

// Описание типа элемента корзины
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
  onCheckout: () => void;
}

const CartInfo: React.FC<CartInfoProps> = ({ cartItems, total, removeFromCart, clearCart, onCheckout }) => {
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
                <span>{item.name} — {item.quantity} шт. — {item.total} ₽</span>
                <button onClick={() => removeFromCart(item.id)} className="remove-button">Удалить</button>
              </li>
            ))}
          </ul>
          <h3>Общая сумма: {total} ₽</h3>
          <div className="cart-actions">
            <button onClick={clearCart} className="clear-button">Очистить корзину</button>
            <button onClick={onCheckout} className="checkout-button">Оформить заказ</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartInfo;