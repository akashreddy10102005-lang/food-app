// Common food database for offline mode
export const commonFoodDatabase = {
  rice: {
    name: 'Rice (1 cup)',
    calories: 206,
    protein: 4.3,
    carbs: 45,
    fat: 0.4,
    fiber: 0.6,
    sugar: 0.1,
    healthRating: 'moderate' as const,
    healthyAlternative: 'Brown Rice',
    alternativeReason: 'Higher fiber and lower glycemic index',
  },
  'brown rice': {
    name: 'Brown Rice (1 cup)',
    calories: 216,
    protein: 5,
    carbs: 45,
    fat: 1.8,
    fiber: 3.5,
    sugar: 0.7,
    healthRating: 'good' as const,
    healthyAlternative: null,
    alternativeReason: null,
  },
  bread: {
    name: 'White Bread (2 slices)',
    calories: 158,
    protein: 5.4,
    carbs: 30,
    fat: 2,
    fiber: 1.2,
    sugar: 3,
    healthRating: 'moderate' as const,
    healthyAlternative: 'Whole Wheat Bread',
    alternativeReason: 'More fiber and nutrients',
  },
  'whole wheat bread': {
    name: 'Whole Wheat Bread (2 slices)',
    calories: 162,
    protein: 6,
    carbs: 28,
    fat: 2.5,
    fiber: 3.5,
    sugar: 4,
    healthRating: 'good' as const,
    healthyAlternative: null,
    alternativeReason: null,
  },
  chicken: {
    name: 'Chicken Breast (100g)',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sugar: 0,
    healthRating: 'good' as const,
    healthyAlternative: null,
    alternativeReason: null,
  },
  'grilled chicken': {
    name: 'Grilled Chicken (100g)',
    calories: 120,
    protein: 25,
    carbs: 0,
    fat: 2.5,
    fiber: 0,
    sugar: 0,
    healthRating: 'good' as const,
    healthyAlternative: null,
    alternativeReason: null,
  },
  fish: {
    name: 'Fish (100g)',
    calories: 206,
    protein: 22,
    carbs: 0,
    fat: 12,
    fiber: 0,
    sugar: 0,
    healthRating: 'good' as const,
    healthyAlternative: null,
    alternativeReason: null,
  },
  eggs: {
    name: 'Eggs (2 large)',
    calories: 156,
    protein: 12.6,
    carbs: 1.1,
    fat: 10.6,
    fiber: 0,
    sugar: 1.1,
    healthRating: 'moderate' as const,
    healthyAlternative: 'Egg Whites',
    alternativeReason: 'Lower in fat and cholesterol',
  },
  vegetables: {
    name: 'Mixed Vegetables (1 cup)',
    calories: 50,
    protein: 2,
    carbs: 10,
    fat: 0.2,
    fiber: 3,
    sugar: 5,
    healthRating: 'good' as const,
    healthyAlternative: null,
    alternativeReason: null,
  },
  fruits: {
    name: 'Mixed Fruits (1 cup)',
    calories: 80,
    protein: 1,
    carbs: 20,
    fat: 0.3,
    fiber: 3,
    sugar: 15,
    healthRating: 'good' as const,
    healthyAlternative: null,
    alternativeReason: null,
  },
  pizza: {
    name: 'Pizza (1 slice)',
    calories: 285,
    protein: 12,
    carbs: 36,
    fat: 10,
    fiber: 2.3,
    sugar: 4,
    healthRating: 'avoid' as const,
    healthyAlternative: 'Veggie Pizza',
    alternativeReason: 'More vegetables, less cheese',
  },
  burger: {
    name: 'Burger (1)',
    calories: 354,
    protein: 20,
    carbs: 29,
    fat: 18,
    fiber: 1.6,
    sugar: 7,
    healthRating: 'avoid' as const,
    healthyAlternative: 'Grilled Chicken Burger',
    alternativeReason: 'Lower in fat and calories',
  },
  pasta: {
    name: 'Pasta (1 cup cooked)',
    calories: 221,
    protein: 8,
    carbs: 43,
    fat: 1.3,
    fiber: 2.5,
    sugar: 1.2,
    healthRating: 'moderate' as const,
    healthyAlternative: 'Whole Wheat Pasta',
    alternativeReason: 'Higher fiber content',
  },
  dal: {
    name: 'Dal (1 cup)',
    calories: 180,
    protein: 12,
    carbs: 30,
    fat: 0.8,
    fiber: 8,
    sugar: 2,
    healthRating: 'good' as const,
    healthyAlternative: null,
    alternativeReason: null,
  },
  curry: {
    name: 'Vegetable Curry (1 cup)',
    calories: 150,
    protein: 6,
    carbs: 18,
    fat: 7,
    fiber: 4,
    sugar: 4,
    healthRating: 'good' as const,
    healthyAlternative: null,
    alternativeReason: null,
  },
  idli: {
    name: 'Idli (2 pieces)',
    calories: 78,
    protein: 4,
    carbs: 16,
    fat: 0.4,
    fiber: 1,
    sugar: 0.2,
    healthRating: 'good' as const,
    healthyAlternative: null,
    alternativeReason: null,
  },
  dosa: {
    name: 'Dosa (1)',
    calories: 168,
    protein: 4,
    carbs: 30,
    fat: 3,
    fiber: 1,
    sugar: 0.5,
    healthRating: 'moderate' as const,
    healthyAlternative: 'Oats Dosa',
    alternativeReason: 'Higher fiber and protein',
  },
  samosa: {
    name: 'Samosa (1)',
    calories: 260,
    protein: 5,
    carbs: 30,
    fat: 13,
    fiber: 2.5,
    sugar: 1,
    healthRating: 'avoid' as const,
    healthyAlternative: 'Baked Samosa',
    alternativeReason: 'Lower fat content',
  },
  salad: {
    name: 'Garden Salad (1 bowl)',
    calories: 33,
    protein: 2,
    carbs: 6,
    fat: 0.4,
    fiber: 2.5,
    sugar: 3.5,
    healthRating: 'good' as const,
    healthyAlternative: null,
    alternativeReason: null,
  },
  yogurt: {
    name: 'Greek Yogurt (1 cup)',
    calories: 130,
    protein: 17,
    carbs: 8,
    fat: 4,
    fiber: 0,
    sugar: 6,
    healthRating: 'good' as const,
    healthyAlternative: null,
    alternativeReason: null,
  },
  oatmeal: {
    name: 'Oatmeal (1 cup)',
    calories: 158,
    protein: 6,
    carbs: 27,
    fat: 3,
    fiber: 4,
    sugar: 1,
    healthRating: 'good' as const,
    healthyAlternative: null,
    alternativeReason: null,
  },
  nuts: {
    name: 'Mixed Nuts (1 oz)',
    calories: 173,
    protein: 5,
    carbs: 6,
    fat: 15,
    fiber: 1.7,
    sugar: 2,
    healthRating: 'good' as const,
    healthyAlternative: null,
    alternativeReason: null,
  },
  'bananas': {
    name: 'Banana (1 medium)',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    fiber: 3.1,
    sugar: 14,
    healthRating: 'good' as const,
    healthyAlternative: null,
    alternativeReason: null,
  },
  apples: {
    name: 'Apple (1 medium)',
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    fiber: 4.4,
    sugar: 19,
    healthRating: 'good' as const,
    healthyAlternative: null,
    alternativeReason: null,
  },
  milk: {
    name: 'Milk (1 cup)',
    calories: 149,
    protein: 8,
    carbs: 12,
    fat: 8,
    fiber: 0,
    sugar: 12,
    healthRating: 'moderate' as const,
    healthyAlternative: 'Low-fat Milk',
    alternativeReason: 'Lower fat content',
  },
};

export class OfflineCache {
  private static readonly CACHE_KEY = 'nutriscan_food_cache';
  private static readonly CACHE_VERSION = '1.0';

  // Check if service worker is supported and online
  static isOnline(): boolean {
    if (typeof window === 'undefined') return true;
    return navigator.onLine;
  }

  // Get food from cache
  static getFood(foodName: string): any | null {
    if (typeof window === 'undefined') return null;

    try {
      const cache = this.getCache();
      const foodNameLower = foodName.toLowerCase();

      // Search in cached results
      if (cache.recentAnalyses) {
        const cached = cache.recentAnalyses.find(
          (item: any) => item.foodName.toLowerCase().includes(foodNameLower)
        );
        if (cached) {
          return cached;
        }
      }

      // Search in common food database
      for (const [key, food] of Object.entries(commonFoodDatabase)) {
        if (foodNameLower.includes(key)) {
          return food;
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting food from cache:', error);
      return null;
    }
  }

  // Save food analysis to cache
  static saveFoodAnalysis(analysis: any): void {
    if (typeof window === 'undefined') return;

    try {
      const cache = this.getCache();

      if (!cache.recentAnalyses) {
        cache.recentAnalyses = [];
      }

      // Add new analysis
      cache.recentAnalyses.unshift({
        ...analysis,
        cachedAt: new Date().toISOString(),
      });

      // Keep only last 50 analyses
      if (cache.recentAnalyses.length > 50) {
        cache.recentAnalyses = cache.recentAnalyses.slice(0, 50);
      }

      this.setCache(cache);
    } catch (error) {
      console.error('Error saving food analysis to cache:', error);
    }
  }

  // Get all cached analyses
  static getRecentAnalyses(limit: number = 10): any[] {
    if (typeof window === 'undefined') return [];

    try {
      const cache = this.getCache();
      return cache.recentAnalyses?.slice(0, limit) || [];
    } catch (error) {
      console.error('Error getting recent analyses:', error);
      return [];
    }
  }

  // Clear cache
  static clearCache(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(this.CACHE_KEY);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // Get cache object
  private static getCache(): any {
    if (typeof window === 'undefined') return { version: this.CACHE_VERSION };

    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Check version compatibility
        if (parsed.version === this.CACHE_VERSION) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }

    return { version: this.CACHE_VERSION };
  }

  // Set cache object
  private static setCache(cache: any): void {
    if (typeof window === 'undefined') return;

    try {
      cache.version = this.CACHE_VERSION;
      cache.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  }

  // Get cache size
  static getCacheSize(): number {
    if (typeof window === 'undefined') return 0;

    try {
      const cache = this.getCache();
      return cache.recentAnalyses?.length || 0;
    } catch (error) {
      return 0;
    }
  }

  // Initialize offline listeners
  static initializeOfflineListeners(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      console.log('App is back online');
    });

    window.addEventListener('offline', () => {
      console.log('App is offline, using cached data');
    });
  }
}

// Initialize listeners on module load (client-side only)
if (typeof window !== 'undefined') {
  OfflineCache.initializeOfflineListeners();
}
