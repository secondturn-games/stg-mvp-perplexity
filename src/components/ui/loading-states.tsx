'use client'

import { cn } from '@/lib/utils'

// Spinner component with different sizes
export function Spinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  }

  return (
    <div 
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Inline loading state for buttons
export function ButtonSpinner({ className }: { className?: string }) {
  return (
    <Spinner 
      size="sm" 
      className={cn('mr-2', className)} 
    />
  )
}

// Full page loading state
export function PageLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50'>
      <div className='text-center'>
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className='text-gray-600 font-medium'>{message}</p>
      </div>
    </div>
  )
}

// Section loading state (for parts of pages)
export function SectionLoading({ 
  message = 'Loading...', 
  className,
  size = 'md'
}: { 
  message?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  return (
    <div className={cn('flex items-center justify-center py-8', className)}>
      <div className='text-center'>
        <Spinner size={size} className="mx-auto mb-2" />
        <p className='text-gray-600 text-sm'>{message}</p>
      </div>
    </div>
  )
}

// Skeleton loading for cards/lists
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 animate-pulse', className)}>
      <div className='aspect-[4/3] bg-gray-200 rounded-t-lg' />
      <div className='p-4 space-y-3'>
        <div className='h-6 bg-gray-200 rounded w-3/4' />
        <div className='h-8 bg-gray-200 rounded w-1/3' />
        <div className='flex justify-between'>
          <div className='h-4 bg-gray-200 rounded w-1/4' />
          <div className='h-4 bg-gray-200 rounded w-1/4' />
        </div>
        <div className='space-y-2'>
          <div className='h-4 bg-gray-200 rounded w-full' />
          <div className='h-4 bg-gray-200 rounded w-2/3' />
        </div>
        <div className='h-3 bg-gray-200 rounded w-1/3' />
      </div>
    </div>
  )
}

// Skeleton for text content
export function SkeletonText({ 
  lines = 3, 
  className 
}: { 
  lines?: number
  className?: string 
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i}
          className={cn(
            'h-4 bg-gray-200 rounded animate-pulse',
            i === lines - 1 ? 'w-2/3' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

// Loading overlay for forms/modals
export function LoadingOverlay({ 
  isVisible, 
  message = 'Processing...' 
}: { 
  isVisible: boolean
  message?: string 
}) {
  if (!isVisible) return null

  return (
    <div className='absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg'>
      <div className='text-center'>
        <Spinner size="lg" className="mx-auto mb-2" />
        <p className='text-gray-700 font-medium'>{message}</p>
      </div>
    </div>
  )
}

// Progress bar for uploads/long operations
export function ProgressBar({ 
  progress, 
  className,
  showPercentage = true 
}: { 
  progress: number
  className?: string
  showPercentage?: boolean 
}) {
  return (
    <div className={cn('w-full', className)}>
      <div className='flex justify-between items-center mb-1'>
        {showPercentage && (
          <span className='text-sm text-gray-600'>{Math.round(progress)}%</span>
        )}
      </div>
      <div className='w-full bg-gray-200 rounded-full h-2'>
        <div 
          className='bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out'
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  )
}
