# Создание интерактивного веб-интерфейса для цветочного магазина с использованием современных технологий

Интернет-магазин цветов для частных и корпоративных клиентов Краснодара и пригорода. Проект построен на headless-архитектуре Go + React + PostgreSQL, поддерживает PWA-режим, мгновенную оплату через Ю-Кассу и blue/green-деплой с помощью Docker и GitHub Actions.

## Технологии

**Backend:** Go 1.22, Gin, pgx, JWT-авторизация
**Frontend:** React 18, React Router, React-Query, Zustand, Tailwind CSS, Workbox (PWA)
**База данных:** PostgreSQL 16 (JSONB, pgvector)
**Хранилище статики:** S3-совместимое (MinIO/AWS S3)
**Контейнеризация:** Docker, Docker Compose
**CI/CD:** GitHub Actions, blue/green-деплой
**Мониторинг:** Prometheus, Grafana

## Быстрый старт (Docker)

1. `git clone https://github.com/Ksenyakin/FlowerShop.git && cd FlowerShop`
2. `cp .env.example .env` и заполните:

   * POSTGRES\_USER, POSTGRES\_PASSWORD, POSTGRES\_DB
   * JWT\_SECRET
   * YOOKASSA\_SHOP\_ID, YOOKASSA\_SECRET\_KEY
   * S3\_ENDPOINT, S3\_BUCKET, S3\_ACCESS\_KEY, S3\_SECRET\_KEY
3. `docker-compose up -d --build`
4. Откройте в браузере [http://localhost:3000](http://localhost:3000) (фронтенд) и [http://localhost:8080/api](http://localhost:8080/api) (API)

## Локальная разработка без Docker

### Backend

1. Установите Go 1.22.
2. В директории `backend` выполните `go mod download`.
3. Запустите PostgreSQL и укажите в `.env` те же переменные.
4. Примените миграции:

   ```
   go run github.com/golang-migrate/migrate/v4/cmd/migrate \
     -path ./migrations -database "$DATABASE_URL" up
   ```
5. `go run cmd/api/main.go`

### Frontend

1. Установите Node.js 18+ и pnpm.
2. В директории `frontend` выполните `pnpm install`.
3. Скопируйте `.env.example` в `.env` и укажите `REACT_APP_API_URL=http://localhost:8080/api`.
4. `pnpm start`

## Тестирование

* **Go unit:** `cd backend && go test ./... -race`
* **React unit (Vitest):** `cd frontend && pnpm test`
* **Lint:** `cd backend && golangci-lint run`; `cd frontend && pnpm lint`

## CI/CD

Каждый push в `main` запускает GitHub Actions: lint → тесты → сборка Docker-образов → публикация → blue/green-деплой — всё за \~5 минут без простоев.

## Полезные ссылки

* Админ-панель: [http://localhost:3000/admin](http://localhost:3000/admin)