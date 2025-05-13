# Nadius Server

Серверная часть приложения Nadius, построенная с использованием Node.js, Express, TypeScript и MongoDB.

## Требования

- Node.js (v14 или выше)
- MongoDB
- npm или yarn

## Установка

1. Клонируйте репозиторий
2. Установите зависимости:
```bash
npm install
```

3. Создайте файл .env в корневой директории и добавьте следующие переменные:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/nadius
JWT_SECRET=your-secret-key
```

## Запуск

Для разработки:
```bash
npm run dev
```

Для продакшена:
```bash
npm run build
npm start
```

## API Endpoints

### Аутентификация
- POST /api/auth/register - Регистрация нового пользователя
- POST /api/auth/login - Вход в систему

### Продукты
- GET /api/products - Получить все продукты
- GET /api/products/:id - Получить продукт по ID
- POST /api/products - Создать новый продукт (требуется админ)
- PUT /api/products/:id - Обновить продукт (требуется админ)
- DELETE /api/products/:id - Удалить продукт (требуется админ)

### Заказы
- GET /api/orders - Получить все заказы (требуется админ)
- GET /api/orders/:id - Получить заказ по ID
- POST /api/orders - Создать новый заказ
- PATCH /api/orders/:id/status - Обновить статус заказа (требуется админ)

## Структура проекта

```
src/
  ├── controllers/     # Контроллеры для обработки запросов
  ├── models/         # Mongoose модели
  ├── routes/         # Маршруты API
  ├── middleware/     # Middleware функции
  └── app.ts          # Основной файл приложения
``` 