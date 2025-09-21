/**
 * Image processing utilities for compression and optimization
 */

export interface ImageCompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxSizeBytes?: number
}

export interface ImageProcessingResult {
  file: File
  compressed: boolean
  originalSize: number
  finalSize: number
  compressionRatio: number
}

/**
 * Compress an image file
 */
export async function compressImage(
  file: File,
  options: ImageCompressionOptions = {}
): Promise<ImageProcessingResult> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.85,
    maxSizeBytes = 5 * 1024 * 1024 // 5MB
  } = options

  const originalSize = file.size

  // If file is already small enough, return as-is
  if (originalSize <= maxSizeBytes) {
    return {
      file,
      compressed: false,
      originalSize,
      finalSize: originalSize,
      compressionRatio: 1
    }
  }

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      try {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = calculateDimensions(
          img.width,
          img.height,
          maxWidth,
          maxHeight
        )

        // Set canvas dimensions
        canvas.width = width
        canvas.height = height

        // Draw and compress image
        ctx?.drawImage(img, 0, 0, width, height)

        // Try different quality levels until we get under the size limit
        let currentQuality = quality
        let attempts = 0
        const maxAttempts = 5

        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'))
                return
              }

              const finalSize = blob.size

              // If size is acceptable or we've tried enough times, return result
              if (finalSize <= maxSizeBytes || attempts >= maxAttempts) {
                const compressedFile = new File([blob], file.name, {
                  type: blob.type,
                  lastModified: Date.now()
                })

                resolve({
                  file: compressedFile,
                  compressed: true,
                  originalSize,
                  finalSize,
                  compressionRatio: originalSize / finalSize
                })
              } else {
                // Reduce quality and try again
                attempts++
                currentQuality = Math.max(0.1, currentQuality - 0.15)
                tryCompress()
              }
            },
            file.type,
            currentQuality
          )
        }

        tryCompress()
      } catch (error) {
        reject(new Error(`Image compression failed: ${error}`))
      }
    }

    img.onerror = () => {
      reject(new Error('Failed to load image for compression'))
    }

    img.src = URL.createObjectURL(file)
  })
}

/**
 * Calculate optimal dimensions while maintaining aspect ratio
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let width = originalWidth
  let height = originalHeight

  // Scale down if too wide
  if (width > maxWidth) {
    height = (height * maxWidth) / width
    width = maxWidth
  }

  // Scale down if too tall
  if (height > maxHeight) {
    width = (width * maxHeight) / height
    height = maxHeight
  }

  return {
    width: Math.round(width),
    height: Math.round(height)
  }
}

/**
 * Convert file to WebP format if supported
 */
export async function convertToWebP(
  file: File,
  quality: number = 0.85
): Promise<File> {
  // Check if WebP is supported
  if (!isWebPSupported()) {
    return file
  }

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      try {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file) // Return original if conversion fails
              return
            }

            const webpFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '.webp'),
              {
                type: 'image/webp',
                lastModified: Date.now()
              }
            )

            resolve(webpFile)
          },
          'image/webp',
          quality
        )
      } catch (error) {
        resolve(file) // Return original if conversion fails
      }
    }

    img.onerror = () => {
      resolve(file) // Return original if loading fails
    }

    img.src = URL.createObjectURL(file)
  })
}

/**
 * Check if WebP format is supported
 */
function isWebPSupported(): boolean {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
  } catch {
    return false
  }
}

/**
 * Generate image thumbnail
 */
export async function generateThumbnail(
  file: File,
  size: number = 150
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      try {
        // Calculate square thumbnail dimensions
        const minDimension = Math.min(img.width, img.height)
        const sourceX = (img.width - minDimension) / 2
        const sourceY = (img.height - minDimension) / 2

        canvas.width = size
        canvas.height = size

        ctx?.drawImage(
          img,
          sourceX, sourceY, minDimension, minDimension,
          0, 0, size, size
        )

        resolve(canvas.toDataURL('image/jpeg', 0.8))
      } catch (error) {
        reject(new Error(`Thumbnail generation failed: ${error}`))
      }
    }

    img.onerror = () => {
      reject(new Error('Failed to load image for thumbnail'))
    }

    img.src = URL.createObjectURL(file)
  })
}

/**
 * Process multiple images with compression
 */
export async function processImages(
  files: File[],
  options?: ImageCompressionOptions
): Promise<ImageProcessingResult[]> {
  const results: ImageProcessingResult[] = []
  
  for (const file of files) {
    try {
      const result = await compressImage(file, options)
      results.push(result)
    } catch (error) {
      console.error(`Failed to process ${file.name}:`, error)
      // Add original file if compression fails
      results.push({
        file,
        compressed: false,
        originalSize: file.size,
        finalSize: file.size,
        compressionRatio: 1
      })
    }
  }

  return results
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Get image dimensions
 */
export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      })
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    img.src = URL.createObjectURL(file)
  })
}

