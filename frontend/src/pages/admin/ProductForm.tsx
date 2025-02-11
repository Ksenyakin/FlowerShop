import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProductForm.css";

interface Category {
    id: number;
    name: string;
    parent_id: number | null;
}

const ProductForm: React.FC = () => {
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        category_id: null as number | null, // ✅ Исправлено для корректной типизации
        image_url: "",
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("/api/categories");
                if (!response.ok) throw new Error("Ошибка загрузки категорий");
                const data = await response.json();
                setCategories(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Ошибка:", error);
                setCategories([]); // ✅ Гарантируем, что не будет `null`
            }
        };

        fetchCategories();

        if (id) {
            fetch(`/api/products/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data) {
                        setProduct({
                            ...data,
                            category_id: data.category_id ?? null, // ✅ Фикс, если `category_id` = `null`
                        });
                    }
                })
                .catch((err) => console.error("Ошибка загрузки товара:", err));
        }
    }, [id]);

    const handleUpload = async () => {
        if (!file) {
            alert("Выберите файл перед загрузкой!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (!response.ok) {
                throw new Error("Ошибка при загрузке изображения!");
            }

            const data = await response.json();
            setProduct({ ...product, image_url: data.url });
        } catch (error) {
            console.error("Ошибка загрузки файла:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = id ? "PUT" : "POST";
        const url = id ? `/api/products/${id}` : "/api/addProduct";

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(product),
            });

            if (!response.ok) throw new Error("Ошибка при сохранении товара");
            navigate("/admin/products");
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    return (
        <div className="product-form-container">
            <h1>{id ? "Редактировать товар" : "Добавить товар"}</h1>
            <form onSubmit={handleSubmit} className="product-form">
                <label>Название</label>
                <input
                    type="text"
                    placeholder="Введите название"
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    required
                />

                <label>Описание</label>
                <textarea
                    placeholder="Введите описание"
                    value={product.description}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    required
                />

                <label>Цена</label>
                <input
                    type="number"
                    placeholder="Введите цену"
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                    required
                />

                <label>Остаток</label>
                <input
                    type="number"
                    placeholder="Введите количество"
                    value={product.stock}
                    onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
                    required
                />

                <label>Категория</label>
                <select
                    value={product.category_id !== null ? product.category_id : ""}
                    onChange={(e) => setProduct({
                        ...product,
                        category_id: e.target.value ? Number(e.target.value) : null
                    })}
                    required
                >
                    <option value="">Выберите категорию</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.parent_id ? `↳ ${category.name}` : category.name}
                        </option>
                    ))}
                </select>

                <label>Изображение</label>
                <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
                <button type="button" className="upload-btn" onClick={handleUpload}>📤 Загрузить изображение</button>

                {product.image_url && product.image_url !== "" && (
                    <div className="image-preview">
                        <img src={product.image_url} alt="Товар" />
                    </div>
                )}

                <button type="submit" className="save-btn">Сохранить</button>
            </form>
        </div>
    );
};

export default ProductForm;
