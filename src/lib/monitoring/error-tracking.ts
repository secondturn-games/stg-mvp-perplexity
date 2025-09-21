import * as Sentry from '@sentry/nextjs'

/**
 * Enhanced error tracking utilities with Sentry integration
 * Replaces the basic error tracking with comprehensive Sentry monitoring
 */

/**
 * Initialize error tracking
 * This function is called from the ErrorTrackingProvider
 */
export function initializeErrorTracking() {
  // Sentry is already initialized via config files
  // This function can be used for additional setup if needed
  
  if (typeof window !== 'undefined') {
    // Client-side initialization
    console.log('🔍 Sentry error tracking initialized (client)')
    
    // Set initial context
    Sentry.setTag('component', 'error-tracking')
    Sentry.setTag('platform', 'browser')
    
    // Add initial breadcrumb
    Sentry.addBreadcrumb({
      message: 'Error tracking initialized',
      category: 'system',
      level: 'info',
    })
  } else {
    // Server-side initialization
    console.log('🔍 Sentry error tracking initialized (server)')
  }
}

/**
 * Track page views with enhanced context
 */
export function trackPageView(pathname: string) {
  // Add breadcrumb for page view
  Sentry.addBreadcrumb({
    message: `Page view: ${pathname}`,
    category: 'navigation',
    level: 'info',
    data: {
      pathname,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    },
  })

  // Set current page context
  Sentry.setTag('currentPage', pathname)
}

/**
 * Track user interactions for debugging
 */
export function trackUserInteraction(
  action: string,
  element: string,
  context?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    message: `User interaction: ${action} on ${element}`,
    category: 'user-interaction',
    level: 'info',
    data: {
      action,
      element,
      ...context,
      timestamp: new Date().toISOString(),
    },
  })
}

/**
 * Track business logic errors (non-technical)
 */
export function trackBusinessError(
  errorType: string,
  message: string,
  context?: Record<string, any>
) {
  Sentry.withScope((scope) => {
    scope.setTag('errorType', 'business')
    scope.setTag('businessErrorType', errorType)
    scope.setLevel('warning')
    
    scope.setContext('businessError', {
      type: errorType,
      message,
      ...context,
      timestamp: new Date().toISOString(),
    })

    scope.addBreadcrumb({
      message: `Business error: ${errorType}`,
      category: 'business',
      level: 'warning',
      data: context,
    })

    Sentry.captureMessage(`Business Error: ${message}`, 'warning')
  })
}

/**
 * Track API call errors with detailed context
 */
export function trackApiError(
  endpoint: string,
  method: string,
  statusCode: number,
  error: Error,
  context?: Record<string, any>
) {
  Sentry.withScope((scope) => {
    scope.setTag('errorType', 'api')
    scope.setTag('endpoint', endpoint)
    scope.setTag('method', method)
    scope.setTag('statusCode', statusCode.toString())
    
    scope.setContext('apiError', {
      endpoint,
      method,
      statusCode,
      message: error.message,
      ...context,
      timestamp: new Date().toISOString(),
    })

    scope.addBreadcrumb({
      message: `API error: ${method} ${endpoint}`,
      category: 'api',
      level: 'error',
      data: {
        statusCode,
        ...context,
      },
    })

    Sentry.captureException(error)
  })
}

/**
 * Track form submission errors
 */
export function trackFormError(
  formName: string,
  fieldName: string,
  error: string,
  formData?: Record<string, any>
) {
  Sentry.withScope((scope) => {
    scope.setTag('errorType', 'form')
    scope.setTag('formName', formName)
    scope.setTag('fieldName', fieldName)
    scope.setLevel('warning')
    
    scope.setContext('formError', {
      formName,
      fieldName,
      error,
      // Include form field names but not values for privacy
      formFields: formData ? Object.keys(formData) : [],
      timestamp: new Date().toISOString(),
    })

    scope.addBreadcrumb({
      message: `Form error: ${formName}.${fieldName}`,
      category: 'form',
      level: 'warning',
      data: {
        formName,
        fieldName,
        error,
      },
    })

    Sentry.captureMessage(`Form Error: ${error}`, 'warning')
  })
}

/**
 * Track authentication events
 */
export function trackAuthEvent(
  event: 'signUp' | 'signIn' | 'signOut' | 'passwordReset' | 'emailVerification',
  success: boolean,
  error?: Error,
  context?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    message: `Auth event: ${event} ${success ? 'success' : 'failure'}`,
    category: 'auth',
    level: success ? 'info' : 'warning',
    data: {
      event,
      success,
      ...context,
      timestamp: new Date().toISOString(),
    },
  })

  if (!success && error) {
    Sentry.withScope((scope) => {
      scope.setTag('errorType', 'authentication')
      scope.setTag('authEvent', event)
      scope.setLevel('warning')
      
      scope.setContext('authError', {
        event,
        message: error.message,
        ...context,
        timestamp: new Date().toISOString(),
      })

      Sentry.captureException(error)
    })
  }
}

/**
 * Track performance issues
 */
export function trackPerformanceIssue(
  operation: string,
  duration: number,
  threshold: number,
  context?: Record<string, any>
) {
  if (duration > threshold) {
    Sentry.withScope((scope) => {
      scope.setTag('issueType', 'performance')
      scope.setTag('operation', operation)
      scope.setLevel('warning')
      
      scope.setContext('performance', {
        operation,
        duration,
        threshold,
        ...context,
        timestamp: new Date().toISOString(),
      })

      scope.addBreadcrumb({
        message: `Performance issue: ${operation}`,
        category: 'performance',
        level: 'warning',
        data: {
          duration,
          threshold,
          ...context,
        },
      })

      Sentry.captureMessage(`Performance Issue: ${operation} took ${duration}ms (threshold: ${threshold}ms)`, 'warning')
    })
  }
}

/**
 * Track user feedback and feature usage
 */
export function trackFeatureUsage(
  feature: string,
  action: string,
  context?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    message: `Feature usage: ${feature}.${action}`,
    category: 'feature-usage',
    level: 'info',
    data: {
      feature,
      action,
      ...context,
      timestamp: new Date().toISOString(),
    },
  })
}

/**
 * Manually capture custom errors with context
 */
export function captureCustomError(
  error: Error,
  context: {
    component?: string
    action?: string
    severity?: 'error' | 'warning' | 'info'
    additional?: Record<string, any>
  }
) {
  Sentry.withScope((scope) => {
    scope.setTag('errorType', 'custom')
    
    if (context.component) {
      scope.setTag('component', context.component)
    }
    
    if (context.action) {
      scope.setTag('action', context.action)
    }
    
    scope.setLevel(context.severity || 'error')
    
    if (context.additional) {
      scope.setContext('customError', {
        ...context.additional,
        timestamp: new Date().toISOString(),
      })
    }

    scope.addBreadcrumb({
      message: `Custom error in ${context.component || 'unknown component'}`,
      category: 'custom-error',
      level: context.severity || 'error',
      data: context.additional,
    })

    return Sentry.captureException(error)
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
  
  Sentry.setTag('userType', 'authenticated')
}

/**
 * Clear user context (on sign out)
 */
export function clearUserContext() {
  Sentry.setUser(null)
  Sentry.setTag('userType', 'anonymous')
}

/**
 * Add custom tags for categorization
 */
export function addCustomTags(tags: Record<string, string>) {
  Object.entries(tags).forEach(([key, value]) => {
    Sentry.setTag(key, value)
  })
}

/**
 * Flush Sentry events (useful before page unload)
 */
export async function flushErrorTracking(timeout = 2000) {
  try {
    await Sentry.flush(timeout)
  } catch (error) {
    console.warn('Failed to flush Sentry events:', error)
  }
}