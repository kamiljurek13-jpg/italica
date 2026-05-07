import * as amplitude from '@amplitude/analytics-browser';

// Initialize Amplitude
export const initAmplitude = () => {
  // Replace with your actual Amplitude API key
  const apiKey = import.meta.env.VITE_AMPLITUDE_API_KEY || 'YOUR_AMPLITUDE_API_KEY';
  amplitude.init(apiKey, undefined, {
    defaultTracking: {
      sessions: true,
      pageViews: true,
      formInteractions: true,
      fileDownloads: true,
    },
  });
};

// Track events
export const trackEvent = (eventName: string, eventProperties?: Record<string, any>) => {
  amplitude.track(eventName, eventProperties);
};

// Track Gift Helper mood selection
export const trackGiftHelperMoodClick = (mood: string) => {
  trackEvent('Gift Helper Mood Selected', {
    mood,
    timestamp: new Date().toISOString(),
  });
};

// Track Gift Helper product recommendation
export const trackGiftHelperRecommendation = (mood: string, products: any[]) => {
  trackEvent('Gift Helper Recommendation Generated', {
    mood,
    productCount: products.length,
    productIds: products.map(p => p.id),
    timestamp: new Date().toISOString(),
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
