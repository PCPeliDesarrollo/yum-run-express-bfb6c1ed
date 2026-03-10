import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PromoData {
  enabled: boolean;
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const DEFAULT_PROMO: PromoData = {
  enabled: false,
  badge: "OFERTA ESPECIAL",
  title: "",
  description: "",
  buttonText: "Pedir ahora",
  buttonLink: "/menu",
};

export const usePromo = () => {
  const [promo, setPromo] = useState<PromoData>(DEFAULT_PROMO);
  const [loading, setLoading] = useState(true);

  const fetchPromo = async () => {
    const { data } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "promo")
      .single();

    if (data?.value) {
      setPromo(data.value as unknown as PromoData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPromo();
  }, []);

  const updatePromo = async (newPromo: PromoData) => {
    const { error } = await supabase
      .from("app_settings")
      .update({ value: newPromo as unknown as Record<string, unknown> })
      .eq("key", "promo");

    if (!error) {
      setPromo(newPromo);
    }
    return { error };
  };

  return { promo, loading, updatePromo, refetch: fetchPromo };
};
