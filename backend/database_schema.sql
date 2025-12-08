-- Database Creation
-- Run this first: CREATE DATABASE store_db;

-- Connect to the database and run the following:

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    avatar VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    description TEXT,
    category_id INTEGER,
    images TEXT[], -- Array of image URLs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table (optional, for better product organization)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint for products
ALTER TABLE products 
ADD CONSTRAINT fk_category 
FOREIGN KEY (category_id) 
REFERENCES categories(id) 
ON DELETE SET NULL;

-- Refresh Tokens Table (to manage refresh tokens)
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories
INSERT INTO categories (name, image) VALUES
('Electronics', 'https://api.lorem.space/image?w=640&h=480&r=1'),
('Clothes', 'https://api.lorem.space/image?w=640&h=480&r=2'),
('Furniture', 'https://api.lorem.space/image?w=640&h=480&r=3'),
('Shoes', 'https://api.lorem.space/image?w=640&h=480&r=4'),
('Others', 'https://api.lorem.space/image?w=640&h=480&r=5');

-- Insert sample user (password is 'changeme' hashed with bcrypt)
-- Note: You should create users through the API to properly hash passwords
INSERT INTO users (name, email, password, role, avatar) VALUES
('John Doe', 'john@mail.com', '$2a$10$JlQKhx3vW3cF0mLLJLIpYO9GhK0KOkqVQvY9hT0lZhMxZLr0XO8tC', 'customer', 'https://api.lorem.space/image/face?w=640&h=480&r=867');

-- Insert sample products
INSERT INTO products (title, price, description, category_id, images) VALUES
('Laptop HP', 899.99, 'High performance laptop', 1, ARRAY['https://api.lorem.space/image?w=640&h=480&r=10', 'https://api.lorem.space/image?w=640&h=480&r=11']),
('T-Shirt Cotton', 29.99, 'Comfortable cotton t-shirt', 2, ARRAY['https://api.lorem.space/image?w=640&h=480&r=20']),
('Office Chair', 199.99, 'Ergonomic office chair', 3, ARRAY['https://api.lorem.space/image?w=640&h=480&r=30']),
('Running Shoes', 79.99, 'Professional running shoes', 4, ARRAY['https://api.lorem.space/image?w=640&h=480&r=40']),
('Wireless Mouse', 24.99, 'Bluetooth wireless mouse', 1, ARRAY['https://api.lorem.space/image?w=640&h=480&r=50']);
