// Updated to use Vercel serverless function instead of direct API calls

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  mood: string[];
}

const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const filterByMood = (mood: string, products: Product[]): Product[] =>
  shuffle(products.filter(p => p.mood.includes(mood.toLowerCase()))).slice(0, 4);

export const getProductRecommendations = async (
  mood: string,
  products: Product[]
): Promise<Product[]> => {
  if (import.meta.env.VITE_USE_AI_ENGINE !== 'true') {
    return filterByMood(mood, products);
  }

  try {
    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, products }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    return data.recommendations || [];
  } catch (error) {
    console.error('Error getting recommendations from API:', error);
    return filterByMood(mood, products);
  }
};
