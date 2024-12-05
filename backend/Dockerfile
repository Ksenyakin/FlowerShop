# Указываем базовый образ с Go
FROM golang:1.22-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы проекта в контейнер
COPY go.mod go.sum ./
RUN go mod download

COPY .. .

# Собираем бинарный файл приложения
RUN go build -o backend main.go

# Используем минимальный базовый образ для запуска приложения
FROM alpine:latest

# Устанавливаем рабочую директорию
WORKDIR /root/

# Копируем собранный бинарный файл из предыдущего этапа
COPY --from=builder /app/backend .

# Указываем порт, на котором будет работать приложение
EXPOSE 8080

# Запускаем приложение
CMD ["./backend"]
