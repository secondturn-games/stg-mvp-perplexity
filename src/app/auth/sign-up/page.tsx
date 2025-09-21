'use client'

import { useState } from 'react'
import { signUpAction } from '@/lib/auth/actions'
import { AuthForm, FormField, AuthLink, Alert } from '@/components/auth/auth-form'

export default function SignUpPage() {
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (formData: FormData) => {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const result = await signUpAction(formData)

      if (result.success) {
        if (result.data?.needsVerification) {
          setSuccess(result.data.message)
        } else {
          setSuccess('Account created successfully! You can now sign in.')
        }
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
        title='Create your account'
        subtitle='Join Second Turn Games and start trading board games!'
        onSubmit={handleSignUp}
        submitText='Create account'
        loading={loading}
        footer={
          <p>
            Already have an account?{' '}
            <AuthLink href='/auth/sign-in'>Sign in</AuthLink>
          </p>
        }
      >
        {error && <Alert type='error'>{error}</Alert>}
        {success && <Alert type='success'>{success}</Alert>}

        <FormField
          label='Full name'
          name='name'
          type='text'
          placeholder='Enter your full name'
          required
          autoComplete='name'
        />

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
          placeholder='Create a password (min. 6 characters)'
          required
          autoComplete='new-password'
        />

        <FormField
          label='Confirm password'
          name='confirmPassword'
          type='password'
          placeholder='Confirm your password'
          required
          autoComplete='new-password'
        />
      </AuthForm>
    </div>
  )
}
