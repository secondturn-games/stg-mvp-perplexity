import type { User } from '@/lib/supabase/types'

interface ProfileViewProps {
  user: User
  onEdit: () => void
}

export function ProfileView({ user, onEdit }: ProfileViewProps) {
  return (
    <div className='bg-white rounded-lg border border-gray-200 p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold text-gray-900'>Profile Information</h2>
        <button
          onClick={onEdit}
          className='px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors'
        >
          Edit Profile
        </button>
      </div>

      <div className='space-y-6'>
        {/* Avatar section */}
        <div className='flex items-center space-x-4'>
          <div className='h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center'>
            <span className='text-2xl font-bold text-white'>
              {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h3 className='text-lg font-medium text-gray-900'>{user.name}</h3>
            <p className='text-gray-600'>{user.email}</p>
          </div>
        </div>

        {/* Profile details */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Full Name
            </label>
            <div className='px-3 py-2 bg-gray-50 border border-gray-200 rounded-md'>
              <span className='text-gray-900'>{user.name || 'Not provided'}</span>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email Address
            </label>
            <div className='px-3 py-2 bg-gray-50 border border-gray-200 rounded-md'>
              <span className='text-gray-900'>{user.email}</span>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              City
            </label>
            <div className='px-3 py-2 bg-gray-50 border border-gray-200 rounded-md'>
              <span className='text-gray-900'>{user.city || 'Not specified'}</span>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Member Since
            </label>
            <div className='px-3 py-2 bg-gray-50 border border-gray-200 rounded-md'>
              <span className='text-gray-900'>
                {new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
