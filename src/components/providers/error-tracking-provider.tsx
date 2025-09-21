'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initializeErrorTracking, trackPageView } from '@/lib/monitoring/error-tracking'

interface ErrorTrackingProviderProps {
  children: React.ReactNode
}

export function ErrorTrackingProvider({ children }: ErrorTrackingProviderProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Initialize error tracking on mount
    initializeErrorTracking()
  }, [])

  useEffect(() => {
    // Track page views (without user ID for now)
    trackPageView(pathname)
  }, [pathname])

  return <>{children}</>
}
