import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { ActiveListingWithUser } from '@/lib/supabase/types'

interface ListingCardProps {
  listing: ActiveListingWithUser
  className?: string
}

const CONDITION_LABELS = {
  new: 'New',
  like_new: 'Like New',
  very_good: 'Very Good',
  good: 'Good',
  acceptable: 'Acceptable',
  poor: 'Poor'
} as const

const CONDITION_COLORS = {
  new: 'bg-green-100 text-green-800',
  like_new: 'bg-green-50 text-green-700',
  very_good: 'bg-blue-100 text-blue-800',
  good: 'bg-yellow-100 text-yellow-800',
  acceptable: 'bg-orange-100 text-orange-800',
  poor: 'bg-red-100 text-red-800'
} as const

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price)
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(new Date(dateString))
}

export function ListingCard({ listing, className }: ListingCardProps) {
  const mainImage = listing.images?.[0]
  const hasMultipleImages = (listing.images?.length || 0) > 1

  return (
    <article>
      <Link
        href={`/listings/${listing.id}`}
        data-testid="listing-card"
        className={cn(
          'group block bg-white rounded-lg border border-gray-200 transition-all duration-200',
          'hover:border-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          className
        )}
        aria-label={`View details for ${listing.game_name} - ${formatPrice(listing.price)} in ${CONDITION_LABELS[listing.condition].toLowerCase()} condition`}
      >
      {/* Image Section */}
      <div className='relative aspect-[4/3] overflow-hidden rounded-t-lg bg-gray-100'>
        {mainImage ? (
          <Image
            src={mainImage}
            alt={`${listing.game_name} board game in ${CONDITION_LABELS[listing.condition].toLowerCase()} condition, priced at ${formatPrice(listing.price)}`}
            fill
            className='object-cover group-hover:scale-105 transition-transform duration-200'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        ) : (
          <div 
            className='flex items-center justify-center h-full text-gray-400'
            role='img'
            aria-label={`No image available for ${listing.game_name}`}
          >
            <svg
              className='w-12 h-12'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
              />
            </svg>
          </div>
        )}

        {/* Image Count Badge */}
        {hasMultipleImages && (
          <div className='absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded'>
            {listing.images?.length} photos
          </div>
        )}

        {/* Condition Badge */}
        <div className='absolute top-2 left-2'>
          <span
            className={cn(
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
              CONDITION_COLORS[listing.condition]
            )}
          >
            {CONDITION_LABELS[listing.condition]}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className='p-4'>
        {/* Game Name */}
        <h3 className='font-semibold text-gray-900 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors'>
          {listing.game_name}
        </h3>

        {/* Price */}
        <div className='flex items-center justify-between mb-3'>
          <span className='text-2xl font-bold text-gray-900'>
            {formatPrice(listing.price)}
          </span>
        </div>

        {/* Seller Info */}
        <div className='flex items-center justify-between text-sm text-gray-600 mb-3'>
          <div className='flex items-center space-x-1'>
            <svg 
              className='w-4 h-4' 
              fill='currentColor' 
              viewBox='0 0 20 20'
              aria-hidden='true'
            >
              <path
                fillRule='evenodd'
                d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                clipRule='evenodd'
              />
            </svg>
            <span aria-label={`Sold by ${listing.seller_name}`}>
              {listing.seller_name}
            </span>
          </div>
          
          {listing.city && (
            <div className='flex items-center space-x-1'>
              <svg 
                className='w-4 h-4' 
                fill='currentColor' 
                viewBox='0 0 20 20'
                aria-hidden='true'
              >
                <path
                  fillRule='evenodd'
                  d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                  clipRule='evenodd'
                />
              </svg>
              <span aria-label={`Located in ${listing.city}`}>
                {listing.city}
              </span>
            </div>
          )}
        </div>

        {/* Description Preview */}
        {listing.description && (
          <p className='text-sm text-gray-600 line-clamp-2 mb-3'>
            {listing.description}
          </p>
        )}

        {/* Posted Date */}
        <div className='flex items-center justify-between text-xs text-gray-500'>
          <span>
            <time dateTime={listing.created_at}>
              Posted {formatDate(listing.created_at)}
            </time>
          </span>
          
          {listing.bgg_id && (
            <div className='flex items-center space-x-1' title='BoardGameGeek verified'>
              <span 
                className='w-4 h-4 bg-orange-500 rounded-sm flex items-center justify-center text-white text-[10px] font-bold'
                aria-hidden='true'
              >
                B
              </span>
              <span className='sr-only'>BoardGameGeek verified game</span>
              <span aria-hidden='true'>BGG</span>
            </div>
          )}
        </div>
      </div>
      </Link>
    </article>
  )
}

export function ListingCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 animate-pulse', className)}>
      {/* Image Skeleton */}
      <div className='aspect-[4/3] bg-gray-200 rounded-t-lg' />
      
      {/* Content Skeleton */}
      <div className='p-4 space-y-3'>
        {/* Title */}
        <div className='h-6 bg-gray-200 rounded w-3/4' />
        
        {/* Price */}
        <div className='h-8 bg-gray-200 rounded w-1/3' />
        
        {/* Seller Info */}
        <div className='flex justify-between'>
          <div className='h-4 bg-gray-200 rounded w-1/4' />
          <div className='h-4 bg-gray-200 rounded w-1/4' />
        </div>
        
        {/* Description */}
        <div className='space-y-2'>
          <div className='h-4 bg-gray-200 rounded w-full' />
          <div className='h-4 bg-gray-200 rounded w-2/3' />
        </div>
        
        {/* Date */}
        <div className='h-3 bg-gray-200 rounded w-1/3' />
      </div>
    </div>
  )
}

