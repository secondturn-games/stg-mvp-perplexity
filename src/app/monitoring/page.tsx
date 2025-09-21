import type { Metadata } from 'next'
import { MonitoringDashboard } from '@/components/monitoring/monitoring-dashboard'

export const metadata: Metadata = {
  title: 'Monitoring Dashboard',
  description: 'Production monitoring and analytics dashboard for Second Turn Games',
  robots: {
    index: false,
    follow: false,
  },
}

/**
 * Monitoring Dashboard Page
 * Internal dashboard for monitoring application health and performance
 * This page should be protected in production
 */
export default function MonitoringPage() {
  // In production, add authentication check here
  if (process.env.NODE_ENV === 'production') {
    // Redirect or show access denied for unauthorized users
    // return <AccessDenied />
  }

  return (
    <div className='max-w-7xl mx-auto py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>
          Production Monitoring Dashboard
        </h1>
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <p className='text-blue-800'>
            <strong>🔍 Monitoring Overview:</strong>
          </p>
          <ul className='mt-2 text-blue-700 space-y-1'>
            <li>• Real-time application health and performance metrics</li>
            <li>• API response times and error rates</li>
            <li>• User activity and business intelligence</li>
            <li>• System alerts and notification status</li>
          </ul>
        </div>
      </div>

      <MonitoringDashboard />
    </div>
  )
}
