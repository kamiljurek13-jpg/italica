export type ProductCategory = 'biustonosze' | 'majtki' | 'zestawy' | 'piżamy';
export type ProductMood = 'sleepy' | 'sexy' | 'daily';

export interface ProductDetail {
  label: string;
  value: string;
}

export interface ProductReview {
  author: string;
  rating: number;
  text: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  image_url: string;
  color?: string | null;
  mood: ProductMood[];
  created_at?: string;
  sku?: string | null;
  rating?: number | null;
  family?: string | null;
  details?: ProductDetail[] | null;
  reviews?: ProductReview[] | null;
}
