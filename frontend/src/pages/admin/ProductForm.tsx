import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, TextField, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Typography, Box } from "@mui/material";
import ImageGridPopup from "../../components/ImageGridPopup";

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
        category_id: null as number | null,
        image_url: "",
        top_product: false
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [isS3ModalOpen, setIsS3ModalOpen] = useState<boolean>(false);
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
                setCategories([]);
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
                            category_id: data.category_id ?? null,
                            topProduct: data.topProduct ?? false
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

    const handleSelectS3Image = (url: string) => {
        setProduct({ ...product, image_url: url });
        setIsS3ModalOpen(false);
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
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>{id ? "Редактировать товар" : "Добавить товар"}</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField label="Название" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} required fullWidth />
                <TextField label="Описание" value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} required fullWidth multiline rows={4} />
                <TextField label="Цена" type="number" value={product.price} onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })} required fullWidth />
                <TextField label="Остаток" type="number" value={product.stock} onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })} required fullWidth />
                <FormControl fullWidth>
                    <InputLabel>Категория</InputLabel>
                    <Select value={product.category_id || ""} onChange={(e) => setProduct({ ...product, category_id: e.target.value ? Number(e.target.value) : null })} required>
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControlLabel control={<Checkbox checked={product.top_product} onChange={(e) => setProduct({ ...product, top_product: e.target.checked })} />} label="Отобразить как топ-продукт" />
                <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
                <Button variant="contained" color="secondary" onClick={handleUpload}>📤 Загрузить изображение в S3</Button>
                <Button variant="contained" color="primary" onClick={() => setIsS3ModalOpen(true)}>📷 Выбрать изображение из S3</Button>
                {product.image_url && <Box sx={{ textAlign: "center" }}><img src={product.image_url} alt="Товар" style={{ maxWidth: "100%", borderRadius: "8px" }} /></Box>}
                <Button type="submit" variant="contained" color="success">Сохранить</Button>
            </Box>
            {isS3ModalOpen && <ImageGridPopup onClose={() => setIsS3ModalOpen(false)} onSelect={handleSelectS3Image} />}
        </Container>
    );
};

export default ProductForm;
