import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ImageGallery } from '@/components/listings/image-gallery'
import { SellerContact } from '@/components/listings/seller-contact'
import { getListing } from '@/lib/supabase/server-exports'
import { ListingActions } from './listing-actions'

interface ListingPageProps {
  params: Promise<{ id: string }>
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
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(dateString))
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params
  
  let listing
  try {
    listing = await getListing(id)
  } catch (error) {
    console.error('Failed to fetch listing:', error)
    notFound()
  }

  if (!listing) {
    notFound()
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Breadcrumb Navigation */}
        <nav className='flex items-center space-x-2 text-sm text-gray-600 mb-6'>
          <Link href='/' className='hover:text-blue-600 transition-colors'>
            Home
          </Link>
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
          <Link href='/listings' className='hover:text-blue-600 transition-colors'>
            Browse Listings
          </Link>
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
          <span className='text-gray-900 font-medium truncate max-w-xs'>
            {listing.game_name}
          </span>
        </nav>

        {/* Back Button */}
        <div className='mb-6'>
          <Link
            href='/listings'
            className='inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors'
          >
            <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
            </svg>
            Back to listings
          </Link>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Images and Details */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Image Gallery */}
            <ImageGallery
              images={listing.images || []}
              gameName={listing.game_name}
            />

            {/* Game Details */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <div className='flex items-start justify-between mb-6'>
                <div className='flex-1'>
                  <h1 className='text-3xl font-bold text-gray-900 mb-4'>
                    {listing.game_name}
                  </h1>
                  
                  <div className='flex flex-wrap items-center gap-4 mb-4'>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        CONDITION_COLORS[listing.condition]
                      }`}
                    >
                      {CONDITION_LABELS[listing.condition]}
                    </span>
                    
                    {listing.bgg_id && (
                      <div className='flex items-center space-x-2 text-gray-600'>
                        <div className='w-5 h-5 bg-orange-500 rounded flex items-center justify-center'>
                          <span className='text-white text-xs font-bold'>B</span>
                        </div>
                        <span className='text-sm'>BoardGameGeek</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className='text-right'>
                  <div className='text-4xl font-bold text-blue-600 mb-2'>
                    {formatPrice(listing.price)}
                  </div>
                </div>
              </div>

              {/* Description */}
              {listing.description && (
                <div className='mb-6'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-3'>Description</h3>
                  <div className='prose prose-gray max-w-none'>
                    <p className='text-gray-700 whitespace-pre-wrap leading-relaxed'>
                      {listing.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Listing Details */}
              <div className='border-t border-gray-200 pt-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Listing Details</h3>
                <dl className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <dt className='text-sm font-medium text-gray-600'>Posted</dt>
                    <dd className='text-sm text-gray-900 mt-1'>{formatDate(listing.created_at)}</dd>
                  </div>
                  
                  {listing.city && (
                    <div>
                      <dt className='text-sm font-medium text-gray-600'>Location</dt>
                      <dd className='text-sm text-gray-900 mt-1 flex items-center'>
                        <svg className='w-4 h-4 mr-1 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                          <path
                            fillRule='evenodd'
                            d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                            clipRule='evenodd'
                          />
                        </svg>
                        {listing.city}
                      </dd>
                    </div>
                  )}

                  <div>
                    <dt className='text-sm font-medium text-gray-600'>Condition</dt>
                    <dd className='text-sm text-gray-900 mt-1'>{CONDITION_LABELS[listing.condition]}</dd>
                  </div>

                  <div>
                    <dt className='text-sm font-medium text-gray-600'>Images</dt>
                    <dd className='text-sm text-gray-900 mt-1'>
                      {listing.images?.length || 0} photo{(listing.images?.length || 0) !== 1 ? 's' : ''}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Right Column - Seller Contact */}
          <div className='lg:col-span-1'>
            <div className='sticky top-8'>
              <SellerContact
                listingId={listing.id}
                sellerName={listing.seller_name}
                gameName={listing.game_name}
                price={listing.price}
              />

              {/* Interactive Actions */}
              <ListingActions listingUrl={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/listings/${listing.id}`} />
            </div>
          </div>
        </div>

        {/* Related Listings - Future Enhancement */}
        <div className='mt-12 border-t border-gray-200 pt-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>More from this seller</h2>
          <div className='bg-gray-100 rounded-lg p-8 text-center text-gray-500'>
            <p>Related listings will be displayed here in a future update.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
