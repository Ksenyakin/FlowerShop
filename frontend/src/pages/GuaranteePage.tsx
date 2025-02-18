import React from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, AppBar, Toolbar, Button } from '@mui/material';
import Header from "../components/Header";
import {FoodBank} from "@mui/icons-material";
import Footer from "../components/Footer";

const GuaranteePage: React.FC = () => {
    return (
        <Container maxWidth="md">
            <Header/>

            <Box sx={{ mt: 4, p: 3, borderRadius: 2, boxShadow: 3, bgcolor: 'background.paper' }}>
                <Typography variant="h4" gutterBottom>Гарантия качества</Typography>
                <Typography paragraph>
                    Мы гарантируем свежесть и высокое качество наших цветов. Если у вас есть претензии к качеству продукции, мы готовы решить любые вопросы.
                </Typography>
                <Typography variant="h5" gutterBottom>Условия гарантии:</Typography>
                <List>
                    <ListItem><ListItemText primary="Свежесть цветов – минимум 3 дня с момента доставки" /></ListItem>
                    <ListItem><ListItemText primary="Замена букета при ненадлежащем качестве в течение 24 часов" /></ListItem>
                    <ListItem><ListItemText primary="Возврат средств или повторная доставка при несоответствии заказу" /></ListItem>
                    <ListItem><ListItemText primary="Поддержка клиентов 24/7 по вопросам качества" /></ListItem>
                </List>
                <Typography paragraph>
                    Если у вас есть вопросы или претензии, свяжитесь с нами по телефону +7 (903) 44 77 333 или по email info@flowershop.com.
                </Typography>
            </Box>
            <Footer/>
        </Container>
    );
};

export default GuaranteePage;
