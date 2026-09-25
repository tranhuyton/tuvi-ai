-- =====================================================================
-- Migration: Bổ sung cột message_type cho bảng tuvi_chat_messages
-- Lưu trữ loại câu hỏi ('basic' | 'vip') để hiển thị huy hiệu chuẩn xác
-- =====================================================================

ALTER TABLE public.tuvi_chat_messages 
ADD COLUMN IF NOT EXISTS message_type VARCHAR(20) DEFAULT 'basic';
