import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/server-exports'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export async function ProtectedRoute({ 
  children, 
  redirectTo = '/auth/sign-in' 
}: ProtectedRouteProps) {
  const user = await getUser()

  if (!user) {
    redirect(redirectTo)
  }

  return <>{children}</>
}

// Client-side protected route component
'use client'
import { useAuth } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ClientProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  fallback?: React.ReactNode
}

export function ClientProtectedRoute({ 
  children, 
  redirectTo = '/auth/sign-in',
  fallback
}: ClientProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  if (loading) {
    return (
      fallback || (
        <div className='flex min-h-screen items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
            <p className='mt-2 text-gray-600'>Loading...</p>
          </div>
        </div>
      )
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
