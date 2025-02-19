package handlers

import (
	"encoding/json"
	"flower-shop-backend/utils"
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/sirupsen/logrus"
	"net/http"
	"os"
)

// S3Image представляет изображение, полученное из S3.
type S3Image struct {
	URL string `json:"url"`
}

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

// GetImages возвращает список изображений из S3
func GetImages(w http.ResponseWriter, r *http.Request) {
	bucket := os.Getenv("AWS_BUCKET_NAME")
	region := os.Getenv("AWS_REGION")
	endpoint := os.Getenv("AWS_ENDPOINT")
	accessKey := os.Getenv("AWS_ACCESS_KEY_ID")
	secretKey := os.Getenv("AWS_SECRET_ACCESS_KEY")

	if bucket == "" || region == "" || endpoint == "" || accessKey == "" || secretKey == "" {
		logrus.Error("Не заданы переменные окружения AWS")
		http.Error(w, "Server configuration error", http.StatusInternalServerError)
		return
	}

	// Создаем сессию AWS S3
	sess, err := session.NewSession(&aws.Config{
		Region:           aws.String(region),
		Endpoint:         aws.String(endpoint),
		Credentials:      credentials.NewStaticCredentials(accessKey, secretKey, ""),
		S3ForcePathStyle: aws.Bool(true),
	})
	if err != nil {
		logrus.Error("Ошибка создания AWS-сессии: ", err)
		http.Error(w, "Ошибка подключения к хранилищу", http.StatusInternalServerError)
		return
	}

	svc := s3.New(sess)

	// Получаем список файлов в бакете
	resp, err := svc.ListObjectsV2(&s3.ListObjectsV2Input{
		Bucket: aws.String(bucket),
	})
	if err != nil {
		logrus.Error("Ошибка получения списка объектов: ", err)
		http.Error(w, "Ошибка при получении изображений", http.StatusInternalServerError)
		return
	}

	var images []S3Image
	for _, item := range resp.Contents {
		if item.Key != nil {
			imageURL := fmt.Sprintf("%s/%s/%s", endpoint, bucket, *item.Key)
			images = append(images, S3Image{URL: imageURL})
		}
	}

	// Отправляем JSON-ответ
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(images)
}
