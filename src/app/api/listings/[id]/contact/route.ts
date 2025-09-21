import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, createServerClient } from '@/lib/supabase/server-exports'
import { apiRateLimiter, RATE_LIMITS, getClientIP, addSecurityHeaders } from '@/lib/security/rate-limiting'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Require authentication to access seller contact info
    const user = await requireAuth()
    const { id: listingId } = await params

    if (!listingId) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: 'Listing ID is required' },
          { status: 400 }
        )
      )
    }

    // Get seller contact info (temporary implementation until RPC functions are set up)
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('listings')
      .select(`
        id,
        users!inner(
          name,
          email,
          city
        )
      `)
      .eq('id', listingId)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching seller contact:', error)
      return addSecurityHeaders(
        NextResponse.json(
          { error: 'Failed to fetch seller contact information' },
          { status: 500 }
        )
      )
    }

    if (!data || !data.users) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: 'Listing not found or not active' },
          { status: 404 }
        )
      )
    }

    // Log access for security audit (simplified for now)
    console.log(`Seller contact accessed for listing ${listingId} by user ${user.id} from IP ${clientIP}`)

    const sellerInfo = data.users as { name: string; email: string; city: string }
    return addSecurityHeaders(
      NextResponse.json({
        sellerName: sellerInfo.name,
        sellerEmail: sellerInfo.email,
        sellerCity: sellerInfo.city
      })
    )

  } catch (error) {
    console.error('Contact API error:', error)
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      )
    }
    
    return addSecurityHeaders(
      NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    )
  }
}

// Only allow GET requests
export async function POST() {
  return addSecurityHeaders(
    NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    )
  )
}

export async function PUT() {
  return addSecurityHeaders(
    NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    )
  )
}

export async function DELETE() {
  return addSecurityHeaders(
    NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    )
  )
}
