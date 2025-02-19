import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem } from "@mui/material";
import AdminHeader from "./AdminHeader";

interface Category {
    id: number;
    name: string;
    parent_id: number | null;
}

const CategoriesAdmin: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [parentID, setParentID] = useState<number | null>(null);
    const [editCategory, setEditCategory] = useState<Category | null>(null);

    useEffect(() => {
        fetch("/api/categories")
            .then((res) => res.json())
            .then((data) => setCategories(Array.isArray(data) ? data : []))
            .catch((err) => console.error("Ошибка:", err));
    }, []);

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
        if (!editCategory) return;
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
        <Container maxWidth="md">
            <AdminHeader title="Управление категориями" />
            <Typography variant="h4" gutterBottom>Категории</Typography>
            <TextField fullWidth label="Название категории" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} sx={{ mb: 2 }} />
            <Select fullWidth value={parentID || ""} onChange={(e) => setParentID(e.target.value ? Number(e.target.value) : null)} sx={{ mb: 2 }}>
                <MenuItem value="">Без родительской категории</MenuItem>
                {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                ))}
            </Select>
            <Button variant="contained" color="primary" onClick={handleAddCategory} sx={{ mb: 2 }}>Добавить категорию</Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Название</TableCell>
                            <TableCell>Родительская категория</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.id}</TableCell>
                                <TableCell>
                                    {editCategory && editCategory.id === category.id ? (
                                        <TextField fullWidth value={editCategory.name} onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })} />
                                    ) : (
                                        category.name
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editCategory && editCategory.id === category.id ? (
                                        <Select fullWidth value={editCategory.parent_id || ""} onChange={(e) => setEditCategory({ ...editCategory, parent_id: e.target.value ? Number(e.target.value) : null })}>
                                            <MenuItem value="">Без родительской категории</MenuItem>
                                            {categories.map((cat) => (
                                                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                            ))}
                                        </Select>
                                    ) : (
                                        getParentCategoryName(category.parent_id)
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editCategory && editCategory.id === category.id ? (
                                        <Button variant="contained" color="success" onClick={handleUpdateCategory}>💾 Сохранить</Button>
                                    ) : (
                                        <Button variant="contained" onClick={() => setEditCategory(category)}>✏️ Изменить</Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default CategoriesAdmin;
