'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface AuthFormProps {
  title: string
  subtitle?: string
  onSubmit: (formData: FormData) => Promise<void>
  submitText: string
  children: React.ReactNode
  footer?: React.ReactNode
  loading?: boolean
}

export function AuthForm({
  title,
  subtitle,
  onSubmit,
  submitText,
  children,
  footer,
  loading = false,
}: AuthFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='mx-auto w-full max-w-md space-y-6'>
      <header className='text-center'>
        <h1 className='text-2xl font-bold tracking-tight text-gray-900'>
          {title}
        </h1>
        {subtitle && (
          <p className='mt-2 text-sm text-gray-700'>{subtitle}</p>
        )}
      </header>

      <form action={handleSubmit} className='space-y-4' noValidate>
        {children}
        
        <button
          type='submit'
          disabled={isSubmitting || loading}
          className={cn(
            'w-full rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors',
            'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            (isSubmitting || loading) && 'cursor-wait'
          )}
          aria-describedby={isSubmitting || loading ? 'submit-status' : undefined}
        >
          <span>{isSubmitting || loading ? 'Loading...' : submitText}</span>
          {(isSubmitting || loading) && (
            <span id='submit-status' className='sr-only'>
              Please wait while your request is being processed
            </span>
          )}
        </button>
      </form>

      {footer && (
        <footer className='text-center text-sm text-gray-700'>
          {footer}
        </footer>
      )}
    </div>
  )
}

interface FormFieldProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
  error?: string
  autoComplete?: string
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  error,
  autoComplete,
}: FormFieldProps) {
  const inputId = `${name}-input`
  const errorId = `${name}-error`
  
  return (
    <div>
      <label
        htmlFor={inputId}
        className='block text-sm font-medium text-gray-900 mb-1'
      >
        {label}
        {required && (
          <span className='text-red-600 ml-1' aria-label='required'>*</span>
        )}
      </label>
      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? 'true' : 'false'}
        className={cn(
          'mt-1 block w-full rounded-md border px-3 py-2 text-sm transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          'hover:border-gray-400',
          error
            ? 'border-red-300 bg-red-50 text-red-900'
            : 'border-gray-300 bg-white text-gray-900'
        )}
      />
      {error && (
        <p 
          id={errorId}
          className='mt-1 text-sm text-red-600' 
          role='alert'
          aria-live='polite'
        >
          {error}
        </p>
      )}
    </div>
  )
}

interface AuthLinkProps {
  href: string
  children: React.ReactNode
}

export function AuthLink({ href, children }: AuthLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'text-blue-600 hover:text-blue-700 hover:underline transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-sm'
      )}
    >
      {children}
    </Link>
  )
}

interface AlertProps {
  type: 'success' | 'error' | 'info'
  children: React.ReactNode
}

export function Alert({ type, children }: AlertProps) {
  const baseClasses = 'rounded-lg p-4 text-sm flex items-start space-x-3'
  const typeClasses = {
    success: 'bg-green-50 text-green-800 border border-green-200',
    error: 'bg-red-50 text-red-800 border border-red-200',
    info: 'bg-blue-50 text-blue-800 border border-blue-200',
  }

  const icons = {
    success: (
      <svg className='w-5 h-5 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20' aria-hidden='true'>
        <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
      </svg>
    ),
    error: (
      <svg className='w-5 h-5 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20' aria-hidden='true'>
        <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
      </svg>
    ),
    info: (
      <svg className='w-5 h-5 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20' aria-hidden='true'>
        <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
      </svg>
    )
  }

  const testId = type === 'success' ? 'success-alert' : type === 'error' ? 'error-alert' : 'info-alert'
  const roleType = type === 'error' ? 'alert' : 'status'

  return (
    <div 
      data-testid={testId} 
      className={cn(baseClasses, typeClasses[type])}
      role={roleType}
      aria-live='polite'
    >
      {icons[type]}
      <div className='flex-1'>
        {children}
      </div>
    </div>
  )
}
