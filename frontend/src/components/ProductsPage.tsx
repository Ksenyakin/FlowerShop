import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../components/ProductsPage.css";
import UserDropdown from "./UserDropdown";
import logo from "./logo.png";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Header from "./Header";
import Footer from "./Footer";

interface Product {
    id: number;
    category_id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string;
    color: string;
    bouquet_type: string;
    recipient: string;
    occasion: string;
}

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Фильтры
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedBouquetType, setSelectedBouquetType] = useState<string | null>(null);
    const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
    const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);

    // Загрузка данных
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("/api/products");
                if (!response.ok) {
                    throw new Error("Ошибка загрузки продуктов");
                }
                const data = await response.json();
                setProducts(data);
                setFilteredProducts(data);
            } catch (error) {
                setError("Ошибка загрузки продуктов. Пожалуйста, попробуйте позже.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Фильтрация товаров
    useEffect(() => {
        const filtered = products.filter((product) => {
            return (
                product.price >= priceRange[0] &&
                product.price <= priceRange[1] &&
                (selectedColor ? product.color === selectedColor : true) &&
                (selectedBouquetType ? product.bouquet_type === selectedBouquetType : true) &&
                (selectedRecipient ? product.recipient === selectedRecipient : true) &&
                (selectedOccasion ? product.occasion === selectedOccasion : true)
            );
        });
        setFilteredProducts(filtered);
    }, [priceRange, selectedColor, selectedBouquetType, selectedRecipient, selectedOccasion, products]);

    const resetFilters = () => {
        setPriceRange([0, 20000]);
        setSelectedColor(null);
        setSelectedBouquetType(null);
        setSelectedRecipient(null);
        setSelectedOccasion(null);
        setFilteredProducts(products);
    };


    if (loading) return <div className="loading">Загрузка товаров...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="products-page">
            <Header/>
            <div className="catalog-container">
                {/* Фильтры слева */}
                <aside className="filters">
                    <h3>Фильтры</h3>
                    {/* Ползунок цены */}
                    <label>Цена:</label>
                    <Slider
                        range
                        min={0}
                        max={20000}
                        defaultValue={priceRange}
                        onChange={(value: number | number[]) => {
                            if (Array.isArray(value)) {
                                setPriceRange([value[0], value[1]]);
                            }
                        }}
                    />
                    <p>{priceRange[0]} ₽ - {priceRange[1]} ₽</p>
                    {/* Фильтр по цвету */}
                    <label>Цвет:</label>
                    <select onChange={(e) => setSelectedColor(e.target.value || null)}>
                        <option value="">Все</option>
                        <option value="Красный">Красный</option>
                        <option value="Белый">Белый</option>
                        <option value="Розовый">Розовый</option>
                        <option value="Желтый">Желтый</option>
                    </select>
                    {/* Фильтр по типу букета */}
                    <label>Тип букета:</label>
                    <select onChange={(e) => setSelectedBouquetType(e.target.value || null)}>
                        <option value="">Все</option>
                        <option value="Классический">Классический</option>
                        <option value="Современный">Современный</option>
                    </select>
                    {/* Фильтр по получателю */}
                    <label>Кому:</label>
                    <select onChange={(e) => setSelectedRecipient(e.target.value || null)}>
                        <option value="">Все</option>
                        <option value="Маме">Маме</option>
                        <option value="Девушке">Девушке</option>
                        <option value="Коллеге">Коллеге</option>
                    </select>
                    {/* Фильтр по поводу */}
                    <label>Повод:</label>
                    <select onChange={(e) => setSelectedOccasion(e.target.value || null)}>
                        <option value="">Все</option>
                        <option value="День рождения">День рождения</option>
                        <option value="Годовщина">Годовщина</option>
                        <option value="Свадьба">Свадьба</option>
                    </select>
                    <button className="clear-filters" onClick={resetFilters}>Сбросить фильтры</button>
                </aside>

                {/* Блок товаров */}
                <div className="products-list">
                    {filteredProducts.map((product) => (
                        <div className="products-card" key={product.id}>
                            <Link to={`/products/${product.id}`} className="products-link">
                                <img src={product.image_url} alt={product.name} className="products-image-catalog" />
                                <div className="products-details">
                                    <h2 className="products-name">{product.name}</h2>
                                    <p className="products-price">от {product.price} ₽</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default ProductsPage;
