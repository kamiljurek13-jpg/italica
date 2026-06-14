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

export function useProductsByCategory(
  category: string | undefined,
  page: number = 1,
  pageSize: number = 24
) {
  return useQuery<{ items: Product[]; totalCount: number }>({
    queryKey: ['products', 'category', category, page, pageSize],
    queryFn: async () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: true })
        .range(from, to);
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      const { data, error, count } = await query;
      if (error) throw error;
      return { items: (data as Product[]) ?? [], totalCount: count ?? 0 };
    },
    staleTime: 1000 * 60 * 5,
  });
}
