'use client'

import React from 'react'
import * as Sentry from '@sentry/nextjs'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { trackFormError } from '@/lib/monitoring/error-tracking'

interface FormErrorBoundaryState {
  hasError: boolean
  error: Error | null
  eventId: string | null
}

interface FormErrorBoundaryProps {
  children: React.ReactNode
  formName: string
  onReset?: () => void
}

/**
 * Form-specific Error Boundary
 * Provides better UX for form errors with retry mechanisms
 */
export class FormErrorBoundary extends React.Component<
  FormErrorBoundaryProps,
  FormErrorBoundaryState
> {
  constructor(props: FormErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      eventId: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<FormErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Track form error with context
    trackFormError(
      this.props.formName,
      'component',
      error.message,
      {
        componentStack: errorInfo.componentStack,
      }
    )

    // Capture in Sentry with form-specific context
    const eventId = Sentry.withScope((scope) => {
      scope.setTag('errorBoundary', 'FormErrorBoundary')
      scope.setTag('formName', this.props.formName)
      scope.setLevel('error')
      
      scope.setContext('formError', {
        formName: this.props.formName,
        componentStack: errorInfo.componentStack,
      })

      scope.addBreadcrumb({
        message: `Form error in ${this.props.formName}`,
        category: 'form',
        level: 'error',
        data: {
          formName: this.props.formName,
        },
      })

      return Sentry.captureException(error)
    })

    this.setState({ eventId })
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      eventId: null,
    })
    
    // Call custom reset handler if provided
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      return (
        <FormErrorFallback
          formName={this.props.formName}
          error={this.state.error!}
          resetError={this.resetError}
          eventId={this.state.eventId}
        />
      )
    }

    return this.props.children
  }
}

function FormErrorFallback({
  formName,
  error,
  resetError,
  eventId,
}: {
  formName: string
  error: Error
  resetError: () => void
  eventId: string | null
}) {
  const handleReportIssue = () => {
    if (eventId) {
      Sentry.showReportDialog({
        eventId,
        title: 'Report Form Issue',
        subtitle: `Help us fix this issue with the ${formName.toLowerCase()} form`,
      })
    }
  }

  return (
    <div className='p-6 bg-red-50 border border-red-200 rounded-lg'>
      <div className='flex items-start'>
        <div className='flex-shrink-0'>
          <AlertTriangle className='h-6 w-6 text-red-600' aria-hidden='true' />
        </div>
        
        <div className='ml-3 flex-1'>
          <h3 className='text-lg font-medium text-red-800'>
            {formName} Error
          </h3>
          
          <p className='mt-2 text-sm text-red-700'>
            We encountered an error while processing the {formName.toLowerCase()} form. 
            This issue has been automatically reported to our team.
          </p>

          {/* Development Error Details */}
          {process.env.NODE_ENV === 'development' && (
            <details className='mt-3 text-sm'>
              <summary className='cursor-pointer font-medium text-red-800'>
                Technical Details (Development)
              </summary>
              <div className='mt-2 p-3 bg-red-100 rounded text-xs'>
                <p><strong>Error:</strong> {error.name}</p>
                <p><strong>Message:</strong> {error.message}</p>
                {eventId && <p><strong>Sentry Event ID:</strong> {eventId}</p>}
                {error.stack && (
                  <div className='mt-2'>
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
          <div className='mt-4 flex flex-col sm:flex-row gap-2'>
            <button
              onClick={resetError}
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors'
            >
              <RefreshCw className='h-4 w-4 mr-2' aria-hidden='true' />
              Try Again
            </button>

            <button
              onClick={() => window.location.reload()}
              className='inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors'
            >
              Reload Page
            </button>

            {eventId && (
              <button
                onClick={handleReportIssue}
                className='inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors'
              >
                Report Issue
              </button>
            )}
          </div>

          {/* Help Text */}
          <div className='mt-4 text-xs text-red-600'>
            <p>
              If this problem continues, please try refreshing the page or contact our support team.
              {eventId && (
                <>
                  <br />
                  Error Reference: <code className='bg-red-100 px-1 rounded'>{eventId}</code>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
