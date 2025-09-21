'use client'

import { useState } from 'react'
import { resendConfirmationAction } from '@/lib/auth/actions'
import { AuthForm, FormField, AuthLink, Alert } from '@/components/auth/auth-form'

export default function VerifyEmailPage() {
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleResendConfirmation = async (formData: FormData) => {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const result = await resendConfirmationAction(formData)

      if (result.success) {
        setSuccess(result.data?.message || 'Confirmation email sent!')
      } else {
        setError(result.error || 'An error occurred')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto w-full max-w-md space-y-6'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900'>
            Verify your email
          </h1>
          <p className='mt-2 text-sm text-gray-600'>
            We sent a confirmation link to your email address. Please check your
            email and click the link to verify your account.
          </p>
        </div>

        <Alert type='info'>
          <div>
            <p className='font-medium'>Check your email</p>
            <p className='mt-1'>
              We&apos;ve sent a verification link to your email address. Click
              the link to complete your registration.
            </p>
          </div>
        </Alert>

        <div className='border-t border-gray-200 pt-6'>
          <AuthForm
            title='Didn&apos;t receive the email?'
            subtitle='Enter your email address and we&apos;ll send another confirmation link.'
            onSubmit={handleResendConfirmation}
            submitText='Resend confirmation email'
            loading={loading}
            footer={
              <div className='space-y-2'>
                <p>
                  Already verified?{' '}
                  <AuthLink href='/auth/sign-in'>Sign in</AuthLink>
                </p>
                <p>
                  Wrong email address?{' '}
                  <AuthLink href='/auth/sign-up'>Sign up again</AuthLink>
                </p>
              </div>
            }
          >
            {error && <Alert type='error'>{error}</Alert>}
            {success && <Alert type='success'>{success}</Alert>}

            <FormField
              label='Email address'
              name='email'
              type='email'
              placeholder='Enter your email address'
              required
              autoComplete='email'
            />
          </AuthForm>
        </div>
      </div>
    </div>
  )
}
