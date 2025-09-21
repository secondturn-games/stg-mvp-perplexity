'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth, createListing, createServerClient } from '@/lib/supabase/server-exports'
import { isValidLatvianCity } from '@/lib/constants/cities'
import type { AuthActionResult } from '@/lib/auth/types'
import type { GameCondition } from '@/lib/supabase/types'

export async function createListingAction(formData: FormData): Promise<AuthActionResult> {
  try {
    const user = await requireAuth()

    // Ensure user profile exists in the users table
    const supabase = await createServerClient()
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile) {
      // Try to create the user profile if it doesn't exist
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Anonymous User'
        })

      if (insertError) {
        console.error('Failed to create user profile:', insertError)
        return {
          success: false,
          error: 'User profile setup failed. Please try signing in again or contact support.'
        }
      }
    }

    // Extract form data
    const bggIdStr = formData.get('bgg_id') as string
    const gameName = formData.get('game_name') as string
    const priceStr = formData.get('price') as string
    const condition = formData.get('condition') as GameCondition
    const description = formData.get('description') as string
    const city = formData.get('city') as string

    // Extract images
    const images: string[] = []
    let imageIndex = 0
    while (formData.get(`images[${imageIndex}]`)) {
      const imageUrl = formData.get(`images[${imageIndex}]`) as string
      images.push(imageUrl)
      imageIndex++
    }

    // Validate required fields
    if (!gameName?.trim()) {
      return { success: false, error: 'Game name is required' }
    }

    if (!priceStr?.trim()) {
      return { success: false, error: 'Price is required' }
    }

    const price = parseFloat(priceStr)
    if (isNaN(price) || price <= 0) {
      return { success: false, error: 'Please enter a valid price' }
    }

    if (price > 10000) {
      return { success: false, error: 'Price cannot exceed €10,000' }
    }

    if (!condition) {
      return { success: false, error: 'Condition is required' }
    }

    // Validate condition
    const validConditions: GameCondition[] = ['new', 'like_new', 'very_good', 'good', 'acceptable', 'poor']
    if (!validConditions.includes(condition)) {
      return { success: false, error: 'Invalid condition selected' }
    }

    // Validate description length
    if (description && description.length > 500) {
      return { success: false, error: 'Description cannot exceed 500 characters' }
    }

    // Validate city (optional but must be valid if provided)
    if (city && city.trim() !== '' && !isValidLatvianCity(city)) {
      return { success: false, error: 'Please select a valid city' }
    }

    // Validate BGG ID (optional but must be valid if provided)
    const bggId = bggIdStr ? parseInt(bggIdStr, 10) : null
    if (bggIdStr && (isNaN(bggId!) || bggId! <= 0)) {
      return { success: false, error: 'Invalid BoardGameGeek ID' }
    }

    // Create listing
    const listing = await createListing({
      user_id: user.id,
      bgg_id: bggId,
      game_name: gameName.trim(),
      price,
      condition,
      description: description?.trim() || null,
      images,
      city: city?.trim() || null,
      is_active: true,
    })

    // Revalidate relevant pages
    revalidatePath('/listings')
    revalidatePath('/dashboard')

    return {
      success: true,
      data: {
        listing,
        message: 'Listing created successfully!',
      },
    }
  } catch (error) {
    console.error('Create listing error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create listing',
    }
  }
}


