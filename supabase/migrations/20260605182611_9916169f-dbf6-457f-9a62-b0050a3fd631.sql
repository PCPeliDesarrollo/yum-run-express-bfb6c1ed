
-- 1. Storage: restrict listing to admins (public URLs still work because bucket is public)
DROP POLICY IF EXISTS "Product images are publicly accessible" ON storage.objects;
CREATE POLICY "Admins can list product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'::app_role));

-- 2. Revoke EXECUTE on trigger-only SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;

-- 3. Realtime: restrict channel subscriptions to own user topic / admin topic
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own order channel" ON realtime.messages;
CREATE POLICY "Users can read own order channel"
ON realtime.messages FOR SELECT
TO authenticated
USING (
  (realtime.topic() = 'global-admin-orders' AND public.has_role(auth.uid(), 'admin'::app_role))
  OR (realtime.topic() = 'global-user-orders-' || auth.uid()::text)
);
