package utils

import (
	"database/sql"
	"log"
)

// IsAdmin проверяет, является ли пользователь администратором
func IsAdmin(userID int) (bool, error) {
	var exists bool
	query := "SELECT EXISTS (SELECT 1 FROM admins WHERE user_id = $1)"
	err := DB.QueryRow(query, userID).Scan(&exists)
	if err != nil && err != sql.ErrNoRows {
		log.Printf("Ошибка при проверке прав администратора: %v", err)
		return false, err
	}

	return exists, nil
}
