import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Gift, Moon, Flame, Coffee } from 'lucide-react';
import { getProductRecommendations, type Product } from '@/lib/anthropic';
import { trackGiftHelperMoodClick, trackGiftHelperRecommendation } from '@/lib/amplitude';
import productsData from '@/data/products.json';

type Mood = 'sleepy' | 'sexy' | 'daily';

const moodConfig = {
  sleepy: {
    icon: Moon,
    label: 'Sleepy',
    description: 'Soft, comfortable pieces for relaxation',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  sexy: {
    icon: Flame,
    label: 'Sexy',
    description: 'Bold, statement pieces that turn heads',
    color: 'bg-red-500 hover:bg-red-600',
  },
  daily: {
    icon: Coffee,
    label: 'Daily',
    description: 'Versatile pieces for everyday elegance',
    color: 'bg-amber-500 hover:bg-amber-600',
  },
};

const GiftHelper = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMoodClick = async (mood: Mood) => {
    setSelectedMood(mood);
    setLoading(true);
    setError(null);
    
    // Track the mood selection
    trackGiftHelperMoodClick(mood);

    try {
      // Get recommendations from Anthropic
      const products = await getProductRecommendations(mood, productsData as Product[]);
      setRecommendations(products);
      
      // Track the recommendations
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
            <h2 className="text-4xl font-serif font-light">Gift Helper</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Not sure what to choose? Let our AI assistant help you find the perfect piece based on the mood you're looking for.
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

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">
              Finding the perfect pieces for you...
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
              Try Again
            </Button>
          </div>
        )}

        {/* Recommendations */}
        {!loading && recommendations.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-serif mb-2">
                Perfect for a {selectedMood} mood
              </h3>
              <p className="text-muted-foreground">
                Here are our AI-curated recommendations just for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image}
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
                          View Details
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
    </section>
  );
};

export default GiftHelper;
