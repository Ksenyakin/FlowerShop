import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, Grid, Button, CircularProgress } from "@mui/material";

interface ImageGridPopupProps {
    onClose: () => void;
    onSelect: (url: string) => void;
}

const ImageGridPopup: React.FC<ImageGridPopupProps> = ({ onClose, onSelect }) => {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/images");
                if (!response.ok) {
                    throw new Error("Ошибка загрузки изображений");
                }
                const data = await response.json();
                setImages(data.map((img: { url: string }) => img.url));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    return (
        <Dialog open onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>Галерея изображений</DialogTitle>
            <DialogContent>
                {loading ? (
                    <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
                ) : (
                    <Grid container spacing={2}>
                        {images.map((img, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <img
                                    src={img}
                                    alt={`Изображение ${index + 1}`}
                                    style={{ width: "100%", borderRadius: "8px", cursor: "pointer" }}
                                    onClick={() => onSelect(img)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}
                <Button onClick={onClose} variant="contained" color="secondary" sx={{ mt: 2 }}>
                    Закрыть
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default ImageGridPopup;
