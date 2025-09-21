/**
 * Rate limiting system for API endpoints and external service calls
 */

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyGenerator?: (identifier: string) => string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

export interface RateLimitResult {
  allowed: boolean
  remainingRequests: number
  resetTime: number
  retryAfter?: number
}

class RateLimiter {
  private requests = new Map<string, number[]>()
  
  check(identifier: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now()
    const key = config.keyGenerator ? config.keyGenerator(identifier) : identifier
    const windowStart = now - config.windowMs
    
    // Get existing requests for this identifier
    let userRequests = this.requests.get(key) || []
    
    // Remove requests outside the current window
    userRequests = userRequests.filter(timestamp => timestamp > windowStart)
    
    // Check if limit is exceeded
    const allowed = userRequests.length < config.maxRequests
    const remainingRequests = Math.max(0, config.maxRequests - userRequests.length)
    const resetTime = windowStart + config.windowMs
    
    // Record this request if allowed
    if (allowed) {
      userRequests.push(now)
      this.requests.set(key, userRequests)
    }
    
    const result: RateLimitResult = {
      allowed,
      remainingRequests,
      resetTime
    }
    
    // Add retry-after header if limit exceeded
    if (!allowed) {
      const oldestRequest = Math.min(...userRequests)
      result.retryAfter = Math.ceil((oldestRequest + config.windowMs - now) / 1000)
    }
    
    return result
  }
  
  // Clean up old entries periodically
  cleanup() {
    const now = Date.now()
    for (const [key, timestamps] of this.requests.entries()) {
      const validTimestamps = timestamps.filter(ts => now - ts < 24 * 60 * 60 * 1000) // Keep last 24 hours
      if (validTimestamps.length === 0) {
        this.requests.delete(key)
      } else {
        this.requests.set(key, validTimestamps)
      }
    }
  }
}

// Rate limit configurations for different endpoints
export const RATE_LIMITS = {
  // BGG API calls - conservative to avoid hitting their limits
  BGG_SEARCH: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 searches per minute
    keyGenerator: (userId: string) => `bgg_search:${userId}`
  },
  
  BGG_DETAILS: {
    windowMs: 60 * 1000, // 1 minute  
    maxRequests: 20, // 20 detail requests per minute
    keyGenerator: (userId: string) => `bgg_details:${userId}`
  },
  
  // File uploads - prevent abuse
  FILE_UPLOAD: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 20, // 20 uploads per hour
    keyGenerator: (userId: string) => `upload:${userId}`
  },
  
  // Listing creation - prevent spam
  CREATE_LISTING: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5, // 5 listings per hour
    keyGenerator: (userId: string) => `create_listing:${userId}`
  },
  
  // API calls - general protection
  API_GENERAL: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
    keyGenerator: (ip: string) => `api:${ip}`
  },
  
  // Authentication attempts - prevent brute force
  AUTH_ATTEMPTS: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 failed attempts per 15 minutes
    keyGenerator: (ip: string) => `auth:${ip}`
  }
} as const

// Singleton rate limiter instances
export const bggRateLimiter = new RateLimiter()
export const uploadRateLimiter = new RateLimiter()
export const apiRateLimiter = new RateLimiter()
export const authRateLimiter = new RateLimiter()

/**
 * Middleware helper for rate limiting
 */
export function createRateLimitMiddleware(
  limiter: RateLimiter,
  config: RateLimitConfig,
  identifierExtractor: (request: Request) => string
) {
  return (request: Request) => {
    const identifier = identifierExtractor(request)
    const result = limiter.check(identifier, config)
    
    return {
      ...result,
      headers: {
        'X-RateLimit-Limit': config.maxRequests.toString(),
        'X-RateLimit-Remaining': result.remainingRequests.toString(),
        'X-RateLimit-Reset': result.resetTime.toString(),
        ...(result.retryAfter && { 'Retry-After': result.retryAfter.toString() })
      }
    }
  }
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string {
  const headers = new Headers(request.headers)
  
  // Check common proxy headers
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown'
  }
  
  const realIP = headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  
  const clientIP = headers.get('x-client-ip')
  if (clientIP) {
    return clientIP
  }
  
  // Fallback to a default value
  return 'unknown'
}

/**
 * BGG API rate limiting with caching integration
 */
export class BggRateLimiter {
  private lastRequestTime = 0
  private requestQueue: Array<() => Promise<any>> = []
  private isProcessing = false
  
  async execute<T>(request: () => Promise<T>, userId: string): Promise<T> {
    // Check user rate limit first
    const userLimit = bggRateLimiter.check(userId, RATE_LIMITS.BGG_SEARCH)
    if (!userLimit.allowed) {
      throw new Error(`Rate limit exceeded. Try again in ${userLimit.retryAfter} seconds.`)
    }
    
    // Add to queue
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await this.executeWithDelay(request)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      
      this.processQueue()
    })
  }
  
  private async executeWithDelay<T>(request: () => Promise<T>): Promise<T> {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    const minDelay = 1000 // 1 second between BGG requests
    
    if (timeSinceLastRequest < minDelay) {
      await new Promise(resolve => setTimeout(resolve, minDelay - timeSinceLastRequest))
    }
    
    this.lastRequestTime = Date.now()
    return await request()
  }
  
  private async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return
    }
    
    this.isProcessing = true
    
    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift()
      if (request) {
        try {
          await request()
        } catch (error) {
          console.error('BGG request failed:', error)
        }
      }
    }
    
    this.isProcessing = false
  }
}

export const bggApiLimiter = new BggRateLimiter()

/**
 * Security headers for API responses
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
}

/**
 * Apply security headers to response
 */
export function addSecurityHeaders(response: Response): Response {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

// Cleanup rate limiter data periodically (run in background)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    bggRateLimiter.cleanup()
    uploadRateLimiter.cleanup()
    apiRateLimiter.cleanup()
    authRateLimiter.cleanup()
  }, 60 * 60 * 1000) // Every hour
}
