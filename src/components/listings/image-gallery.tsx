'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
  images: string[]
  gameName: string
  className?: string
}

export function ImageGallery({ images, gameName, className }: ImageGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className={cn('aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center', className)}>
        <div className='text-center text-gray-400'>
          <svg className='w-16 h-16 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
            />
          </svg>
          <p className='text-sm'>No images available</p>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  const openLightbox = (index: number) => {
    setCurrentImage(index)
    setLightboxOpen(true)
  }

  return (
    <>
      <div className={cn('space-y-4', className)}>
        {/* Main Image */}
        <div className='relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden group'>
          {images[currentImage] && (
            <Image
              src={images[currentImage]}
              alt={`${gameName} - Image ${currentImage + 1}`}
              fill
              className='object-cover cursor-pointer'
              onClick={() => openLightbox(currentImage)}
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          )}
          
          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className='absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-75'
                aria-label='Previous image'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className='absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-75'
                aria-label='Next image'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </button>
            </>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className='absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded'>
              {currentImage + 1} / {images.length}
            </div>
          )}

          {/* Expand button */}
          <button
            onClick={() => openLightbox(currentImage)}
            className='absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-75'
            aria-label='View full size'
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4' />
            </svg>
          </button>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className='flex space-x-2 overflow-x-auto pb-2'>
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={cn(
                  'flex-shrink-0 relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
                  currentImage === index
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <Image
                  src={image}
                  alt={`${gameName} thumbnail ${index + 1}`}
                  fill
                  className='object-cover'
                  sizes='64px'
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4'>
          <div className='relative max-w-4xl max-h-full'>
            {/* Close button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className='absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors'
              aria-label='Close lightbox'
            >
              <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>

            {/* Main lightbox image */}
            <div className='relative max-w-full max-h-[80vh]'>
              {images[currentImage] && (
                <Image
                  src={images[currentImage]}
                  alt={`${gameName} - Full size image ${currentImage + 1}`}
                  width={800}
                  height={600}
                  className='object-contain max-w-full max-h-full'
                />
              )}
            </div>

            {/* Lightbox navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className='absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-colors'
                  aria-label='Previous image'
                >
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className='absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-colors'
                  aria-label='Next image'
                >
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                  </svg>
                </button>

                {/* Lightbox counter */}
                <div className='absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-75 text-white px-3 py-1 rounded'>
                  {currentImage + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

