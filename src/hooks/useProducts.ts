import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/data/products';

interface DbProduct {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  price: number;
  price_media: number | null;
  category: string;
  is_gluten_free: boolean;
  has_egg: boolean;
  has_pork: boolean;
  has_dairy: boolean;
  has_nuts: boolean;
  has_fish: boolean;
  has_shellfish: boolean;
  has_soy: boolean;
  available: boolean;
  sort_order: number;
  options: any;
}

const PRODUCTS_STALE_TIME = 1000 * 60 * 5;
const PRODUCTS_GC_TIME = 1000 * 60 * 30;

const mapDbToProduct = (db: DbProduct): Product => ({
  id: db.id,
  name: db.name,
  description: db.description,
  image: db.image_url || '/placeholder.svg',
  price: Number(db.price),
  priceMedia: db.price_media ? Number(db.price_media) : undefined,
  category: db.category,
  isGlutenFree: db.is_gluten_free,
  hasEgg: db.has_egg,
  hasPork: db.has_pork,
  options: Array.isArray(db.options) ? db.options : [],
});

const isPizzaAvailable = (): boolean => {
  const now = new Date();
  const spainTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }));
  const h = spainTime.getHours();
  const m = spainTime.getMinutes();
  const totalMinutes = h * 60 + m;
  return totalMinutes >= 1200 && totalMinutes < 1410;
};

const fetchAvailableProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('available', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return (data || []).map(mapDbToProduct);
};

const fetchAllProducts = async (): Promise<DbProduct[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return (data || []) as DbProduct[];
};

export const useProducts = () => {
  const [pizzaAvailable, setPizzaAvailable] = useState(isPizzaAvailable());

  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products', 'available'],
    queryFn: fetchAvailableProducts,
    staleTime: PRODUCTS_STALE_TIME,
    gcTime: PRODUCTS_GC_TIME,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPizzaAvailable(isPizzaAvailable());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products]);

  const getProductById = (id: string) => products.find((p) => p.id === id);
  const getProductsByCategory = (category: string) => products.filter((p) => p.category === category);
  const errorMessage = error instanceof Error ? error.message : error ? 'Error al cargar productos' : null;

  return {
    products,
    categories,
    loading: isLoading,
    error: errorMessage,
    getProductById,
    getProductsByCategory,
    refetch: () => refetch(),
    pizzaAvailable,
  };
};

export const useAllProducts = () => {
  const {
    data: products = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: fetchAllProducts,
    staleTime: 1000 * 60,
    gcTime: PRODUCTS_GC_TIME,
    refetchOnWindowFocus: false,
  });

  return { products, loading: isLoading, refetch: () => refetch() };
};
