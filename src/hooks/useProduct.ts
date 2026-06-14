import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types/product';

export function useProduct(productId: string | undefined) {
  return useQuery<Product | null>({
    queryKey: ['products', 'detail', productId],
    queryFn: async () => {
      if (!productId) return null;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      if (error) throw error;
      return data as Product;
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
  });
}
