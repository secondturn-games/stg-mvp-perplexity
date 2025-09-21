'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { GameCondition } from '@/lib/supabase/types'

const CONDITION_OPTIONS: { value: GameCondition; label: string; description: string }[] = [
  {
    value: 'new',
    label: 'New',
    description: 'Brand new, still in shrink wrap or never opened'
  },
  {
    value: 'like_new',
    label: 'Like New',
    description: 'Opened but unplayed, all components present and pristine'
  },
  {
    value: 'very_good',
    label: 'Very Good',
    description: 'Lightly played, minor shelf wear, all components present'
  },
  {
    value: 'good',
    label: 'Good',
    description: 'Played several times, some wear but fully functional'
  },
  {
    value: 'acceptable',
    label: 'Acceptable',
    description: 'Well-played, noticeable wear but still playable'
  },
  {
    value: 'poor',
    label: 'Poor',
    description: 'Heavily worn, some components may be damaged or missing'
  },
]

interface ConditionSelectProps {
  name: string
  value?: GameCondition
  onChange?: (value: GameCondition) => void
  error?: string
  required?: boolean
  label?: string
}

export function ConditionSelect({
  name,
  value,
  onChange,
  error,
  required = false,
  label = 'Condition',
}: ConditionSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonId = `${name}-button`
  const listboxId = `${name}-listbox`
  const errorId = `${name}-error`

  const selectedOption = CONDITION_OPTIONS.find(option => option.value === value)

  const handleSelect = (condition: GameCondition) => {
    onChange?.(condition)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className='relative'>
      <label 
        htmlFor={buttonId}
        className='block text-sm font-medium text-gray-900 mb-1'
      >
        {label}
        {required && <span className='text-red-600 ml-1' aria-label='required'>*</span>}
      </label>
      
      <div className='relative'>
        <button
          id={buttonId}
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full px-3 py-2 text-left border rounded-md shadow-sm transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'hover:border-gray-400',
            error
              ? 'border-red-300 bg-red-50 text-red-900'
              : 'border-gray-300 bg-white text-gray-900',
            !selectedOption && 'text-gray-500'
          )}
          aria-haspopup='listbox'
          aria-expanded={isOpen}
          aria-labelledby={buttonId}
          aria-describedby={error ? errorId : `${name}-help`}
          aria-invalid={error ? 'true' : 'false'}
        >
          <div className='flex justify-between items-center'>
            <div>
              {selectedOption ? (
                <div>
                  <span className='font-medium text-gray-900'>{selectedOption.label}</span>
                  <p className='text-xs text-gray-500 mt-0.5'>{selectedOption.description}</p>
                </div>
              ) : (
                <span>Select condition</span>
              )}
            </div>
            <svg
              className={cn(
                'h-4 w-4 text-gray-400 transition-transform',
                isOpen && 'transform rotate-180'
              )}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </div>
        </button>

        {/* Hidden input for form submission */}
        <input
          type='hidden'
          name={name}
          value={value || ''}
        />

        {/* Help text */}
        <div id={`${name}-help`} className='mt-1 text-xs text-gray-600'>
          Select the condition that best describes your game
        </div>

        {isOpen && (
          <>
            {/* Overlay to close dropdown */}
            <div
              className='fixed inset-0 z-10'
              onClick={() => setIsOpen(false)}
              aria-hidden='true'
            />
            
            {/* Dropdown menu */}
            <ul 
              id={listboxId}
              className='absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto py-1'
              role='listbox'
              aria-labelledby={buttonId}
            >
              {CONDITION_OPTIONS.map((option) => (
                <li key={option.value} role='option' aria-selected={value === option.value}>
                  <button
                    type='button'
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      'w-full px-3 py-3 text-left transition-colors',
                      'hover:bg-gray-50 focus:outline-none focus:bg-blue-50 focus:ring-2 focus:ring-blue-500',
                      value === option.value 
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                        : 'text-gray-900'
                    )}
                    aria-selected={value === option.value}
                  >
                    <div>
                      <p className='font-medium'>{option.label}</p>
                      <p className='text-xs text-gray-600 mt-0.5'>{option.description}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

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



