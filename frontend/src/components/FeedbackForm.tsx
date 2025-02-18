import { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";

export default function FeedbackForm() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", phone: "", message: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        console.log("Форма отправлена:", formData);
        setOpen(false);
    };

    return (
        <>
            {/* Кнопка вызова формы */}
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                Обратная связь
            </Button>

            {/* Модальное окно */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Оставьте сообщение</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Ваше имя"
                        name="name"
                        fullWidth
                        margin="dense"
                        variant="outlined"
                        onChange={handleChange}
                    />
                    <TextField
                        label="Телефон"
                        name="phone"
                        fullWidth
                        margin="dense"
                        variant="outlined"
                        onChange={handleChange}
                    />
                    <TextField
                        label="Ваш вопрос"
                        name="message"
                        fullWidth
                        multiline
                        rows={3}
                        margin="dense"
                        variant="outlined"
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="secondary">
                        Закрыть
                    </Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained">
                        Отправить
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
