'use client'

import React from 'react'
import * as Sentry from '@sentry/nextjs'
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ListingErrorBoundaryState {
  hasError: boolean
  error: Error | null
  eventId: string | null
}

interface ListingErrorBoundaryProps {
  children: React.ReactNode
  listingId?: string
  listingName?: string
}

/**
 * Listing-specific Error Boundary
 * Handles errors in listing components with contextual information
 */
export class ListingErrorBoundary extends React.Component<
  ListingErrorBoundaryProps,
  ListingErrorBoundaryState
> {
  constructor(props: ListingErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      eventId: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ListingErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Capture listing-specific error context
    Sentry.withScope((scope) => {
      scope.setTag('errorBoundary', 'ListingErrorBoundary')
      scope.setTag('feature', 'listings')
      
      // Add listing context if available
      if (this.props.listingId) {
        scope.setTag('listingId', this.props.listingId)
        scope.setContext('listing', {
          id: this.props.listingId,
          name: this.props.listingName,
        })
      }

      scope.setContext('errorInfo', {
        componentStack: errorInfo.componentStack,
      })

      scope.addBreadcrumb({
        message: 'Listing component error',
        category: 'listing',
        level: 'error',
        data: {
          listingId: this.props.listingId,
          listingName: this.props.listingName,
        },
      })

      const eventId = Sentry.captureException(error)
      this.setState({ eventId })
    })
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      eventId: null,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <ListingErrorFallback
          error={this.state.error!}
          resetError={this.resetError}
          eventId={this.state.eventId}
          listingId={this.props.listingId}
          listingName={this.props.listingName}
        />
      )
    }

    return this.props.children
  }
}

function ListingErrorFallback({
  error,
  resetError,
  eventId,
  listingId,
  listingName,
}: {
  error: Error
  resetError: () => void
  eventId: string | null
  listingId?: string
  listingName?: string
}) {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  const handleGoToMarketplace = () => {
    router.push('/listings')
  }

  const handleReportIssue = () => {
    if (eventId) {
      Sentry.showReportDialog({ 
        eventId,
        title: 'Report Listing Issue',
        subtitle: `Help us fix this issue with ${listingName || 'this listing'}`
      })
    }
  }

  return (
    <div className='max-w-md mx-auto mt-8'>
      <div className='bg-white shadow-lg rounded-lg p-6'>
        {/* Error Icon */}
        <div className='flex justify-center mb-4'>
          <div className='rounded-full bg-red-100 p-3'>
            <AlertCircle className='h-6 w-6 text-red-600' aria-hidden='true' />
          </div>
        </div>

        {/* Error Content */}
        <div className='text-center'>
          <h2 className='text-lg font-semibold text-gray-900 mb-2'>
            Unable to Load Listing
          </h2>
          
          {listingName ? (
            <p className='text-gray-600 mb-4'>
              We encountered an error while loading <strong>{listingName}</strong>. 
              This issue has been reported to our team.
            </p>
          ) : (
            <p className='text-gray-600 mb-4'>
              We encountered an error while loading this listing. 
              This issue has been reported to our team.
            </p>
          )}

          {/* Development Error Details */}
          {process.env.NODE_ENV === 'development' && (
            <details className='text-left mb-4 p-3 bg-gray-50 rounded text-sm'>
              <summary className='cursor-pointer font-medium'>
                Technical Details
              </summary>
              <div className='mt-2 space-y-1'>
                <p><strong>Error:</strong> {error.message}</p>
                {listingId && <p><strong>Listing ID:</strong> {listingId}</p>}
                {eventId && <p><strong>Sentry Event:</strong> {eventId}</p>}
              </div>
            </details>
          )}

          {/* Action Buttons */}
          <div className='space-y-2'>
            <button
              onClick={resetError}
              className='w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'
            >
              <RefreshCw className='h-4 w-4 mr-2' aria-hidden='true' />
              Try Again
            </button>

            <div className='flex space-x-2'>
              <button
                onClick={handleGoBack}
                className='flex-1 flex justify-center items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors'
              >
                <ArrowLeft className='h-4 w-4 mr-1' aria-hidden='true' />
                Go Back
              </button>

              <button
                onClick={handleGoToMarketplace}
                className='flex-1 flex justify-center items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors'
              >
                Browse All
              </button>
            </div>

            {eventId && (
              <button
                onClick={handleReportIssue}
                className='w-full text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded transition-colors'
              >
                Report this issue to help us improve
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
