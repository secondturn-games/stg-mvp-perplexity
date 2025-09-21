'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BggGameSelector } from './bgg-game-selector'
import { ConditionSelect } from './condition-select'
import { ImageUpload } from './image-upload'
import { CitySelect } from '@/components/ui/city-select'
// import { FormField, Alert } from '@/components/auth/auth-form'
import { createListingAction } from './actions'
import { cn } from '@/lib/utils'
import { ButtonSpinner, LoadingOverlay } from '@/components/ui/loading-states'
import { FormError, SuccessAlert } from '@/components/ui/error-states'
import type { BggGameDetails } from '@/lib/bgg'
import type { GameCondition } from '@/lib/supabase/types'

interface FormData {
  selectedGame: BggGameDetails | null
  price: string
  condition: GameCondition | ''
  description: string
  images: string[]
  city: string
}

interface FormErrors {
  game?: string
  price?: string
  condition?: string
  description?: string
  images?: string
  city?: string
}

export function CreateListingForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    selectedGame: null,
    price: '',
    condition: '',
    description: '',
    images: [],
    city: '',
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [success, setSuccess] = useState('')

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {}

    // Game validation
    if (!formData.selectedGame) {
      newErrors.game = 'Please select a board game'
    }

    // Price validation
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required'
    } else {
      const price = parseFloat(formData.price)
      if (isNaN(price) || price <= 0) {
        newErrors.price = 'Please enter a valid price'
      } else if (price > 10000) {
        newErrors.price = 'Price cannot exceed €10,000'
      }
    }

    // Condition validation
    if (!formData.condition) {
      newErrors.condition = 'Please select the game condition'
    }

    // Description validation (optional but with length limit)
    if (formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const validationErrors = validateForm()
    setErrors(validationErrors)
    
    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setLoading(true)
    setSubmitError('')
    setSuccess('')

    try {
      // Create FormData for server action
      const submitFormData = new FormData()
      
      if (formData.selectedGame) {
        submitFormData.append('bgg_id', formData.selectedGame.id.toString())
        submitFormData.append('game_name', formData.selectedGame.name)
      }
      
      submitFormData.append('price', formData.price)
      submitFormData.append('condition', formData.condition)
      submitFormData.append('description', formData.description)
      submitFormData.append('city', formData.city)
      
      // Add images
      formData.images.forEach((imageUrl, index) => {
        submitFormData.append(`images[${index}]`, imageUrl)
      })

      const result = await createListingAction(submitFormData)

      if (result.success) {
        setSuccess('Listing created successfully!')
        setTimeout(() => {
          router.push('/dashboard') // Redirect to user dashboard
        }, 2000)
      } else {
        setSubmitError(result.error || 'Failed to create listing')
      }
    } catch (err) {
      setSubmitError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (field in errors && errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field as keyof FormErrors]: undefined }))
    }
  }

  return (
    <div className='relative'>
      <LoadingOverlay isVisible={loading} message="Creating your listing..." />
      
      <form onSubmit={handleSubmit} className='space-y-6'>
        {submitError && <FormError message={submitError} />}
        {success && <SuccessAlert message={success} />}

      {/* BGG Game Selection */}
      <BggGameSelector
        selectedGame={formData.selectedGame}
        onGameSelect={(game) => updateFormData('selectedGame', game)}
        error={errors.game}
      />

      {/* Price and Condition Row */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Price (EUR)
            <span className='text-red-500 ml-1'>*</span>
          </label>
          <div className='relative'>
            <span className='absolute left-3 top-2 text-gray-500'>€</span>
            <input
              type='number'
              step='0.01'
              min='0'
              max='10000'
              value={formData.price}
              onChange={(e) => updateFormData('price', e.target.value)}
              placeholder='0.00'
              className={cn(
                'w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
              )}
            />
          </div>
          {errors.price && (
            <p className='mt-1 text-sm text-red-600'>{errors.price}</p>
          )}
        </div>

        <ConditionSelect
          name='condition'
          value={formData.condition as GameCondition}
          onChange={(condition) => updateFormData('condition', condition)}
          error={errors.condition}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Description
          <span className='text-gray-500 ml-1 font-normal'>- Optional</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          placeholder='Add any additional details about the game condition, included components, etc.'
          maxLength={500}
          rows={4}
          className={cn(
            'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none',
            errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
          )}
        />
        <div className='flex justify-between mt-1'>
          {errors.description ? (
            <p className='text-sm text-red-600'>{errors.description}</p>
          ) : (
            <p className='text-sm text-gray-500'>
              Provide additional details to help buyers
            </p>
          )}
          <p className='text-sm text-gray-500'>
            {formData.description.length}/500
          </p>
        </div>
      </div>

      {/* Images */}
      <ImageUpload
        images={formData.images}
        onImagesChange={(images) => updateFormData('images', images)}
        maxImages={3}
        error={errors.images}
        disabled={loading}
      />

      {/* City */}
      <CitySelect
        name='city'
        label='City'
        value={formData.city}
        onChange={(city) => updateFormData('city', city)}
        placeholder='Select your city (optional)'
        error={errors.city}
      />

      {/* Submit Button */}
      <div className='flex items-center justify-end space-x-3 pt-6 border-t border-gray-200'>
        <button
          type='button'
          onClick={() => router.back()}
          className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={loading}
          className='inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        >
          {loading && <ButtonSpinner />}
          {loading ? 'Creating Listing...' : 'Create Listing'}
        </button>
      </div>
    </form>
    </div>
  )
}
