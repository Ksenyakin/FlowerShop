import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Alert, Box } from '@mui/material';

const UpdateUserPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        birthday: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

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
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setFormData({
                    name: data.name || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    birthday: data.birthday || '',
                });
            } catch (err) {
                setError('Не удалось загрузить данные пользователя');
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await fetch('/api/update_user', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            setMessage('Данные успешно обновлены!');
            setTimeout(() => {
                window.location.href = '/profile';
            }, 2000);
        } catch (err) {
            setError('Ошибка при обновлении данных');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, p: 3, borderRadius: 2, boxShadow: 3, bgcolor: 'background.paper' }}>
                <Typography variant="h4" gutterBottom>Изменение данных пользователя</Typography>
                {message && <Alert severity="success">{message}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth margin="normal" label="Имя" name="name" value={formData.name} onChange={handleChange} />
                    <TextField fullWidth margin="normal" label="Телефон" name="phone" value={formData.phone} onChange={handleChange} />
                    <TextField fullWidth margin="normal" label="Адрес" name="address" value={formData.address} onChange={handleChange} />
                    <TextField fullWidth margin="normal" label="День рождения" name="birthday" type="date" value={formData.birthday} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                    <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>Сохранить изменения</Button>
                </form>
            </Box>
        </Container>
    );
};

export default UpdateUserPage;