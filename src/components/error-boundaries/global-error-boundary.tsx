'use client'

import React from 'react'
import * as Sentry from '@sentry/nextjs'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  eventId: string | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorFallbackProps {
  error: Error
  resetError: () => void
  eventId: string | null
}

/**
 * Global Error Boundary Component
 * Catches all React errors and reports them to Sentry
 * Provides user-friendly error UI with recovery options
 */
export class GlobalErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 React Error Boundary Caught Error')
      console.error('Error:', error)
      console.error('Error Info:', errorInfo)
      console.error('Component Stack:', errorInfo.componentStack)
      console.groupEnd()
    }

    // Capture error in Sentry with additional context
    Sentry.withScope((scope) => {
      // Add custom context
      scope.setTag('errorBoundary', 'GlobalErrorBoundary')
      scope.setLevel('error')
      
      // Add component stack trace
      scope.setContext('errorInfo', {
        componentStack: errorInfo.componentStack,
      })
      
      // Add user context if available
      scope.setContext('errorDetails', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      })

      // Add breadcrumbs for better debugging
      scope.addBreadcrumb({
        message: 'React Error Boundary triggered',
        category: 'error-boundary',
        level: 'error',
        data: {
          componentStack: errorInfo.componentStack,
        },
      })

      // Capture the error
      const eventId = Sentry.captureException(error)
      
      // Update state with event ID for user reporting
      this.setState({
        errorInfo,
        eventId,
      })
    })

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return (
          <FallbackComponent
            error={this.state.error!}
            resetError={this.resetError}
            eventId={this.state.eventId}
          />
        )
      }

      // Default error UI
      return <DefaultErrorFallback 
        error={this.state.error!} 
        resetError={this.resetError}
        eventId={this.state.eventId}
      />
    }

    return this.props.children
  }
}

/**
 * Default Error Fallback Component
 * Provides a user-friendly error interface with recovery options
 */
function DefaultErrorFallback({ error, resetError, eventId }: ErrorFallbackProps) {
  const handleReportBug = () => {
    // Open user feedback dialog
    if (eventId) {
      Sentry.showReportDialog({ eventId })
    }
  }

  const handleReload = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          {/* Error Icon */}
          <div className='flex justify-center mb-6'>
            <div className='rounded-full bg-red-100 p-3'>
              <AlertTriangle className='h-8 w-8 text-red-600' aria-hidden='true' />
            </div>
          </div>

          {/* Error Message */}
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-gray-900 mb-2'>
              Oops! Something went wrong
            </h1>
            <p className='text-gray-600 mb-6'>
              We encountered an unexpected error. Our team has been notified and will investigate this issue.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <details className='text-left mb-6 p-4 bg-gray-50 rounded-md'>
                <summary className='cursor-pointer font-medium text-gray-700 mb-2'>
                  Error Details (Development)
                </summary>
                <div className='text-sm text-gray-600 space-y-2'>
                  <p><strong>Error:</strong> {error.name}</p>
                  <p><strong>Message:</strong> {error.message}</p>
                  {error.stack && (
                    <div>
                      <strong>Stack Trace:</strong>
                      <pre className='mt-1 text-xs bg-white p-2 rounded border overflow-auto max-h-32'>
                        {error.stack}
                      </pre>
                    </div>
                  )}
                  {eventId && (
                    <p><strong>Event ID:</strong> {eventId}</p>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className='space-y-3'>
              <button
                onClick={resetError}
                className='w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
              >
                <RefreshCw className='h-4 w-4 mr-2' aria-hidden='true' />
                Try Again
              </button>

              <button
                onClick={handleReload}
                className='w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
              >
                <RefreshCw className='h-4 w-4 mr-2' aria-hidden='true' />
                Reload Page
              </button>

              <button
                onClick={handleGoHome}
                className='w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
              >
                <Home className='h-4 w-4 mr-2' aria-hidden='true' />
                Go to Homepage
              </button>

              {eventId && (
                <button
                  onClick={handleReportBug}
                  className='w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
                >
                  <Bug className='h-4 w-4 mr-2' aria-hidden='true' />
                  Report This Issue
                </button>
              )}
            </div>

            {/* Support Information */}
            <div className='mt-6 text-xs text-gray-500'>
              <p>
                If this problem persists, please contact our support team.
                {eventId && (
                  <>
                    <br />
                    Reference ID: <code className='bg-gray-100 px-1 rounded'>{eventId}</code>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Lightweight Error Boundary for specific components
 * Use this for non-critical components that shouldn't crash the whole page
 */
export function ComponentErrorBoundary({ 
  children, 
  fallback = null,
  componentName = 'Component'
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
  componentName?: string
}) {
  return (
    <GlobalErrorBoundary
      onError={(error, errorInfo) => {
        // Log component-specific error
        Sentry.withScope((scope) => {
          scope.setTag('errorBoundary', 'ComponentErrorBoundary')
          scope.setTag('component', componentName)
          scope.setLevel('warning') // Lower severity for component errors
          
          scope.setContext('componentError', {
            componentName,
            componentStack: errorInfo.componentStack,
          })

          Sentry.captureException(error)
        })
      }}
      fallback={fallback ? () => <>{fallback}</> : ({ resetError }) => (
        <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-md'>
          <div className='flex items-center'>
            <AlertTriangle className='h-5 w-5 text-yellow-600 mr-2' aria-hidden='true' />
            <div className='flex-1'>
              <h3 className='text-sm font-medium text-yellow-800'>
                Component Error
              </h3>
              <p className='text-sm text-yellow-700 mt-1'>
                The {componentName} component encountered an error. 
              </p>
            </div>
            <button
              onClick={resetError}
              className='ml-3 text-yellow-600 hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded'
              aria-label='Retry loading component'
            >
              <RefreshCw className='h-4 w-4' />
            </button>
          </div>
        </div>
      )}
    >
      {children}
    </GlobalErrorBoundary>
  )
}

/**
 * Form Error Boundary
 * Specialized error boundary for forms with better UX
 */
export function FormErrorBoundary({ 
  children,
  formName = 'Form'
}: {
  children: React.ReactNode
  formName?: string
}) {
  return (
    <ComponentErrorBoundary
      componentName={`${formName} Form`}
      fallback={
        <div className='p-4 bg-red-50 border border-red-200 rounded-md'>
          <div className='flex items-center'>
            <AlertTriangle className='h-5 w-5 text-red-600 mr-2' aria-hidden='true' />
            <div className='flex-1'>
              <h3 className='text-sm font-medium text-red-800'>
                Form Error
              </h3>
              <p className='text-sm text-red-700 mt-1'>
                The {formName.toLowerCase()} form encountered an error. Please refresh the page and try again.
              </p>
            </div>
          </div>
          <div className='mt-3'>
            <button
              onClick={() => window.location.reload()}
              className='text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors'
            >
              Refresh Page
            </button>
          </div>
        </div>
      }
    >
      {children}
    </ComponentErrorBoundary>
  )
}

/**
 * API Error Boundary
 * Handles errors from API calls and data fetching
 */
export function ApiErrorBoundary({ 
  children,
  apiName = 'API'
}: {
  children: React.ReactNode
  apiName?: string
}) {
  return (
    <ComponentErrorBoundary
      componentName={`${apiName} API`}
      fallback={
        <div className='p-4 bg-blue-50 border border-blue-200 rounded-md'>
          <div className='flex items-center'>
            <AlertTriangle className='h-5 w-5 text-blue-600 mr-2' aria-hidden='true' />
            <div className='flex-1'>
              <h3 className='text-sm font-medium text-blue-800'>
                Connection Error
              </h3>
              <p className='text-sm text-blue-700 mt-1'>
                Unable to load data from {apiName.toLowerCase()}. Please check your connection and try again.
              </p>
            </div>
          </div>
          <div className='mt-3'>
            <button
              onClick={() => window.location.reload()}
              className='text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors'
            >
              Retry
            </button>
          </div>
        </div>
      }
    >
      {children}
    </ComponentErrorBoundary>
  )
}
