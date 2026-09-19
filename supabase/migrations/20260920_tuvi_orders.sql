-- Migration tạo bảng tuvi_orders cho hệ thống thanh toán tự động VietQR
CREATE TABLE IF NOT EXISTS public.tuvi_orders (
    id TEXT PRIMARY KEY,
    order_code VARCHAR(20) UNIQUE NOT NULL,
    payment_type VARCHAR(50) NOT NULL,
    amount NUMERIC NOT NULL,
    ho_ten VARCHAR(255),
    email VARCHAR(255),
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ,
    transaction_id VARCHAR(255),
    chart_id UUID,
    user_id UUID
);

-- Index tra cứu nhanh mã đơn
CREATE INDEX IF NOT EXISTS idx_tuvi_orders_code ON public.tuvi_orders (order_code);
CREATE INDEX IF NOT EXISTS idx_tuvi_orders_status ON public.tuvi_orders (status);
