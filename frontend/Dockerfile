# Базовый образ для сборки приложения
FROM node:14-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект в контейнер
COPY . .

# Собираем проект
RUN npm run build

# Используем минимальный образ nginx для сервировки
FROM nginx:stable-alpine

# Устанавливаем рабочую директорию
WORKDIR /usr/share/nginx/html

# Копируем собранный фронтенд из предыдущего этапа
COPY --from=builder /app/build .

# Копируем кастомный конфиг nginx, если нужно
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]
