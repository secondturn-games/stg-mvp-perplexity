export default function DashboardLoading() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header skeleton */}
        <div className='mb-8'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <div className='h-8 bg-gray-200 rounded w-32 mb-2 animate-pulse' />
              <div className='h-4 bg-gray-200 rounded w-48 animate-pulse' />
            </div>
            <div className='mt-4 sm:mt-0'>
              <div className='h-10 bg-gray-200 rounded w-40 animate-pulse' />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Profile skeleton */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <div className='text-center'>
                <div className='w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse' />
                <div className='h-5 bg-gray-200 rounded w-24 mx-auto mb-1 animate-pulse' />
                <div className='h-4 bg-gray-200 rounded w-32 mx-auto mb-4 animate-pulse' />
                
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <div className='h-4 bg-gray-200 rounded w-20 animate-pulse' />
                    <div className='h-4 bg-gray-200 rounded w-8 animate-pulse' />
                  </div>
                  <div className='flex justify-between'>
                    <div className='h-4 bg-gray-200 rounded w-24 animate-pulse' />
                    <div className='h-4 bg-gray-200 rounded w-16 animate-pulse' />
                  </div>
                </div>

                <div className='mt-6 pt-4 border-t border-gray-200'>
                  <div className='h-4 bg-gray-200 rounded w-20 mx-auto animate-pulse' />
                </div>
              </div>
            </div>
          </div>

          {/* Listings skeleton */}
          <div className='lg:col-span-3'>
            <div className='bg-white rounded-lg border border-gray-200'>
              <div className='px-6 py-4 border-b border-gray-200'>
                <div className='h-6 bg-gray-200 rounded w-40 mb-1 animate-pulse' />
                <div className='h-4 bg-gray-200 rounded w-32 animate-pulse' />
              </div>

              {/* Table skeleton */}
              <div className='p-6'>
                <div className='space-y-4'>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className='flex items-center space-x-4'>
                      <div className='w-12 h-12 bg-gray-200 rounded-lg animate-pulse' />
                      <div className='flex-1 space-y-2'>
                        <div className='h-4 bg-gray-200 rounded w-3/4 animate-pulse' />
                        <div className='h-3 bg-gray-200 rounded w-1/2 animate-pulse' />
                      </div>
                      <div className='h-4 bg-gray-200 rounded w-16 animate-pulse' />
                      <div className='h-4 bg-gray-200 rounded w-20 animate-pulse' />
                      <div className='h-4 bg-gray-200 rounded w-24 animate-pulse' />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

