import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer: React.FC = () => {
    return (
        <footer className="footer-content">
            <p>&copy; {new Date().getFullYear()} DecorFleurs. Все права защищены.</p>
            <nav className="footer-links">
                <Link to="/privacy">Политика конфиденциальности</Link>
                <Link to="/terms">Условия использования</Link>
            </nav>
        </footer>
    );
};

export default Footer;
