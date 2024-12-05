package utils

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"os" // Для работы с переменными окружения
)

var DB *sql.DB

// InitDB инициализирует соединение с базой данных
func InitDB() error {
	var err error

	// Получаем параметры подключения из переменных окружения
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	// Формируем строку подключения
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	// Подключаемся к базе данных
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		return fmt.Errorf("could not connect to database: %w", err)
	}

	// Проверяем соединение
	if err = DB.Ping(); err != nil {
		return fmt.Errorf("could not ping database: %w", err)
	}

	return nil
}
