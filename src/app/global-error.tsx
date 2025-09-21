'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

/**
 * Global Error Page
 * Catches errors that occur outside of the normal React component tree
 * This includes errors in the root layout and other critical failures
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Capture global error in Sentry
    Sentry.withScope((scope) => {
      scope.setTag('errorBoundary', 'GlobalError')
      scope.setTag('errorType', 'global')
      scope.setLevel('error')
      
      // Add error context
      scope.setContext('globalError', {
        name: error.name,
        message: error.message,
        digest: error.digest,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      })

      // Add breadcrumb
      scope.addBreadcrumb({
        message: 'Global error occurred',
        category: 'error',
        level: 'error',
        data: {
          errorName: error.name,
          errorMessage: error.message,
          digest: error.digest,
        },
      })

      Sentry.captureException(error)
    })
  }, [error])

  const handleReportIssue = () => {
    Sentry.showReportDialog({
      title: 'Report Application Error',
      subtitle: 'Help us improve by reporting this critical error',
    })
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  const handleReload = () => {
    window.location.reload()
  }

  return (
    <html>
      <body>
        <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
          <div className='sm:mx-auto sm:w-full sm:max-w-md'>
            <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
              {/* Error Icon */}
              <div className='flex justify-center mb-6'>
                <div className='rounded-full bg-red-100 p-4'>
                  <AlertTriangle className='h-10 w-10 text-red-600' aria-hidden='true' />
                </div>
              </div>

              {/* Error Content */}
              <div className='text-center'>
                <h1 className='text-2xl font-bold text-gray-900 mb-3'>
                  Application Error
                </h1>
                
                <p className='text-gray-600 mb-6'>
                  A critical error occurred that prevented the application from working properly. 
                  Our team has been automatically notified and will investigate this issue.
                </p>

                {/* Development Error Details */}
                {process.env.NODE_ENV === 'development' && (
                  <details className='text-left mb-6 p-4 bg-gray-50 rounded-md'>
                    <summary className='cursor-pointer font-medium text-gray-700 mb-2'>
                      Error Details (Development)
                    </summary>
                    <div className='text-sm text-gray-600 space-y-2'>
                      <p><strong>Error:</strong> {error.name}</p>
                      <p><strong>Message:</strong> {error.message}</p>
                      {error.digest && <p><strong>Digest:</strong> {error.digest}</p>}
                      {error.stack && (
                        <div>
                          <strong>Stack Trace:</strong>
                          <pre className='mt-1 text-xs bg-white p-2 rounded border overflow-auto max-h-32'>
                            {error.stack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}

                {/* Action Buttons */}
                <div className='space-y-3'>
                  <button
                    onClick={reset}
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
                    Reload Application
                  </button>

                  <button
                    onClick={handleGoHome}
                    className='w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
                  >
                    <Home className='h-4 w-4 mr-2' aria-hidden='true' />
                    Go to Homepage
                  </button>

                  <button
                    onClick={handleReportIssue}
                    className='w-full text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded transition-colors'
                  >
                    Report this issue to help us improve
                  </button>
                </div>

                {/* Support Information */}
                <div className='mt-6 text-xs text-gray-500'>
                  <p>
                    If this problem persists, please contact our support team.
                    {error.digest && (
                      <>
                        <br />
                        Error ID: <code className='bg-gray-100 px-1 rounded'>{error.digest}</code>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
