'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth, updateUserProfile } from '@/lib/supabase/server-exports'
import type { AuthActionResult } from '@/lib/auth/types'
import { validateProfileForm, type ProfileFormData } from './validation'

export async function updateProfileAction(formData: FormData): Promise<AuthActionResult> {
  try {
    const user = await requireAuth()
    
    const name = formData.get('name') as string
    const city = formData.get('city') as string

    const profileData: ProfileFormData = {
      name: name?.trim(),
      city: city?.trim() || undefined,
    }

    // Validate form data
    const validationErrors = validateProfileForm(profileData)
    if (Object.keys(validationErrors).length > 0) {
      return {
        success: false,
        error: Object.values(validationErrors)[0],
      }
    }

    // Update profile in database
    const updatedProfile = await updateUserProfile({
      name: profileData.name,
      city: profileData.city || undefined,
    })

    // Revalidate the profile page
    revalidatePath('/profile')

    return {
      success: true,
      data: {
        profile: updatedProfile,
        message: 'Profile updated successfully!',
      },
    }
  } catch (error) {
    console.error('Profile update error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update profile',
    }
  }
}

export async function deleteAccountAction(): Promise<AuthActionResult> {
  try {
    const user = await requireAuth()
    
    // Note: Account deletion would need to be implemented in Supabase
    // This is a placeholder for the action
    // In a real implementation, you'd want to:
    // 1. Delete user's listings
    // 2. Delete user profile
    // 3. Delete auth user
    
    return {
      success: false,
      error: 'Account deletion is not yet implemented',
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to delete account',
    }
  }
}
