import { NextRequest, NextResponse } from 'next/server'
import { getListings } from '@/lib/supabase/server-exports'
import { apiRateLimiter, RATE_LIMITS, getClientIP, addSecurityHeaders } from '@/lib/security/rate-limiting'
import type { ListingFilters, GameCondition } from '@/lib/supabase/types'

export async function GET(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request)
    const rateLimit = apiRateLimiter.check(clientIP, RATE_LIMITS.API_GENERAL)
    
    if (!rateLimit.allowed) {
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

    const { searchParams } = new URL(request.url)
    
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
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      )
    }
    
    // Fetch listings from Supabase
    const result = await getListings({
      page,
      limit,
      sortBy,
      sortOrder,
      filters
    })
    
    return addSecurityHeaders(NextResponse.json(result))
    
  } catch (error) {
    console.error('API Error - Get Listings:', error)
    
    return addSecurityHeaders(
      NextResponse.json(
        { 
          error: 'Failed to fetch listings',
          details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
        },
        { status: 500 }
      )
    )
  }
}

export async function POST(request: NextRequest) {
  return addSecurityHeaders(
    NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    )
  )
}

