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
                          color VARCHAR(50),
                          bouquet_type VARCHAR(50),
                          recipient VARCHAR(50),
                          occasion VARCHAR(50),
                        top_product BOOLEAN,
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
ALTER TABLE categories ADD CONSTRAINT unique_category_name UNIQUE (name);

-- Вставим категории, если их ещё нет
INSERT INTO categories (name, description)
VALUES 
  ('Букет', 'Цветочные композиции в виде классического букета'),
  ('Кашпо', 'Цветы, оформленные в декоративных кашпо'),
  ('Сумочка', 'Композиции, оформленные в сумочках или коробках')
ON CONFLICT (name) DO NOTHING;


-- Вставляем новые товары
INSERT INTO products (category_id, name, description, price, stock, color, bouquet_type, recipient, occasion, top_product, image_url)
    VALUES
        (2, 'Кашпо с гипсофилой', 'Нежная композиция в кашпо с гипсофилой.', 1890.00, 10, 'Белый', 'Кашпо', 'Для неё', 'Любой повод', TRUE, 'https://s3.twcstorage.ru/84163e07-decor-fleurs-s3/8.jpg'),
        (1, 'Букет хризантем', 'Пышный букет свежих хризантем.', 1590.00, 12, 'Жёлтый', 'Букет', 'Мама', 'День рождения', FALSE, 'https://s3.twcstorage.ru/84163e07-decor-fleurs-s3/7.jpg'),
        (1, 'Букет с матиолой', 'Ароматный букет с матиолой.', 1790.00, 8, 'Сиреневый', 'Букет', 'Подруга', 'Поздравление', FALSE, 'https://s3.twcstorage.ru/84163e07-decor-fleurs-s3/photo_2025-02-28_13-50-40.jpg'),
        (1, 'Букет альстромерий', 'Лёгкий и яркий букет из альстромерий.', 1690.00, 9, 'Разноцветный', 'Букет', 'Сестра', 'Без повода', FALSE, 'https://s3.twcstorage.ru/84163e07-decor-fleurs-s3/1.jpg'),
        (2, 'Кашпо с тюльпанами и ирисами', 'Весенняя композиция в кашпо с тюльпанами и ирисами.', 1990.00, 6, 'Фиолетовый', 'Кашпо', 'Любимая', '8 марта', TRUE, 'https://s3.twcstorage.ru/84163e07-decor-fleurs-s3/14.jpg'),
        (3, 'Сумочка с розами', 'Оригинальный букет-аксессуар с розами в сумочке.', 2290.00, 5, 'Красный', 'Сумочка', 'Жена', 'Годовщина', TRUE, 'https://s3.twcstorage.ru/84163e07-decor-fleurs-s3/4.jpg');

INSERT INTO users (id, email, password_hash, role, name, phone, address, loyalty_level, points, total_purchases, last_purchase_date, birthday, created_at, updated_at) 
VALUES (
    1,
    '123-510@mail.ru',
    '$2a$10$/66YiRcDtw5r.oXpvaoT2urDsWWDSRpVcIlDYIZj/jDns1lxWb3U6',
    'admin',
    'Даниил',
    '89615005678',
    'Краснодар',
    1,
    0,
    0.00,
    '2025-07-03 19:17:58.509862',
    '2003-07-25',
    '2025-07-03 19:17:58.509862',
    '2025-07-03 19:18:14.842376'
);
