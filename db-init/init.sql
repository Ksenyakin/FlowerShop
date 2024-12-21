-- 1. Таблица пользователей (users)
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       name VARCHAR(100),
                       phone VARCHAR(20),
                       address VARCHAR(100),
                       loyalty_level INTEGER DEFAULT 1,
                       points INTEGER DEFAULT 0,
                       total_purchases INTEGER DEFAULT 0,
                       last_purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       birthday DATE
);

-- 2. Таблица категорий (categories)
CREATE TABLE categories (
                            id SERIAL PRIMARY KEY,
                            name VARCHAR(255) NOT NULL,
                            description TEXT,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Таблица товаров (products)
CREATE TABLE products (
                          id SERIAL PRIMARY KEY,
                          category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
                          name VARCHAR(255) NOT NULL,
                          description TEXT,
                          price NUMERIC(10,2) NOT NULL,
                          stock INTEGER NOT NULL DEFAULT 0,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          image_url VARCHAR(255)
);

-- 4. Таблица корзины (cart_items)
CREATE TABLE cart_items (
                            id SERIAL PRIMARY KEY,
                            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                            product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                            quantity INTEGER NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Таблица заказов (orders)
CREATE TABLE orders (
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                        total_price NUMERIC(10, 2) NOT NULL,
                        status VARCHAR(50) DEFAULT 'new',
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Таблица элементов заказа (order_items)
CREATE TABLE order_items (
                             id SERIAL PRIMARY KEY,
                             order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                             product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                             quantity INTEGER NOT NULL,
                             price NUMERIC(10, 2) NOT NULL
);

-- 7. Таблица платежей (payments)
CREATE TABLE payments (
                          id SERIAL PRIMARY KEY,
                          order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                          payment_status VARCHAR(50) DEFAULT 'pending',
                          amount NUMERIC(10, 2) NOT NULL,
                          payment_provider VARCHAR(255),
                          transaction_id VARCHAR(255) UNIQUE,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admins (
                        id SERIAL PRIMARY KEY,
                        user_id INT NOT NULL UNIQUE,
                        created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE admins
    ADD CONSTRAINT fk_admin_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;
