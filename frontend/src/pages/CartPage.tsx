// src/pages/CartPage.tsx
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartInfo, { CartItem } from "../components/CartInfo";
import DeliveryInfo from "../components/DeliveryInfo";
import PaymentMethods from "../components/PaymentMethods";
import "../components/styles/CartPage.css";

interface OrderItem {
  product_id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  total_price: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

interface DeliveryData {
  address: string;
  phone: string;
  deliveryDate: string;
  timeSlot: string;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [deliveryData, setDeliveryData] = useState<DeliveryData | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    loadCart();
  }, []);

  // Загрузка локальной корзины
  const loadCart = () => {
    let items: CartItem[] = [];
    try {
      const raw = localStorage.getItem("cart");
      if (raw) items = JSON.parse(raw);
    } catch {
      console.warn("Некорректный JSON в localStorage.cart");
    }
    setCartItems(items);
    calculateTotal(items);
  };

  // Помощник для подсчёта итога
  const calculateTotal = (items: CartItem[]) => {
    setTotal(items.reduce((sum, i) => sum + i.total, 0));
  };

  // Удаление из корзины
  const removeFromCart = (cartItemId: number) => {
    const updated = cartItems.filter(i => i.id !== cartItemId);
    setCartItems(updated);
    calculateTotal(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Очистка корзины
  const clearCart = () => {
    setCartItems([]);
    setTotal(0);
    localStorage.removeItem("cart");
  };

  // Сохранение данных доставки
  const handleDeliverySubmit = (data: DeliveryData) => {
    setDeliveryData(data);
  };

  // Оформление заказа — просто открываем модалку с локальными данными
  const handleCheckout = () => {
    if (!deliveryData) {
      alert("Пожалуйста, заполните информацию о доставке.");
      return;
    }

    // Формируем заказ из локальной корзины
    const items: OrderItem[] = cartItems.map(item => ({
      product_id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.total,
    }));

    const newOrder: Order = {
      id: Date.now(), // или любой другой уникальный локально ID
      total_price: total,
      status: "pending",
      created_at: new Date().toISOString(),
      items,
    };

    setCreatedOrder(newOrder);
    setModalOpen(true);
  };

  // Закрытие модалки
  const handleCloseModal = () => {
    clearCart();
    setCreatedOrder(null);
    setModalOpen(false);
  };

  return (
    <div className="cart-page">
      <Header />

      <main className="cart-main">
        <div className="cart-container">
          <section className="cart-items">
            <CartInfo
              cartItems={cartItems}
              total={total}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
              onCheckout={handleCheckout}
            />
          </section>
          <aside className="cart-sidebar">
            <DeliveryInfo onSubmit={handleDeliverySubmit} />
          </aside>
        </div>
      </main>

      {isModalOpen && createdOrder && (
        <div className="cart-modal">
          <div className="cart-modal__backdrop" onClick={handleCloseModal} />
          <div className="cart-modal__window">
            <h2>Спасибо за заказ #{createdOrder.id}!</h2>
            <p><strong>Статус:</strong> {createdOrder.status}</p>
            <p><strong>Дата:</strong> {new Date(createdOrder.created_at).toLocaleString()}</p>
            <p><strong>Адрес:</strong> {deliveryData?.address}</p>
            <p><strong>Телефон:</strong> {deliveryData?.phone}</p>
            <h3>Ваши товары:</h3>
            <ul>
              {createdOrder.items.map(item => (
                <li key={item.product_id}>
                  {item.name} × {item.quantity} — {(item.price * item.quantity).toFixed(2)} ₽
                </li>
              ))}
            </ul>
            <p><strong>Итого:</strong> {createdOrder.total_price.toFixed(2)} ₽</p>
            <button className="btn btn-secondary" onClick={handleCloseModal}>
              Закрыть
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CartPage;
