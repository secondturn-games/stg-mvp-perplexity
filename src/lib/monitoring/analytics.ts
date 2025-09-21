import { track } from '@vercel/analytics'

/**
 * Enhanced Analytics Tracking for Second Turn Games
 * Integrates with Vercel Analytics for comprehensive user behavior tracking
 */

// Custom event types for better tracking
export type AnalyticsEvent = 
  | 'listing_created'
  | 'listing_viewed'
  | 'listing_contacted'
  | 'search_performed'
  | 'filter_applied'
  | 'user_registered'
  | 'user_signed_in'
  | 'bgg_game_selected'
  | 'image_uploaded'
  | 'form_error'
  | 'api_error'
  | 'page_error'

/**
 * Track custom events with enhanced context
 */
export function trackEvent(event: AnalyticsEvent, properties?: Record<string, any>) {
  try {
    // Add common properties
    const enhancedProperties = {
      ...properties,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
    }

    // Track with Vercel Analytics
    track(event, enhancedProperties)

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', {
        event,
        properties: enhancedProperties,
      })
    }
  } catch (error) {
    console.warn('Analytics tracking failed:', error)
  }
}

/**
 * Track listing interactions
 */
export function trackListingEvent(
  action: 'created' | 'viewed' | 'contacted' | 'edited' | 'deleted',
  listingData: {
    listingId: string
    gameName: string
    price: number
    condition: string
    city?: string
    bggId?: number
  }
) {
  trackEvent(`listing_${action}` as AnalyticsEvent, {
    listingId: listingData.listingId,
    gameName: listingData.gameName,
    price: listingData.price,
    condition: listingData.condition,
    city: listingData.city,
    bggId: listingData.bggId,
    category: 'listing',
  })
}

/**
 * Track search and filter usage
 */
export function trackSearchEvent(
  searchData: {
    query?: string
    filters?: {
      city?: string
      condition?: string[]
      minPrice?: number
      maxPrice?: number
    }
    resultsCount: number
    searchDuration: number
  }
) {
  trackEvent('search_performed', {
    hasQuery: !!searchData.query,
    queryLength: searchData.query?.length || 0,
    filtersUsed: Object.keys(searchData.filters || {}).length,
    resultsCount: searchData.resultsCount,
    searchDuration: searchData.searchDuration,
    category: 'search',
  })
}

/**
 * Track user authentication events
 */
export function trackAuthEvent(
  action: 'registered' | 'signed_in' | 'signed_out' | 'password_reset',
  userData?: {
    method?: 'email' | 'oauth'
    provider?: string
  }
) {
  trackEvent(`user_${action}` as AnalyticsEvent, {
    method: userData?.method,
    provider: userData?.provider,
    category: 'auth',
  })
}

/**
 * Track BGG integration usage
 */
export function trackBggEvent(
  action: 'search' | 'selected' | 'error',
  bggData: {
    query?: string
    gameId?: number
    gameName?: string
    resultsCount?: number
    searchDuration?: number
    errorType?: string
  }
) {
  trackEvent('bgg_game_selected', {
    action,
    query: bggData.query,
    gameId: bggData.gameId,
    gameName: bggData.gameName,
    resultsCount: bggData.resultsCount,
    searchDuration: bggData.searchDuration,
    errorType: bggData.errorType,
    category: 'bgg_integration',
  })
}

/**
 * Track form interactions and errors
 */
export function trackFormEvent(
  formName: string,
  action: 'started' | 'completed' | 'abandoned' | 'error',
  formData?: {
    fieldCount?: number
    completionTime?: number
    errorField?: string
    errorType?: string
  }
) {
  trackEvent('form_error', {
    formName,
    action,
    fieldCount: formData?.fieldCount,
    completionTime: formData?.completionTime,
    errorField: formData?.errorField,
    errorType: formData?.errorType,
    category: 'form_interaction',
  })
}

/**
 * Track API performance and errors
 */
export function trackApiEvent(
  endpoint: string,
  method: string,
  status: 'success' | 'error',
  performance: {
    duration: number
    statusCode?: number
    errorType?: string
  }
) {
  trackEvent('api_error', {
    endpoint,
    method,
    status,
    duration: performance.duration,
    statusCode: performance.statusCode,
    errorType: performance.errorType,
    category: 'api_performance',
  })
}

/**
 * Track page performance metrics
 */
export function trackPagePerformance(
  pageName: string,
  metrics: {
    loadTime?: number
    renderTime?: number
    interactionTime?: number
    errorCount?: number
  }
) {
  trackEvent('page_error', {
    pageName,
    loadTime: metrics.loadTime,
    renderTime: metrics.renderTime,
    interactionTime: metrics.interactionTime,
    errorCount: metrics.errorCount,
    category: 'page_performance',
  })
}

/**
 * Track business metrics
 */
export function trackBusinessEvent(
  metric: 'conversion' | 'engagement' | 'retention' | 'revenue',
  data: {
    value?: number
    currency?: string
    source?: string
    campaign?: string
  }
) {
  track(`business_${metric}`, {
    value: data.value,
    currency: data.currency,
    source: data.source,
    campaign: data.campaign,
    category: 'business_metrics',
  })
}

/**
 * Track feature usage and A/B tests
 */
export function trackFeatureEvent(
  feature: string,
  action: 'enabled' | 'used' | 'disabled',
  context?: {
    variant?: string
    experiment?: string
    userId?: string
  }
) {
  track('feature_usage', {
    feature,
    action,
    variant: context?.variant,
    experiment: context?.experiment,
    category: 'feature_tracking',
  })
}

/**
 * Batch track multiple events (for performance)
 */
export function trackBatchEvents(events: Array<{
  event: AnalyticsEvent
  properties?: Record<string, any>
}>) {
  events.forEach(({ event, properties }) => {
    trackEvent(event, properties)
  })
}
