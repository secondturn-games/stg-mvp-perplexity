import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/server-exports'
import { CreateListingForm } from '@/components/listings/create-listing-form'

export default async function CreateListingPage() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/sign-in?redirectTo=/listings/create')
  }

  return (
    <div className='max-w-2xl mx-auto py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Create New Listing</h1>
        <p className='mt-2 text-gray-600'>
          List your board game for sale in the marketplace
        </p>
      </div>

      <div className='bg-white rounded-lg border border-gray-200 p-6'>
        <CreateListingForm />
      </div>
    </div>
  )
}



