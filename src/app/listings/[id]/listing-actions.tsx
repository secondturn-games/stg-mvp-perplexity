'use client'

interface ListingActionsProps {
  listingUrl: string
}

export function ListingActions({ listingUrl }: ListingActionsProps) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(listingUrl)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this board game listing',
          url: listingUrl
        })
      } catch (err) {
        console.error('Failed to share:', err)
      }
    } else {
      // Fallback to copy link
      copyToClipboard()
    }
  }

  return (
    <>
      {/* Share Actions */}
      <div className='mt-6 bg-white border border-gray-200 rounded-lg p-4'>
        <h4 className='font-semibold text-gray-900 mb-3'>Share this listing</h4>
        <div className='flex space-x-2'>
          <button
            onClick={copyToClipboard}
            className='flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors'
          >
            Copy Link
          </button>
          <button
            onClick={shareNative}
            className='flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors'
          >
            Share
          </button>
        </div>
      </div>

      {/* Report Listing */}
      <div className='mt-4 text-center'>
        <button 
          onClick={() => alert('Report functionality will be implemented soon')}
          className='text-sm text-gray-500 hover:text-red-600 transition-colors'
        >
          Report this listing
        </button>
      </div>
    </>
  )
}

