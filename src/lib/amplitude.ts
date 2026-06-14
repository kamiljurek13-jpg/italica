import * as amplitude from '@amplitude/analytics-browser';
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser';
import { getABGroup, type ABGroup } from '@/hooks/useABGroup';

export const initAmplitude = () => {
  const apiKey = import.meta.env.VITE_AMPLITUDE_API_KEY || 'YOUR_AMPLITUDE_API_KEY';
  amplitude.init(apiKey, undefined, {
    defaultTracking: {
      sessions: true,
      pageViews: true,
      formInteractions: true,
      fileDownloads: true,
    },
  });
  amplitude.add(sessionReplayPlugin({ sampleRate: 1, maskLevel: 'conservative' }));

  (window as any).__italica = {
    identifyUser: (props: Record<string, string | boolean>) => {
      const id = new amplitude.Identify();
      Object.entries(props).forEach(([k, v]) => id.set(k, v));
      amplitude.identify(id);
    },
  };
};

export const identifyABGroup = (group: ABGroup) => {
  const identifyObj = new amplitude.Identify();
  identifyObj.set('ab_group', group);
  amplitude.identify(identifyObj);
};

const trackEvent = (eventName: string, eventProperties?: Record<string, unknown>) => {
  amplitude.track(eventName, eventProperties);
};

export const trackGiftHelperMoodClick = (mood: string) => {
  trackEvent('Gift Helper Mood Selected', {
    mood,
    ab_group: getABGroup(),
    timestamp: new Date().toISOString(),
  });
};

export const trackGiftHelperRecommendation = (mood: string, products: { id: string }[]) => {
  trackEvent('Gift Helper Recommendation Generated', {
    mood,
    productCount: products.length,
    productIds: products.map(p => p.id),
    ab_group: getABGroup(),
    timestamp: new Date().toISOString(),
  });
};

export const trackTimeToFirstProduct = (props: {
  ttfp_ms: number;
  source: 'search_icon' | 'gift_helper_icon';
}) => {
  trackEvent('Time to First Product', {
    ...props,
    ab_group: getABGroup(),
  });
};

export const trackNavigationMenuOpened = (action: 'open' | 'close') => {
  trackEvent('Navigation Menu Opened', { action });
};

export const trackNavigationCategoryClicked = (category: string, source: 'desktop_dropdown' | 'mobile_menu') => {
  trackEvent('Navigation Category Clicked', { category, source });
};

export const trackSearchOpened = () => {
  trackEvent('Search Opened');
};

export const trackSearchQueryEntered = (query: string, resultsCount: number) => {
  trackEvent('Search Query Entered', { query, results_count: resultsCount });
};

export const trackSearchPopularClicked = (searchTerm: string) => {
  trackEvent('Search Popular Clicked', { search_term: searchTerm });
};

export const trackProductViewed = (product: { id: string; name: string; category: string; price: number }) => {
  trackEvent('Product Viewed', product);
};

export const trackProductAddedToCart = (product: { id: string; name: string; category: string; price: number; quantity: number }) => {
  trackEvent('Product Added to Cart', { ...product, ab_group: getABGroup() });
};

export const trackOrderCompleted = (order: {
  total: number;
  subtotal: number;
  shipping: number;
  itemCount: number;
  items: { id: string; name: string; price: number; quantity: number }[];
}) => {
  trackEvent('Order Completed', {
    ...order,
    revenue: order.total,
    ab_group: getABGroup(),
  });
};
