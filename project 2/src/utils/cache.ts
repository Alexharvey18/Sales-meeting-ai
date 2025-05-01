const CACHE_PREFIX = 'salesforce_intelligence_';
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

export function getCacheKey(key: string): string {
  return `${CACHE_PREFIX}${key}`;
}

export function setCache<T>(key: string, data: T): void {
  const item = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(getCacheKey(key), JSON.stringify(item));
}

export function getCache<T>(key: string): T | null {
  const item = localStorage.getItem(getCacheKey(key));
  if (!item) return null;

  const { data, timestamp } = JSON.parse(item);
  if (Date.now() - timestamp > CACHE_DURATION) {
    localStorage.removeItem(getCacheKey(key));
    return null;
  }

  return data;
}