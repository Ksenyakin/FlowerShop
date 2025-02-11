package utils

import (
	"bytes"
	"fmt"
	"mime/multipart"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/sirupsen/logrus"
)

// UploadToS3 загружает файл в Timeweb S3 и возвращает правильный URL
func UploadToS3(file multipart.File, filename string) (string, error) {
	accessKey := os.Getenv("AWS_ACCESS_KEY_ID")
	secretKey := os.Getenv("AWS_SECRET_ACCESS_KEY")
	region := os.Getenv("AWS_REGION")
	endpoint := os.Getenv("AWS_ENDPOINT")
	bucket := os.Getenv("AWS_BUCKET_NAME")

	if accessKey == "" || secretKey == "" || region == "" || endpoint == "" || bucket == "" {
		logrus.Error("Ошибка: не заданы переменные окружения AWS")
		return "", fmt.Errorf("ошибка: не заданы переменные окружения AWS")
	}

	logrus.Infof("Инициализация сессии AWS: endpoint=%s, bucket=%s", endpoint, bucket)

	sess, err := session.NewSession(&aws.Config{
		Region:           aws.String(region),
		Endpoint:         aws.String(endpoint),
		Credentials:      credentials.NewStaticCredentials(accessKey, secretKey, ""),
		S3ForcePathStyle: aws.Bool(true),
	})
	if err != nil {
		logrus.Error("Ошибка создания AWS сессии: ", err)
		return "", fmt.Errorf("ошибка создания AWS сессии: %w", err)
	}

	svc := s3.New(sess)

	// Читаем файл
	buf := new(bytes.Buffer)
	_, err = buf.ReadFrom(file)
	if err != nil {
		logrus.Error("Ошибка чтения файла: ", err)
		return "", fmt.Errorf("ошибка чтения файла: %w", err)
	}

	// Загружаем файл в S3
	logrus.Infof("Загрузка файла: %s", filename)

	_, err = svc.PutObject(&s3.PutObjectInput{
		Bucket:      aws.String(bucket),
		Key:         aws.String(filename),
		Body:        bytes.NewReader(buf.Bytes()),
		ContentType: aws.String(http.DetectContentType(buf.Bytes())),
		ACL:         aws.String("public-read"),
	})
	if err != nil {
		logrus.Error("Ошибка загрузки файла в S3: ", err)
		return "", fmt.Errorf("ошибка загрузки файла в S3: %w", err)
	}

	// Формируем правильную ссылку с именем бакета
	fileURL := fmt.Sprintf("%s/%s/%s", endpoint, bucket, filename)
	logrus.Infof("Файл успешно загружен: %s", fileURL)

	return fileURL, nil
}
