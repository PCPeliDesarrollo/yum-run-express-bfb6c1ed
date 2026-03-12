import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get schedule and override status
    const [scheduleRes, overrideRes, kitchenRes] = await Promise.all([
      supabase
        .from("app_settings")
        .select("value")
        .eq("key", "kitchen_schedule")
        .maybeSingle(),
      supabase
        .from("app_settings")
        .select("value")
        .eq("key", "kitchen_manual_override")
        .maybeSingle(),
      supabase
        .from("app_settings")
        .select("value")
        .eq("key", "kitchen_open")
        .maybeSingle(),
    ]);

    const schedule = scheduleRes.data?.value as { slots: { open: string; close: string }[] } | null;
    const isOverride = overrideRes.data?.value === true;
    const currentKitchenOpen = kitchenRes.data?.value === true;

    if (!schedule || !schedule.slots) {
      return new Response(JSON.stringify({ message: "No schedule configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get current time in Spain (Europe/Madrid)
    const now = new Date();
    const spainTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Europe/Madrid" })
    );
    const currentMinutes = spainTime.getHours() * 60 + spainTime.getMinutes();

    // Check if current time falls within any schedule slot
    const shouldBeOpen = schedule.slots.some((slot) => {
      const [openH, openM] = slot.open.split(":").map(Number);
      const [closeH, closeM] = slot.close.split(":").map(Number);
      const openMinutes = openH * 60 + openM;
      const closeMinutes = closeH * 60 + closeM;
      return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
    });

    // If manual override is active, check if we're at a schedule transition
    // (i.e., the scheduled state changed). If so, clear the override and apply schedule.
    if (isOverride) {
      // Only clear override when the schedule transitions (shouldBeOpen != currentKitchenOpen means
      // the schedule wants something different from current state, which is a transition point)
      if (shouldBeOpen !== currentKitchenOpen) {
        // Schedule transition detected — clear override and apply schedule
        await Promise.all([
          supabase
            .from("app_settings")
            .update({ value: false, updated_at: new Date().toISOString() })
            .eq("key", "kitchen_manual_override"),
          supabase
            .from("app_settings")
            .update({ value: shouldBeOpen, updated_at: new Date().toISOString() })
            .eq("key", "kitchen_open"),
        ]);

        return new Response(
          JSON.stringify({
            message: "Override cleared at schedule transition",
            kitchen_open: shouldBeOpen,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Override active and no transition — do nothing
      return new Response(
        JSON.stringify({ message: "Manual override active, skipping", kitchen_open: currentKitchenOpen }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // No override — apply schedule if different from current state
    if (shouldBeOpen !== currentKitchenOpen) {
      await supabase
        .from("app_settings")
        .update({ value: shouldBeOpen, updated_at: new Date().toISOString() })
        .eq("key", "kitchen_open");
    }

    return new Response(
      JSON.stringify({ message: "Schedule checked", kitchen_open: shouldBeOpen }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
