'use client'

import { useState } from 'react'
import { updateProfileAction } from '@/lib/profile/actions'
import { FormField, Alert } from '@/components/auth/auth-form'
import { CitySelect } from '@/components/ui/city-select'
import type { User } from '@/lib/supabase/types'

interface ProfileEditProps {
  user: User
  onCancel: () => void
  onSuccess: (updatedProfile?: User) => void
}

export function ProfileEdit({ user, onCancel, onSuccess }: ProfileEditProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState(user.city || '')

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await updateProfileAction(formData)

      if (result.success) {
        setSuccess(result.data?.message || 'Profile updated successfully!')
        setTimeout(() => {
          onSuccess(result.data?.profile)
        }, 1500)
      } else {
        setError(result.error || 'Failed to update profile')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-white rounded-lg border border-gray-200 p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold text-gray-900'>Edit Profile</h2>
        <button
          onClick={onCancel}
          className='px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
          disabled={loading}
        >
          Cancel
        </button>
      </div>

      <form action={handleSubmit} className='space-y-6'>
        {error && <Alert type='error'>{error}</Alert>}
        {success && <Alert type='success'>{success}</Alert>}

        {/* Avatar section (read-only) */}
        <div className='flex items-center space-x-4 pb-6 border-b border-gray-200'>
          <div className='h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center'>
            <span className='text-2xl font-bold text-white'>
              {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h3 className='text-lg font-medium text-gray-900'>Profile Picture</h3>
            <p className='text-sm text-gray-600'>
              Profile pictures are automatically generated from your name
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <div className='sm:col-span-2'>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700'
            >
              Full Name
              <span className='text-red-500 ml-1'>*</span>
            </label>
            <input
              id='name'
              name='name'
              type='text'
              placeholder='Enter your full name'
              required
              autoComplete='name'
              defaultValue={user.name || ''}
              className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email Address
            </label>
            <div className='px-3 py-2 bg-gray-100 border border-gray-200 rounded-md'>
              <span className='text-gray-600'>{user.email}</span>
              <p className='text-xs text-gray-500 mt-1'>
                Email cannot be changed here. Contact support if needed.
              </p>
            </div>
          </div>

          <div>
            <CitySelect
              name='city'
              label='City'
              value={selectedCity}
              onChange={setSelectedCity}
              placeholder='Select your city (optional)'
            />
          </div>
        </div>

        <div className='flex items-center justify-end space-x-3 pt-6 border-t border-gray-200'>
          <button
            type='button'
            onClick={onCancel}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={loading}
            className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
