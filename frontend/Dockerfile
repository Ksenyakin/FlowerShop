FROM node:14-alpine AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Убедимся, что react-scripts доступны
RUN ls -la ./node_modules/.bin

# Исправляем права доступа для react-scripts
RUN chmod +x ./node_modules/.bin/react-scripts

# Копируем весь проект в контейнер
COPY . .

# Собираем проект
RUN npm run build

FROM nginx:stable-alpine

# Копируем собранный фронтенд в директорию Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Копируем кастомный конфиг Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
