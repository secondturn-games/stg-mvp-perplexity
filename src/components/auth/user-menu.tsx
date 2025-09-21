'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth, useAuthActions } from '@/lib/supabase'

export function UserMenu() {
  const { user, loading } = useAuth()
  const { signOut } = useAuthActions()
  const [isOpen, setIsOpen] = useState(false)

  if (loading) {
    return (
      <div className='h-8 w-8 animate-pulse rounded-full bg-gray-200'></div>
    )
  }

  if (!user) {
    return (
      <div className='flex items-center space-x-2 sm:space-x-4'>
        <Link
          href='/auth/sign-in'
          className='text-gray-700 hover:text-gray-900 text-sm'
        >
          Sign in
        </Link>
        <Link
          href='/auth/sign-up'
          className='rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:px-4'
        >
          Sign up
        </Link>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100'
      >
        <div className='h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium'>
          {user.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <span className='hidden sm:block truncate max-w-32'>{user.email}</span>
        <svg
          className={`h-4 w-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Overlay to close menu when clicking outside */}
          <div
            className='fixed inset-0 z-10'
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Dropdown menu */}
          <div className='absolute right-0 z-20 mt-2 w-48 sm:w-56 rounded-lg bg-white shadow-lg border border-gray-200'>
            <div className='py-1'>
              <div className='px-4 py-2 border-b border-gray-100'>
                <p className='text-sm font-medium text-gray-900 truncate'>
                  {user.email}
                </p>
              </div>
              
              <Link
                href='/profile'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              
              <Link
                href='/dashboard'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              
              <Link
                href='/listings/create'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
                onClick={() => setIsOpen(false)}
              >
                Create Listing
              </Link>
              
              <Link
                href='/settings'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
                onClick={() => setIsOpen(false)}
              >
                Settings
              </Link>
              
              <div className='border-t border-gray-100'>
                <button
                  onClick={handleSignOut}
                  className='block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50'
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
