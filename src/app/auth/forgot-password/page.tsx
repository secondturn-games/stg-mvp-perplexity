'use client'

import { useState } from 'react'
import { resetPasswordAction } from '@/lib/auth/actions'
import { AuthForm, FormField, AuthLink, Alert } from '@/components/auth/auth-form'

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleResetPassword = async (formData: FormData) => {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const result = await resetPasswordAction(formData)

      if (result.success) {
        setSuccess(result.data?.message || 'Password reset instructions sent!')
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
      <AuthForm
        title='Reset your password'
        subtitle='Enter your email address and we&apos;ll send you a link to reset your password.'
        onSubmit={handleResetPassword}
        submitText='Send reset instructions'
        loading={loading}
        footer={
          <div className='space-y-2'>
            <p>
              Remember your password?{' '}
              <AuthLink href='/auth/sign-in'>Sign in</AuthLink>
            </p>
            <p>
              Don&apos;t have an account?{' '}
              <AuthLink href='/auth/sign-up'>Sign up</AuthLink>
            </p>
          </div>
        }
      >
        {error && <Alert type='error'>{error}</Alert>}
        {success && (
          <Alert type='success'>
            <div>
              <p>{success}</p>
              <p className='mt-2'>
                Check your email and click the link to reset your password.
              </p>
            </div>
          </Alert>
        )}

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
  )
}
