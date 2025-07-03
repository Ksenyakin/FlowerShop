// src/pages/OrdersPage.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../components/styles/OrdersPage.css";

interface Order {
  id: number;
  date: string;
  status: string;
  total: number;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("[OrdersPage] token from localStorage:", token);
    if (!token) {
      console.warn("[OrdersPage] no token—redirect to login");
      navigate("/login"); 
      return;
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };
    console.log("[OrdersPage] fetch headers:", headers);

    fetch("/api/orders", { headers })
      .then(async (res) => {
        console.log("[OrdersPage] response status:", res.status, res.statusText);
        const text = await res.text();
        console.log("[OrdersPage] response body:", text);
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        return JSON.parse(text) as Order[];
      })
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => {
        console.error("[OrdersPage] fetch error:", err);
        setError("Не удалось загрузить заказы");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div className="orders-page">
      <Header />

      <main className="orders-main">
        <h1 className="orders-title">История заказов</h1>

        {loading && <p className="orders-status">Загрузка заказов…</p>}
        {error && <p className="orders-status orders-status_error">{error}</p>}
        {!loading && !error && orders.length === 0 && (
          <p className="orders-status">У вас пока нет заказов.</p>
        )}

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card__header">
                <span className="order-card__id">Заказ №{order.id}</span>
                <span className="order-card__date">{order.date}</span>
              </div>
              <div className="order-card__body">
                <p className="order-card__status">
                  <strong>Статус:</strong> {order.status}
                </p>
                <p className="order-card__total">
                  <strong>Сумма:</strong> {order.total} ₽
                </p>
              </div>
              <div className="order-card__actions">
                <Link to={`/orders/${order.id}`} className="btn btn-outline">
                  Подробнее
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="orders-back">
          <Link to="/" className="btn btn-link">
            ← На главную
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrdersPage;
