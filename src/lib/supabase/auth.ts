import { createClient } from './server'
import type { User } from '@supabase/supabase-js'

/**
 * Get the current user from the server
 * Use this in Server Components, Server Actions, and Route Handlers
 */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Get the current session from the server
 */
export async function getSession() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser()
  return !!user
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth(): Promise<User> {
  const user = await getUser()
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

/**
 * Get user profile with additional data
 */
export async function getUserProfile() {
  const user = await getUser()
  if (!user) return null

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

/**
 * Update user profile
 */
export async function updateUserProfile(updates: {
  name?: string
  city?: string
}) {
  const user = await requireAuth()
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Get user's listings
 */
export async function getUserListings(userId?: string) {
  const supabase = await createClient()
  const targetUserId = userId || (await requireAuth()).id

  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', targetUserId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Get user's active listings
 */
export async function getUserActiveListings(userId?: string) {
  const supabase = await createClient()
  const targetUserId = userId || (await requireAuth()).id

  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', targetUserId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
