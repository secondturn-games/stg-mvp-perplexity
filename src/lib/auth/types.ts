import type { AuthError } from '@supabase/supabase-js'

export interface AuthFormData {
  email: string
  password: string
  name?: string
  confirmPassword?: string
}

export interface AuthActionResult {
  success: boolean
  error?: string
  data?: any
}

export interface AuthState {
  user: any
  loading: boolean
  error?: string
}

// Auth error messages mapping
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'Invalid login credentials': 'Invalid email or password',
  'Email not confirmed': 'Please check your email and click the confirmation link',
  'User already registered': 'An account with this email already exists',
  'Password should be at least 6 characters': 'Password must be at least 6 characters long',
  'Unable to validate email address: invalid format': 'Please enter a valid email address',
  'signup_disabled': 'New registrations are currently disabled',
  'email_address_invalid': 'Please enter a valid email address',
  'weak_password': 'Password is too weak. Please choose a stronger password',
  'email_address_not_authorized': 'This email address is not authorized to sign up',
}

export function getAuthErrorMessage(error: AuthError | Error | string): string {
  if (typeof error === 'string') {
    return AUTH_ERROR_MESSAGES[error] || error
  }
  
  if ('message' in error) {
    return AUTH_ERROR_MESSAGES[error.message] || error.message
  }
  
  return 'An unexpected error occurred'
}

export interface ValidationErrors {
  email?: string
  password?: string
  confirmPassword?: string
  name?: string
}

export function validateAuthForm(data: AuthFormData, isSignUp = false): ValidationErrors {
  const errors: ValidationErrors = {}
  
  // Email validation
  if (!data.email) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address'
  }
  
  // Password validation
  if (!data.password) {
    errors.password = 'Password is required'
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long'
  }
  
  // Sign up specific validations
  if (isSignUp) {
    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long'
    }
    
    if (!data.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
  }
  
  return errors
}
