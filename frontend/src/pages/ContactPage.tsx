// src/pages/ContactPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../components/styles/ContactPage.css";

const ContactPage: React.FC = () => (
  <div className="contact-page">
    <Header />

    <main className="contact-page__content">
      <h1>Контакты</h1>

      <ul className="contact-page__list">
        <li>
          <strong>Телефон:</strong>{" "}
          <a href="tel:+79034477333">+7 (903) 44-77-333</a>
        </li>
        <li>
          <strong>E-mail:</strong>{" "}
          <a href="mailto:info@decor-fleurs.ru">info@decor-fleurs.ru</a>
        </li>
        <li>
          <strong>Telegram:</strong>{" "}
          <a
            href="https://t.me/decorfleurs"
            target="_blank"
            rel="noopener noreferrer"
          >
            @decorfleurs
          </a>
        </li>
        <li>
          <strong>WhatsApp:</strong>{" "}
          <a
            href="https://wa.me/79034477333"
            target="_blank"
            rel="noopener noreferrer"
          >
            Написать в WhatsApp
          </a>
        </li>
        <li>
          <strong>Адрес:</strong> ул. Гидростроителей, д. 62к1
        </li>
      </ul>
    </main>

    <Footer />
  </div>
);

export default ContactPage;
