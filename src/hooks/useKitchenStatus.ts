import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useKitchenStatus = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'kitchen_open')
      .maybeSingle();

    if (!error && data) {
      setIsOpen(data.value === true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStatus();

    const channel = supabase
      .channel('kitchen-status')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'app_settings', filter: 'key=eq.kitchen_open' },
        (payload) => {
          setIsOpen(payload.new.value === true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const toggleKitchen = async (open: boolean) => {
    const { error } = await supabase
      .from('app_settings')
      .update({ value: open, updated_at: new Date().toISOString() })
      .eq('key', 'kitchen_open');

    if (error) throw error;
    setIsOpen(open);
  };

  return { isOpen, loading, toggleKitchen };
};
