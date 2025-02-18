import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Button } from '@mui/material';

const DevelopmentPopup: React.FC = () => {
    const [open, setOpen] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setOpen(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Сайт в разработке</DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    Наш сайт находится в стадии разработки. Если вы обнаружили какие-либо ошибки или у вас есть предложения, пожалуйста, напишите нам.
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Контакты: TG - @ksendan25
                </Typography>
                <Button onClick={handleClose} variant="contained" color="primary" sx={{ mt: 2 }}>
                    Закрыть
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default DevelopmentPopup;
