import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Button Component Variants
 * Uses the custom Tailwind utility classes defined in globals.css
 */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

/**
 * Primary Button Component
 * Uses darkGreen background with white text
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const baseClasses = getButtonClasses(variant, size)
  
  return (
    <button
      className={cn(
        baseClasses,
        loading && 'cursor-wait',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span>{loading ? 'Loading...' : children}</span>
    </button>
  )
}

/**
 * Primary Button - Dark Green
 */
export function PrimaryButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="primary" {...props} />
}

/**
 * Secondary Button - Vibrant Orange
 */
export function SecondaryButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="secondary" {...props} />
}

/**
 * Outline Button - Dark Green border
 */
export function OutlineButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="outline" {...props} />
}

/**
 * Ghost Button - Transparent with hover
 */
export function GhostButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="ghost" {...props} />
}

/**
 * Danger Button - Coral color
 */
export function DangerButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="danger" {...props} />
}

/**
 * Get button classes based on variant and size
 */
function getButtonClasses(variant: ButtonProps['variant'], size: ButtonProps['size']): string {
  const variantClasses = {
    primary: size === 'lg' ? 'btn-primary-lg' : size === 'sm' ? 'btn-primary-sm' : 'btn-primary',
    secondary: size === 'lg' ? 'btn-secondary-lg' : size === 'sm' ? 'btn-secondary-sm' : 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  }

  const sizeClasses = {
    sm: size !== 'sm' && variant !== 'primary' && variant !== 'secondary' ? 'px-3 py-1.5 text-sm' : '',
    md: '',
    lg: size !== 'lg' && variant !== 'primary' && variant !== 'secondary' ? 'px-6 py-3 text-lg' : '',
  }

  return cn(
    variantClasses[variant || 'primary'],
    sizeClasses[size || 'md']
  )
}

/**
 * Button Group Component
 * For grouping related buttons
 */
export interface ButtonGroupProps {
  children: React.ReactNode
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export function ButtonGroup({ 
  children, 
  className, 
  orientation = 'horizontal' 
}: ButtonGroupProps) {
  return (
    <div
      className={cn(
        'inline-flex',
        orientation === 'horizontal' ? 'flex-row space-x-2' : 'flex-col space-y-2',
        className
      )}
      role="group"
    >
      {children}
    </div>
  )
}

/**
 * Icon Button Component
 * For buttons with just icons
 */
export interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: React.ReactNode
  'aria-label': string
}

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  className,
  ...props
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  }

  return (
    <Button
      variant={variant}
      className={cn(
        sizeClasses[size],
        'aspect-square',
        className
      )}
      {...props}
    >
      {icon}
    </Button>
  )
}
