import { ErrorHandlingExamples } from '@/components/examples/error-handling-examples'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sentry Error Handling Test',
  description: 'Test page for demonstrating Sentry error tracking and monitoring',
  robots: {
    index: false,
    follow: false,
  },
}

export default function TestSentryPage() {
  return (
    <div className='max-w-4xl mx-auto py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>
          Sentry Error Tracking Test Page
        </h1>
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <p className='text-blue-800'>
            <strong>🔍 Testing Instructions:</strong>
          </p>
          <ul className='mt-2 text-blue-700 space-y-1'>
            <li>• Use the examples below to trigger various types of errors</li>
            <li>• Check your Sentry dashboard to see captured errors and events</li>
            <li>• Monitor breadcrumbs and user context in Sentry</li>
            <li>• Test error boundaries and recovery mechanisms</li>
          </ul>
        </div>
      </div>

      <ErrorHandlingExamples />

      <div className='mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg'>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>
          🎯 What to Check in Sentry:
        </h3>
        <ul className='text-gray-700 space-y-1'>
          <li>• <strong>Issues:</strong> Captured errors with stack traces</li>
          <li>• <strong>Performance:</strong> Transaction traces and slow operations</li>
          <li>• <strong>Breadcrumbs:</strong> User actions leading to errors</li>
          <li>• <strong>User Context:</strong> User information and session data</li>
          <li>• <strong>Tags:</strong> Error categorization and filtering</li>
          <li>• <strong>Releases:</strong> Error tracking across deployments</li>
        </ul>
      </div>
    </div>
  )
}

/**
 * This page is only available in development
 * Remove or protect this route in production
 */
