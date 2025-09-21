'use client'

import { useState } from 'react'
import { LATVIAN_CITIES } from '@/lib/constants/cities'
import { cn } from '@/lib/utils'

interface CitySelectProps {
  name: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  required?: boolean
  placeholder?: string
  label?: string
}

export function CitySelect({
  name,
  value = '',
  onChange,
  error,
  required = false,
  placeholder = 'Select a city',
  label = 'City',
}: CitySelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (city: string) => {
    onChange?.(city)
    setIsOpen(false)
  }

  const selectedCity = value || ''
  const displayValue = selectedCity || placeholder

  return (
    <div className='relative'>
      {label && (
        <label
          htmlFor={`${name}-button`}
          className='block text-sm font-medium text-gray-900 mb-1'
        >
          {label}
          {required && <span className='text-red-600 ml-1' aria-label='required'>*</span>}
        </label>
      )}
      
      <div className='relative'>
        <button
          id={`${name}-button`}
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full px-3 py-2 text-left border rounded-md shadow-sm transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'hover:border-gray-400',
            error
              ? 'border-red-300 bg-red-50 text-red-900'
              : 'border-gray-300 bg-white text-gray-900',
            !selectedCity && 'text-gray-500'
          )}
          aria-haspopup='listbox'
          aria-expanded={isOpen}
          aria-describedby={error ? `${name}-error` : `${name}-help`}
          aria-invalid={error ? 'true' : 'false'}
        >
          <span className='block truncate'>{displayValue}</span>
          <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
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
          </span>
        </button>

        {/* Hidden input for form submission */}
        <input
          type='hidden'
          name={name}
          value={selectedCity}
        />

        {/* Help text */}
        <div id={`${name}-help`} className='mt-1 text-xs text-gray-600'>
          Select your city to help buyers find local listings
        </div>

        {isOpen && (
          <>
            {/* Overlay to close dropdown when clicking outside */}
            <div
              className='fixed inset-0 z-10'
              onClick={() => setIsOpen(false)}
              aria-hidden='true'
            />
            
            {/* Dropdown menu */}
            <ul 
              className='absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto py-1'
              role='listbox'
              aria-labelledby={`${name}-button`}
            >
              {/* Empty option */}
              <li role='option' aria-selected={!selectedCity}>
                <button
                  type='button'
                  onClick={() => handleSelect('')}
                  className={cn(
                    'w-full px-3 py-2 text-left transition-colors',
                    'hover:bg-gray-50 focus:outline-none focus:bg-blue-50 focus:ring-2 focus:ring-blue-500',
                    !selectedCity 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                      : 'text-gray-500'
                  )}
                  aria-selected={!selectedCity}
                >
                  <span className='italic'>No city selected</span>
                </button>
              </li>
              
              {/* City options */}
              {LATVIAN_CITIES.map((city) => (
                <li key={city} role='option' aria-selected={selectedCity === city}>
                  <button
                    type='button'
                    onClick={() => handleSelect(city)}
                    className={cn(
                      'w-full px-3 py-2 text-left transition-colors',
                      'hover:bg-gray-50 focus:outline-none focus:bg-blue-50 focus:ring-2 focus:ring-blue-500',
                      selectedCity === city 
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500 font-medium' 
                        : 'text-gray-900'
                    )}
                    aria-selected={selectedCity === city}
                  >
                    {city}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {error && (
        <p 
          id={`${name}-error`}
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
