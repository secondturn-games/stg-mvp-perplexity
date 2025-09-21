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

  const selectedOption = CONDITION_OPTIONS.find(option => option.value === value)

  const handleSelect = (condition: GameCondition) => {
    onChange?.(condition)
    setIsOpen(false)
  }

  return (
    <div className='relative'>
      <label className='block text-sm font-medium text-gray-700 mb-1'>
        {label}
        {required && <span className='text-red-500 ml-1'>*</span>}
      </label>
      
      <div className='relative'>
        <button
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full px-3 py-2 text-left border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
            error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 bg-white hover:border-gray-400',
            !selectedOption && 'text-gray-500'
          )}
          aria-haspopup='listbox'
          aria-expanded={isOpen}
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

        {isOpen && (
          <>
            {/* Overlay to close dropdown */}
            <div
              className='fixed inset-0 z-10'
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown menu */}
            <div className='absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto'>
              <ul className='py-1'>
                {CONDITION_OPTIONS.map((option) => (
                  <li key={option.value}>
                    <button
                      type='button'
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        'w-full px-3 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors',
                        value === option.value && 'bg-blue-50 text-blue-600'
                      )}
                    >
                      <div>
                        <p className='font-medium text-gray-900'>{option.label}</p>
                        <p className='text-xs text-gray-500 mt-0.5'>{option.description}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      {error && (
        <p className='mt-1 text-sm text-red-600'>{error}</p>
      )}
    </div>
  )
}



