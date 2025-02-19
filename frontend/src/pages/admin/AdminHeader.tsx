import React from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";

const AdminHeader: React.FC<{ title: string }> = ({ title }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: "#2c3e50", boxShadow: 3 }}>
            <Container>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#ecf0f1" }}>{title}</Typography>
                    <Box>
                        <Button color="inherit" sx={{ mx: 1 }} onClick={() => navigate("/admin/products")}>📦 Товары</Button>
                        <Button color="inherit" sx={{ mx: 1 }} onClick={() => navigate("/admin/categories")}>📂 Категории</Button>
                        <Button color="inherit" sx={{ mx: 1 }} onClick={() => navigate("/")}>🏠 На сайт</Button>
                        <Button color="error" sx={{ ml: 2, fontWeight: "bold" }} onClick={handleLogout}>🚪 Выйти</Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default AdminHeader;