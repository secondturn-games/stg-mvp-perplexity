'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AuthLink, Alert } from '@/components/auth/auth-form'

function AuthCodeErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  const getErrorMessage = () => {
    switch (error) {
      case 'access_denied':
        return 'Access was denied. You may have cancelled the sign-in process.'
      case 'exchange_failed':
        return 'Failed to complete sign-in. The authentication code may be invalid or expired.'
      case 'no_code':
        return 'No authorization code was provided. Please try signing in again.'
      default:
        return errorDescription || 'An unexpected authentication error occurred.'
    }
  }

  const getErrorTitle = () => {
    switch (error) {
      case 'access_denied':
        return 'Access Denied'
      case 'exchange_failed':
        return 'Sign-in Failed'
      case 'no_code':
        return 'Invalid Request'
      default:
        return 'Authentication Error'
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto w-full max-w-md space-y-6'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            {getErrorTitle()}
          </h1>
          
          <Alert type='error'>
            <div>
              <p className='font-medium'>Unable to complete authentication</p>
              <p className='mt-1'>{getErrorMessage()}</p>
            </div>
          </Alert>
        </div>

        <div className='text-center space-y-4'>
          <div>
            <AuthLink href='/auth/sign-in'>
              <span className='inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'>
                Try signing in again
              </span>
            </AuthLink>
          </div>
          
          <div className='text-sm text-gray-600'>
            <p>
              Need help?{' '}
              <AuthLink href='/contact'>Contact support</AuthLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthCodeError() {
  return (
    <Suspense fallback={
      <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
        <div className='mx-auto w-full max-w-md space-y-6'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-gray-900 mb-4'>
              Loading...
            </h1>
          </div>
        </div>
      </div>
    }>
      <AuthCodeErrorContent />
    </Suspense>
  )
}
