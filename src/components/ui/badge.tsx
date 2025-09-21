import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Badge Component Variants
 * Uses the custom Tailwind utility classes defined in globals.css
 */

export interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

/**
 * Badge Component
 * Displays status indicators and labels with brand colors
 */
export function Badge({
  variant = 'neutral',
  size = 'md',
  children,
  className,
  icon,
}: BadgeProps) {
  const baseClasses = getBadgeClasses(variant, size)
  
  return (
    <span className={cn(baseClasses, className)}>
      {icon && (
        <span className="mr-1" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  )
}

/**
 * Warning Badge - Warm Yellow
 */
export function WarningBadge(props: Omit<BadgeProps, 'variant'>) {
  return <Badge variant="warning" {...props} />
}

/**
 * Success Badge - Teal
 */
export function SuccessBadge(props: Omit<BadgeProps, 'variant'>) {
  return <Badge variant="success" {...props} />
}

/**
 * Error Badge - Coral
 */
export function ErrorBadge(props: Omit<BadgeProps, 'variant'>) {
  return <Badge variant="error" {...props} />
}

/**
 * Info Badge - Lavender
 */
export function InfoBadge(props: Omit<BadgeProps, 'variant'>) {
  return <Badge variant="info" {...props} />
}

/**
 * Neutral Badge - Gray
 */
export function NeutralBadge(props: Omit<BadgeProps, 'variant'>) {
  return <Badge variant="neutral" {...props} />
}

/**
 * Get badge classes based on variant and size
 */
function getBadgeClasses(variant: BadgeProps['variant'], size: BadgeProps['size']): string {
  const variantClasses = {
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
    neutral: 'badge-neutral',
  }

  const sizeClasses = {
    sm: '',
    md: '',
    lg: 'badge-lg',
  }

  return cn(
    variantClasses[variant || 'neutral'],
    sizeClasses[size || 'md']
  )
}

/**
 * Status Badge Component
 * For displaying status with predefined colors and icons
 */
export interface StatusBadgeProps extends Omit<BadgeProps, 'variant' | 'icon'> {
  status: 'online' | 'offline' | 'pending' | 'active' | 'inactive' | 'new' | 'featured'
}

export function StatusBadge({ status, ...props }: StatusBadgeProps) {
  const statusConfig = {
    online: {
      variant: 'success' as const,
      icon: (
        <div className="w-2 h-2 bg-current rounded-full" />
      ),
      label: 'Online'
    },
    offline: {
      variant: 'neutral' as const,
      icon: (
        <div className="w-2 h-2 bg-current rounded-full opacity-50" />
      ),
      label: 'Offline'
    },
    pending: {
      variant: 'warning' as const,
      icon: (
        <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
      ),
      label: 'Pending'
    },
    active: {
      variant: 'success' as const,
      icon: (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      label: 'Active'
    },
    inactive: {
      variant: 'neutral' as const,
      icon: (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
      label: 'Inactive'
    },
    new: {
      variant: 'info' as const,
      icon: (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
      label: 'New'
    },
    featured: {
      variant: 'warning' as const,
      icon: (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
      label: 'Featured'
    }
  }

  const config = statusConfig[status]

  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      {...props}
    >
      {config.label}
    </Badge>
  )
}

/**
 * Condition Badge Component
 * For board game condition indicators
 */
export interface ConditionBadgeProps extends Omit<BadgeProps, 'variant'> {
  condition: 'new' | 'like-new' | 'very-good' | 'good' | 'acceptable' | 'poor'
}

export function ConditionBadge({ condition, ...props }: ConditionBadgeProps) {
  const conditionConfig = {
    'new': { variant: 'success' as const, label: 'New' },
    'like-new': { variant: 'success' as const, label: 'Like New' },
    'very-good': { variant: 'info' as const, label: 'Very Good' },
    'good': { variant: 'warning' as const, label: 'Good' },
    'acceptable': { variant: 'warning' as const, label: 'Acceptable' },
    'poor': { variant: 'error' as const, label: 'Poor' },
  }

  const config = conditionConfig[condition]

  return (
    <Badge variant={config.variant} {...props}>
      {config.label}
    </Badge>
  )
}
