/**
 * Error tracking and monitoring for production environment
 */

export interface ErrorReport {
  message: string
  stack?: string
  url: string
  userAgent: string
  userId?: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high' | 'critical'
  context?: Record<string, any>
}

export interface PerformanceReport {
  metric: string
  value: number
  url: string
  timestamp: Date
  userId?: string
  device: 'mobile' | 'tablet' | 'desktop'
  connection: string
}

class ErrorTracker {
  private isProduction = process.env.NODE_ENV === 'production'
  private siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  /**
   * Report JavaScript errors
   */
  reportError(error: Error, context?: Record<string, any>, severity: ErrorReport['severity'] = 'medium') {
    const report: ErrorReport = {
      message: error.message,
      stack: error.stack,
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      timestamp: new Date(),
      severity,
      context
    }

    this.sendErrorReport(report)
  }

  /**
   * Report API errors
   */
  reportAPIError(
    endpoint: string, 
    status: number, 
    message: string, 
    userId?: string,
    context?: Record<string, any>
  ) {
    const severity: ErrorReport['severity'] = status >= 500 ? 'high' : 'medium'
    
    const report: ErrorReport = {
      message: `API Error: ${endpoint} - ${status} - ${message}`,
      url: endpoint,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      userId,
      timestamp: new Date(),
      severity,
      context: {
        status,
        endpoint,
        ...context
      }
    }

    this.sendErrorReport(report)
  }

  /**
   * Report performance metrics
   */
  reportPerformance(metric: string, value: number, context?: Record<string, any>) {
    if (!this.isProduction) return

    const report: PerformanceReport = {
      metric,
      value,
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      timestamp: new Date(),
      device: this.getDeviceType(),
      connection: this.getConnectionType(),
      ...context
    }

    this.sendPerformanceReport(report)
  }

  /**
   * Report security events
   */
  reportSecurityEvent(
    event: string,
    severity: ErrorReport['severity'] = 'high',
    context?: Record<string, any>
  ) {
    const report: ErrorReport = {
      message: `Security Event: ${event}`,
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      timestamp: new Date(),
      severity,
      context
    }

    this.sendErrorReport(report)
  }

  private sendErrorReport(report: ErrorReport) {
    if (this.isProduction) {
      // In production, send to your error tracking service
      this.sendToErrorService(report)
    } else {
      // In development, log to console
      console.error('Error Report:', report)
    }
  }

  private sendPerformanceReport(report: PerformanceReport) {
    if (this.isProduction) {
      // In production, send to your analytics service
      this.sendToAnalyticsService(report)
    } else {
      // In development, log to console
      console.log('Performance Report:', report)
    }
  }

  private async sendToErrorService(report: ErrorReport) {
    try {
      // Example: Send to Sentry, LogRocket, or custom service
      if (process.env.SENTRY_DSN) {
        // Sentry integration would go here
        console.log('Would send to Sentry:', report)
      } else {
        // Fallback: Send to custom endpoint
        await fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(report)
        })
      }
    } catch (error) {
      console.error('Failed to send error report:', error)
    }
  }

  private async sendToAnalyticsService(report: PerformanceReport) {
    try {
      // Example: Send to Vercel Analytics, Google Analytics, or custom service
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      })
    } catch (error) {
      console.error('Failed to send performance report:', error)
    }
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop'
    
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  private getConnectionType(): string {
    if (typeof navigator === 'undefined') return 'unknown'
    
    const connection = (navigator as any).connection
    return connection?.effectiveType || 'unknown'
  }
}

// Singleton instance
export const errorTracker = new ErrorTracker()

/**
 * Initialize error tracking for the application
 */
export function initializeErrorTracking() {
  if (typeof window === 'undefined') return

  // Global error handler
  window.addEventListener('error', (event) => {
    errorTracker.reportError(
      new Error(event.message),
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      },
      'high'
    )
  })

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    errorTracker.reportError(
      new Error(`Unhandled Promise Rejection: ${event.reason}`),
      { reason: event.reason },
      'high'
    )
  })

  // Performance monitoring
  if ('PerformanceObserver' in window) {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          errorTracker.reportPerformance('FCP', entry.startTime)
        }
      }
    })
    
    try {
      observer.observe({ entryTypes: ['paint'] })
    } catch (error) {
      console.warn('Performance monitoring not supported:', error)
    }
  }
}

/**
 * Track user actions for analytics
 */
export function trackUserAction(action: string, properties?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics service
    errorTracker.reportPerformance(
      `user_action_${action}`,
      1,
      { action, properties }
    )
  }
}

/**
 * Track page views
 */
export function trackPageView(path: string, userId?: string) {
  if (process.env.NODE_ENV === 'production') {
    errorTracker.reportPerformance(
      'page_view',
      1,
      { path, userId }
    )
  }
}
