// Pexels API integration for fetching high-quality product images

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

interface PexelsSearchResponse {
  photos: PexelsPhoto[];
  total_results: number;
  page: number;
  per_page: number;
}

const colorTranslations: Record<string, string> = {
  czarny: 'black',
  biały: 'white',
  czerwony: 'red',
  różowy: 'pink',
  beżowy: 'beige',
  granatowy: 'navy',
  fioletowy: 'purple',
  złoty: 'gold',
  bordowy: 'burgundy',
  szary: 'gray',
};

const moodMaterial: Record<string, string> = {
  sexy: 'lace',
  sleepy: 'silk',
  daily: 'cotton',
};

// Category-specific keywords
const categoryKeywords = {
  biustonosze: 'bra',
  'piżamy': 'pajamas',
  'koszulki-nocne': 'nightgown',
  'pończochy': 'stockings',
  pasy: 'garter belt',
  zestawy: 'lingerie set',
};

/**
 * Fetch images from Pexels API based on mood and category
 */
export const fetchPexelsImage = async (
  mood: string,
  category: string,
  color: string = '',
  index: number = 0
): Promise<string | null> => {
  const apiKey = import.meta.env.VITE_PEXELS_API_KEY;

  if (!apiKey) {
    console.warn('VITE_PEXELS_API_KEY not found in environment variables');
    return null;
  }

  try {
    const colorEn = colorTranslations[color] || color;
    const material = moodMaterial[mood as keyof typeof moodMaterial] || 'lingerie';
    const categoryKeyword = categoryKeywords[category as keyof typeof categoryKeywords] || 'lingerie';
    const searchQuery = colorEn
      ? `${colorEn} ${material} ${categoryKeyword}`
      : `${material} ${categoryKeyword}`;

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&orientation=portrait&per_page=15`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data: PexelsSearchResponse = await response.json();

    if (data.photos && data.photos.length > 0) {
      // Get a photo from the results (use index to get different photos)
      const photoIndex = index % data.photos.length;
      const photo = data.photos[photoIndex];
      
      // Return the portrait or medium size image
      return photo.src.portrait || photo.src.medium;
    }

    return null;
  } catch (error) {
    console.error('Error fetching from Pexels:', error);
    return null;
  }
};

/**
 * Batch fetch images for multiple products
 * This helps optimize API calls
 */
export const fetchImagesForProducts = async (
  products: Array<{ id: string; mood: string[]; category: string; color?: string }>
): Promise<Record<string, string>> => {
  const imageMap: Record<string, string> = {};
  
  // Add delay between requests to respect rate limits
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const primaryMood = product.mood[0] || 'daily';
    
    const imageUrl = await fetchPexelsImage(primaryMood, product.category, product.color ?? '', i);
    
    if (imageUrl) {
      imageMap[product.id] = imageUrl;
    }
    
    // Wait 200ms between requests to avoid rate limiting
    if (i < products.length - 1) {
      await delay(200);
    }
  }

  return imageMap;
};

/**
 * Get curated search queries for manual image selection
 * Use this to generate search URLs for manual curation
 */
export const getCuratedSearchQueries = () => {
  return {
    sleepy: [
      'https://www.pexels.com/search/luxury%20silk%20pajamas/',
      'https://www.pexels.com/search/soft%20satin%20fabric/',
      'https://www.pexels.com/search/delicate%20gold%20jewelry/',
    ],
    sexy: [
      'https://www.pexels.com/search/luxury%20black%20lingerie/',
      'https://www.pexels.com/search/elegant%20lace%20underwear/',
      'https://www.pexels.com/search/bold%20jewelry%20dramatic/',
    ],
    daily: [
      'https://www.pexels.com/search/minimalist%20jewelry/',
      'https://www.pexels.com/search/elegant%20everyday%20jewelry/',
      'https://www.pexels.com/search/simple%20gold%20jewelry/',
    ],
  };
};
