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
          htmlFor={name}
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}
      
      <div className='relative'>
        <button
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full px-3 py-2 text-left border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
            error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 bg-white hover:border-gray-400',
            !selectedCity && 'text-gray-500'
          )}
          aria-haspopup='listbox'
          aria-expanded={isOpen}
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

        {isOpen && (
          <>
            {/* Overlay to close dropdown when clicking outside */}
            <div
              className='fixed inset-0 z-10'
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown menu */}
            <div className='absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto'>
              <ul className='py-1'>
                {/* Empty option */}
                <li>
                  <button
                    type='button'
                    onClick={() => handleSelect('')}
                    className={cn(
                      'w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50',
                      !selectedCity && 'bg-blue-50 text-blue-600'
                    )}
                  >
                    <span className='text-gray-500 italic'>No city selected</span>
                  </button>
                </li>
                
                {/* City options */}
                {LATVIAN_CITIES.map((city) => (
                  <li key={city}>
                    <button
                      type='button'
                      onClick={() => handleSelect(city)}
                      className={cn(
                        'w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors',
                        selectedCity === city && 'bg-blue-50 text-blue-600 font-medium'
                      )}
                    >
                      {city}
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
