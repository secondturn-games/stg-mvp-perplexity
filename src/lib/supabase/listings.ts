import { createClient } from './server'
import type {
  Listing,
  ListingInsert,
  ListingUpdate,
  ListingFilters,
  ListingSearchParams,
  ActiveListingWithUser,
} from './types'

/**
 * Get all active listings with pagination and filtering
 */
export async function getListings({
  page = 1,
  limit = 20,
  sortBy = 'created_at',
  sortOrder = 'desc',
  filters = {},
}: ListingSearchParams = {}) {
  const supabase = await createClient()
  let query = supabase
    .from('active_listings_with_users')
    .select('*')

  // Apply filters
  if (filters.city) {
    query = query.eq('city', filters.city)
  }
  
  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice)
  }
  
  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice)
  }
  
  if (filters.condition && filters.condition.length > 0) {
    query = query.in('condition', filters.condition)
  }
  
  if (filters.bggId) {
    query = query.eq('bgg_id', filters.bggId)
  }
  
  if (filters.search) {
    query = query.ilike('game_name', `%${filters.search}%`)
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  // Apply pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) throw error

  return {
    data: data as ActiveListingWithUser[],
    count: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

/**
 * Get a single listing by ID
 */
export async function getListing(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('active_listings_with_users')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as ActiveListingWithUser
}

/**
 * Create a new listing
 */
export async function createListing(listing: ListingInsert) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('listings')
    .insert(listing)
    .select()
    .single()

  if (error) throw error
  return data as Listing
}

/**
 * Update a listing
 */
export async function updateListing(id: string, updates: ListingUpdate) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('listings')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Listing
}

/**
 * Delete a listing
 */
export async function deleteListing(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Toggle listing active status
 */
export async function toggleListingStatus(id: string, isActive: boolean) {
  return updateListing(id, { is_active: isActive })
}

/**
 * Get listings by city
 */
export async function getListingsByCity(city: string, limit = 20) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('active_listings_with_users')
    .select('*')
    .eq('city', city)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as ActiveListingWithUser[]
}

/**
 * Search listings by game name
 */
export async function searchListings(searchTerm: string, limit = 20) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('active_listings_with_users')
    .select('*')
    .ilike('game_name', `%${searchTerm}%`)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as ActiveListingWithUser[]
}

/**
 * Get recent listings
 */
export async function getRecentListings(limit = 10) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('active_listings_with_users')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as ActiveListingWithUser[]
}

/**
 * Get listings by BoardGameGeek ID
 */
export async function getListingsByBggId(bggId: number) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('active_listings_with_users')
    .select('*')
    .eq('bgg_id', bggId)
    .order('price', { ascending: true })

  if (error) throw error
  return data as ActiveListingWithUser[]
}

/**
 * Get unique cities from listings
 */
export async function getListingCities() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('listings')
    .select('city')
    .not('city', 'is', null)
    .eq('is_active', true)

  if (error) throw error
  
  // Extract unique cities
  const cities = [...new Set(data.map(item => item.city).filter(Boolean))]
  return cities.sort()
}
