'use client'

import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className
}: PaginationProps) {
  if (totalPages <= 1) return null

  // Calculate visible page range
  const getVisiblePages = () => {
    const delta = 2 // Number of pages to show on each side of current page
    const range = []
    const rangeWithDots = []

    // Always include first page
    range.push(1)

    // Calculate start and end of middle range
    const start = Math.max(2, currentPage - delta)
    const end = Math.min(totalPages - 1, currentPage + delta)

    // Add dots if there's a gap between 1 and start
    if (start > 2) {
      rangeWithDots.push(1, '...')
    } else if (start === 2) {
      rangeWithDots.push(1)
    } else {
      rangeWithDots.push(1)
    }

    // Add middle range
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        rangeWithDots.push(i)
      }
    }

    // Add dots if there's a gap between end and last page
    if (end < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (end === totalPages - 1) {
      rangeWithDots.push(totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div data-testid="pagination" className={cn('flex items-center justify-between', className)}>
      {/* Results info */}
      <div className='flex-1 flex justify-between sm:hidden'>
        <button
          data-testid="pagination-prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Previous
        </button>
        <button
          data-testid="pagination-next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Next
        </button>
      </div>

      <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
        <div>
          <p data-testid="pagination-info" className='text-sm text-gray-700'>
            Showing <span className='font-medium'>{startItem}</span> to{' '}
            <span className='font-medium'>{endItem}</span> of{' '}
            <span className='font-medium'>{totalItems}</span> results
          </p>
        </div>
        
        <div>
          <nav className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px' aria-label='Pagination'>
            {/* Previous button */}
            <button
              data-testid="pagination-prev"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <span className='sr-only'>Previous</span>
              <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            </button>

            {/* Page numbers */}
            {visiblePages.map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`dots-${index}`}
                    className='relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700'
                  >
                    ...
                  </span>
                )
              }

              const pageNumber = page as number
              const isActive = pageNumber === currentPage

              return (
                <button
                  key={pageNumber}
                  data-testid="pagination-page"
                  onClick={() => onPageChange(pageNumber)}
                  className={cn(
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    isActive
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  )}
                >
                  {pageNumber}
                </button>
              )
            })}

            {/* Next button */}
            <button
              data-testid="pagination-next"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <span className='sr-only'>Next</span>
              <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}

