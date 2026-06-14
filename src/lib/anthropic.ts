import { supabase } from '@/lib/supabase';
import type { SearchResult } from '@/hooks/useSemanticSearch';

const EMBED_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/embed`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const MOOD_QUERIES: Record<string, string> = {
  sleepy: 'miękka bielizna do spania piżama wygodna relaks',
  sexy: 'zmysłowa bielizna seksowna odważna przyciągająca wzrok',
  daily: 'wygodna codzienna bielizna casualowa zapominasz że masz na sobie',
};

export const getProductRecommendations = async (mood: string): Promise<SearchResult[]> => {
  const query = MOOD_QUERIES[mood] ?? mood;

  try {
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
      match_count: 6,
    });

    if (error) throw error;

    return (data as SearchResult[]).slice(0, 3);
  } catch (err) {
    console.error('Recommendations error, falling back to mood filter:', err);

    const { data } = await supabase
      .from('products')
      .select('id, name, description, price, image_url, category')
      .contains('mood', [mood])
      .limit(3);

    return (data ?? []).map(p => ({ ...p, similarity: 0 })) as SearchResult[];
  }
};
