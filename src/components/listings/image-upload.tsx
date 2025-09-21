'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { uploadImage, validateImageFiles, STORAGE_CONFIG } from '@/lib/supabase/client-exports'
import { compressImage, formatFileSize } from '@/lib/utils/image-processing'
import { useAuth } from '@/lib/hooks/use-auth'
import { retry, uploadShouldRetry, RetryError } from '@/lib/utils/retry'
import { ProgressBar, Spinner } from '@/components/ui/loading-states'
import { RetryButton } from '@/components/ui/error-states'

interface ImageUploadData {
  file: File
  preview: string
  uploading: boolean
  uploaded: boolean
  url?: string
  path?: string
  error?: string
  compressed?: boolean
  originalSize?: number
  finalSize?: number
  progress?: number
  retryCount?: number
}

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  onImageDataChange?: (imageData: ImageUploadData[]) => void
  maxImages?: number
  error?: string
  disabled?: boolean
}

export function ImageUpload({ 
  images, 
  onImagesChange, 
  onImageDataChange,
  maxImages = 3, 
  error,
  disabled = false
}: ImageUploadProps) {
  const [imageData, setImageData] = useState<ImageUploadData[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  const updateImageData = (newData: ImageUploadData[]) => {
    setImageData(newData)
    onImageDataChange?.(newData)
    
    // Update images array with uploaded URLs
    const uploadedUrls = newData
      .filter(data => data.uploaded && data.url)
      .map(data => data.url!)
    onImagesChange(uploadedUrls)
  }

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0 || disabled) return
    if (!user) {
      setValidationErrors(['Please sign in to upload images'])
      return
    }

    const remainingSlots = maxImages - imageData.length
    const filesToProcess = Array.from(files).slice(0, remainingSlots)

    if (filesToProcess.length === 0) return

    // Validate files
    const validation = validateImageFiles(filesToProcess)
    if (!validation.valid) {
      setValidationErrors(validation.errors)
      return
    }

    setValidationErrors([])

    // Create initial image data with previews
    const newImageData: ImageUploadData[] = filesToProcess.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: true,
      uploaded: false,
    }))

    const updatedData = [...imageData, ...newImageData]
    updateImageData(updatedData)

    // Process and upload images
    for (let i = 0; i < newImageData.length; i++) {
      const dataIndex = imageData.length + i
      const imageItem = newImageData[i]
      
      if (!imageItem) continue
      
      try {
        // Compress image if needed
        const compressionResult = await compressImage(imageItem.file, {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 0.85,
          maxSizeBytes: STORAGE_CONFIG.MAX_FILE_SIZE
        })

        // Upload to Supabase Storage with retry
        const uploadResult = await retry(
          () => uploadImage(compressionResult.file, user.id),
          {
            maxAttempts: 3,
            baseDelay: 1000,
            shouldRetry: uploadShouldRetry
          }
        )

        // Update the specific image data
        const newData = [...updatedData]
        newData[dataIndex] = {
          ...imageItem,
          uploading: false,
          uploaded: true,
          url: uploadResult.url,
          path: uploadResult.path,
          compressed: compressionResult.compressed,
          originalSize: compressionResult.originalSize,
          finalSize: compressionResult.finalSize,
          progress: 100
        }
        updateImageData(newData)

      } catch (err) {
        console.error('Image upload error:', err)
        
        let errorMessage = 'Upload failed'
        if (err instanceof RetryError) {
          errorMessage = `Upload failed after ${err.attempts} attempts`
        } else if (err instanceof Error) {
          if (err.message.includes('file too large')) {
            errorMessage = 'File is too large. Please choose a smaller image.'
          } else if (err.message.includes('invalid file type')) {
            errorMessage = 'Invalid file type. Please choose a JPG, PNG, or WebP image.'
          } else if (err.message.includes('network')) {
            errorMessage = 'Network error. Please check your connection and try again.'
          }
        }
        
        // Update with error
        const newData = [...updatedData]
        newData[dataIndex] = {
          ...imageItem,
          uploading: false,
          uploaded: false,
          error: errorMessage,
          retryCount: 0
        }
        updateImageData(newData)
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const removeImage = (index: number) => {
    const imageToRemove = imageData[index]
    if (imageToRemove?.preview) {
      URL.revokeObjectURL(imageToRemove.preview)
    }
    
    const newData = imageData.filter((_, i) => i !== index)
    updateImageData(newData)
  }

  const retryUpload = async (index: number) => {
    const imageItem = imageData[index]
    if (!imageItem || !user) return

    const newData = [...imageData]
    newData[index] = { 
      ...imageItem, 
      uploading: true, 
      error: undefined,
      progress: 0,
      retryCount: (imageItem.retryCount || 0) + 1
    }
    updateImageData(newData)

    try {
      // Compress image if needed
      const compressionResult = await compressImage(imageItem.file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.85,
        maxSizeBytes: STORAGE_CONFIG.MAX_FILE_SIZE
      })

      // Upload to Supabase Storage with retry
      const uploadResult = await retry(
        () => uploadImage(compressionResult.file, user.id),
        {
          maxAttempts: 3,
          baseDelay: 1000,
          shouldRetry: uploadShouldRetry
        }
      )

      // Update with success
      newData[index] = {
        ...imageItem,
        uploading: false,
        uploaded: true,
        url: uploadResult.url,
        path: uploadResult.path,
        compressed: compressionResult.compressed,
        originalSize: compressionResult.originalSize,
        finalSize: compressionResult.finalSize,
        error: undefined,
        progress: 100
      }
      updateImageData(newData)

    } catch (err) {
      console.error('Retry upload error:', err)
      
      let errorMessage = 'Upload failed'
      if (err instanceof RetryError) {
        errorMessage = `Upload failed after ${err.attempts} attempts: ${err.lastError.message}`
      } else if (err instanceof Error) {
        if (err.message.includes('file too large')) {
          errorMessage = 'File is too large. Please choose a smaller image.'
        } else if (err.message.includes('invalid file type')) {
          errorMessage = 'Invalid file type. Please choose a JPG, PNG, or WebP image.'
        } else if (err.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        }
      }
      
      // Update with error
      newData[index] = {
        ...imageItem,
        uploading: false,
        uploaded: false,
        error: errorMessage
      }
      updateImageData(newData)
    }
  }

  const canAddMore = imageData.length < maxImages
  const isUploading = imageData.some(data => data.uploading)
  const hasErrors = imageData.some(data => data.error)
  const allUploaded = imageData.length > 0 && imageData.every(data => data.uploaded)

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <label 
          htmlFor='image-upload-input'
          className='block text-sm font-medium text-gray-900'
        >
          Photos ({imageData.filter(d => d.uploaded).length}/{maxImages})
          <span className='text-gray-600 ml-1 font-normal'>- Optional but recommended</span>
        </label>
        {isUploading && (
          <div className='flex items-center text-sm text-blue-600'>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2'></div>
            Uploading...
          </div>
        )}
        {allUploaded && imageData.length > 0 && (
          <div className='flex items-center text-sm text-green-600'>
            <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
            </svg>
            All uploaded
          </div>
        )}
      </div>

      {/* Image Grid */}
      {imageData.length > 0 && (
        <div className='grid grid-cols-3 gap-3'>
          {imageData.map((data, index) => (
            <div key={index} className='relative group'>
              <div className='relative'>
                <div className={cn(
                'relative w-full h-24 rounded-lg border overflow-hidden',
                data.uploaded ? 'border-green-200' : data.error ? 'border-red-200' : 'border-gray-200',
                data.uploading && 'opacity-50'
              )}>
                <Image
                  src={data.preview}
                  alt={`Game image ${index + 1} - ${data.uploaded ? 'uploaded successfully' : data.uploading ? 'uploading' : 'upload failed'}`}
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                />
              </div>
                
                {/* Upload progress overlay */}
                {data.uploading && (
                  <div className='absolute inset-0 bg-black bg-opacity-50 rounded-lg flex flex-col items-center justify-center p-2'>
                    <Spinner size="sm" className="border-white border-t-transparent mb-2" />
                    <div className='text-white text-xs text-center'>
                      {data.retryCount && data.retryCount > 0 ? `Retry ${data.retryCount}` : 'Uploading...'}
                    </div>
                    {data.progress !== undefined && (
                      <div className='w-full mt-2'>
                        <ProgressBar 
                          progress={data.progress} 
                          className="h-1" 
                          showPercentage={false}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Error overlay */}
                {data.error && (
                  <div className='absolute inset-0 bg-red-500 bg-opacity-90 rounded-lg flex flex-col items-center justify-center p-2'>
                    <div className='text-center'>
                      <svg className='w-6 h-6 text-white mx-auto mb-1' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                      </svg>
                      <div className='text-xs text-white mb-2 text-center max-w-full truncate' title={data.error}>
                        Failed
                      </div>
                      <RetryButton
                        onRetry={() => retryUpload(index)}
                        className='text-xs px-2 py-1 bg-white text-red-600 hover:bg-gray-100'
                      >
                        Retry
                      </RetryButton>
                    </div>
                  </div>
                )}

                {/* Success indicator */}
                {data.uploaded && (
                  <div className='absolute top-1 right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center'>
                    <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                    </svg>
                  </div>
                )}
              </div>

              {/* Remove button */}
              <button
                type='button'
                onClick={() => removeImage(index)}
                disabled={data.uploading}
                className={cn(
                  'absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors',
                  'hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
                  data.uploading 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'opacity-0 group-hover:opacity-100 focus:opacity-100'
                )}
                aria-label={`Remove image ${index + 1}`}
              >
                <span aria-hidden='true'>×</span>
              </button>

              {/* Main image indicator */}
              {index === 0 && data.uploaded && (
                <div className='absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded'>
                  Main
                </div>
              )}

              {/* Compression info */}
              {data.compressed && data.originalSize && data.finalSize && (
                <div className='absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1.5 py-0.5 rounded'>
                  {formatFileSize(data.finalSize)}
                </div>
              )}

              {/* Error tooltip */}
              {data.error && (
                <div className='absolute bottom-full left-0 mb-2 p-2 bg-red-600 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 max-w-48'>
                  {data.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
            dragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400',
            disabled && 'opacity-50 cursor-not-allowed',
            (error || validationErrors.length > 0) && 'border-red-300 bg-red-50'
          )}
        >
          <input
            id='image-upload-input'
            ref={fileInputRef}
            type='file'
            multiple
            accept={STORAGE_CONFIG.ALLOWED_MIME_TYPES.join(',')}
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={disabled || isUploading}
            className='sr-only'
            aria-describedby='image-upload-help'
          />
          
          <div className='space-y-2'>
            <svg
              className='mx-auto h-8 w-8 text-gray-400'
              stroke='currentColor'
              fill='none'
              viewBox='0 0 48 48'
            >
              <path
                d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <div>
              <button
                type='button'
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
                className={cn(
                  'text-blue-600 hover:text-blue-700 font-medium transition-colors rounded-md',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  (disabled || isUploading) && 'opacity-50 cursor-not-allowed'
                )}
                aria-describedby='image-upload-help'
              >
                {isUploading ? 'Uploading...' : 'Upload photos'}
              </button>
              <p className='text-sm text-gray-500'>or drag and drop</p>
            </div>
            <p id='image-upload-help' className='text-xs text-gray-600'>
              PNG, JPG, WebP up to {formatFileSize(STORAGE_CONFIG.MAX_FILE_SIZE)} each • {maxImages - imageData.length} more allowed
            </p>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {error && (
        <p className='text-sm text-red-600'>{error}</p>
      )}
      
      {validationErrors.length > 0 && (
        <div className='space-y-1'>
          {validationErrors.map((err, index) => (
            <p key={index} className='text-sm text-red-600'>{err}</p>
          ))}
        </div>
      )}

      {/* Upload Summary */}
      {imageData.length > 0 && (
        <div className='text-xs text-gray-500 space-y-1'>
          {hasErrors && (
            <p className='text-red-600'>Some images failed to upload. Click retry to try again.</p>
          )}
          {imageData.some(d => d.compressed) && (
            <p>Images were automatically compressed to reduce file size.</p>
          )}
        </div>
      )}

      {/* Hidden inputs for form submission - only uploaded images */}
      {imageData
        .filter(data => data.uploaded && data.url)
        .map((data, index) => (
          <input
            key={index}
            type='hidden'
            name={`images[${index}]`}
            value={data.url}
          />
        ))}
    </div>
  )
}

