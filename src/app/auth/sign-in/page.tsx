'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInAction } from '@/lib/auth/actions'
import { AuthForm, FormField, AuthLink, Alert } from '@/components/auth/auth-form'

export default function SignInPage() {
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignIn = async (formData: FormData) => {
    setError('')
    setLoading(true)

    try {
      const result = await signInAction(formData)

      if (result.success) {
        router.push('/') // Redirect to home page
        router.refresh()
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
        title='Sign in to your account'
        subtitle='Welcome back! Please sign in to continue.'
        onSubmit={handleSignIn}
        submitText='Sign in'
        loading={loading}
        footer={
          <div className='space-y-2'>
            <p>
              Don&apos;t have an account?{' '}
              <AuthLink href='/auth/sign-up'>Sign up</AuthLink>
            </p>
            <p>
              <AuthLink href='/auth/forgot-password'>
                Forgot your password?
              </AuthLink>
            </p>
          </div>
        }
      >
        {error && <Alert type='error'>{error}</Alert>}

        <FormField
          label='Email address'
          name='email'
          type='email'
          placeholder='Enter your email'
          required
          autoComplete='email'
        />

        <FormField
          label='Password'
          name='password'
          type='password'
          placeholder='Enter your password'
          required
          autoComplete='current-password'
        />
      </AuthForm>
    </div>
  )
}
