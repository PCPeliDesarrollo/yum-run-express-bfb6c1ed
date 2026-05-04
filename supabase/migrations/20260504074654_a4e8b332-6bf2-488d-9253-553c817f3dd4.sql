-- Explicitly prevent non-admins from seeing guest orders (user_id IS NULL)
-- The existing permissive policy "Users can view their own orders" already filters these out
-- because auth.uid() = NULL returns NULL, but we add a RESTRICTIVE policy to be explicit and safe.

CREATE POLICY "Guest orders only visible to admins"
ON public.orders
AS RESTRICTIVE
FOR SELECT
TO authenticated
USING (
  user_id IS NOT NULL OR has_role(auth.uid(), 'admin'::app_role)
);