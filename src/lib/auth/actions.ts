'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getAuthErrorMessage, validateAuthForm, type AuthActionResult } from './types'
import { authRateLimiter, RATE_LIMITS, getClientIP } from '@/lib/security/rate-limiting'

export async function signUpAction(formData: FormData): Promise<AuthActionResult> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const confirmPassword = formData.get('confirmPassword') as string

  // Validate form data
  const validationErrors = validateAuthForm(
    { email, password, name, confirmPassword },
    true
  )

  if (Object.keys(validationErrors).length > 0) {
    return {
      success: false,
      error: Object.values(validationErrors)[0],
    }
  }

  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          name: name,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    })

    if (error) {
      return {
        success: false,
        error: getAuthErrorMessage(error),
      }
    }

    if (data.user && !data.user.email_confirmed_at) {
      return {
        success: true,
        data: {
          message: 'Please check your email and click the confirmation link to complete your registration.',
          needsVerification: true,
        },
      }
    }

    return {
      success: true,
      data: { user: data.user },
    }
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error as Error),
    }
  }
}

export async function signInAction(formData: FormData): Promise<AuthActionResult> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Get client IP for rate limiting
  const headersList = await headers()
  const forwardedFor = headersList.get('x-forwarded-for')
  const clientIP = forwardedFor ? forwardedFor.split(',')[0]?.trim() || 'unknown' : 'unknown'

  // Validate form data
  const validationErrors = validateAuthForm({ email, password })

  if (Object.keys(validationErrors).length > 0) {
    // Rate limit failed attempts
    authRateLimiter.check(clientIP, RATE_LIMITS.AUTH_ATTEMPTS)
    return {
      success: false,
      error: Object.values(validationErrors)[0],
    }
  }

  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Rate limit failed authentication attempts
      const rateLimit = authRateLimiter.check(clientIP, RATE_LIMITS.AUTH_ATTEMPTS)
      
      if (!rateLimit.allowed) {
        return {
          success: false,
          error: `Too many failed login attempts. Please try again in ${rateLimit.retryAfter} seconds.`,
        }
      }

      return {
        success: false,
        error: getAuthErrorMessage(error),
      }
    }

    return {
      success: true,
      data: { user: data.user },
    }
  } catch (error) {
    // Rate limit on system errors too
    authRateLimiter.check(clientIP, RATE_LIMITS.AUTH_ATTEMPTS)
    
    return {
      success: false,
      error: getAuthErrorMessage(error as Error),
    }
  }
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/sign-in')
}

export async function resetPasswordAction(formData: FormData): Promise<AuthActionResult> {
  const email = formData.get('email') as string

  if (!email) {
    return {
      success: false,
      error: 'Email is required',
    }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      success: false,
      error: 'Please enter a valid email address',
    }
  }

  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
    })

    if (error) {
      return {
        success: false,
        error: getAuthErrorMessage(error),
      }
    }

    return {
      success: true,
      data: {
        message: 'Password reset instructions have been sent to your email.',
      },
    }
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error as Error),
    }
  }
}

export async function updatePasswordAction(formData: FormData): Promise<AuthActionResult> {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || password.length < 6) {
    return {
      success: false,
      error: 'Password must be at least 6 characters long',
    }
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      error: 'Passwords do not match',
    }
  }

  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      return {
        success: false,
        error: getAuthErrorMessage(error),
      }
    }

    return {
      success: true,
      data: {
        message: 'Password updated successfully',
      },
    }
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error as Error),
    }
  }
}

export async function resendConfirmationAction(formData: FormData): Promise<AuthActionResult> {
  const email = formData.get('email') as string

  if (!email) {
    return {
      success: false,
      error: 'Email is required',
    }
  }

  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    })

    if (error) {
      return {
        success: false,
        error: getAuthErrorMessage(error),
      }
    }

    return {
      success: true,
      data: {
        message: 'Confirmation email sent successfully',
      },
    }
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error as Error),
    }
  }
}
