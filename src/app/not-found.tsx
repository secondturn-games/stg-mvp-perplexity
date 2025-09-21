import * as Sentry from '@sentry/nextjs'
import Link from 'next/link'
import { Search, Home, ArrowLeft } from 'lucide-react'

/**
 * Custom 404 Not Found Page
 * Tracks 404 errors in Sentry for monitoring broken links
 */
export default function NotFound() {
  // Track 404 error in Sentry
  Sentry.addBreadcrumb({
    message: '404 page accessed',
    category: 'navigation',
    level: 'info',
    data: {
      timestamp: new Date().toISOString(),
    },
  })

  // Capture 404 as a message (not an exception since it's expected behavior)
  Sentry.captureMessage('404 Page Not Found', 'info')

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          {/* 404 Icon */}
          <div className='flex justify-center mb-6'>
            <div className='rounded-full bg-blue-100 p-4'>
              <Search className='h-10 w-10 text-blue-600' aria-hidden='true' />
            </div>
          </div>

          {/* 404 Content */}
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              404
            </h1>
            <h2 className='text-xl font-semibold text-gray-700 mb-3'>
              Page Not Found
            </h2>
            
            <p className='text-gray-600 mb-6'>
              Sorry, we couldn't find the page you're looking for. 
              The page might have been moved, deleted, or you might have mistyped the URL.
            </p>

            {/* Navigation Options */}
            <div className='space-y-3'>
              <Link
                href='/'
                className='w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
              >
                <Home className='h-4 w-4 mr-2' aria-hidden='true' />
                Go to Homepage
              </Link>

              <Link
                href='/listings'
                className='w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
              >
                <Search className='h-4 w-4 mr-2' aria-hidden='true' />
                Browse Marketplace
              </Link>

              <button
                onClick={() => window.history.back()}
                className='w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
              >
                <ArrowLeft className='h-4 w-4 mr-2' aria-hidden='true' />
                Go Back
              </button>
            </div>

            {/* Help Text */}
            <div className='mt-6 text-xs text-gray-500'>
              <p>
                If you believe this is an error, please contact our support team.
                We've been notified about this 404 error for investigation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
