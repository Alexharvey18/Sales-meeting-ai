interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry?: number; // Optional expiry time in milliseconds
}

// Use localStorage for persistence between sessions
const cache: Record<string, CacheItem<any>> = (() => {
  try {
    const savedCache = localStorage.getItem('app_cache');
    return savedCache ? JSON.parse(savedCache) : {};
  } catch (error) {
    console.error('Failed to load cache from localStorage:', error);
    return {};
  }
})();

/**
 * Save cache to localStorage
 */
function persistCache() {
  try {
    localStorage.setItem('app_cache', JSON.stringify(cache));
  } catch (error) {
    console.error('Failed to persist cache to localStorage:', error);
  }
}

/**
 * Get a value from cache
 * @param key The cache key
 * @returns The cached value, or undefined if not found or expired
 */
export function getCache<T>(key: string): T | undefined {
  const item = cache[key];
  
  if (!item) return undefined;
  
  // Check if the item has expired
  if (item.expiry && Date.now() - item.timestamp > item.expiry) {
    delete cache[key];
    persistCache();
    return undefined;
  }
  
  return item.data;
}

/**
 * Set a value in cache
 * @param key The cache key
 * @param data The data to cache
 * @param expiry Optional expiry time in milliseconds
 */
export function setCache<T>(key: string, data: T, expiry?: number): void {
  cache[key] = {
    data,
    timestamp: Date.now(),
    expiry
  };
  
  persistCache();
}

/**
 * Clear all cache or a specific key
 * @param key Optional specific key to clear
 */
export function clearCache(key?: string): void {
  if (key) {
    delete cache[key];
  } else {
    // Clear all keys
    Object.keys(cache).forEach(k => delete cache[k]);
  }
  
  persistCache();
}

/**
 * Get cache stats
 * @returns Information about the cache
 */
export function getCacheStats() {
  const keys = Object.keys(cache);
  const totalItems = keys.length;
  const expiredItems = keys.filter(key => {
    const item = cache[key];
    return item.expiry && Date.now() - item.timestamp > item.expiry;
  }).length;
  
  const oldestItem = keys.reduce((oldest, key) => {
    const item = cache[key];
    return (!oldest || item.timestamp < oldest) ? item.timestamp : oldest;
  }, 0);
  
  return {
    totalItems,
    expiredItems,
    oldestItemAge: oldestItem ? Math.floor((Date.now() - oldestItem) / 1000 / 60) + ' minutes' : 'none',
    keys
  };
}