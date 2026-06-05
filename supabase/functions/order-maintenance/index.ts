import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const results: string[] = [];

  // Auto-mark as "delivered" orders that have been "ready" for 20+ minutes
  const twentyMinAgo = new Date(Date.now() - 20 * 60 * 1000).toISOString();
  const { data: readyOrders, error: readyError } = await supabase
    .from("orders")
    .update({ status: "delivered" })
    .eq("status", "ready")
    .lte("updated_at", twentyMinAgo)
    .select("id");

  if (readyError) {
    results.push(`Error auto-delivering: ${readyError.message}`);
  } else {
    results.push(`Auto-delivered ${readyOrders?.length || 0} orders`);
  }

  // Note: old orders are NOT auto-deleted anymore. Admin deletes them manually
  // from the "Historial" tab, grouped by month.

  return new Response(JSON.stringify({ results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
