import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCategoryImages = () => {
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchImages = useCallback(async () => {
    const { data } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'category_images')
      .maybeSingle();

    if (data?.value && typeof data.value === 'object' && !Array.isArray(data.value)) {
      setCategoryImages(data.value as Record<string, string>);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const updateCategoryImage = async (category: string, imageUrl: string) => {
    const updated = { ...categoryImages, [category]: imageUrl };

    const { error } = await supabase
      .from('app_settings')
      .upsert({ key: 'category_images', value: updated as any, updated_at: new Date().toISOString() });

    if (!error) {
      setCategoryImages(updated);
    }
    return { error };
  };

  return { categoryImages, loading, updateCategoryImage, refetch: fetchImages };
};
