import { Suspense } from 'react'
import type { Metadata } from 'next'
import { MarketplaceContent } from './marketplace-content'
import { ListingCardSkeleton } from '@/components/listings/listing-card'

export const metadata: Metadata = {
  title: 'Browse Board Games',
  description: 'Discover amazing board games for sale in Latvia. Browse our marketplace to find strategic games, family games, and rare collectibles from fellow board game enthusiasts.',
  keywords: ['board games for sale', 'buy board games Latvia', 'board game marketplace', 'strategic games', 'tabletop games'],
  openGraph: {
    title: 'Browse Board Games | Second Turn Games',
    description: 'Discover amazing board games for sale in Latvia. Browse our marketplace to find your next favorite game.',
    url: 'https://secondturngames.lv/listings',
  },
}

function MarketplaceLoading() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-width-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='h-8 bg-gray-200 rounded w-1/3 mb-2 animate-pulse' />
          <div className='h-4 bg-gray-200 rounded w-1/2 animate-pulse' />
        </div>

        {/* Filters skeleton */}
        <div className='bg-white border border-gray-200 rounded-lg p-4 mb-8'>
          <div className='h-10 bg-gray-200 rounded mb-4 animate-pulse' />
          <div className='flex space-x-3'>
            <div className='h-10 bg-gray-200 rounded w-48 animate-pulse' />
            <div className='h-10 bg-gray-200 rounded w-32 animate-pulse' />
          </div>
        </div>

        {/* Listings grid skeleton */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
          {Array.from({ length: 12 }).map((_, index) => (
            <ListingCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<MarketplaceLoading />}>
      <MarketplaceContent />
    </Suspense>
  )
}


