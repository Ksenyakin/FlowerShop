import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, CircularProgress, Alert, List, ListItem, ListItemText, AppBar, Toolbar } from '@mui/material';
import Header from "./Header";
import Footer from "./Footer";

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
};

const ProfilePage: React.FC = () => {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/userinfo', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Ошибка при загрузке профиля: ${response.statusText}`);
                }

                const data = await response.json();
                setUserData(data);
                setLoading(false);
            } catch (err) {
                setError((err as Error).message);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
    }

    if (error) {
        return <Alert severity="error">Ошибка: {error}</Alert>;
    }

    if (!userData) {
        return <Typography variant="h6">Данные пользователя недоступны</Typography>;
    }

    return (
        <Container maxWidth="md">
            <Header/>

            <Box sx={{ mt: 4, p: 3, borderRadius: 2, boxShadow: 3, bgcolor: 'background.paper' }}>
                <Typography variant="h4" gutterBottom>Профиль пользователя</Typography>
                <List>
                    <ListItem><ListItemText primary="Имя" secondary={userData.name} /></ListItem>
                    <ListItem><ListItemText primary="Телефон" secondary={userData.phone} /></ListItem>
                    <ListItem><ListItemText primary="Адрес" secondary={userData.address} /></ListItem>
                    <ListItem><ListItemText primary="Электронная почта" secondary={userData.email} /></ListItem>
                    <ListItem><ListItemText primary="День рождения" secondary={formatDate(userData.birthday)} /></ListItem>
                    <ListItem><ListItemText primary="Уровень лояльности" secondary={userData.loyalty_level} /></ListItem>
                    <ListItem><ListItemText primary="Бонусные баллы" secondary={userData.points} /></ListItem>
                </List>
                <Button variant="contained" color="primary" href="/update-user" sx={{ mt: 2 }}>Редактировать данные</Button>
            </Box>
            <Footer/>
        </Container>
    );
};

export default ProfilePage;
