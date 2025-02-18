import React from 'react';
import { Container, Typography, Box, AppBar, Toolbar, Button } from '@mui/material';
import Header from "../components/Header";
import Footer from "../components/Footer";

const PrivacyPolicyPage: React.FC = () => {
    return (
        <Container maxWidth="md">
            <Header/>

            <Box sx={{ mt: 4, p: 3, borderRadius: 2, boxShadow: 3, bgcolor: 'background.paper' }}>
                <Typography variant="h4" gutterBottom>Политика конфиденциальности</Typography>
                <Typography paragraph>
                    Мы уважаем вашу конфиденциальность и обязуемся защищать ваши персональные данные. Данная политика описывает, какие данные мы собираем, как мы их используем и какие у вас есть права.
                </Typography>
                <Typography variant="h5" gutterBottom>Какие данные мы собираем?</Typography>
                <Typography paragraph>
                    Мы можем собирать следующую информацию: имя, номер телефона, адрес электронной почты, адрес доставки, историю заказов.
                </Typography>
                <Typography variant="h5" gutterBottom>Как мы используем вашу информацию?</Typography>
                <Typography paragraph>
                    Ваша информация используется для обработки заказов, обеспечения доставки, улучшения сервиса и персонализации предложений.
                </Typography>
                <Typography variant="h5" gutterBottom>Как мы защищаем ваши данные?</Typography>
                <Typography paragraph>
                    Мы принимаем все необходимые меры для защиты ваших данных, включая шифрование, защиту от несанкционированного доступа и политику конфиденциальности сотрудников.
                </Typography>
                <Typography paragraph>
                    Если у вас есть вопросы по поводу нашей политики конфиденциальности, свяжитесь с нами по телефону +7 (903) 44 77 333 или email info@flowershop.com.
                </Typography>
            </Box>
            <Footer/>
        </Container>
    );
};

export default PrivacyPolicyPage;
