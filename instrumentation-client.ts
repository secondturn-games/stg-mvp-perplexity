/**
 * Client-side Instrumentation File
 * This file configures the initialization of Sentry on the browser side.
 * The config you add here will be used whenever a users loads a page in their browser.
 * https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === 'development',

  // Environment configuration
  environment: process.env.NODE_ENV || 'development',

  // Release information
  release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',

  // Capture unhandled promise rejections
  captureUnhandledRejections: true,

  // Performance monitoring
  enableTracing: true,

  // Session replay for debugging (be mindful of privacy)
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.01 : 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Filtering options
  beforeSend(event, hint) {
    // Filter out known non-critical errors
    if (event.exception) {
      const error = hint.originalException
      
      // Filter out Next.js hydration errors (common and usually not critical)
      if (
        error?.message?.includes('Hydration failed') ||
        error?.message?.includes('Text content does not match server-rendered HTML') ||
        error?.message?.includes('There was an error while hydrating')
      ) {
        return null
      }

      // Filter out ResizeObserver errors (browser quirks)
      if (error?.message?.includes('ResizeObserver loop limit exceeded')) {
        return null
      }

      // Filter out network errors that might be user-related
      if (error?.message?.includes('NetworkError') && !error?.message?.includes('500')) {
        return null
      }
    }

    return event
  },

  // User context
  initialScope: {
    tags: {
      component: 'client',
      platform: 'browser',
    },
  },

  // Additional options for production
  ...(process.env.NODE_ENV === 'production' && {
    // Enable source maps upload in production
    enableSourceMaps: true,
    
    // Configure allowed URLs for better security
    allowUrls: [
      /https:\/\/secondturngames\.lv/,
      /https:\/\/.*\.vercel\.app/,
    ],
  }),
})

// Export required hooks for Next.js App Router
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
