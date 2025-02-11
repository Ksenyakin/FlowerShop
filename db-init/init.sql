-- 1. Таблица пользователей (users)
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       role VARCHAR(50) NOT NULL DEFAULT 'user',
                       name VARCHAR(100),
                       phone VARCHAR(20),
                       address VARCHAR(100),
                       loyalty_level INTEGER NOT NULL DEFAULT 1,
                       points INTEGER NOT NULL DEFAULT 0,
                       total_purchases NUMERIC(10,2) NOT NULL DEFAULT 0,
                       last_purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       birthday DATE,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Применяем триггер к таблице users
CREATE TRIGGER trigger_update_users
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();


-- 2. Таблица категорий (categories)
CREATE TABLE categories (
                            id SERIAL PRIMARY KEY,
                            name VARCHAR(255) NOT NULL,
                            description TEXT,
                            parent_id INT DEFAULT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_update_categories
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- 3. Таблица товаров (products)
CREATE TABLE products (
                          id SERIAL PRIMARY KEY,
                          category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
                          name VARCHAR(255) NOT NULL,
                          description TEXT,
                          price NUMERIC(10,2) NOT NULL,
                          stock INTEGER NOT NULL DEFAULT 0,
                          image_url VARCHAR(255),
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_update_products
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();


-- 4. Таблица корзины (cart_items)
CREATE TABLE cart_items (
                            id SERIAL PRIMARY KEY,
                            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                            product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                            quantity INTEGER NOT NULL DEFAULT 1,
                            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            UNIQUE (user_id, product_id)
);

-- 5. Таблица заказов (orders)
CREATE TABLE orders (
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                        total_price NUMERIC(10,2) NOT NULL,
                        status VARCHAR(50) NOT NULL DEFAULT 'new',
                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Таблица элементов заказа (order_items)
CREATE TABLE order_items (
                             id SERIAL PRIMARY KEY,
                             order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                             product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                             quantity INTEGER NOT NULL DEFAULT 1,
                             price NUMERIC(10,2) NOT NULL,
                             UNIQUE (order_id, product_id)
);

-- 7. Таблица платежей (payments)
CREATE TABLE payments (
                          id SERIAL PRIMARY KEY,
                          order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                          payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
                          amount NUMERIC(10,2) NOT NULL,
                          payment_provider VARCHAR(255),
                          transaction_id VARCHAR(255) UNIQUE,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Таблица администраторов (admins)
CREATE TABLE admins (
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
