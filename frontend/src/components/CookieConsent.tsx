import { useState, useEffect } from "react";
import { Snackbar, Button, Paper, Typography } from "@mui/material";

export default function CookieConsent() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookieConsent");
        if (!consent) {
            setOpen(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookieConsent", "accepted");
        setOpen(false);
    };

    const handleDecline = () => {
        localStorage.setItem("cookieConsent", "declined");
        setOpen(false);
    };

    return (
        <Snackbar
            open={open}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            <Paper
                elevation={3}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: 2,
                    borderRadius: 2,
                    maxWidth: 600,
                    backgroundColor: "#fff",
                }}
            >
                <Typography sx={{ flex: 1 }}>
                    Мы используем файлы cookie для улучшения работы сайта. Продолжая
                    использовать сайт, вы соглашаетесь с нашей <a href="/privacy">политикой конфиденциальности</a>.
                </Typography>
                <Button onClick={handleDecline} color="secondary">
                    Отклонить
                </Button>
                <Button onClick={handleAccept} color="primary" variant="contained">
                    Принять
                </Button>
            </Paper>
        </Snackbar>
    );
}
