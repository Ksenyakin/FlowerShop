package middlewares

import (
	"context"
	"flower-shop-backend/utils"
	"net/http"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/sirupsen/logrus"
)

var jwtSecret = []byte("your-secret-key")

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenStr := r.Header.Get("Authorization")
		if tokenStr == "" || !strings.HasPrefix(tokenStr, "Bearer ") {
			http.Error(w, `{"message": "Authorization header is required"}`, http.StatusUnauthorized)
			return
		}

		// Убираем "Bearer " из токена
		tokenStr = strings.TrimPrefix(tokenStr, "Bearer ")

		// Проверяем токен
		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.NewValidationError("unexpected signing method", jwt.ValidationErrorSignatureInvalid)
			}
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			logrus.Warn("Неправильный токен: ", err)
			http.Error(w, `{"message": "Invalid token"}`, http.StatusUnauthorized)
			return
		}

		// Извлечение claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			http.Error(w, `{"message": "Invalid token claims"}`, http.StatusUnauthorized)
			return
		}

		email, ok := claims["email"].(string)
		if !ok {
			http.Error(w, `{"message": "Email not found in token"}`, http.StatusUnauthorized)
			return
		}

		// Добавляем email в контекст
		ctx := context.WithValue(r.Context(), "email", email)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// AdminMiddleware проверяет, что пользователь является администратором
func AdminMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userID, ok := r.Context().Value("user_id").(int)
		if !ok {
			http.Error(w, "Не удалось получить информацию о пользователе", http.StatusUnauthorized)
			return
		}

		isAdmin, err := utils.IsAdmin(userID)
		if err != nil || !isAdmin {
			http.Error(w, "Недостаточно прав для доступа", http.StatusForbidden)
			return
		}

		next.ServeHTTP(w, r)
	})
}
