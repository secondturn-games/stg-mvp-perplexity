'use client'

import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title: string
  message: string
  icon?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

// Generic error state component
export function ErrorState({ 
  title, 
  message, 
  icon, 
  actions, 
  className 
}: ErrorStateProps) {
  return (
    <div className={cn('text-center py-8', className)}>
      <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100'>
        {icon || (
          <svg className='h-6 w-6 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' />
          </svg>
        )}
      </div>
      <h3 className='mb-2 text-lg font-medium text-gray-900'>{title}</h3>
      <p className='mb-4 text-gray-600 max-w-md mx-auto'>{message}</p>
      {actions}
    </div>
  )
}

// Network error component
export function NetworkError({ onRetry, className }: { onRetry?: () => void, className?: string }) {
  return (
    <ErrorState
      title="Connection Problem"
      message="Unable to connect to the server. Please check your internet connection and try again."
      icon={
        <svg className='h-6 w-6 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0' />
        </svg>
      }
      className={className}
      actions={onRetry && (
        <button
          onClick={onRetry}
          className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors'
        >
          <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
          </svg>
          Try Again
        </button>
      )}
    />
  )
}

// Server error component  
export function ServerError({ onRetry, className }: { onRetry?: () => void, className?: string }) {
  return (
    <ErrorState
      title="Server Error"
      message="Something went wrong on our end. We're working to fix this issue. Please try again in a moment."
      icon={
        <svg className='h-6 w-6 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01' />
        </svg>
      }
      className={className}
      actions={onRetry && (
        <button
          onClick={onRetry}
          className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors'
        >
          <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
          </svg>
          Try Again
        </button>
      )}
    />
  )
}

// BGG API specific error
export function BggApiError({ onRetry, className }: { onRetry?: () => void, className?: string }) {
  return (
    <ErrorState
      title="BoardGameGeek Unavailable"
      message="We're having trouble connecting to BoardGameGeek. This might be temporary. Please try searching again."
      icon={
        <svg className='h-6 w-6 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01' />
        </svg>
      }
      className={className}
      actions={onRetry && (
        <button
          onClick={onRetry}
          className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors'
        >
          <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
          </svg>
          Try Again
        </button>
      )}
    />
  )
}

// Image upload error
export function ImageUploadError({ 
  message, 
  onRetry, 
  className 
}: { 
  message: string
  onRetry?: () => void
  className?: string 
}) {
  return (
    <ErrorState
      title="Upload Failed"
      message={message}
      icon={
        <svg className='h-6 w-6 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
        </svg>
      }
      className={className}
      actions={onRetry && (
        <button
          onClick={onRetry}
          className='inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
        >
          <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
          </svg>
          Retry Upload
        </button>
      )}
    />
  )
}

// Form validation error alert
export function FormError({ message, className }: { message: string, className?: string }) {
  return (
    <div className={cn('rounded-lg bg-red-50 p-4 border border-red-200', className)}>
      <div className='flex'>
        <div className='flex-shrink-0'>
          <svg className='h-5 w-5 text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' />
          </svg>
        </div>
        <div className='ml-3'>
          <p className='text-sm text-red-800'>{message}</p>
        </div>
      </div>
    </div>
  )
}

// Success alert
export function SuccessAlert({ message, className }: { message: string, className?: string }) {
  return (
    <div className={cn('rounded-lg bg-green-50 p-4 border border-green-200', className)}>
      <div className='flex'>
        <div className='flex-shrink-0'>
          <svg className='h-5 w-5 text-green-400' viewBox='0 0 20 20' fill='currentColor'>
            <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
          </svg>
        </div>
        <div className='ml-3'>
          <p className='text-sm text-green-800'>{message}</p>
        </div>
      </div>
    </div>
  )
}

// Warning alert
export function WarningAlert({ message, className }: { message: string, className?: string }) {
  return (
    <div className={cn('rounded-lg bg-yellow-50 p-4 border border-yellow-200', className)}>
      <div className='flex'>
        <div className='flex-shrink-0'>
          <svg className='h-5 w-5 text-yellow-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' />
          </svg>
        </div>
        <div className='ml-3'>
          <p className='text-sm text-yellow-800'>{message}</p>
        </div>
      </div>
    </div>
  )
}

// No results state
export function NoResults({ 
  title = "No results found",
  message,
  icon,
  actions,
  className 
}: {
  title?: string
  message: string
  icon?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('text-center py-12', className)}>
      <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
        {icon || (
          <svg className='h-8 w-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
          </svg>
        )}
      </div>
      <h3 className='mb-2 text-lg font-medium text-gray-900'>{title}</h3>
      <p className='mb-6 text-gray-600 max-w-md mx-auto'>{message}</p>
      {actions}
    </div>
  )
}

// Retry button component
export function RetryButton({ 
  onRetry, 
  loading = false, 
  className,
  children = "Try Again"
}: {
  onRetry: () => void
  loading?: boolean
  className?: string
  children?: React.ReactNode
}) {
  return (
    <button
      onClick={onRetry}
      disabled={loading}
      className={cn(
        'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
        className
      )}
    >
      {loading ? (
        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
      ) : (
        <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
        </svg>
      )}
      {children}
    </button>
  )
}