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

  // 1. Auto-mark as "delivered" orders that have been "ready" for 30+ minutes
  const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const { data: readyOrders, error: readyError } = await supabase
    .from("orders")
    .update({ status: "delivered" })
    .eq("status", "ready")
    .lte("updated_at", thirtyMinAgo)
    .select("id");

  if (readyError) {
    results.push(`Error auto-delivering: ${readyError.message}`);
  } else {
    results.push(`Auto-delivered ${readyOrders?.length || 0} orders`);
  }

  // 2. Delete orders older than 10 days that are delivered or cancelled
  const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
  const { data: deletedOrders, error: deleteError } = await supabase
    .from("orders")
    .delete()
    .in("status", ["delivered", "cancelled"])
    .lte("created_at", tenDaysAgo)
    .select("id");

  if (deleteError) {
    results.push(`Error deleting old orders: ${deleteError.message}`);
  } else {
    results.push(`Deleted ${deletedOrders?.length || 0} old orders`);
  }

  return new Response(JSON.stringify({ results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
