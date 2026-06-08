export type ProductCategory = 'biustonosze' | 'majtki' | 'zestawy' | 'piżamy';
export type ProductColor = 'czarny' | 'biały' | 'czerwony';
export type ProductMood = 'sleepy' | 'sexy' | 'daily';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  image_url: string;
  color: ProductColor;
  mood: ProductMood[];
  created_at?: string;
}
