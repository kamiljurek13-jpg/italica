import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Gift, Moon, Flame, Coffee } from 'lucide-react';
import { getProductRecommendations } from '@/lib/anthropic';
import type { SearchResult } from '@/hooks/useSemanticSearch';
import { trackGiftHelperMoodClick, trackGiftHelperRecommendation } from '@/lib/amplitude';

type Mood = 'sleepy' | 'sexy' | 'daily';

const moodConfig = {
  sleepy: {
    icon: Moon,
    label: 'Sleep',
    description: 'Miękkie, wygodne rzeczy do spania',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  sexy: {
    icon: Flame,
    label: 'Sexy',
    description: 'Odważne, przyciągające wzrok',
    color: 'bg-red-500 hover:bg-red-600',
  },
  daily: {
    icon: Coffee,
    label: 'Na codzień',
    description: 'Wygodne, zapominasz że masz na sobie',
    color: 'bg-amber-500 hover:bg-amber-600',
  },
};

const GiftHelper = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [recommendations, setRecommendations] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [loading]);

  const handleMoodClick = async (mood: Mood) => {
    setSelectedMood(mood);
    setLoading(true);
    setError(null);

    trackGiftHelperMoodClick(mood);

    try {
      const products = await getProductRecommendations(mood);
      setRecommendations(products);
      trackGiftHelperRecommendation(mood, products);
    } catch (err) {
      console.error('Error getting recommendations:', err);
      setError('Unable to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gift className="w-8 h-8 text-primary" />
            <h2 className="text-4xl font-serif font-light">Doradca Prezentów</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powiedz nam co masz na myśli
          </p>
        </div>

        {/* Mood Selection Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {(Object.keys(moodConfig) as Mood[]).map((mood) => {
            const config = moodConfig[mood];
            const Icon = config.icon;
            const isSelected = selectedMood === mood;

            return (
              <Card
                key={mood}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                onClick={() => handleMoodClick(mood)}
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-full ${config.color} text-white`}>
                      <Icon className="w-8 h-8" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-serif">{config.label}</CardTitle>
                  <CardDescription className="text-base">
                    {config.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <div ref={resultsRef}>
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">
              Szukamy idealnych produktów dla Ciebie...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 text-lg">{error}</p>
            <Button
              onClick={() => selectedMood && handleMoodClick(selectedMood)}
              className="mt-4"
              variant="outline"
            >
              Spróbuj ponownie
            </Button>
          </div>
        )}

        {/* Recommendations */}
        {!loading && recommendations.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-serif mb-2">
                Idealne na nastrój: {selectedMood ? moodConfig[selectedMood].label : ''}
              </h3>
              <p className="text-muted-foreground">
                Oto produkty dobrane specjalnie dla Ciebie
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h4 className="text-xl font-serif mb-2">{product.name}</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">
                        {product.price} zł
                      </span>
                      <Link to={`/product/${product.id}`}>
                        <Button variant="outline" size="sm">
                          Zobacz szczegóły
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </section>
  );
};

export default GiftHelper;
