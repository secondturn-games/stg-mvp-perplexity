'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ListingCard, ListingCardSkeleton } from '@/components/listings/listing-card'
import { MarketplaceFilters } from '@/components/listings/marketplace-filters'
import { Pagination } from '@/components/listings/pagination'
import { NetworkError, ServerError, RetryButton } from '@/components/ui/error-states'
import type { ListingFilters, ActiveListingWithUser } from '@/lib/supabase/types'

interface MarketplaceData {
  data: ActiveListingWithUser[]
  count: number
  page: number
  limit: number
  totalPages: number
}

const ITEMS_PER_PAGE = 20

export function MarketplaceContent() {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState<MarketplaceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<ListingFilters>({})

  // Fetch listings data
  const fetchListings = useCallback(async (page: number, currentFilters: ListingFilters) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/listings?' + new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...(currentFilters.search && { search: currentFilters.search }),
        ...(currentFilters.city && { city: currentFilters.city }),
        ...(currentFilters.condition?.length && { condition: currentFilters.condition.join(',') }),
        ...(currentFilters.minPrice !== undefined && { minPrice: currentFilters.minPrice.toString() }),
        ...(currentFilters.maxPrice !== undefined && { maxPrice: currentFilters.maxPrice.toString() }),
      }))

      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error('Server error occurred while loading listings')
        } else if (response.status === 404) {
          throw new Error('Listings endpoint not found')
        } else if (response.status >= 400) {
          throw new Error('Invalid request while loading listings')
        } else {
          throw new Error('Failed to fetch listings')
        }
      }

      const data = await response.json()
      setListings(data)
    } catch (err) {
      console.error('Error fetching listings:', err)
      
      let errorMessage = 'Failed to load listings'
      if (err instanceof Error) {
        if (err.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else if (err.message.includes('Server error')) {
          errorMessage = 'Server is temporarily unavailable. Please try again in a moment.'
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: ListingFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }, [])

  // Handle page changes
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Fetch data when filters or page changes
  useEffect(() => {
    fetchListings(currentPage, filters)
  }, [currentPage, filters, fetchListings])

  // Initialize page from URL params
  useEffect(() => {
    const pageParam = searchParams.get('page')
    if (pageParam) {
      const page = parseInt(pageParam, 10)
      if (page > 0) {
        setCurrentPage(page)
      }
    }
  }, [searchParams])

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-width-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Board Game Marketplace</h1>
          <p className='text-gray-600'>
            Discover amazing board games from sellers across Latvia
          </p>
        </div>

        {/* Filters */}
        <div className='mb-8'>
          <MarketplaceFilters onFiltersChange={handleFiltersChange} />
        </div>

        {/* Results Header */}
        {listings && !loading && (
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-lg font-medium text-gray-900'>
                {listings.count === 0 ? 'No listings found' : 
                 listings.count === 1 ? '1 listing found' :
                 `${listings.count.toLocaleString()} listings found`}
              </h2>
              {listings.count > 0 && (
                <p className='text-sm text-gray-600 mt-1'>
                  Showing page {listings.page} of {listings.totalPages}
                </p>
              )}
            </div>

            {/* Sort Options - Future enhancement */}
            {listings.count > 0 && (
              <div className='flex items-center space-x-4'>
                <label className='text-sm text-gray-700'>Sort by:</label>
                <select className='border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'>
                  <option value='created_at_desc'>Newest first</option>
                  <option value='created_at_asc'>Oldest first</option>
                  <option value='price_asc'>Price: Low to High</option>
                  <option value='price_desc'>Price: High to Low</option>
                  <option value='game_name_asc'>Game A-Z</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className='py-8'>
            {error.includes('Network error') ? (
              <NetworkError onRetry={() => fetchListings(currentPage, filters)} />
            ) : error.includes('Server') ? (
              <ServerError onRetry={() => fetchListings(currentPage, filters)} />
            ) : (
              <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
                <div className='flex justify-center mb-4'>
                  <svg className='w-12 h-12 text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' />
                  </svg>
                </div>
                <h3 className='text-lg font-medium text-red-800 mb-2'>Error Loading Listings</h3>
                <p className='text-red-600 mb-4'>{error}</p>
                <RetryButton onRetry={() => fetchListings(currentPage, filters)} />
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
            {Array.from({ length: 12 }).map((_, index) => (
              <ListingCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {listings && listings.count === 0 && !loading && (
          <div className='text-center py-16'>
            <div className='flex justify-center mb-6'>
              <svg className='w-24 h-24 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' />
              </svg>
            </div>
            <h3 className='text-xl font-medium text-gray-900 mb-2'>No listings found</h3>
            <p className='text-gray-600 mb-6 max-w-md mx-auto'>
              We couldn&apos;t find any board games matching your criteria. Try adjusting your filters or check back later for new listings.
            </p>
            <div className='space-x-4'>
              <button
                onClick={() => handleFiltersChange({})}
                className='inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              >
                Clear Filters
              </button>
              <Link
                href='/listings/create'
                className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              >
                List Your Games
              </Link>
            </div>
          </div>
        )}

        {/* Listings Grid */}
        {listings && listings.data.length > 0 && !loading && (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8'>
              {listings.data.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={listings.totalPages}
              totalItems={listings.count}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  )
}

