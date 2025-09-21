import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Card Component System
 * Uses the custom Tailwind utility classes defined in globals.css
 */

export interface CardProps {
  variant?: 'default' | 'elevated' | 'interactive' | 'flat' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

/**
 * Base Card Component
 */
export function Card({
  variant = 'default',
  size = 'md',
  children,
  className,
  onClick,
  ...props
}: CardProps & React.HTMLAttributes<HTMLDivElement>) {
  const cardClasses = getCardClasses(variant, size)
  
  return (
    <div
      className={cn(cardClasses, className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Card Header Component
 */
export interface CardHeaderProps {
  children: React.ReactNode
  className?: string
  clean?: boolean
}

export function CardHeader({ children, className, clean = false }: CardHeaderProps) {
  return (
    <div className={cn(clean ? 'card-header-clean' : 'card-header', className)}>
      {children}
    </div>
  )
}

/**
 * Card Body Component
 */
export interface CardBodyProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'padded' | 'compact'
}

export function CardBody({ children, className, variant = 'default' }: CardBodyProps) {
  const bodyClasses = {
    default: 'card-body',
    padded: 'card-body-padded',
    compact: 'card-body-compact',
  }

  return (
    <div className={cn(bodyClasses[variant], className)}>
      {children}
    </div>
  )
}

/**
 * Card Footer Component
 */
export interface CardFooterProps {
  children: React.ReactNode
  className?: string
  clean?: boolean
}

export function CardFooter({ children, className, clean = false }: CardFooterProps) {
  return (
    <div className={cn(clean ? 'card-footer-clean' : 'card-footer', className)}>
      {children}
    </div>
  )
}

/**
 * Get card classes based on variant and size
 */
function getCardClasses(variant: CardProps['variant'], size: CardProps['size']): string {
  const variantClasses = {
    default: 'card',
    elevated: 'card-elevated',
    interactive: 'card-interactive',
    flat: 'card-flat',
    accent: 'card-accent',
  }

  const sizeClasses = {
    sm: 'card-sm',
    md: '',
    lg: 'card-lg',
  }

  return cn(
    variantClasses[variant || 'default'],
    sizeClasses[size || 'md']
  )
}

/**
 * Listing Card Component
 * Specialized card for board game listings
 */
export interface ListingCardProps {
  title: string
  price: string
  condition: string
  seller: string
  city?: string
  image?: string
  featured?: boolean
  onClick?: () => void
  className?: string
}

export function ListingCard({
  title,
  price,
  condition,
  seller,
  city,
  image,
  featured = false,
  onClick,
  className
}: ListingCardProps) {
  return (
    <Card 
      variant="interactive" 
      onClick={onClick}
      className={cn('overflow-hidden', className)}
    >
      {/* Image Section */}
      {image ? (
        <div className="aspect-[4/3] bg-surface-100">
          <img 
            src={image} 
            alt={`${title} board game`}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] bg-surface-100 flex items-center justify-center">
          <svg className="w-12 h-12 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      <CardBody>
        {/* Title and Price */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-text-primary text-lg leading-tight flex-1 mr-2">
            {title}
          </h3>
          {featured && (
            <span className="badge-warning badge-lg">Featured</span>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-text-primary">{price}</span>
          <span className="badge-info">{condition}</span>
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span>{seller}</span>
          </div>

          {city && (
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{city}</span>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

/**
 * Stats Card Component
 * For displaying metrics and statistics
 */
export interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ReactNode
  className?: string
}

export function StatsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  className
}: StatsCardProps) {
  const changeColors = {
    positive: 'text-teal-600',
    negative: 'text-coral-600',
    neutral: 'text-text-muted'
  }

  return (
    <Card variant="elevated" className={className}>
      <CardBody>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-text-secondary text-sm font-medium">{title}</p>
            <p className="text-text-primary text-2xl font-bold mt-1">{value}</p>
            {change && (
              <p className={cn('text-sm font-medium mt-1', changeColors[changeType])}>
                {change}
              </p>
            )}
          </div>
          {icon && (
            <div className="text-text-muted">
              {icon}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

/**
 * Feature Card Component
 * For highlighting features or benefits
 */
export interface FeatureCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  featured?: boolean
  className?: string
}

export function FeatureCard({
  title,
  description,
  icon,
  featured = false,
  className
}: FeatureCardProps) {
  return (
    <Card 
      variant={featured ? 'accent' : 'elevated'} 
      className={className}
    >
      <CardBody variant="padded">
        <div className="text-center">
          {icon && (
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-darkGreen/10 rounded-full text-darkGreen">
                {icon}
              </div>
            </div>
          )}
          <h3 className="text-text-primary font-semibold text-lg mb-2">
            {title}
          </h3>
          <p className="text-text-secondary">
            {description}
          </p>
          {featured && (
            <div className="mt-4">
              <span className="badge-warning">Popular</span>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}
