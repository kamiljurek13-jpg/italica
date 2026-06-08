import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/types/product';

const HERO_CATEGORIES = ['biustonosze', 'piżamy', 'zestawy'] as const;
const INTERVAL_MS = 5000;

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const { data: allProducts = [] } = useProducts();

  const slides = HERO_CATEGORIES
    .map(cat => allProducts.find(p => p.category === cat))
    .filter(Boolean) as Product[];

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <section className="w-full px-6 mb-12">
        <div className="relative aspect-[4/3] md:aspect-[16/7] bg-muted animate-pulse" />
      </section>
    );
  }

  const product = slides[current];

  return (
    <section className="w-full px-6 mb-12">
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-[4/3] md:aspect-[16/7] overflow-hidden bg-muted">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent text-white">
            <p className="text-sm font-light capitalize">{product.category}</p>
            <h3 className="text-2xl font-serif font-light">{product.name}</h3>
            <p className="text-lg">{product.price} zł</p>
          </div>
        </div>
      </Link>
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-foreground' : 'bg-muted-foreground/30'}`}
            aria-label={`Slajd ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
