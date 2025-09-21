'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import * as Sentry from '@sentry/nextjs'
import { initializeErrorTracking, trackPageView } from '@/lib/monitoring/error-tracking'
import { useAuth } from '@/lib/hooks/use-auth'

interface ErrorTrackingProviderProps {
  children: React.ReactNode
}

export function ErrorTrackingProvider({ children }: ErrorTrackingProviderProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  useEffect(() => {
    // Initialize error tracking on mount
    initializeErrorTracking()
    
    // Configure Sentry user context
    Sentry.setTag('app', 'second-turn-games')
    Sentry.setTag('platform', 'web')
    
    // Add deployment context
    if (process.env.VERCEL_ENV) {
      Sentry.setTag('deployment', process.env.VERCEL_ENV)
      Sentry.setTag('region', process.env.VERCEL_REGION || 'unknown')
    }
  }, [])

  useEffect(() => {
    // Update user context in Sentry when user changes
    if (user) {
      Sentry.setUser({
        id: user.id,
        email: user.email,
      })
      Sentry.setTag('authenticated', 'true')
    } else {
      Sentry.setUser(null)
      Sentry.setTag('authenticated', 'false')
    }
  }, [user])

  useEffect(() => {
    // Track page views for both custom tracking and Sentry
    trackPageView(pathname)
    
    // Add breadcrumb for navigation
    Sentry.addBreadcrumb({
      message: `Navigated to ${pathname}`,
      category: 'navigation',
      level: 'info',
      data: {
        pathname,
        timestamp: new Date().toISOString(),
      },
    })
  }, [pathname])

  // Global error handler for unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
      
      Sentry.withScope((scope) => {
        scope.setTag('errorType', 'unhandledRejection')
        scope.setLevel('error')
        scope.setContext('promiseRejection', {
          reason: event.reason,
          pathname,
        })
        
        Sentry.captureException(event.reason)
      })
    }

    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error)
      
      Sentry.withScope((scope) => {
        scope.setTag('errorType', 'globalError')
        scope.setLevel('error')
        scope.setContext('globalError', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          pathname,
        })
        
        Sentry.captureException(event.error || new Error(event.message))
      })
    }

    // Add global error listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    // Cleanup listeners
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [pathname])

  return <>{children}</>
}
