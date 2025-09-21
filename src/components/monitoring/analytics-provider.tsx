'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { trackEvent, trackAuthEvent } from '@/lib/monitoring/analytics'
import { log } from '@/lib/monitoring/logflare'
import { useAuth } from '@/lib/hooks/use-auth'

interface AnalyticsContextType {
  trackEvent: typeof trackEvent
  trackPageView: (pageName: string, properties?: Record<string, any>) => void
  trackUserAction: (action: string, properties?: Record<string, any>) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null)

interface AnalyticsProviderProps {
  children: ReactNode
}

/**
 * Analytics Provider
 * Provides analytics tracking context throughout the application
 */
export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  // Track page views
  useEffect(() => {
    const pageName = getPageName(pathname)
    
    trackEvent('page_error', {
      pageName,
      pathname,
      timestamp: new Date().toISOString(),
    })

    log.info('Page view', {
      pageName,
      pathname,
      userId: user?.id,
      authenticated: !!user,
    })
  }, [pathname, user])

  // Track authentication state changes
  useEffect(() => {
    if (user) {
      trackAuthEvent('signed_in', { method: 'email' })
      log.auth('user_session_active', user.id)
    }
  }, [user])

  const trackPageView = (pageName: string, properties?: Record<string, any>) => {
    trackEvent('page_error', {
      pageName,
      pathname,
      ...properties,
    })

    log.info('Custom page view', {
      pageName,
      pathname,
      userId: user?.id,
      ...properties,
    })
  }

  const trackUserAction = (action: string, properties?: Record<string, any>) => {
    trackEvent('user_registered', {
      action,
      pathname,
      userId: user?.id,
      ...properties,
    })

    log.info('User action', {
      action,
      pathname,
      userId: user?.id,
      ...properties,
    })
  }

  const contextValue: AnalyticsContextType = {
    trackEvent,
    trackPageView,
    trackUserAction,
  }

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  )
}

/**
 * Hook to use analytics context
 */
export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}

/**
 * Get friendly page name from pathname
 */
function getPageName(pathname: string): string {
  const routes: Record<string, string> = {
    '/': 'Homepage',
    '/listings': 'Marketplace',
    '/listings/create': 'Create Listing',
    '/auth/sign-in': 'Sign In',
    '/auth/sign-up': 'Sign Up',
    '/auth/forgot-password': 'Forgot Password',
    '/auth/reset-password': 'Reset Password',
    '/auth/verify-email': 'Verify Email',
    '/profile': 'User Profile',
    '/dashboard': 'User Dashboard',
    '/test-sentry': 'Error Testing',
  }

  // Handle dynamic routes
  if (pathname.startsWith('/listings/') && pathname !== '/listings/create') {
    return 'Listing Details'
  }

  return routes[pathname] || 'Unknown Page'
}

/**
 * Higher-order component for automatic page tracking
 */
export function withPageTracking<P extends object>(
  Component: React.ComponentType<P>,
  pageName?: string
) {
  return function TrackedComponent(props: P) {
    const pathname = usePathname()
    const analytics = useAnalytics()

    useEffect(() => {
      const name = pageName || getPageName(pathname)
      analytics.trackPageView(name, {
        component: Component.name,
      })
    }, [pathname, analytics])

    return <Component {...props} />
  }
}
