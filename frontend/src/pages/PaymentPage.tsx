// src/pages/PaymentPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../components/styles/PaymentPage.css";

const PaymentPage: React.FC = () => (
  <div className="payment-page">
    <Header />

    <main className="payment-page__content">
      <h1>Оплата</h1>

      <section className="payment-page__section">
        <h2>Доступные способы оплаты</h2>
        <ul className="payment-page__methods">
          <li>Система быстрых платежей (СБП)</li>
          <li>Банковские карты Visa, MasterCard и МИР</li>
          <li>Оплата при получении (наличными или картой курьеру)</li>
        </ul>
      </section>

      <section className="payment-page__section">
        <h2>Безопасность платежей</h2>
        <p>
          Все транзакции проходят по защищённому каналу связи (SSL/TLS). Мы используем
          сертифицированные платёжные шлюзы, полностью соответствующие требованиям
          PCI DSS. Это гарантирует, что ваши платёжные данные обрабатываются
          с максимальным уровнем безопасности.
        </p>
      </section>

      <section className="payment-page__section">
        <h2>Хранение данных карт</h2>
        <p>
          Мы не храним и не передаём третьим лицам реквизиты ваших карт. Все
          данные вводятся непосредственно в платёжный шлюз, и мы получаем только
          подтверждение успешного списания средств.
        </p>
      </section>

    </main>

    <Footer />
  </div>
);

export default PaymentPage;
