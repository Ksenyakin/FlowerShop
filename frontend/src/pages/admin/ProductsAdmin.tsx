import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Dialog, DialogContent, Checkbox } from "@mui/material";
import AdminHeader from "./AdminHeader";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string;
    top_product: boolean;
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

    if (loading) return <CircularProgress sx={{ display: "block", margin: "20px auto" }} />;

    return (
        <Container maxWidth="lg">
            <AdminHeader title="Управление товарами" />
            <Typography variant="h4" gutterBottom>Список товаров</Typography>
            <Button variant="contained" color="primary" onClick={() => navigate("/admin/products/new")} sx={{ mb: 2 }}>
                ➕ Добавить товар
            </Button>

            {products.length === 0 ? <Typography>Нет товаров</Typography> : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Фото</TableCell>
                                <TableCell>Название</TableCell>
                                <TableCell>Описание</TableCell>
                                <TableCell>Цена</TableCell>
                                <TableCell>Остаток</TableCell>
                                <TableCell>Топ-продукт</TableCell>
                                <TableCell>Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            style={{ width: 50, cursor: "pointer" }}
                                            onClick={() => setSelectedImage(product.image_url)}
                                        />
                                    </TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                    <TableCell>{product.price} ₽</TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    <TableCell>
                                        <Checkbox checked={product.top_product} disabled />
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={() => navigate(`/admin/products/edit/${product.id}`)}>✏️ Изменить</Button>
                                        <Button onClick={() => handleDelete(product.id)} color="error">🗑 Удалить</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={!!selectedImage} onClose={() => setSelectedImage(null)}>
                <DialogContent>
                    <img src={selectedImage || ""} alt="Товар" style={{ maxWidth: "100%" }} />
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default ProductsAdmin;
