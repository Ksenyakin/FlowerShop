import React, { useEffect, useState } from 'react';
import './AdminPanel.css';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
}

const AdminPanel: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        imageUrl: '',
    });

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/admin/products');
            if (!response.ok) throw new Error('Ошибка загрузки продуктов');
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleImageUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка загрузки изображения');
            }

            const imageUrl = await response.text(); // Получаем URL изображения
            return imageUrl;
        } catch (err) {
            alert('Ошибка загрузки изображения: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'));
            return null;
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const uploadedImageUrl = await handleImageUpload(e.target.files[0]);
            if (uploadedImageUrl) {
                setNewProduct((prev) => ({ ...prev, imageUrl: uploadedImageUrl }));
            }
        }
    };

    const handleAddProduct = async () => {
        try {
            const response = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct),
            });

            if (!response.ok) {
                throw new Error('Ошибка добавления продукта');
            }

            alert('Продукт успешно добавлен');
            setNewProduct({ name: '', description: '', price: 0, stock: 0, imageUrl: '' });
            fetchProducts(); // Обновить список продуктов
        } catch (err) {
            alert('Ошибка: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'));
        }
    };

    const deleteProduct = async (id: number) => {
        try {
            const response = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Не удалось удалить продукт');
            setProducts(products.filter((product) => product.id !== id));
        } catch (err) {
            alert('Ошибка удаления: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'));
        }
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div className="admin-panel">
            <h1>Управление товарами</h1>

            <div className="product-form">
                <h2>Добавить новый продукт</h2>
                <input
                    type="text"
                    placeholder="Название"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                />
                <textarea
                    placeholder="Описание"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
                />
                <input
                    type="number"
                    placeholder="Цена"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, price: +e.target.value }))}
                />
                <input
                    type="number"
                    placeholder="Остаток"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, stock: +e.target.value }))}
                />
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleAddProduct}>Добавить продукт</button>
            </div>

            <table>
                <thead>
                <tr>
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
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>{product.price} ₽</td>
                        <td>{product.stock}</td>
                        <td>
                            <button onClick={() => deleteProduct(product.id)}>Удалить</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;
