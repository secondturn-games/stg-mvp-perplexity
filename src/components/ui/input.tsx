import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Input Component System
 * Uses the custom Tailwind utility classes defined in globals.css
 */

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'surface' | 'elevated' | 'flat' | 'underlined'
  state?: 'default' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  label?: string
  helperText?: string
  errorText?: string
  required?: boolean
  name?: string
}

/**
 * Base Input Component
 */
export function Input({
  variant = 'surface',
  state = 'default',
  size = 'md',
  label,
  helperText,
  errorText,
  required = false,
  className,
  id,
  name,
  ...props
}: InputProps) {
  // Use name or provided id for stable hydration, fallback to a stable pattern
  const inputId = id || (name ? `input-${name}` : `input-${label?.toLowerCase().replace(/\s+/g, '-') || 'field'}`)
  const helperId = helperText ? `${inputId}-helper` : undefined
  const errorId = errorText ? `${inputId}-error` : undefined
  
  const inputClasses = getInputClasses(variant, state, size)
  const finalState = errorText ? 'error' : state

  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-text-primary"
        >
          {label}
          {required && (
            <span className="text-coral ml-1" aria-label="required">*</span>
          )}
        </label>
      )}
      
      <input
        id={inputId}
        className={cn(inputClasses, className)}
        aria-describedby={cn(
          helperId && !errorText ? helperId : undefined,
          errorText ? errorId : undefined
        )}
        aria-invalid={errorText ? 'true' : 'false'}
        {...props}
      />
      
      {helperText && !errorText && (
        <p id={helperId} className="text-sm text-text-muted">
          {helperText}
        </p>
      )}
      
      {errorText && (
        <p id={errorId} className="text-sm text-coral" role="alert">
          {errorText}
        </p>
      )}
    </div>
  )
}

/**
 * Textarea Component
 */
export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  variant?: 'surface' | 'auto'
  state?: 'default' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  label?: string
  helperText?: string
  errorText?: string
  required?: boolean
  name?: string
}

export function Textarea({
  variant = 'surface',
  state = 'default',
  size = 'md',
  label,
  helperText,
  errorText,
  required = false,
  className,
  id,
  name,
  ...props
}: TextareaProps) {
  // Use name or provided id for stable hydration, fallback to a stable pattern
  const textareaId = id || (name ? `textarea-${name}` : `textarea-${label?.toLowerCase().replace(/\s+/g, '-') || 'field'}`)
  const helperId = helperText ? `${textareaId}-helper` : undefined
  const errorId = errorText ? `${textareaId}-error` : undefined
  
  const textareaClasses = getTextareaClasses(variant, state, size)
  const finalState = errorText ? 'error' : state

  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={textareaId}
          className="block text-sm font-medium text-text-primary"
        >
          {label}
          {required && (
            <span className="text-coral ml-1" aria-label="required">*</span>
          )}
        </label>
      )}
      
      <textarea
        id={textareaId}
        className={cn(textareaClasses, className)}
        aria-describedby={cn(
          helperId && !errorText ? helperId : undefined,
          errorText ? errorId : undefined
        )}
        aria-invalid={errorText ? 'true' : 'false'}
        {...props}
      />
      
      {helperText && !errorText && (
        <p id={helperId} className="text-sm text-text-muted">
          {helperText}
        </p>
      )}
      
      {errorText && (
        <p id={errorId} className="text-sm text-coral" role="alert">
          {errorText}
        </p>
      )}
    </div>
  )
}

/**
 * Select Component
 */
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  variant?: 'surface'
  state?: 'default' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  label?: string
  helperText?: string
  errorText?: string
  required?: boolean
  name?: string
  children: React.ReactNode
}

export function Select({
  variant = 'surface',
  state = 'default',
  size = 'md',
  label,
  helperText,
  errorText,
  required = false,
  className,
  id,
  name,
  children,
  ...props
}: SelectProps) {
  // Use name or provided id for stable hydration, fallback to a stable pattern
  const selectId = id || (name ? `select-${name}` : `select-${label?.toLowerCase().replace(/\s+/g, '-') || 'field'}`)
  const helperId = helperText ? `${selectId}-helper` : undefined
  const errorId = errorText ? `${selectId}-error` : undefined
  
  const selectClasses = getSelectClasses(variant, state, size)
  const finalState = errorText ? 'error' : state

  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-text-primary"
        >
          {label}
          {required && (
            <span className="text-coral ml-1" aria-label="required">*</span>
          )}
        </label>
      )}
      
      <select
        id={selectId}
        className={cn(selectClasses, className)}
        aria-describedby={cn(
          helperId && !errorText ? helperId : undefined,
          errorText ? errorId : undefined
        )}
        aria-invalid={errorText ? 'true' : 'false'}
        {...props}
      >
        {children}
      </select>
      
      {helperText && !errorText && (
        <p id={helperId} className="text-sm text-text-muted">
          {helperText}
        </p>
      )}
      
      {errorText && (
        <p id={errorId} className="text-sm text-coral" role="alert">
          {errorText}
        </p>
      )}
    </div>
  )
}

/**
 * Get input classes based on variant, state, and size
 */
function getInputClasses(
  variant: InputProps['variant'],
  state: InputProps['state'],
  size: InputProps['size']
): string {
  const variantClasses = {
    surface: 'input-surface',
    elevated: 'input-elevated',
    flat: 'input-flat',
    underlined: 'input-underlined',
  }

  const stateClasses = {
    default: '',
    success: 'input-success',
    warning: 'input-warning',
    error: 'input-error',
  }

  const sizeClasses = {
    sm: 'input-sm',
    md: '',
    lg: 'input-lg',
  }

  return cn(
    variantClasses[variant || 'surface'],
    stateClasses[state || 'default'],
    sizeClasses[size || 'md']
  )
}

/**
 * Get textarea classes based on variant, state, and size
 */
function getTextareaClasses(
  variant: TextareaProps['variant'],
  state: TextareaProps['state'],
  size: TextareaProps['size']
): string {
  const variantClasses = {
    surface: 'textarea-surface',
    auto: 'textarea-auto',
  }

  const stateClasses = {
    default: '',
    success: 'input-success',
    warning: 'input-warning',
    error: 'input-error',
  }

  const sizeClasses = {
    sm: 'input-sm',
    md: '',
    lg: 'input-lg',
  }

  return cn(
    variantClasses[variant || 'surface'],
    stateClasses[state || 'default'],
    sizeClasses[size || 'md']
  )
}

/**
 * Get select classes based on variant, state, and size
 */
function getSelectClasses(
  variant: SelectProps['variant'],
  state: SelectProps['state'],
  size: SelectProps['size']
): string {
  const variantClasses = {
    surface: 'select-surface',
  }

  const stateClasses = {
    default: '',
    success: 'input-success',
    warning: 'input-warning',
    error: 'input-error',
  }

  const sizeClasses = {
    sm: 'input-sm',
    md: '',
    lg: 'input-lg',
  }

  return cn(
    variantClasses[variant || 'surface'],
    stateClasses[state || 'default'],
    sizeClasses[size || 'md']
  )
}

/**
 * Form Group Component
 * For grouping related form elements
 */
export interface FormGroupProps {
  children: React.ReactNode
  className?: string
}

export function FormGroup({ children, className }: FormGroupProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  )
}
