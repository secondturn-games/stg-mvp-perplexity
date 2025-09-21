/**
 * Next.js Instrumentation File
 * This file is used to integrate monitoring and observability tools
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only run instrumentation in Node.js runtime (not Edge)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Import and initialize Sentry for server-side
    const Sentry = await import('@sentry/nextjs')
    
    Sentry.init({
      dsn: process.env.SENTRY_DSN,

      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: process.env.NODE_ENV === 'development',

      // Environment configuration
      environment: process.env.NODE_ENV || 'development',

      // Release information
      release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',

      // Server-specific configuration
      serverName: process.env.VERCEL_REGION || 'local',

      // Performance monitoring for server
      enableTracing: true,

      // Custom integrations for server-side
      integrations: [
        new Sentry.ProfilingIntegration(),
      ],

      // Filtering options for server
      beforeSend(event, hint) {
        // Filter out known non-critical server errors
        if (event.exception) {
          const error = hint.originalException

          // Filter out common Next.js server errors that aren't actionable
          if (
            error?.message?.includes('ECONNRESET') ||
            error?.message?.includes('socket hang up') ||
            error?.message?.includes('Client network socket disconnected')
          ) {
            return null
          }

          // Filter out Supabase connection timeouts (handle gracefully in app)
          if (
            error?.message?.includes('timeout') &&
            error?.message?.includes('supabase')
          ) {
            // Still log but with lower severity
            event.level = 'warning'
          }
        }

        return event
      },

      // Server context
      initialScope: {
        tags: {
          component: 'server',
          platform: 'node',
        },
      },

      // Additional server configuration
      profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

      // Configure sampling based on transaction name
      tracesSampler: (samplingContext) => {
        const { transactionContext } = samplingContext
        
        // Sample health checks less frequently
        if (transactionContext.name?.includes('/api/health')) {
          return 0.01
        }
        
        // Sample static files less frequently
        if (transactionContext.name?.includes('/_next/static')) {
          return 0.01
        }
        
        // Sample API routes more frequently
        if (transactionContext.name?.includes('/api/')) {
          return process.env.NODE_ENV === 'production' ? 0.5 : 1.0
        }
        
        // Default sampling rate
        return process.env.NODE_ENV === 'production' ? 0.1 : 1.0
      },
    })
  }

  // Edge runtime configuration
  if (process.env.NEXT_RUNTIME === 'edge') {
    const Sentry = await import('@sentry/nextjs')
    
    Sentry.init({
      dsn: process.env.SENTRY_DSN,

      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: process.env.NODE_ENV === 'development',

      // Environment configuration
      environment: process.env.NODE_ENV || 'development',

      // Release information
      release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',

      // Edge runtime specific configuration
      enableTracing: true,

      // Edge context
      initialScope: {
        tags: {
          component: 'edge',
          platform: 'edge-runtime',
        },
      },

      // Filtering for edge runtime
      beforeSend(event, hint) {
        // Filter out edge-specific non-critical errors
        if (event.exception) {
          const error = hint.originalException

          // Filter out edge runtime timeouts
          if (error?.message?.includes('edge timeout')) {
            return null
          }
        }

        return event
      },

      // Minimal integrations for edge runtime
      integrations: [
        // Only include integrations that work in edge runtime
      ],

      // Lower sampling for edge functions
      tracesSampler: (samplingContext) => {
        const { transactionContext } = samplingContext
        
        // Sample middleware less frequently
        if (transactionContext.name?.includes('middleware')) {
          return 0.01
        }
        
        return process.env.NODE_ENV === 'production' ? 0.05 : 1.0
      },
    })
  }
}

// Export required hooks for Next.js error handling
export async function onRequestError(
  error: unknown,
  request: {
    method: string
    url: string
    headers: Record<string, string>
  }
) {
  const Sentry = await import('@sentry/nextjs')
  
  Sentry.withScope((scope) => {
    scope.setTag('errorType', 'requestError')
    scope.setTag('method', request.method)
    
    scope.setContext('request', {
      method: request.method,
      url: request.url,
      headers: request.headers,
    })

    scope.addBreadcrumb({
      message: `Request error: ${request.method} ${request.url}`,
      category: 'request',
      level: 'error',
    })

    Sentry.captureException(error)
  })
}
