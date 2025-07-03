package models

import "time"

type OrderItem struct {
    ProductID int     `json:"product_id"`
    Name      string  `json:"name"`
    Quantity  int     `json:"quantity"`
    Price     float64 `json:"price"`
}

// Order — основные поля заказа вместе с его товарами
type Order struct {
    ID         int         `json:"id"`
    UserID     int         `json:"user_id"`
    TotalPrice float64     `json:"total_price"`
    Status     string      `json:"status"`
    CreatedAt  time.Time   `json:"created_at"`
    UpdatedAt  time.Time   `json:"updated_at"`
    Items      []OrderItem `json:"items"`
}
