import React, { useState, useEffect } from "react";
import "./CategoriesAdmin.css";

interface Category {
    id: number;
    name: string;
    parent_id: number | null;
}

const CategoriesAdmin: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [parentID, setParentID] = useState<number | null>(null);
    const [editCategory, setEditCategory] = useState<Category | null>(null); // ✅ Добавлено

    useEffect(() => {
        fetch("/api/categories")
            .then((res) => res.json())
            .then((data) => setCategories(Array.isArray(data) ? data : []))
            .catch((err) => console.error("Ошибка:", err));
    }, []);

    // Получаем название родительской категории
    const getParentCategoryName = (parent_id: number | null) => {
        if (!parent_id) return "—";
        const parent = categories.find((cat) => cat.id === parent_id);
        return parent ? parent.name : "—";
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;

        try {
            const response = await fetch("/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ name: newCategory, parent_id: parentID }),
            });

            if (!response.ok) throw new Error("Ошибка при добавлении категории");

            window.location.reload();
        } catch (error) {
            console.error("Ошибка при добавлении категории:", error);
        }
    };

    const handleUpdateCategory = async () => {
        if (!editCategory) return; // ✅ Проверяем, есть ли выбранная категория для редактирования

        try {
            const response = await fetch(`/api/categories/${editCategory.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ name: editCategory.name, parent_id: editCategory.parent_id }),
            });

            if (!response.ok) throw new Error("Ошибка при изменении категории");

            window.location.reload();
        } catch (error) {
            console.error("Ошибка изменения категории:", error);
        }
    };

    return (
        <div className="categories-admin">
            <h1>Управление категориями</h1>
            <button onClick={() => window.history.back()} className="back-btn">⬅ Назад</button>

            <div className="category-form">
                <input
                    type="text"
                    placeholder="Название категории"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <select onChange={(e) => setParentID(e.target.value ? Number(e.target.value) : null)}>
                    <option value="">Без родительской категории</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <button onClick={handleAddCategory}>Добавить категорию</button>
            </div>

            <table className="category-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Родительская категория</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {categories.map((category) => (
                    <tr key={category.id}>
                        <td>{category.id}</td>
                        <td>
                            {editCategory && editCategory.id === category.id ? (
                                <input
                                    type="text"
                                    value={editCategory.name}
                                    onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                                />
                            ) : (
                                category.name
                            )}
                        </td>
                        <td>
                            {editCategory && editCategory.id === category.id ? (
                                <select
                                    value={editCategory.parent_id || ""}
                                    onChange={(e) =>
                                        setEditCategory({
                                            ...editCategory,
                                            parent_id: e.target.value ? Number(e.target.value) : null,
                                        })
                                    }
                                >
                                    <option value="">Без родительской категории</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                getParentCategoryName(category.parent_id)
                            )}
                        </td>
                        <td>
                            {editCategory && editCategory.id === category.id ? (
                                <button onClick={handleUpdateCategory}>💾 Сохранить</button>
                            ) : (
                                <button onClick={() => setEditCategory(category)}>✏️ Изменить</button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoriesAdmin;
