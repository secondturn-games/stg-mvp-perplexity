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
      <div className='text-center'>
        <h1 className='text-2xl font-bold tracking-tight text-gray-900'>
          {title}
        </h1>
        {subtitle && (
          <p className='mt-2 text-sm text-gray-600'>{subtitle}</p>
        )}
      </div>

      <form action={handleSubmit} className='space-y-4'>
        {children}
        
        <button
          type='submit'
          disabled={isSubmitting || loading}
          className={cn(
            'w-full rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors',
            'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        >
          {isSubmitting || loading ? 'Loading...' : submitText}
        </button>
      </form>

      {footer && (
        <div className='text-center text-sm text-gray-600'>
          {footer}
        </div>
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
  return (
    <div>
      <label
        htmlFor={name}
        className='block text-sm font-medium text-gray-700'
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={cn(
          'mt-1 block w-full rounded-md border px-3 py-2 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 bg-white'
        )}
      />
      {error && (
        <p className='mt-1 text-sm text-red-600'>{error}</p>
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
      className='text-blue-600 hover:text-blue-700 hover:underline'
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
  const baseClasses = 'rounded-lg p-4 text-sm'
  const typeClasses = {
    success: 'bg-green-50 text-green-800 border border-green-200',
    error: 'bg-red-50 text-red-800 border border-red-200',
    info: 'bg-blue-50 text-blue-800 border border-blue-200',
  }

  return (
    <div className={cn(baseClasses, typeClasses[type])}>
      {children}
    </div>
  )
}
