'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { updatePasswordAction } from '@/lib/auth/actions'
import { AuthForm, FormField, AuthLink, Alert } from '@/components/auth/auth-form'

function ResetPasswordContent() {
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if we have the required parameters for password reset
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    
    if (error) {
      setError(errorDescription || 'Invalid or expired reset link')
      setIsValidToken(false)
    } else {
      setIsValidToken(true)
    }
  }, [searchParams])

  const handleUpdatePassword = async (formData: FormData) => {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const result = await updatePasswordAction(formData)

      if (result.success) {
        setSuccess(result.data?.message || 'Password updated successfully!')
        // Redirect to sign in page after 2 seconds
        setTimeout(() => {
          router.push('/auth/sign-in')
        }, 2000)
      } else {
        setError(result.error || 'An error occurred')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (isValidToken === null) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-2 text-gray-600'>Verifying reset link...</p>
        </div>
      </div>
    )
  }

  if (isValidToken === false) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
        <div className='mx-auto w-full max-w-md text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Invalid Reset Link
          </h1>
          <Alert type='error'>
            {error || 'This password reset link is invalid or has expired.'}
          </Alert>
          <div className='mt-6'>
            <AuthLink href='/auth/forgot-password'>
              Request a new password reset link
            </AuthLink>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
      <AuthForm
        title='Set new password'
        subtitle='Enter your new password below.'
        onSubmit={handleUpdatePassword}
        submitText='Update password'
        loading={loading}
        footer={
          <p>
            <AuthLink href='/auth/sign-in'>Back to sign in</AuthLink>
          </p>
        }
      >
        {error && <Alert type='error'>{error}</Alert>}
        {success && (
          <Alert type='success'>
            <div>
              <p>{success}</p>
              <p className='mt-2'>Redirecting to sign in page...</p>
            </div>
          </Alert>
        )}

        <FormField
          label='New password'
          name='password'
          type='password'
          placeholder='Enter your new password (min. 6 characters)'
          required
          autoComplete='new-password'
        />

        <FormField
          label='Confirm new password'
          name='confirmPassword'
          type='password'
          placeholder='Confirm your new password'
          required
          autoComplete='new-password'
        />
      </AuthForm>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-2 text-gray-600'>Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
