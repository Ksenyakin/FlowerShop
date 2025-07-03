package handlers

import (
	"encoding/json"
	"flower-shop-backend/models"
	"flower-shop-backend/utils"
	"github.com/gorilla/mux"
	"net/http"
	"strconv"
	"time"
	"log"
)

// CartItem представляет элемент корзины
type CartItem struct {
	ProductID int     `json:"product_id"`
	Name      string  `json:"name"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`
}

func CreateOrder(w http.ResponseWriter, r *http.Request) {
    // Лог входящего запроса и заголовка Authorization
    log.Printf("[CreateOrder] %s %s headers.Authorization=%q", r.Method, r.URL.Path, r.Header.Get("Authorization"))

    // 1) Получаем user_id из контекста
    uidVal := r.Context().Value("user_id")
    userIDf, ok := uidVal.(float64)
    if !ok {
        log.Printf("[CreateOrder] no user_id in context, uidVal=%#v", uidVal)
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }
    userID := int(userIDf)
    log.Printf("[CreateOrder] authenticated user_id=%d", userID)

    // 2) Открываем транзакцию
    tx, err := utils.DB.Begin()
    if err != nil {
        http.Error(w, "DB error", http.StatusInternalServerError)
        return
    }
    defer func() {
        if err != nil {
            tx.Rollback()
        } else {
            tx.Commit()
        }
    }()

    // 3) Вставляем запись в orders и получаем ID
    var orderID int
    err = tx.QueryRow(`
        INSERT INTO orders (user_id, total_price, status, created_at, updated_at)
        VALUES ($1, $2, 'pending', $3, $3)
        RETURNING id
    `, userID, 0.0, time.Now()).Scan(&orderID)
    if err != nil {
        http.Error(w, "Failed to create order", http.StatusInternalServerError)
        return
    }

    // 4) Читаем элементы из cart_items и считаем сумму
    rows, err := tx.Query(`
        SELECT ci.product_id, p.name, ci.quantity, ci.price
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.cart_id = (
            SELECT id FROM cart WHERE user_id = $1
        )
    `, userID)
    if err != nil {
        http.Error(w, "Failed to query cart items", http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var items []models.OrderItem
    var total float64
    for rows.Next() {
        var it models.OrderItem
        if err = rows.Scan(&it.ProductID, &it.Name, &it.Quantity, &it.Price); err != nil {
            http.Error(w, "Failed to scan cart item", http.StatusInternalServerError)
            return
        }
        total += float64(it.Quantity) * it.Price
        items = append(items, it)
    }
    if err = rows.Err(); err != nil {
        http.Error(w, "Error reading cart items", http.StatusInternalServerError)
        return
    }

    // 5) Обновляем total_price в orders
    _, err = tx.Exec(`
        UPDATE orders SET total_price = $1, updated_at = $2 WHERE id = $3
    `, total, time.Now(), orderID)
    if err != nil {
        http.Error(w, "Failed to update order total", http.StatusInternalServerError)
        return
    }

    // 6) Вставляем позиции в order_items
    stmt, err := tx.Prepare(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
    `)
    if err != nil {
        http.Error(w, "Failed to prepare statement", http.StatusInternalServerError)
        return
    }
    defer stmt.Close()

    for _, it := range items {
        if _, err = stmt.Exec(orderID, it.ProductID, it.Quantity, it.Price); err != nil {
            http.Error(w, "Failed to insert order item", http.StatusInternalServerError)
            return
        }
    }

    // 7) Очищаем cart_items
    if _, err = tx.Exec(`
        DELETE FROM cart_items
        WHERE cart_id = (
            SELECT id FROM cart WHERE user_id = $1
        )
    `, userID); err != nil {
        log.Printf("[CreateOrder] error clearing cart: %v", err)
        http.Error(w, "Failed to clear cart", http.StatusInternalServerError)
        return
    }

    log.Printf(
        "[CreateOrder] order %d created successfully for user %d, total=%.2f, items=%d",
        orderID, userID, total, len(items),
    )

    // 8) Возвращаем полную модель заказа
    order := models.Order{
        ID:         orderID,
        UserID:     userID,
        TotalPrice: total,
        Status:     "pending",
        CreatedAt:  time.Now(),
        UpdatedAt:  time.Now(),
        Items:      items,
    }
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(order)
}

// GetOrders — возвращает список заказов текущего пользователя (без наполнения Items)
func GetOrders(w http.ResponseWriter, r *http.Request) {
    // user_id из контекста (AuthMiddleware)
    uidVal := r.Context().Value("user_id")
    uid, ok := uidVal.(float64)
    if !ok {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    // Получаем основные поля заказа
    rows, err := utils.DB.Query(`
        SELECT id, user_id, total_price, status, created_at, updated_at
        FROM orders
        WHERE user_id = $1
        ORDER BY created_at DESC
    `, int(uid))
    if err != nil {
        http.Error(w, "Failed to query orders", http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var orders []models.Order
    for rows.Next() {
        var o models.Order
        if err := rows.Scan(
            &o.ID,
            &o.UserID,
            &o.TotalPrice,
            &o.Status,
            &o.CreatedAt,
            &o.UpdatedAt,
        ); err != nil {
            http.Error(w, "Failed to scan order", http.StatusInternalServerError)
            return
        }
        // Items остаётся пустым, фронт может не запрашивать их сразу
        orders = append(orders, o)
    }
    if err := rows.Err(); err != nil {
        http.Error(w, "Error reading orders", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(orders)
}

// GetOrder — возвращает один заказ вместе с его Items
func GetOrder(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    orderID, err := strconv.Atoi(vars["order_id"])
    if err != nil {
        http.Error(w, "Invalid order ID", http.StatusBadRequest)
        return
    }

    // Сначала вытаскиваем основные поля заказа
    var order models.Order
    err = utils.DB.
        QueryRow(`
            SELECT id, user_id, total_price, status, created_at, updated_at
            FROM orders
            WHERE id = $1
        `, orderID).
        Scan(
            &order.ID,
            &order.UserID,
            &order.TotalPrice,
            &order.Status,
            &order.CreatedAt,
            &order.UpdatedAt,
        )
    if err != nil {
        http.Error(w, "Order not found", http.StatusNotFound)
        return
    }

    // Теперь добираем Items
    rows, err := utils.DB.Query(`
        SELECT p.id, p.name, oi.quantity, oi.price
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = $1
    `, orderID)
    if err != nil {
        http.Error(w, "Failed to query order items", http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    for rows.Next() {
        var itm struct {
            ProductID int     `json:"product_id"`
            Name      string  `json:"name"`
            Quantity  int     `json:"quantity"`
            Price     float64 `json:"price"`
        }
        if err := rows.Scan(&itm.ProductID, &itm.Name, &itm.Quantity, &itm.Price); err != nil {
            http.Error(w, "Failed to scan order item", http.StatusInternalServerError)
            return
        }
        order.Items = append(order.Items, itm)
    }
    if err := rows.Err(); err != nil {
        http.Error(w, "Error reading order items", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(order)
}