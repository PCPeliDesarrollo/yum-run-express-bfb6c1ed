import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface KitchenScheduleSlot {
  open: string;
  close: string;
}

export interface KitchenSchedule {
  slots: KitchenScheduleSlot[];
}

export const useKitchenStatus = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState<KitchenSchedule>({ slots: [] });
  const [scheduleLoading, setScheduleLoading] = useState(true);

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

  const fetchSchedule = async () => {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'kitchen_schedule')
      .maybeSingle();

    if (!error && data && data.value) {
      setSchedule(data.value as unknown as KitchenSchedule);
    }
    setScheduleLoading(false);
  };

  useEffect(() => {
    fetchStatus();
    fetchSchedule();

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
    // Set manual override + kitchen status together
    const [kitchenResult, overrideResult] = await Promise.all([
      supabase
        .from('app_settings')
        .update({ value: open, updated_at: new Date().toISOString() })
        .eq('key', 'kitchen_open'),
      supabase
        .from('app_settings')
        .update({ value: true, updated_at: new Date().toISOString() })
        .eq('key', 'kitchen_manual_override'),
    ]);

    if (kitchenResult.error) throw kitchenResult.error;
    setIsOpen(open);
  };

  const updateSchedule = async (newSchedule: KitchenSchedule) => {
    const { error } = await supabase
      .from('app_settings')
      .update({ value: newSchedule as any, updated_at: new Date().toISOString() })
      .eq('key', 'kitchen_schedule');

    if (error) throw error;
    setSchedule(newSchedule);
  };

  return { isOpen, loading, toggleKitchen, schedule, scheduleLoading, updateSchedule };
};
