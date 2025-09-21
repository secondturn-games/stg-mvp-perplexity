'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { CitySelect } from '@/components/ui/city-select'
import type { GameCondition, ListingFilters } from '@/lib/supabase/types'

interface MarketplaceFiltersProps {
  onFiltersChange: (filters: ListingFilters) => void
  className?: string
}

const CONDITION_OPTIONS: { value: GameCondition; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like New' },
  { value: 'very_good', label: 'Very Good' },
  { value: 'good', label: 'Good' },
  { value: 'acceptable', label: 'Acceptable' },
  { value: 'poor', label: 'Poor' }
]

export function MarketplaceFilters({ onFiltersChange, className }: MarketplaceFiltersProps) {
  const searchParams = useSearchParams()
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState<ListingFilters>({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    condition: searchParams.get('condition')?.split(',').filter(Boolean) as GameCondition[] || [],
    minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
  })

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Update URL and notify parent when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    
    if (filters.search) params.set('search', filters.search)
    if (filters.city) params.set('city', filters.city)
    if (filters.condition && filters.condition.length > 0) {
      params.set('condition', filters.condition.join(','))
    }
    if (filters.minPrice !== undefined) params.set('minPrice', filters.minPrice.toString())
    if (filters.maxPrice !== undefined) params.set('maxPrice', filters.maxPrice.toString())
    
    // Update URL without triggering navigation
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    window.history.replaceState({}, '', newUrl)
    
    // Notify parent component
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

  const updateFilter = <K extends keyof ListingFilters>(key: K, value: ListingFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleCondition = (condition: GameCondition) => {
    setFilters(prev => ({
      ...prev,
      condition: prev.condition?.includes(condition)
        ? prev.condition.filter(c => c !== condition)
        : [...(prev.condition || []), condition]
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      city: '',
      condition: [],
      minPrice: undefined,
      maxPrice: undefined,
    })
  }

  const hasActiveFilters = !!(
    filters.search ||
    filters.city ||
    (filters.condition && filters.condition.length > 0) ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined
  )

  return (
    <div className={cn('bg-white border border-gray-200 rounded-lg p-4 space-y-4', className)}>
      {/* Search Bar */}
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
          </svg>
        </div>
        <input
          type='text'
          placeholder='Search board games...'
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
        />
      </div>

      {/* Quick Filters Row */}
      <div className='flex flex-col sm:flex-row gap-3 sm:items-center'>
        {/* City Filter */}
        <div className='flex-1 sm:min-w-[200px] sm:max-w-[250px]'>
          <CitySelect
            name='city-filter'
            value={filters.city}
            onChange={(city) => updateFilter('city', city)}
            placeholder='Any city'
          />
        </div>

        <div className='flex flex-col xs:flex-row gap-3'>
          {/* Advanced Filters Toggle */}
          <button
            type='button'
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={cn(
              'inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium transition-colors flex-1 xs:flex-initial',
              showAdvancedFilters
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            )}
          >
            <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4' />
            </svg>
            <span className='hidden xs:inline'>More filters</span>
            <span className='xs:hidden'>Filters</span>
            <svg
              className={cn('w-4 h-4 ml-1 transition-transform', showAdvancedFilters && 'rotate-180')}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
            </svg>
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              type='button'
              onClick={clearFilters}
              className='inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors flex-1 xs:flex-initial'
            >
              <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
              <span className='hidden xs:inline'>Clear all</span>
              <span className='xs:hidden'>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className='pt-4 border-t border-gray-200 space-y-4'>
          {/* Price Range */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Price Range (EUR)</label>
            <div className='grid grid-cols-1 xs:grid-cols-2 gap-3'>
              <div>
                <input
                  type='number'
                  placeholder='Min price'
                  value={filters.minPrice || ''}
                  onChange={(e) => updateFilter('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className='block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                  min='0'
                  step='0.01'
                />
              </div>
              <div>
                <input
                  type='number'
                  placeholder='Max price'
                  value={filters.maxPrice || ''}
                  onChange={(e) => updateFilter('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className='block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                  min='0'
                  step='0.01'
                />
              </div>
            </div>
          </div>

          {/* Condition Filter */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Condition</label>
            <div className='flex flex-wrap gap-2'>
              {CONDITION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type='button'
                  onClick={() => toggleCondition(option.value)}
                  className={cn(
                    'inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
                    filters.condition?.includes(option.value)
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {option.label}
                  {filters.condition?.includes(option.value) && (
                    <svg className='w-4 h-4 ml-1' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className='flex flex-wrap gap-2 pt-2 border-t border-gray-200'>
          {filters.search && (
            <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
              Search: &quot;{filters.search}&quot;
            </span>
          )}
          {filters.city && (
            <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
              {filters.city}
            </span>
          )}
          {filters.condition?.map((condition) => (
            <span key={condition} className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800'>
              {CONDITION_OPTIONS.find(opt => opt.value === condition)?.label}
            </span>
          ))}
          {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
            <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
              €{filters.minPrice || 0} - €{filters.maxPrice || '∞'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

