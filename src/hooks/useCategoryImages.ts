import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const CATEGORY_IMAGES_CACHE_KEY = 'category_images_cache_v1';

const readCachedCategoryImages = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};

  try {
    const raw = localStorage.getItem(CATEGORY_IMAGES_CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, string>;
    }
  } catch {
    // ignore cache parsing errors
  }

  return {};
};

const writeCachedCategoryImages = (images: Record<string, string>) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CATEGORY_IMAGES_CACHE_KEY, JSON.stringify(images));
  } catch {
    // ignore cache write errors
  }
};

export const useCategoryImages = () => {
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>(() => readCachedCategoryImages());
  const [loading, setLoading] = useState(() => Object.keys(readCachedCategoryImages()).length === 0);

  const fetchImages = useCallback(async () => {
    const { data } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'category_images')
      .maybeSingle();

    if (data?.value && typeof data.value === 'object' && !Array.isArray(data.value)) {
      const images = data.value as Record<string, string>;
      setCategoryImages(images);
      writeCachedCategoryImages(images);
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
      writeCachedCategoryImages(updated);
    }

    return { error };
  };

  return { categoryImages, loading, updateCategoryImage, refetch: fetchImages };
};
