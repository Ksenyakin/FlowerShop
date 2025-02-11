package middleware

import (
	"flower-shop-backend/utils"
	"net/http"

	"github.com/sirupsen/logrus"
)

// RequireAdmin проверяет, является ли пользователь администратором
func RequireAdmin(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tokenStr := r.Header.Get("Authorization")
		if tokenStr == "" {
			logrus.Warn("Отсутствует заголовок Authorization")
			http.Error(w, `{"message": "Authorization header is required"}`, http.StatusUnauthorized)
			return
		}

		if len(tokenStr) > len("Bearer ") {
			tokenStr = tokenStr[len("Bearer "):]
		} else {
			logrus.Warn("Неправильный формат токена")
			http.Error(w, `{"message": "Invalid token format"}`, http.StatusUnauthorized)
			return
		}

		claims, err := utils.ParseToken(tokenStr)
		if err != nil {
			logrus.Warn("Ошибка проверки токена: ", err)
			http.Error(w, `{"message": "Invalid token"}`, http.StatusUnauthorized)
			return
		}

		if claims.Role != "admin" {
			logrus.Warn("Доступ запрещен: пользователь не является администратором")
			http.Error(w, `{"message": "Access denied"}`, http.StatusForbidden)
			return
		}

		next(w, r)
	}
}
