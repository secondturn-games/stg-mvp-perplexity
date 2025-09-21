import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getUser, getUserActiveListings } from '@/lib/supabase/server-exports'
import type { Listing, GameCondition } from '@/lib/supabase/types'

const CONDITION_LABELS: Record<GameCondition, string> = {
  new: 'New',
  like_new: 'Like New',
  very_good: 'Very Good',
  good: 'Good',
  acceptable: 'Acceptable',
  poor: 'Poor'
}

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
    month: 'short',
    day: 'numeric'
  }).format(new Date(dateString))
}

export default async function DashboardPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/auth/sign-in?redirect=/dashboard')
  }

  let userListings: Listing[] = []
  let error: string | null = null

  try {
    userListings = await getUserActiveListings()
  } catch (err) {
    error = 'Failed to load your listings'
    console.error('Dashboard listings error:', err)
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
              <p className='mt-2 text-gray-600'>
                Manage your board game listings
              </p>
            </div>
            <div className='mt-4 sm:mt-0'>
              <Link
                href='/listings/create'
                className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
              >
                <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                </svg>
                Create New Listing
              </Link>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8'>
          {/* Profile Information */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <div className='text-center'>
                <div className='w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center'>
                  <svg className='w-8 h-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                  {user.user_metadata?.full_name || user.user_metadata?.name || 'User'}
                </h3>
                <p className='text-sm text-gray-600 mb-4'>{user.email}</p>
                
                <div className='space-y-3 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Active Listings:</span>
                    <span className='font-medium text-gray-900'>{userListings.length}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Member Since:</span>
                    <span className='font-medium text-gray-900'>
                      {formatDate(user.created_at)}
                    </span>
                  </div>
                </div>

                <div className='mt-6 pt-4 border-t border-gray-200'>
                  <Link
                    href='/profile'
                    className='text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors'
                  >
                    Edit Profile →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Listings */}
          <div className='lg:col-span-3'>
            <div className='bg-white rounded-lg border border-gray-200'>
              <div className='px-6 py-4 border-b border-gray-200'>
                <h2 className='text-lg font-semibold text-gray-900'>Your Active Listings</h2>
                <p className='text-sm text-gray-600 mt-1'>
                  {userListings.length} active listing{userListings.length !== 1 ? 's' : ''}
                </p>
              </div>

              {error ? (
                <div className='p-6'>
                  <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                    <div className='flex items-center'>
                      <svg className='w-5 h-5 text-red-400 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                      <p className='text-red-800'>{error}</p>
                    </div>
                  </div>
                </div>
              ) : userListings.length === 0 ? (
                <div className='p-12 text-center'>
                  <div className='w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center'>
                    <svg className='w-8 h-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
                    </svg>
                  </div>
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>No listings yet</h3>
                  <p className='text-gray-600 mb-6'>
                    Start by creating your first board game listing
                  </p>
                  <Link
                    href='/listings/create'
                    className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
                  >
                    <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                    </svg>
                    Create Your First Listing
                  </Link>
                </div>
              ) : (
                <div className='overflow-hidden'>
                  {/* Desktop Table View */}
                  <div className='hidden sm:block'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Game
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Price
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Condition
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Posted
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {userListings.map((listing) => (
                          <tr key={listing.id} className='hover:bg-gray-50'>
                            <td className='px-6 py-4'>
                              <div className='flex items-center'>
                                <div className='flex-shrink-0 w-12 h-12'>
                                  {listing.images && listing.images.length > 0 && listing.images[0] ? (
                                    <Image
                                      src={listing.images[0]}
                                      alt={listing.game_name}
                                      width={48}
                                      height={48}
                                      className='w-12 h-12 object-cover rounded-lg'
                                    />
                                  ) : (
                                    <div className='w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center'>
                                      <svg className='w-6 h-6 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                                <div className='ml-4'>
                                  <div className='text-sm font-medium text-gray-900 line-clamp-2'>
                                    {listing.game_name}
                                  </div>
                                  {listing.city && (
                                    <div className='text-sm text-gray-500 flex items-center mt-1'>
                                      <svg className='w-3 h-3 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                        <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
                                      </svg>
                                      {listing.city}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='text-sm font-medium text-gray-900'>
                                {formatPrice(listing.price)}
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                                {CONDITION_LABELS[listing.condition]}
                              </span>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                              {formatDate(listing.created_at)}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                              <Link
                                href={`/listings/${listing.id}`}
                                className='text-blue-600 hover:text-blue-700 transition-colors'
                              >
                                View Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className='sm:hidden'>
                    <div className='space-y-4 p-4'>
                      {userListings.map((listing) => (
                        <div key={listing.id} className='border border-gray-200 rounded-lg p-4'>
                          <div className='flex items-start space-x-4'>
                            <div className='flex-shrink-0'>
                              {listing.images && listing.images.length > 0 && listing.images[0] ? (
                                <Image
                                  src={listing.images[0]}
                                  alt={listing.game_name}
                                  width={60}
                                  height={60}
                                  className='w-16 h-16 object-cover rounded-lg'
                                />
                              ) : (
                                <div className='w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center'>
                                  <svg className='w-6 h-6 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className='flex-1 min-w-0'>
                              <div className='flex items-start justify-between'>
                                <div>
                                  <h3 className='text-sm font-medium text-gray-900 line-clamp-2 mb-1'>
                                    {listing.game_name}
                                  </h3>
                                  <div className='flex items-center space-x-2 mb-2'>
                                    <span className='text-lg font-bold text-blue-600'>
                                      {formatPrice(listing.price)}
                                    </span>
                                    <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                                      {CONDITION_LABELS[listing.condition]}
                                    </span>
                                  </div>
                                  <div className='flex items-center justify-between text-xs text-gray-500'>
                                    <span>Posted {formatDate(listing.created_at)}</span>
                                    {listing.city && (
                                      <span className='flex items-center'>
                                        <svg className='w-3 h-3 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                          <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
                                        </svg>
                                        {listing.city}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className='mt-3'>
                                <Link
                                  href={`/listings/${listing.id}`}
                                  className='text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors'
                                >
                                  View Details →
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

