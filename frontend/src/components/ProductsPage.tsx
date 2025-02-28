import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../components/ProductsPage.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Header from "./Header";
import Footer from "./Footer";
import { FormControl, InputLabel, MenuItem, Select, Button } from "@mui/material";

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

interface Category {
    id: number;
    name: string;
}

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Фильтры
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

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

        const fetchCategories = async () => {
            try {
                const response = await fetch("/api/categories");
                if (!response.ok) {
                    throw new Error("Ошибка загрузки категорий");
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Ошибка загрузки категорий:", error);
            }
        };

        fetchProducts();
        fetchCategories();
    }, []);

    // Фильтрация товаров
    useEffect(() => {
        const filtered = products.filter((product) => {
            return (
                product.stock > 0 &&
                product.price >= priceRange[0] &&
                product.price <= priceRange[1] &&
                (selectedCategory ? product.category_id === selectedCategory : true)
            );
        });
        setFilteredProducts(filtered);
    }, [priceRange, selectedCategory, products]);

    const resetFilters = () => {
        setPriceRange([0, 20000]);
        setSelectedCategory(null);
        setFilteredProducts(products);
    };

    if (loading) return <div className="loading">Загрузка товаров...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="products-page">
            <Header />
            <div className="catalog-container">
                {/* Фильтры */}
                <aside className="filters">
                    <h3>Фильтры</h3>

                    {/* Фильтр по категории */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="category-label">Категория</InputLabel>
                        <Select
                            labelId="category-label"
                            value={selectedCategory || ""}
                            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                        >
                            <MenuItem value="">Все</MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

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

                    <Button variant="contained" color="primary" fullWidth onClick={resetFilters}>
                        Сбросить фильтры
                    </Button>
                </aside>

                {/* Список товаров */}
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
            <Footer />
        </div>
    );
};

export default ProductsPage;
