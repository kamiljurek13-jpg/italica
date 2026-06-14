import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ProductCategory } from '@/types/product';

const EMBED_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/embed`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export interface SearchResult {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  image_url: string;
  description: string;
  similarity: number;
}

async function fetchSemanticResults(query: string): Promise<SearchResult[]> {
  const embedRes = await fetch(EMBED_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({ text: query }),
  });

  if (!embedRes.ok) throw new Error(`Embed error: ${embedRes.status}`);

  const { embedding } = await embedRes.json();

  const { data, error } = await supabase.rpc('match_products', {
    query_embedding: embedding,
    match_threshold: 0.4,
    match_count: 8,
  });

  if (error) throw error;
  return data as SearchResult[];
}

export function useSemanticSearch(query: string) {
  return useQuery<SearchResult[]>({
    queryKey: ['semanticSearch', query],
    queryFn: () => fetchSemanticResults(query),
    enabled: query.trim().length >= 3,
    staleTime: 5 * 60 * 1000,
    placeholderData: [],
  });
}
