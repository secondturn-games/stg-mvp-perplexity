import { createClient } from './client'
import { validateFileSecurely, uploadRateLimiter, generateSecureUploadPath, logFileOperation, SECURE_UPLOAD_CONFIG } from '@/lib/security/file-validation'
import { uploadRateLimiter as rateLimiter, RATE_LIMITS } from '@/lib/security/rate-limiting'

/**
 * Storage configuration
 */
export const STORAGE_CONFIG = {
  BUCKET_NAME: 'listing-images',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  MAX_IMAGES_PER_LISTING: 3,
} as const

/**
 * Upload a file to Supabase Storage (client-side)
 */
export async function uploadImage(
  file: File,
  userId: string,
  listingId?: string
): Promise<{ url: string; path: string }> {
  // Rate limiting check
  const rateLimit = rateLimiter.check(userId, RATE_LIMITS.FILE_UPLOAD)
  if (!rateLimit.allowed) {
    logFileOperation(userId, 'upload', file.name, false, 'Rate limit exceeded')
    throw new Error(`Upload rate limit exceeded. Try again in ${rateLimit.retryAfter} seconds.`)
  }

  // Security validation
  const validation = validateFileSecurely(file, SECURE_UPLOAD_CONFIG)
  if (!validation.isValid) {
    logFileOperation(userId, 'upload', file.name, false, validation.errors.join(', '))
    throw new Error(`File validation failed: ${validation.errors.join(', ')}`)
  }

  // Log warnings if any
  if (validation.warnings.length > 0) {
    console.warn('File upload warnings:', validation.warnings)
  }

  const supabase = createClient()

  try {
    // Generate secure filename
    const secureFilename = generateSecureUploadPath(userId, validation.sanitizedName || file.name)

    const { data, error } = await supabase.storage
      .from(STORAGE_CONFIG.BUCKET_NAME)
      .upload(secureFilename, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type, // Explicitly set content type
      })

    if (error) {
      logFileOperation(userId, 'upload', file.name, false, error.message)
      throw new Error(`Failed to upload image: ${error.message}`)
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_CONFIG.BUCKET_NAME)
      .getPublicUrl(data.path)

    // Log successful upload
    logFileOperation(userId, 'upload', file.name, true)

    return {
      url: urlData.publicUrl,
      path: data.path,
    }
  } catch (error) {
    logFileOperation(userId, 'upload', file.name, false, error instanceof Error ? error.message : 'Unknown error')
    throw error
  }
}

/**
 * Upload multiple images (client-side)
 */
export async function uploadImages(
  files: File[],
  userId: string,
  listingId?: string
): Promise<Array<{ url: string; path: string }>> {
  const uploadPromises = files.map(file => uploadImage(file, userId, listingId))
  return Promise.all(uploadPromises)
}

/**
 * Delete an image from storage (client-side)
 */
export async function deleteImage(path: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase.storage
    .from(STORAGE_CONFIG.BUCKET_NAME)
    .remove([path])

  if (error) {
    console.error('Delete error:', error)
    throw new Error(`Failed to delete image: ${error.message}`)
  }
}

/**
 * Delete multiple images from storage (client-side)
 */
export async function deleteImages(paths: string[]): Promise<void> {
  if (paths.length === 0) return

  const supabase = createClient()
  
  const { error } = await supabase.storage
    .from(STORAGE_CONFIG.BUCKET_NAME)
    .remove(paths)

  if (error) {
    console.error('Batch delete error:', error)
    throw new Error(`Failed to delete images: ${error.message}`)
  }
}

/**
 * Extract storage path from public URL
 */
export function extractStoragePath(publicUrl: string): string | null {
  try {
    const url = new URL(publicUrl)
    const pathParts = url.pathname.split('/')
    const bucketIndex = pathParts.findIndex(part => part === STORAGE_CONFIG.BUCKET_NAME)
    
    if (bucketIndex === -1 || bucketIndex === pathParts.length - 1) {
      return null
    }
    
    return pathParts.slice(bucketIndex + 1).join('/')
  } catch {
    return null
  }
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!STORAGE_CONFIG.ALLOWED_MIME_TYPES.includes(file.type as any)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${STORAGE_CONFIG.ALLOWED_MIME_TYPES.join(', ')}`
    }
  }

  // Check file size
  if (file.size > STORAGE_CONFIG.MAX_FILE_SIZE) {
    const maxSizeMB = STORAGE_CONFIG.MAX_FILE_SIZE / (1024 * 1024)
    return {
      valid: false,
      error: `File size too large. Maximum size: ${maxSizeMB}MB`
    }
  }

  return { valid: true }
}

/**
 * Validate multiple image files
 */
export function validateImageFiles(files: File[]): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (files.length > STORAGE_CONFIG.MAX_IMAGES_PER_LISTING) {
    errors.push(`Too many files. Maximum: ${STORAGE_CONFIG.MAX_IMAGES_PER_LISTING} images`)
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (file) {
      const validation = validateImageFile(file)
      if (!validation.valid) {
        errors.push(`File ${i + 1}: ${validation.error}`)
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
