'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/supabase'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ButtonSpinner } from '@/components/ui/loading-states'
import { FormError, SuccessAlert } from '@/components/ui/error-states'

interface SellerContactProps {
  listingId: string
  sellerName: string
  sellerEmail?: string // Optional - will be fetched securely if needed
  gameName: string
  price: number
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price)
}

export function SellerContact({ listingId, sellerName, sellerEmail: initialEmail, gameName, price }: SellerContactProps) {
  const { user } = useAuth()
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [sellerEmail, setSellerEmail] = useState(initialEmail)
  const [fetchingContact, setFetchingContact] = useState(false)

  const handleContactSeller = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError('Please sign in to contact the seller')
      return
    }

    if (!message.trim()) {
      setError('Please enter a message')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Simulate sending message (replace with actual implementation)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real implementation, this would send an email or create a message
      console.log('Contact seller:', {
        from: user.email,
        to: sellerEmail,
        subject: `Interested in ${gameName}`,
        message: message.trim()
      })
      
      setSuccess('Message sent successfully! The seller will receive your message via email.')
      setMessage('')
      setIsContactFormOpen(false)
    } catch (err) {
      setError('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchSellerContact = async () => {
    if (!user || sellerEmail) return
    
    setFetchingContact(true)
    setError('')
    
    try {
      const response = await fetch(`/api/listings/${listingId}/contact`)
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please sign in to contact the seller')
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please try again later.')
        } else {
          throw new Error('Failed to get seller contact information')
        }
      }
      
      const data = await response.json()
      setSellerEmail(data.sellerEmail)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get contact information')
    } finally {
      setFetchingContact(false)
    }
  }

  const generateEmailLink = () => {
    if (!sellerEmail) return '#'
    
    const subject = encodeURIComponent(`Interested in ${gameName} - ${formatPrice(price)}`)
    const body = encodeURIComponent(
      `Hi ${sellerName},\n\nI'm interested in your listing for "${gameName}" priced at ${formatPrice(price)}.\n\nPlease let me know if it's still available and we can arrange the details.\n\nThanks!\n\nBest regards,\n${user?.email || 'A potential buyer'}`
    )
    return `mailto:${sellerEmail}?subject=${subject}&body=${body}`
  }

  return (
    <div className='bg-white border border-gray-200 rounded-lg p-6'>
      <div className='mb-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>Seller Information</h3>
        
        <div className='flex items-center space-x-3 mb-4'>
          <div className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center'>
            <span className='text-white font-medium text-sm'>
              {sellerName[0]?.toUpperCase() || 'S'}
            </span>
          </div>
          <div>
            <p className='font-medium text-gray-900'>{sellerName}</p>
            <p className='text-sm text-gray-600'>Seller</p>
          </div>
        </div>

        <div className='bg-gray-50 rounded-lg p-4 mb-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='font-medium text-gray-900'>{gameName}</p>
              <p className='text-2xl font-bold text-blue-600'>{formatPrice(price)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Actions */}
      <div className='space-y-3'>
        {!user ? (
          <div className='text-center p-4 bg-blue-50 rounded-lg'>
            <p className='text-sm text-blue-800 mb-3'>
              Sign in to contact the seller
            </p>
            <Link
              href='/auth/sign-in'
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
            >
              Sign In
            </Link>
          </div>
        ) : (
          <>
            {/* Quick Email Link */}
            {sellerEmail ? (
              <a
                href={generateEmailLink()}
                className='w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
              >
                <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                </svg>
                Email Seller
              </a>
            ) : (
              <button
                onClick={fetchSellerContact}
                disabled={fetchingContact}
                className='w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                {fetchingContact ? (
                  <>
                    <ButtonSpinner />
                    Getting Contact Info...
                  </>
                ) : (
                  <>
                    <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                    </svg>
                    Get Contact Info
                  </>
                )}
              </button>
            )}

            {/* Contact Form Toggle */}
            <button
              type='button'
              onClick={() => setIsContactFormOpen(!isContactFormOpen)}
              className='w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
            >
              <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
              </svg>
              {isContactFormOpen ? 'Hide Message Form' : 'Send Message'}
            </button>

            {/* Contact Form */}
            {isContactFormOpen && (
              <div className='border-t border-gray-200 pt-4 mt-4'>
                <form onSubmit={handleContactSeller} className='space-y-4'>
                  {error && <FormError message={error} />}
                  {success && <SuccessAlert message={success} />}
                  
                  <div>
                    <label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-1'>
                      Your Message
                    </label>
                    <textarea
                      id='message'
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`Hi ${sellerName}, I'm interested in your listing for "${gameName}". Is it still available?`}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none'
                      disabled={loading}
                    />
                  </div>
                  
                  <div className='flex space-x-3'>
                    <button
                      type='button'
                      onClick={() => {
                        setIsContactFormOpen(false)
                        setMessage('')
                        setError('')
                        setSuccess('')
                      }}
                      className='flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      disabled={loading || !message.trim()}
                      className='flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                    >
                      {loading && <ButtonSpinner />}
                      {loading ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>

      {/* Safety Notice */}
      <div className='mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
        <div className='flex'>
          <div className='flex-shrink-0'>
            <svg className='h-5 w-5 text-yellow-400' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
            </svg>
          </div>
          <div className='ml-3'>
            <h4 className='text-sm font-medium text-yellow-800'>Safety First</h4>
            <p className='text-sm text-yellow-700 mt-1'>
              Always meet in public places for transactions. Never send money before seeing the item.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}