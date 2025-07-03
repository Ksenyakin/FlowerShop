# Этап сборки
FROM node:18-buster AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Очищаем кеш npm перед установкой
RUN npm cache clean --force

# Устанавливаем зависимости
RUN npm install

# Проверяем, где установлены бинарные файлы
RUN ls -la /app/node_modules/.bin

# Исправляем права на всю папку `node_modules`
RUN chmod -R 777 /app/node_modules

# Проверяем права на `react-scripts`
RUN ls -la /app/node_modules/.bin/react-scripts

# Убеждаемся, что `react-scripts` можно выполнить
RUN chmod +x /app/node_modules/.bin/react-scripts

# Копируем весь проект в контейнер
COPY . .

# Запускаем сборку проекта (используем абсолютный путь)
RUN node /app/node_modules/react-scripts/bin/react-scripts.js build

# Этап запуска
FROM nginx:stable-alpine

# Копируем собранный фронтенд в директорию Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Копируем кастомный конфиг Nginx
COPY nginx.dev.conf /etc/nginx/conf.d/default.conf

# Открываем порт
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
