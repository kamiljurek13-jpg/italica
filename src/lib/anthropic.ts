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

export const getProductRecommendations = async (
  mood: string,
  products: Product[]
): Promise<Product[]> => {
  try {
    // Call our secure Vercel serverless function
    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mood,
        products,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Return recommendations from the API
    return data.recommendations || [];
  } catch (error) {
    console.error('Error getting recommendations from API:', error);
    
    // Fallback: return products that match the mood
    return products
      .filter(p => p.mood.includes(mood.toLowerCase()))
      .slice(0, 3);
  }
};
