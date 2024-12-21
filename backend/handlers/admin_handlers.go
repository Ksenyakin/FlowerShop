package handlers

import (
	"encoding/json"
	"flower-shop-backend/models"
	"flower-shop-backend/utils"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
	"io"
	"net/http"
	"os"
	"path/filepath"
)

// AdminManageProducts управляет продуктами для администраторов
func AdminManageProducts(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		GetProducts(w, r) // Можно переиспользовать существующий обработчик для получения продуктов
	case "POST":
		// Добавление нового продукта
		var product models.Product
		if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
			http.Error(w, "Ошибка при декодировании запроса", http.StatusBadRequest)
			return
		}

		_, err := utils.DB.Exec("INSERT INTO products (name, description, price, stock, image_url) VALUES ($1, $2, $3, $4, $5)",
			product.Name, product.Description, product.Price, product.Stock, product.ImageURL)
		if err != nil {
			http.Error(w, "Не удалось добавить продукт", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		logrus.Info("Продукт успешно добавлен")
	case "PUT":
		// Обновление существующего продукта
		var product models.Product
		if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
			http.Error(w, "Ошибка при декодировании запроса", http.StatusBadRequest)
			return
		}

		_, err := utils.DB.Exec("UPDATE products SET name = $1, description = $2, price = $3, stock = $4, image_url = $5 WHERE id = $6",
			product.Name, product.Description, product.Price, product.Stock, product.ImageURL, product.ID)
		if err != nil {
			http.Error(w, "Не удалось обновить продукт", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		logrus.Info("Продукт успешно обновлен")
	case "DELETE":
		vars := mux.Vars(r)
		productID := vars["id"]

		_, err := utils.DB.Exec("DELETE FROM products WHERE id = $1", productID)
		if err != nil {
			http.Error(w, "Не удалось удалить продукт", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		logrus.Info("Продукт успешно удален")
	default:
		http.Error(w, "Метод не поддерживается", http.StatusMethodNotAllowed)
	}
}

// UploadImage загружает изображение и сохраняет его локально, возвращая URL
func UploadImage(w http.ResponseWriter, r *http.Request) {
	// Ограничиваем размер загружаемого файла (10 MB)
	r.ParseMultipartForm(10 << 20)

	// Получаем файл из запроса
	file, handler, err := r.FormFile("image")
	if err != nil {
		logrus.WithError(err).Error("Не удалось получить файл")
		http.Error(w, "Ошибка загрузки файла", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Указываем путь для сохранения файла
	uploadDir := "uploads"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		// Создаем папку, если она не существует
		if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
			logrus.WithError(err).Error("Не удалось создать директорию для загрузки")
			http.Error(w, "Ошибка создания директории", http.StatusInternalServerError)
			return
		}
	}

	savePath := filepath.Join(uploadDir, handler.Filename)
	dst, err := os.Create(savePath)
	if err != nil {
		logrus.WithError(err).Error("Не удалось сохранить файл")
		http.Error(w, "Ошибка сохранения файла", http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	// Копируем содержимое файла в назначенное место
	if _, err = io.Copy(dst, file); err != nil {
		logrus.WithError(err).Error("Не удалось сохранить содержимое файла")
		http.Error(w, "Ошибка сохранения файла", http.StatusInternalServerError)
		return
	}

	// Формируем URL для доступа к файлу
	fileURL := fmt.Sprintf("/static/uploads/%s", handler.Filename)
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(fileURL))
	logrus.Infof("Файл успешно загружен: %s", fileURL)
}
