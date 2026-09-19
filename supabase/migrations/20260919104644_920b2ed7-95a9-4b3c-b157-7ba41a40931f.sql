-- Índices para consultas de alta concurrencia
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON public.orders (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON public.orders (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_available_sort ON public.products (available, sort_order);
CREATE INDEX IF NOT EXISTS idx_products_category_sort ON public.products (category, sort_order);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles (user_id);