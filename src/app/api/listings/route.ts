import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { getListings } from '@/lib/supabase/server-exports'
import { apiRateLimiter, RATE_LIMITS, getClientIP, addSecurityHeaders } from '@/lib/security/rate-limiting'
import { captureApiError, addBreadcrumb } from '@/lib/monitoring/sentry-utils'
import { log, withLogging } from '@/lib/monitoring/logflare'
import type { ListingFilters, GameCondition } from '@/lib/supabase/types'

export const GET = withLogging(async function GET(request: NextRequest) {
  const startTime = Date.now()
  const clientIP = getClientIP(request)
  const { searchParams } = new URL(request.url)
  
  // Log API call start
  log.info('GET /api/listings started', {
    clientIP,
    userAgent: request.headers.get('user-agent'),
    searchParams: Object.fromEntries(searchParams),
  })
  
  // Add breadcrumb for API call
  addBreadcrumb('API call started', 'api', {
    route: '/api/listings',
    method: 'GET',
    timestamp: new Date().toISOString(),
  })

  try {
    // Rate limiting check
    const rateLimit = apiRateLimiter.check(clientIP, RATE_LIMITS.API_GENERAL)
    
    if (!rateLimit.allowed) {
      // Log rate limiting
      log.warn('Rate limit exceeded', {
        clientIP,
        retryAfter: rateLimit.retryAfter,
        endpoint: '/api/listings',
      })

      // Log rate limiting for monitoring
      Sentry.addBreadcrumb({
        message: 'Rate limit exceeded',
        category: 'rate-limit',
        level: 'warning',
        data: {
          clientIP,
          retryAfter: rateLimit.retryAfter,
        },
      })

      return addSecurityHeaders(
        NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            retryAfter: rateLimit.retryAfter 
          },
          { 
            status: 429,
            headers: {
              'Retry-After': rateLimit.retryAfter?.toString() || '60'
            }
          }
        )
      )
    }

    // Parse pagination parameters
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    
    // Parse filter parameters
    const filters: ListingFilters = {}
    
    const search = searchParams.get('search')
    if (search) {
      filters.search = search
    }
    
    const city = searchParams.get('city')
    if (city) {
      filters.city = city
    }
    
    const conditionParam = searchParams.get('condition')
    if (conditionParam) {
      filters.condition = conditionParam.split(',').filter(Boolean) as GameCondition[]
    }
    
    const minPrice = searchParams.get('minPrice')
    if (minPrice) {
      const parsed = parseFloat(minPrice)
      if (!isNaN(parsed)) {
        filters.minPrice = parsed
      }
    }
    
    const maxPrice = searchParams.get('maxPrice')
    if (maxPrice) {
      const parsed = parseFloat(maxPrice)
      if (!isNaN(parsed)) {
        filters.maxPrice = parsed
      }
    }
    
    const bggId = searchParams.get('bggId')
    if (bggId) {
      const parsed = parseInt(bggId, 10)
      if (!isNaN(parsed)) {
        filters.bggId = parsed
      }
    }
    
    // Parse sorting parameters
    const sortByParam = searchParams.get('sortBy')
    const validSortBy = ['created_at', 'price', 'game_name']
    const sortBy = validSortBy.includes(sortByParam || '') ? sortByParam as 'created_at' | 'price' | 'game_name' : 'created_at'
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc'
    
    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      log.warn('Invalid pagination parameters', {
        page,
        limit,
        clientIP,
      })

      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      )
    }
    
    // Log database operation start
    const dbStartTime = Date.now()
    
    // Fetch listings from Supabase
    const result = await getListings({
      page,
      limit,
      sortBy,
      sortOrder,
      filters
    })
    
    const dbDuration = Date.now() - dbStartTime
    const totalDuration = Date.now() - startTime
    
    // Log database performance
    log.database('SELECT', 'listings', dbDuration, {
      page,
      limit,
      filters,
      resultCount: result.data?.length || 0,
    })
    
    // Log API performance
    log.performance('api_response_time', totalDuration, 2000, {
      endpoint: '/api/listings',
      method: 'GET',
      resultCount: result.data?.length || 0,
    })
    
    // Track successful API call performance
    if (totalDuration > 2000) { // Log slow queries
      log.warn('Slow API response detected', {
        duration: totalDuration,
        dbDuration,
        route: '/api/listings',
        filters,
        resultCount: result.data?.length || 0,
      })

      Sentry.addBreadcrumb({
        message: 'Slow API response',
        category: 'performance',
        level: 'warning',
        data: {
          duration: totalDuration,
          route: '/api/listings',
          filters,
        },
      })
    }

    addBreadcrumb('API call completed successfully', 'api', {
      route: '/api/listings',
      duration: totalDuration,
      resultCount: result.data?.length || 0,
    })

    log.info('GET /api/listings completed successfully', {
      duration: totalDuration,
      dbDuration,
      resultCount: result.data?.length || 0,
      clientIP,
    })
    
    return addSecurityHeaders(NextResponse.json(result))
    
  } catch (error) {
    const duration = Date.now() - startTime
    
    console.error('API Error - Get Listings:', error)
    
    // Log error details
    log.error('GET /api/listings failed', error as Error, {
      duration,
      clientIP,
      searchParams: Object.fromEntries(searchParams),
    })
    
    // Capture error in Sentry with context
    const eventId = captureApiError(error as Error, {
      route: '/api/listings',
      method: 'GET',
      statusCode: 500,
      requestData: {
        page,
        limit,
        filters,
      },
    })
    
    return addSecurityHeaders(
      NextResponse.json(
        { 
          error: 'Failed to fetch listings',
          details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined,
          eventId: process.env.NODE_ENV === 'development' ? eventId : undefined,
        },
        { status: 500 }
      )
    )
  }
}, { route: '/api/listings', method: 'GET' })

export async function POST(request: NextRequest) {
  return addSecurityHeaders(
    NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    )
  )
}

