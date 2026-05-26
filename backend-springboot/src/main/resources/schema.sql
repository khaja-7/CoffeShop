-- ================================================================
-- Coffee Shop API — Supabase PostgreSQL Schema
-- Run this in your Supabase SQL Editor to create the tables.
-- Spring Boot (ddl-auto=update) will also auto-create them,
-- but running this manually gives you full control.
-- ================================================================

-- ── Users Table ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(100)  NOT NULL,
    email      VARCHAR(150)  NOT NULL UNIQUE,
    password   TEXT          NOT NULL,
    phone      VARCHAR(20),
    created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ── Products Table ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    price       DOUBLE PRECISION NOT NULL,
    rating      INT          NOT NULL DEFAULT 0,
    category    VARCHAR(50)  NOT NULL,
    image       VARCHAR(300)
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- ── Orders Table ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
    id          VARCHAR(50)  PRIMARY KEY,
    user_id     BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_name   VARCHAR(100) NOT NULL,
    items       TEXT         NOT NULL,   -- JSON array of order items
    total       DOUBLE PRECISION NOT NULL,
    address     TEXT,
    status      VARCHAR(50)  NOT NULL DEFAULT 'Confirmed',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- ================================================================
-- Enable Row Level Security (optional — recommended for Supabase)
-- ================================================================

-- ALTER TABLE users    ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders   ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE users    IS 'Coffee Shop registered users';
COMMENT ON TABLE products IS 'Coffee Shop product catalog';
COMMENT ON TABLE orders   IS 'Coffee Shop customer orders';
