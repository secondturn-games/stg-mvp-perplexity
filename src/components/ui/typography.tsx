import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Typography Components
 * Uses the custom Tailwind text color utilities defined in globals.css
 */

export interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  variant?: 'primary' | 'secondary' | 'tertiary' | 'brand' | 'accent'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span'
}

/**
 * Heading Component
 * Semantic heading component with consistent styling
 */
export function Heading({
  level = 1,
  variant = 'primary',
  size,
  children,
  className,
  as,
  ...props
}: HeadingProps & React.HTMLAttributes<HTMLHeadingElement>) {
  const Component = as || (`h${level}` as keyof JSX.IntrinsicElements)
  const headingClasses = getHeadingClasses(level, variant, size)

  return (
    <Component
      className={cn(headingClasses, className)}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * Paragraph Component
 */
export interface ParagraphProps {
  variant?: 'primary' | 'secondary' | 'muted' | 'small' | 'caption'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
  as?: 'p' | 'div' | 'span'
}

export function Paragraph({
  variant = 'primary',
  size,
  children,
  className,
  as = 'p',
  ...props
}: ParagraphProps & React.HTMLAttributes<HTMLParagraphElement>) {
  const paragraphClasses = getParagraphClasses(variant, size)

  const Component = as as keyof JSX.IntrinsicElements

  return (
    <Component
      className={cn(paragraphClasses, className)}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * Text Component - Generic text wrapper
 */
export interface TextProps {
  variant?: 'primary' | 'secondary' | 'muted' | 'interactive' | 'link' | 'brand' | 'accent' | 'success' | 'warning' | 'error' | 'info'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  children: React.ReactNode
  className?: string
  as?: 'span' | 'div' | 'p' | 'strong' | 'em'
  hover?: boolean
}

export function Text({
  variant = 'primary',
  size = 'md',
  weight = 'normal',
  children,
  className,
  as = 'span',
  hover = false,
  ...props
}: TextProps & React.HTMLAttributes<HTMLSpanElement>) {
  const textClasses = getTextClasses(variant, size, weight, hover)
  const Component = as as keyof JSX.IntrinsicElements

  return (
    <Component
      className={cn(textClasses, className)}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * Link Component - Styled link with proper accessibility
 */
export interface LinkProps {
  href: string
  variant?: 'default' | 'subtle' | 'brand'
  external?: boolean
  children: React.ReactNode
  className?: string
}

export function Link({
  href,
  variant = 'default',
  external = false,
  children,
  className,
  ...props
}: LinkProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const linkClasses = getLinkClasses(variant)

  return (
    <a
      href={href}
      className={cn(linkClasses, className)}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
      {external && (
        <svg
          className="inline w-3 h-3 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      )}
    </a>
  )
}

/**
 * Label Component - Form labels with proper styling
 */
export interface LabelProps {
  htmlFor?: string
  required?: boolean
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary'
}

export function Label({
  htmlFor,
  required = false,
  children,
  className,
  variant = 'primary',
  ...props
}: LabelProps & React.LabelHTMLAttributes<HTMLLabelElement>) {
  const labelClasses = variant === 'primary' ? 'text-primary' : 'text-secondary'

  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'block text-sm font-medium mb-1',
        labelClasses,
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-brand-error ml-1" aria-label="required">*</span>
      )}
    </label>
  )
}

/**
 * Price Component - Specialized price display
 */
export interface PriceProps {
  amount: string | number
  currency?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Price({
  amount,
  currency = '€',
  size = 'md',
  className
}: PriceProps) {
  const priceClasses = {
    sm: 'text-price text-base',
    md: 'text-price',
    lg: 'text-price-large'
  }

  return (
    <span className={cn(priceClasses[size], className)}>
      {currency}{amount}
    </span>
  )
}

/**
 * Timestamp Component - Formatted time display
 */
export interface TimestampProps {
  date: string | Date
  format?: 'relative' | 'absolute' | 'short'
  className?: string
}

export function Timestamp({
  date,
  format = 'relative',
  className
}: TimestampProps) {
  const formatDate = (date: string | Date, format: TimestampProps['format']) => {
    const d = new Date(date)
    
    switch (format) {
      case 'relative':
        const now = new Date()
        const diffMs = now.getTime() - d.getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        
        if (diffDays === 0) return 'Today'
        if (diffDays === 1) return 'Yesterday'
        if (diffDays < 7) return `${diffDays} days ago`
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
        return `${Math.floor(diffDays / 30)} months ago`
        
      case 'short':
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        
      case 'absolute':
      default:
        return d.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
    }
  }

  return (
    <time
      dateTime={new Date(date).toISOString()}
      className={cn('text-timestamp', className)}
    >
      {formatDate(date, format)}
    </time>
  )
}

/**
 * Status Text Component - For displaying various states
 */
export interface StatusTextProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral'
  children: React.ReactNode
  className?: string
}

export function StatusText({
  status,
  children,
  className
}: StatusTextProps) {
  const statusClasses = {
    success: 'text-brand-success',
    warning: 'text-brand-warning',
    error: 'text-brand-error',
    info: 'text-brand-info',
    neutral: 'text-secondary'
  }

  return (
    <span className={cn(statusClasses[status], 'text-sm font-medium', className)}>
      {children}
    </span>
  )
}

/**
 * Helper functions for generating classes
 */

function getHeadingClasses(
  level: HeadingProps['level'],
  variant: HeadingProps['variant'],
  size?: HeadingProps['size']
): string {
  // Default sizes based on heading level
  const defaultSizes = {
    1: '3xl',
    2: '2xl',
    3: 'xl',
    4: 'lg',
    5: 'md',
    6: 'sm'
  }

  const finalSize = size || defaultSizes[level || 1]

  const variantClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    tertiary: 'text-muted',
    brand: 'text-brand-primary',
    accent: 'text-brand-accent'
  }

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl'
  }

  const weightClasses = {
    1: 'font-bold',
    2: 'font-bold',
    3: 'font-semibold',
    4: 'font-semibold',
    5: 'font-medium',
    6: 'font-medium'
  }

  return cn(
    variantClasses[variant || 'primary'],
    sizeClasses[finalSize as keyof typeof sizeClasses],
    weightClasses[level || 1]
  )
}

function getParagraphClasses(
  variant: ParagraphProps['variant'],
  size?: ParagraphProps['size']
): string {
  const variantClasses = {
    primary: 'text-body-primary',
    secondary: 'text-body-secondary',
    muted: 'text-muted',
    small: 'text-body-small',
    caption: 'text-caption'
  }

  const sizeClasses = size ? {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  } : {}

  return cn(
    variantClasses[variant || 'primary'],
    size ? sizeClasses[size] : undefined
  )
}

function getTextClasses(
  variant: TextProps['variant'],
  size: TextProps['size'],
  weight: TextProps['weight'],
  hover: boolean
): string {
  const variantClasses = {
    primary: hover ? 'text-primary-hover' : 'text-primary',
    secondary: hover ? 'text-secondary-hover' : 'text-secondary',
    muted: hover ? 'text-muted-hover' : 'text-muted',
    interactive: 'text-interactive',
    link: 'text-link',
    brand: 'text-brand-primary',
    accent: 'text-brand-accent',
    success: 'text-brand-success',
    warning: 'text-brand-warning',
    error: 'text-brand-error',
    info: 'text-brand-info'
  }

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  }

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }

  return cn(
    variantClasses[variant || 'primary'],
    sizeClasses[size || 'md'],
    weightClasses[weight || 'normal']
  )
}

function getLinkClasses(variant: LinkProps['variant']): string {
  const variantClasses = {
    default: 'text-link',
    subtle: 'text-link-subtle',
    brand: 'text-brand-primary hover:text-brand-accent underline-offset-2 hover:underline'
  }

  return cn(
    variantClasses[variant || 'default'],
    'focus:outline-none focus:ring-2 focus:ring-vibrantOrange/20 rounded-sm'
  )
}
