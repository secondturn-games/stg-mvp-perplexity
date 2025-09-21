import * as Sentry from '@sentry/nextjs'
import type { NextRequest } from 'next/server'

/**
 * Sentry utilities for consistent error tracking across the application
 */

/**
 * Capture API route errors with enhanced context
 */
export function captureApiError(
  error: Error,
  context: {
    route: string
    method: string
    userId?: string
    requestData?: any
    statusCode?: number
  }
) {
  return Sentry.withScope((scope) => {
    // Set error context
    scope.setTag('errorType', 'api')
    scope.setTag('route', context.route)
    scope.setTag('method', context.method)
    
    if (context.userId) {
      scope.setUser({ id: context.userId })
    }
    
    if (context.statusCode) {
      scope.setTag('statusCode', context.statusCode.toString())
      scope.setLevel(context.statusCode >= 500 ? 'error' : 'warning')
    }

    // Add request context (be careful with sensitive data)
    scope.setContext('apiRequest', {
      route: context.route,
      method: context.method,
      statusCode: context.statusCode,
      timestamp: new Date().toISOString(),
      // Only include non-sensitive request data
      requestDataKeys: context.requestData ? Object.keys(context.requestData) : [],
    })

    // Add breadcrumb
    scope.addBreadcrumb({
      message: `API Error: ${context.method} ${context.route}`,
      category: 'api',
      level: 'error',
      data: {
        route: context.route,
        method: context.method,
        statusCode: context.statusCode,
      },
    })

    return Sentry.captureException(error)
  })
}

/**
 * Capture user action errors (form submissions, interactions)
 */
export function captureUserActionError(
  error: Error,
  context: {
    action: string
    component: string
    userId?: string
    formData?: any
  }
) {
  return Sentry.withScope((scope) => {
    scope.setTag('errorType', 'userAction')
    scope.setTag('action', context.action)
    scope.setTag('component', context.component)
    
    if (context.userId) {
      scope.setUser({ id: context.userId })
    }

    scope.setContext('userAction', {
      action: context.action,
      component: context.component,
      timestamp: new Date().toISOString(),
      // Include form field names but not values for privacy
      formFields: context.formData ? Object.keys(context.formData) : [],
    })

    scope.addBreadcrumb({
      message: `User action error: ${context.action} in ${context.component}`,
      category: 'user-action',
      level: 'error',
      data: {
        action: context.action,
        component: context.component,
      },
    })

    return Sentry.captureException(error)
  })
}

/**
 * Capture authentication errors
 */
export function captureAuthError(
  error: Error,
  context: {
    authAction: 'signUp' | 'signIn' | 'signOut' | 'resetPassword' | 'verifyEmail'
    email?: string
    provider?: string
  }
) {
  return Sentry.withScope((scope) => {
    scope.setTag('errorType', 'authentication')
    scope.setTag('authAction', context.authAction)
    
    if (context.provider) {
      scope.setTag('authProvider', context.provider)
    }

    // Set user context (email only, no sensitive data)
    if (context.email) {
      scope.setUser({ email: context.email })
    }

    scope.setContext('authentication', {
      action: context.authAction,
      provider: context.provider,
      timestamp: new Date().toISOString(),
      // Don't include sensitive auth data
    })

    scope.addBreadcrumb({
      message: `Authentication error: ${context.authAction}`,
      category: 'auth',
      level: 'error',
      data: {
        action: context.authAction,
        provider: context.provider,
      },
    })

    return Sentry.captureException(error)
  })
}

/**
 * Capture external API errors (BGG, Supabase, etc.)
 */
export function captureExternalApiError(
  error: Error,
  context: {
    service: 'bgg' | 'supabase' | 'storage' | 'other'
    operation: string
    endpoint?: string
    statusCode?: number
  }
) {
  return Sentry.withScope((scope) => {
    scope.setTag('errorType', 'externalApi')
    scope.setTag('service', context.service)
    scope.setTag('operation', context.operation)
    
    if (context.statusCode) {
      scope.setTag('statusCode', context.statusCode.toString())
    }

    scope.setContext('externalApi', {
      service: context.service,
      operation: context.operation,
      endpoint: context.endpoint,
      statusCode: context.statusCode,
      timestamp: new Date().toISOString(),
    })

    scope.addBreadcrumb({
      message: `External API error: ${context.service} ${context.operation}`,
      category: 'external-api',
      level: 'warning',
      data: {
        service: context.service,
        operation: context.operation,
        statusCode: context.statusCode,
      },
    })

    return Sentry.captureException(error)
  })
}

/**
 * Capture performance issues
 */
export function capturePerformanceIssue(
  message: string,
  context: {
    operation: string
    duration: number
    threshold: number
    component?: string
  }
) {
  return Sentry.withScope((scope) => {
    scope.setTag('issueType', 'performance')
    scope.setTag('operation', context.operation)
    scope.setLevel('warning')

    scope.setContext('performance', {
      operation: context.operation,
      duration: context.duration,
      threshold: context.threshold,
      component: context.component,
      timestamp: new Date().toISOString(),
    })

    scope.addBreadcrumb({
      message: `Performance issue: ${context.operation}`,
      category: 'performance',
      level: 'warning',
      data: {
        duration: context.duration,
        threshold: context.threshold,
      },
    })

    return Sentry.captureMessage(message, 'warning')
  })
}

/**
 * Add custom breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  category: string,
  data?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level: 'info',
    timestamp: Date.now() / 1000,
    data,
  })
}

/**
 * Set user context for error tracking
 */
export function setUserContext(user: {
  id: string
  email: string
  name?: string
}) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  })
}

/**
 * Clear user context (on sign out)
 */
export function clearUserContext() {
  Sentry.setUser(null)
}

/**
 * Wrapper for API route handlers with automatic error capturing
 */
export function withSentryApiHandler<T extends (...args: any[]) => any>(
  handler: T,
  options: {
    route: string
    method: string
  }
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args)
    } catch (error) {
      // Extract request information if available
      const request = args[0] as NextRequest | undefined
      const method = request?.method || options.method
      const url = request?.url || options.route

      captureApiError(error as Error, {
        route: options.route,
        method,
        statusCode: 500,
      })

      // Re-throw the error to maintain normal error handling
      throw error
    }
  }) as T
}

/**
 * Track custom events for analytics
 */
export function trackCustomEvent(
  eventName: string,
  properties?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    message: `Custom event: ${eventName}`,
    category: 'custom-event',
    level: 'info',
    data: properties,
  })

  // Also capture as a message for tracking
  Sentry.captureMessage(`Event: ${eventName}`, 'info')
}
