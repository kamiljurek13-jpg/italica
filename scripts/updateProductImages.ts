/**
 * Script to fetch images from Pexels and update products.json
 * Run with: npx tsx scripts/updateProductImages.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  mood: string[];
}

interface PexelsPhoto {
  id: number;
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
}

// Mood-based search keywords
const moodKeywords = {
  sleepy: [
    'luxury silk pajamas',
    'soft satin nightwear',
    'elegant sleepwear',
    'comfortable cotton nightgown',
    'delicate nightwear natural light',
  ],
  sexy: [
    'luxury black lingerie',
    'elegant lace underwear',
    'dramatic lingerie shadows',
    'red satin lingerie',
    'seductive lingerie set',
  ],
  daily: [
    'white cotton underwear',
    'elegant everyday lingerie',
    'simple white bra',
    'comfortable daily lingerie',
    'classic white lingerie',
  ],
};

const categoryKeywords = {
  biustonosze: 'bra',
  'piżamy': 'pajamas',
  'koszulki-nocne': 'nightgown',
  'pończochy': 'stockings',
  pasy: 'garter belt',
  zestawy: 'lingerie set',
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchPexelsImage(
  mood: string,
  category: string,
  index: number
): Promise<string | null> {
  const apiKey = process.env.VITE_PEXELS_API_KEY;

  if (!apiKey) {
    console.error('❌ VITE_PEXELS_API_KEY not found in environment variables');
    process.exit(1);
  }

  try {
    const moodKeywordList = moodKeywords[mood as keyof typeof moodKeywords] || moodKeywords.daily;
    const categoryKeyword = categoryKeywords[category as keyof typeof categoryKeywords] || 'lingerie';
    
    const keywordIndex = index % moodKeywordList.length;
    const searchQuery = `${moodKeywordList[keywordIndex]} ${categoryKeyword}`;

    console.log(`  🔍 Searching: "${searchQuery}"`);

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
      const photoIndex = index % data.photos.length;
      const photo = data.photos[photoIndex];
      console.log(`  ✅ Found image (ID: ${photo.id})`);
      return photo.src.portrait || photo.src.medium;
    }

    console.log(`  ⚠️  No images found`);
    return null;
  } catch (error) {
    console.error(`  ❌ Error:`, error);
    return null;
  }
}

async function updateProductImages() {
  console.log('🚀 Starting Pexels image update...\n');

  // Read products.json
  const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');
  const productsData = fs.readFileSync(productsPath, 'utf-8');
  const products: Product[] = JSON.parse(productsData);

  console.log(`📦 Found ${products.length} products\n`);

  // Fetch images for each product
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const primaryMood = product.mood[0] || 'daily';

    console.log(`[${i + 1}/${products.length}] ${product.name} (${primaryMood} - ${product.category})`);

    const imageUrl = await fetchPexelsImage(primaryMood, product.category, i);

    if (imageUrl) {
      product.image = imageUrl;
      console.log(`  💾 Updated image URL\n`);
    } else {
      console.log(`  ⏭️  Keeping original image\n`);
    }

    // Wait between requests to respect rate limits
    if (i < products.length - 1) {
      await delay(300);
    }
  }

  // Write updated products back to file
  fs.writeFileSync(
    productsPath,
    JSON.stringify(products, null, 2),
    'utf-8'
  );

  console.log('✨ Products updated successfully!');
  console.log(`📁 File saved: ${productsPath}`);
}

// Run the script
updateProductImages().catch(console.error);
