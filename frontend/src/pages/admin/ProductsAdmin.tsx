import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader"; // ✅ Добавляем импорт
import "./ProductsAdmin.css";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string;
}

const ProductsAdmin: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => {
                console.log("📦 Загруженные товары:", data);
                setProducts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("❌ Ошибка загрузки товаров:", err);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Вы уверены, что хотите удалить товар?")) return;

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (!response.ok) throw new Error("Ошибка удаления товара");

            setProducts(products.filter((product) => product.id !== id));
        } catch (error) {
            console.error("Ошибка удаления товара:", error);
        }
    };

    if (loading) return <h1>Загрузка...</h1>;

    return (
        <>
            <AdminHeader title="Управление товарами" />
            <div className="admin-page-content">
                <button onClick={() => navigate("/admin/products/new")} className="add-btn">➕ Добавить товар</button>

                {products.length === 0 ? <p>Нет товаров</p> : (
                    <table className="products-table">
                        <thead>
                        <tr>
                            <th>Фото</th>
                            <th>Название</th>
                            <th>Описание</th>
                            <th>Цена</th>
                            <th>Остаток</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="product-image"
                                        onClick={() => setSelectedImage(product.image_url)}
                                    />
                                </td>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>{product.price} ₽</td>
                                <td>{product.stock}</td>
                                <td>
                                    <button onClick={() => navigate(`/admin/products/edit/${product.id}`)}>✏️ Изменить</button>
                                    <button onClick={() => handleDelete(product.id)}>🗑 Удалить</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                {/* Оверлей для увеличенного фото */}
                {selectedImage && (
                    <div className="image-overlay" onClick={() => setSelectedImage(null)}>
                        <div className="image-container">
                            <img src={selectedImage} alt="Товар" />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ProductsAdmin;
