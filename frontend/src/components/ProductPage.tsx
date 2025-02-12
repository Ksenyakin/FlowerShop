import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './Header';  // ✅ Подключаем хедер
import Footer from './Footer';  // ✅ Подключаем футер
import './ProductPage.css';

interface Product {
    id: number;
    category_id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string;
    createdAt: string;
    updatedAt: string;
}

const ProductPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${id}`);
                if (!response.ok) {
                    throw new Error('Ошибка загрузки товара');
                }
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                setError('Ошибка загрузки товара. Пожалуйста, попробуйте позже.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <div className="loading">Загрузка товара...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!product) return <div className="error">Товар не найден</div>;

    return (
        <div className="product-page">
            <Header />
            <div className="product-details">
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="product-image"
                />
                <h1 className="product-name">{product.name}</h1>
                <p className="product-description">{product.description}</p>
                <p className="product-price">{product.price} ₽</p>
                <p className="product-stock">В наличии: {product.stock} шт.</p>
                <button className="product-button">Добавить в корзину</button>
            </div>
            <Footer />
        </div>
    );
};

export default ProductPage;
