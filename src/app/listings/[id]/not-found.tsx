import Link from 'next/link'

export default function ListingNotFound() {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='max-w-md w-full text-center'>
        <div className='mb-8'>
          <svg
            className='mx-auto h-24 w-24 text-gray-300'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1}
              d='M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.1-5.7-2.7'
            />
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1}
              d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </div>

        <h1 className='text-3xl font-bold text-gray-900 mb-4'>
          Listing Not Found
        </h1>
        
        <p className='text-gray-600 mb-8 leading-relaxed'>
          The listing you're looking for doesn't exist or may have been removed by the seller.
        </p>

        <div className='space-y-4'>
          <Link
            href='/listings'
            className='block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium'
          >
            Browse All Listings
          </Link>
          
          <Link
            href='/'
            className='block w-full bg-white text-gray-700 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium'
          >
            Go to Homepage
          </Link>
        </div>

        <div className='mt-8 pt-8 border-t border-gray-200'>
          <p className='text-sm text-gray-500'>
            Can't find what you're looking for?{' '}
            <Link href='/listings/create' className='text-blue-600 hover:text-blue-700 font-medium'>
              Create a listing
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

