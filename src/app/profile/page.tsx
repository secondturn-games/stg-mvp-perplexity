import { redirect } from 'next/navigation'
import { getUser, getUserProfile } from '@/lib/supabase/server-exports'
import { ProfilePageContent } from './profile-page-content'

export default async function ProfilePage() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/sign-in?redirectTo=/profile')
  }

  let profile = null
  let error = null

  try {
    profile = await getUserProfile()
  } catch (err) {
    error = 'Failed to load profile'
    console.error('Profile load error:', err)
  }

  return (
    <div className='max-w-4xl mx-auto py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>My Profile</h1>
        <p className='mt-2 text-gray-600'>
          Manage your account information and preferences.
        </p>
      </div>

      <ProfilePageContent profile={profile} error={error} />
    </div>
  )
}
