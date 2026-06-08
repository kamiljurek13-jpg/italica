import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types/product';

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as Product[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductsByCategory(category: string | undefined) {
  return useQuery<Product[]>({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      let query = supabase.from('products').select('*').order('created_at', { ascending: true });
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    },
    staleTime: 1000 * 60 * 5,
  });
}
