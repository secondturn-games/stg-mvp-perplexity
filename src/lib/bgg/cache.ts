/**
 * BGG API caching and request deduplication
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

interface PendingRequest<T> {
  promise: Promise<T>
  timestamp: number
}

class BggCache {
  private cache = new Map<string, CacheEntry<any>>()
  private pendingRequests = new Map<string, PendingRequest<any>>()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes
  private readonly SEARCH_TTL = 2 * 60 * 1000 // 2 minutes for searches
  private readonly DETAILS_TTL = 10 * 60 * 1000 // 10 minutes for game details

  private getTTL(key: string): number {
    if (key.startsWith('search:')) return this.SEARCH_TTL
    if (key.startsWith('game:')) return this.DETAILS_TTL
    return this.DEFAULT_TTL
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() > entry.expiresAt
  }

  private cleanupExpired(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key)
      }
    }

    // Clean up old pending requests (older than 30 seconds)
    for (const [key, request] of this.pendingRequests.entries()) {
      if (now - request.timestamp > 30000) {
        this.pendingRequests.delete(key)
      }
    }
  }

  get<T>(key: string): T | null {
    this.cleanupExpired()
    
    const entry = this.cache.get(key)
    if (!entry || this.isExpired(entry)) {
      return null
    }
    
    return entry.data
  }

  set<T>(key: string, data: T): void {
    const ttl = this.getTTL(key)
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl
    }
    
    this.cache.set(key, entry)
  }

  async getOrFetch<T>(
    key: string, 
    fetchFn: () => Promise<T>,
    forceRefresh: boolean = false
  ): Promise<T> {
    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = this.get<T>(key)
      if (cached !== null) {
        return cached
      }
    }

    // Check if there's already a pending request for this key
    const pending = this.pendingRequests.get(key)
    if (pending && !forceRefresh) {
      return pending.promise
    }

    // Create new request
    const promise = fetchFn().then(
      (data) => {
        // Store in cache
        this.set(key, data)
        // Remove from pending
        this.pendingRequests.delete(key)
        return data
      },
      (error) => {
        // Remove from pending on error
        this.pendingRequests.delete(key)
        throw error
      }
    )

    // Store pending request
    this.pendingRequests.set(key, {
      promise,
      timestamp: Date.now()
    })

    return promise
  }

  clear(): void {
    this.cache.clear()
    this.pendingRequests.clear()
  }

  // Get cache stats for debugging
  getStats() {
    this.cleanupExpired()
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      entries: Array.from(this.cache.keys())
    }
  }
}

// Export singleton instance
export const bggCache = new BggCache()

// Helper functions for creating cache keys
export function createSearchCacheKey(query: string, type: string = 'boardgame'): string {
  return `search:${type}:${query.toLowerCase().trim()}`
}

export function createGameCacheKey(bggId: number): string {
  return `game:${bggId}`
}

export function createMultiGameCacheKey(bggIds: number[]): string {
  return `games:${bggIds.sort().join(',')}`
}

// Utility to preload popular games
export async function preloadPopularGames(bggIds: number[], fetchFn: (id: number) => Promise<any>) {
  const promises = bggIds.map(id => {
    const key = createGameCacheKey(id)
    return bggCache.getOrFetch(key, () => fetchFn(id))
  })
  
  // Don't await all - let them load in background
  Promise.allSettled(promises).catch(() => {
    // Ignore errors in background preloading
  })
}
