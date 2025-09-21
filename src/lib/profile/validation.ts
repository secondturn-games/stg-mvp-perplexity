import { isValidLatvianCity } from '@/lib/constants/cities'

export interface ProfileFormData {
  name: string
  city?: string
}

export interface ProfileValidationErrors {
  name?: string
  city?: string
}

export function validateProfileForm(data: ProfileFormData): ProfileValidationErrors {
  const errors: ProfileValidationErrors = {}

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Name is required'
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long'
  } else if (data.name.trim().length > 100) {
    errors.name = 'Name must be less than 100 characters'
  }

  // City validation (optional but must be valid if provided)
  if (data.city && data.city.trim() !== '' && !isValidLatvianCity(data.city)) {
    errors.city = 'Please select a valid city'
  }

  return errors
}

