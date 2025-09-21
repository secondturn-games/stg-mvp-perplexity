export default function ListingLoading() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Breadcrumb skeleton */}
        <div className='flex items-center space-x-2 mb-6'>
          <div className='h-4 bg-gray-200 rounded w-12 animate-pulse' />
          <div className='w-4 h-4 bg-gray-200 rounded animate-pulse' />
          <div className='h-4 bg-gray-200 rounded w-20 animate-pulse' />
          <div className='w-4 h-4 bg-gray-200 rounded animate-pulse' />
          <div className='h-4 bg-gray-200 rounded w-32 animate-pulse' />
        </div>

        {/* Back button skeleton */}
        <div className='mb-6'>
          <div className='h-4 bg-gray-200 rounded w-24 animate-pulse' />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Images and Details */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Image Gallery Skeleton */}
            <div className='space-y-4'>
              <div className='aspect-[4/3] bg-gray-200 rounded-lg animate-pulse' />
              <div className='flex space-x-2'>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className='w-16 h-16 bg-gray-200 rounded-lg animate-pulse' />
                ))}
              </div>
            </div>

            {/* Game Details Skeleton */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <div className='flex items-start justify-between mb-6'>
                <div className='flex-1'>
                  <div className='h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse' />
                  <div className='flex space-x-4 mb-4'>
                    <div className='h-6 bg-gray-200 rounded-full w-20 animate-pulse' />
                    <div className='h-6 bg-gray-200 rounded w-24 animate-pulse' />
                  </div>
                </div>
                <div className='h-10 bg-gray-200 rounded w-24 animate-pulse' />
              </div>

              {/* Description skeleton */}
              <div className='mb-6'>
                <div className='h-6 bg-gray-200 rounded w-32 mb-3 animate-pulse' />
                <div className='space-y-2'>
                  <div className='h-4 bg-gray-200 rounded w-full animate-pulse' />
                  <div className='h-4 bg-gray-200 rounded w-5/6 animate-pulse' />
                  <div className='h-4 bg-gray-200 rounded w-4/6 animate-pulse' />
                </div>
              </div>

              {/* Details skeleton */}
              <div className='border-t border-gray-200 pt-6'>
                <div className='h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse' />
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i}>
                      <div className='h-4 bg-gray-200 rounded w-16 mb-1 animate-pulse' />
                      <div className='h-4 bg-gray-200 rounded w-24 animate-pulse' />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Skeleton */}
          <div className='lg:col-span-1'>
            <div className='sticky top-8 space-y-6'>
              {/* Contact skeleton */}
              <div className='bg-white border border-gray-200 rounded-lg p-6'>
                <div className='h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse' />
                <div className='h-4 bg-gray-200 rounded w-40 mb-4 animate-pulse' />
                <div className='h-12 bg-gray-200 rounded animate-pulse' />
              </div>

              {/* Share skeleton */}
              <div className='bg-white border border-gray-200 rounded-lg p-4'>
                <div className='h-5 bg-gray-200 rounded w-32 mb-3 animate-pulse' />
                <div className='flex space-x-2'>
                  <div className='flex-1 h-10 bg-gray-200 rounded animate-pulse' />
                  <div className='flex-1 h-10 bg-gray-200 rounded animate-pulse' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

