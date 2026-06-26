import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useProfileComplete = () => {
  const { user, loading: authLoading } = useAuth();
  const [isComplete, setIsComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setIsComplete(null);
      setLoading(false);
      return;
    }

    const check = async () => {
      // Admins are exempt from profile completion
      const { data: roleRow } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (roleRow) {
        setIsComplete(true);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('full_name, phone, address, city, postal_code')
        .eq('id', user.id)
        .single();

      if (data) {
        const complete = !!(
          data.full_name?.trim() &&
          data.phone?.trim() &&
          data.address?.trim() &&
          data.city?.trim() &&
          data.postal_code?.trim()
        );
        setIsComplete(complete);
      } else {
        setIsComplete(false);
      }
      setLoading(false);
    };

    check();
  }, [user, authLoading]);

  return { isComplete, loading: loading || authLoading };
};
