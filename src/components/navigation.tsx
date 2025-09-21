'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { UserMenu } from './auth/user-menu'

const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'Browse', href: '/listings' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className='border-b border-gray-200 bg-white' role='navigation' aria-label='Main navigation'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 justify-between'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link 
              href='/' 
              className='flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md'
              aria-label='Second Turn Games - Go to homepage'
            >
              <span className='text-xl font-bold text-gray-900'>
                Second Turn Games
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-8'>
            {navigationItems.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  pathname === item.href
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                )}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Sell Button */}
            <Link
              href='/listings/create'
              className={cn(
                'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 transition-colors',
                'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              )}
              aria-label='Create a new listing to sell your board games'
            >
              <svg 
                className='w-4 h-4 mr-2' 
                fill='none' 
                stroke='currentColor' 
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
              </svg>
              Sell
            </Link>
            
            <UserMenu />
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden flex items-center space-x-2'>
            <UserMenu />
            <button
              type='button'
              className={cn(
                'inline-flex items-center justify-center p-2 rounded-md transition-colors',
                'text-gray-400 hover:text-gray-500 hover:bg-gray-100',
                'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500'
              )}
              aria-controls='mobile-menu'
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className='sr-only'>
                {isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}
              </span>
              {!isMobileMenuOpen ? (
                <svg
                  className='block h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                  />
                </svg>
              ) : (
                <svg
                  className='block h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className='md:hidden' id='mobile-menu' role='menu' aria-orientation='vertical'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200'>
            {navigationItems.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 rounded-r-md',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  pathname === item.href
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900'
                )}
                role='menuitem'
                aria-current={pathname === item.href ? 'page' : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Sell Button */}
            <Link
              href='/listings/create'
              className={cn(
                'block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white bg-blue-600 rounded-md mx-3 mt-4 text-center transition-colors',
                'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              )}
              role='menuitem'
              aria-label='Create a new listing to sell your board games'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className='flex items-center justify-center'>
                <svg 
                  className='w-4 h-4 mr-2' 
                  fill='none' 
                  stroke='currentColor' 
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                </svg>
                Sell Your Games
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
