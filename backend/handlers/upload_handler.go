package handlers

import (
	"encoding/json"
	"flower-shop-backend/utils"
	"fmt"
	"net/http"
)

// UploadHandler загружает изображение в Timeweb S3
func UploadHandler(w http.ResponseWriter, r *http.Request) {
	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, `{"message": "Ошибка загрузки файла"}`, http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Загружаем файл в S3
	url, err := utils.UploadToS3(file, header.Filename)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"message": "Ошибка загрузки в S3: %s"}`, err.Error()), http.StatusInternalServerError)
		return
	}

	// Отправляем URL клиенту
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"url": url})
}
