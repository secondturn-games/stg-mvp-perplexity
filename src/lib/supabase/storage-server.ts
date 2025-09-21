import { createClient } from './server'
import { STORAGE_CONFIG } from './storage-client'

/**
 * Server-side upload function for server actions
 */
export async function uploadImageServer(
  file: File,
  userId: string,
  listingId?: string
): Promise<{ url: string; path: string }> {
  const supabase = await createClient()

  // Generate unique filename
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = file.name.split('.').pop()?.toLowerCase()
  const filename = `${userId}/${listingId || 'temp'}_${timestamp}_${randomString}.${extension}`

  const { data, error } = await supabase.storage
    .from(STORAGE_CONFIG.BUCKET_NAME)
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Server upload error:', error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(STORAGE_CONFIG.BUCKET_NAME)
    .getPublicUrl(data.path)

  return {
    url: urlData.publicUrl,
    path: data.path,
  }
}

/**
 * Server-side delete function
 */
export async function deleteImageServer(path: string): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase.storage
    .from(STORAGE_CONFIG.BUCKET_NAME)
    .remove([path])

  if (error) {
    console.error('Server delete error:', error)
    throw new Error(`Failed to delete image: ${error.message}`)
  }
}

