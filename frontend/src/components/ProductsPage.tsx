import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductsPage.css';
import UserDropdown from './UserDropdown';
import logo from './logo.png';



interface Product {
    id: number;
    category_id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
}

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Подгрузка данных с API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                if (!response.ok) {
                    throw new Error('Ошибка загрузки продуктов');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                setError('Ошибка загрузки продуктов. Пожалуйста, попробуйте позже.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div className="loading">Загрузка товаров...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div>
            <div className="products-page">
                <header className="header">
                    <div className="logo">
                        <img src={logo} alt="Логотип компании" />
                    </div>
                    <a className="company-name" href="/">Decor Fleurs</a>
                    <nav className="nav">
                        <ul>
                            <li><a href="/products/">Каталог</a></li>
                            <li><a href="/delivery">Доставка</a></li>
                            <li><a href="/about">О нас</a></li>
                            <li><a href="/contacts">Контакты</a></li>
                        </ul>
                    </nav>
                    <div className="auth-buttons">
                        <a href="/register" className="button">Регистрация</a>
                        <a href="/login" className="button">Авторизация</a>
                    </div>
                    <UserDropdown />
                </header>
                <h1>Каталог продуктов</h1>
                <div className="products-list">
                    {products.map((product) => (
                        <div className="product-card" key={product.id}>
                            <Link to={`/products/${product.id}`} className="product-link">
                                <img
                                    src={product.imageUrl || '/default-image.jpg'}
                                    alt={product.name}
                                    className="product-image"
                                />
                                <h2 className="product-name">{product.name}</h2>
                            </Link>
                            <p className="product-description">{product.description}</p>
                            <p className="product-price">{product.price} ₽</p>
                            <button className="product-button">Купить</button>
                        </div>
                    ))}
                </div>
            </div>
            <footer>
                <div className="footer-content">
                    <p>&copy; 2024 Decor Fleurs. Все права защищены.</p>
                    <div className="social-links">
                        <a href="#">VK</a>
                        <a href="#">Instagram</a>
                        <a href="#">Facebook</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
export default ProductsPage;
