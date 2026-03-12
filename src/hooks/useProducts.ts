import { useState, useEffect } from 'react';
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

const mapDbToProduct = (db: DbProduct): Product => ({
  id: db.id,
  name: db.name,
  description: db.description,
  image: db.image_url || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop',
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
  // Convert to Spain timezone
  const spainTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }));
  const h = spainTime.getHours();
  const m = spainTime.getMinutes();
  const totalMinutes = h * 60 + m;
  // Pizzas only available during evening shift: 20:00-23:30
  return totalMinutes >= 1200 && totalMinutes < 1410; // 20*60=1200, 23*60+30=1410
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pizzaAvailable, setPizzaAvailable] = useState(isPizzaAvailable());

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('available', true)
      .order('sort_order', { ascending: true });

    if (error) {
      setError(error.message);
      console.error('Error fetching products:', error);
    } else {
      setProducts((data || []).map(mapDbToProduct));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    // Re-check pizza availability every minute
    const interval = setInterval(() => {
      setPizzaAvailable(isPizzaAvailable());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Keep all products visible but expose pizza availability flag
  const categories = [...new Set(products.map(p => p.category))];

  const getProductById = (id: string) => products.find(p => p.id === id);
  const getProductsByCategory = (category: string) => products.filter(p => p.category === category);

  return { products, categories, loading, error, getProductById, getProductsByCategory, refetch: fetchProducts, pizzaAvailable };
};

export const useAllProducts = () => {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts((data || []) as DbProduct[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, refetch: fetchProducts };
};
