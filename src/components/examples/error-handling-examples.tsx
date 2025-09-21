'use client'

import { useState } from 'react'
import * as Sentry from '@sentry/nextjs'
import { 
  captureCustomError, 
  trackUserInteraction, 
  trackApiError,
  trackBusinessError,
  trackPerformanceIssue 
} from '@/lib/monitoring/error-tracking'
import { FormErrorBoundary } from '@/components/error-boundaries/form-error-boundary'

/**
 * Example components demonstrating proper error handling with Sentry
 * These examples show how to integrate Sentry throughout your application
 */

/**
 * Example: API Call with Error Handling
 */
export function ApiCallExample() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleApiCall = async () => {
    setLoading(true)
    setError(null)
    
    // Track user interaction
    trackUserInteraction('click', 'api-call-button', {
      feature: 'example-api',
    })

    try {
      const startTime = Date.now()
      
      // Add breadcrumb for API call start
      Sentry.addBreadcrumb({
        message: 'Starting API call to /api/listings',
        category: 'api',
        level: 'info',
      })

      const response = await fetch('/api/listings?page=1&limit=5')
      const duration = Date.now() - startTime
      
      // Track performance if slow
      trackPerformanceIssue('api-call', duration, 1000, {
        endpoint: '/api/listings',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'API call failed')
      }

      const data = await response.json()
      setResult(data)

      // Track successful API call
      Sentry.addBreadcrumb({
        message: 'API call completed successfully',
        category: 'api',
        level: 'info',
        data: {
          duration,
          resultCount: data.data?.length || 0,
        },
      })

    } catch (err) {
      const error = err as Error
      setError(error.message)

      // Track API error with context
      trackApiError(
        '/api/listings',
        'GET',
        500,
        error,
        {
          userAction: 'example-api-call',
          component: 'ApiCallExample',
        }
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-4 border border-gray-200 rounded-lg'>
      <h3 className='text-lg font-medium mb-4'>API Call Error Handling Example</h3>
      
      <button
        onClick={handleApiCall}
        disabled={loading}
        className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors'
      >
        {loading ? 'Loading...' : 'Test API Call'}
      </button>

      {error && (
        <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700'>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className='mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-700'>
          <strong>Success:</strong> Loaded {result.data?.length || 0} listings
        </div>
      )}
    </div>
  )
}

/**
 * Example: Form with Error Boundary
 */
export function FormWithErrorBoundaryExample() {
  const [shouldThrowError, setShouldThrowError] = useState(false)

  const ExampleForm = () => {
    if (shouldThrowError) {
      throw new Error('Intentional form error for testing')
    }

    return (
      <form className='space-y-4'>
        <div>
          <label htmlFor='test-input' className='block text-sm font-medium text-gray-700'>
            Test Input
          </label>
          <input
            id='test-input'
            type='text'
            className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2'
            placeholder='Enter some text'
          />
        </div>
        
        <button
          type='button'
          onClick={() => setShouldThrowError(true)}
          className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors'
        >
          Trigger Form Error
        </button>
      </form>
    )
  }

  return (
    <div className='p-4 border border-gray-200 rounded-lg'>
      <h3 className='text-lg font-medium mb-4'>Form Error Boundary Example</h3>
      
      <FormErrorBoundary 
        formName='Example Form'
        onReset={() => setShouldThrowError(false)}
      >
        <ExampleForm />
      </FormErrorBoundary>
    </div>
  )
}

/**
 * Example: Business Logic Error
 */
export function BusinessLogicExample() {
  const [items, setItems] = useState<string[]>([])

  const handleAddItem = () => {
    try {
      // Simulate business logic
      const newItem = `Item ${items.length + 1}`
      
      // Business rule: Maximum 5 items
      if (items.length >= 5) {
        const error = new Error('Cannot add more than 5 items')
        
        // Track business error
        trackBusinessError(
          'itemLimitExceeded',
          'User tried to add more than 5 items',
          {
            currentItemCount: items.length,
            attemptedItem: newItem,
            maxItems: 5,
          }
        )
        
        throw error
      }

      setItems([...items, newItem])
      
      // Track successful action
      trackUserInteraction('add-item', 'business-logic-example', {
        itemCount: items.length + 1,
      })

    } catch (error) {
      // Capture business logic error
      captureCustomError(error as Error, {
        component: 'BusinessLogicExample',
        action: 'addItem',
        severity: 'warning',
        additional: {
          currentItemCount: items.length,
          maxItems: 5,
        },
      })

      alert((error as Error).message) // Simple error display for example
    }
  }

  return (
    <div className='p-4 border border-gray-200 rounded-lg'>
      <h3 className='text-lg font-medium mb-4'>Business Logic Error Example</h3>
      
      <div className='space-y-2 mb-4'>
        {items.map((item, index) => (
          <div key={index} className='p-2 bg-gray-100 rounded'>
            {item}
          </div>
        ))}
      </div>

      <button
        onClick={handleAddItem}
        className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'
      >
        Add Item (Max 5)
      </button>

      <p className='mt-2 text-sm text-gray-600'>
        Items: {items.length}/5 (Try adding more than 5 to see error tracking)
      </p>
    </div>
  )
}

/**
 * Example: Async Error Handling
 */
export function AsyncErrorExample() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [result, setResult] = useState<string | null>(null)

  const handleAsyncOperation = async () => {
    setStatus('loading')
    setResult(null)

    try {
      // Track operation start
      trackUserInteraction('start-async-operation', 'async-example')

      // Simulate async operation that might fail
      const success = Math.random() > 0.5 // 50% chance of failure

      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate delay

      if (!success) {
        throw new Error('Simulated async operation failure')
      }

      setResult('Async operation completed successfully!')
      setStatus('success')

      // Track successful operation
      Sentry.addBreadcrumb({
        message: 'Async operation completed',
        category: 'async-operation',
        level: 'info',
      })

    } catch (error) {
      setStatus('error')
      setResult((error as Error).message)

      // Capture async error with context
      captureCustomError(error as Error, {
        component: 'AsyncErrorExample',
        action: 'asyncOperation',
        severity: 'warning',
        additional: {
          operationType: 'simulated-async',
          timestamp: new Date().toISOString(),
        },
      })
    }
  }

  return (
    <div className='p-4 border border-gray-200 rounded-lg'>
      <h3 className='text-lg font-medium mb-4'>Async Error Handling Example</h3>
      
      <button
        onClick={handleAsyncOperation}
        disabled={status === 'loading'}
        className='px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 transition-colors'
      >
        {status === 'loading' ? 'Processing...' : 'Start Async Operation (50% fail rate)'}
      </button>

      {result && (
        <div className={`mt-4 p-3 rounded ${
          status === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {result}
        </div>
      )}
    </div>
  )
}

/**
 * Example: Component with Manual Error Tracking
 */
export function ManualErrorTrackingExample() {
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const handleCustomError = () => {
    try {
      // Simulate custom error
      throw new Error('This is a custom error for demonstration')
    } catch (error) {
      addLog('Custom error captured')
      
      captureCustomError(error as Error, {
        component: 'ManualErrorTrackingExample',
        action: 'customError',
        severity: 'warning',
        additional: {
          userTriggered: true,
          feature: 'error-tracking-demo',
        },
      })
    }
  }

  const handleBreadcrumb = () => {
    Sentry.addBreadcrumb({
      message: 'User clicked breadcrumb button',
      category: 'user-action',
      level: 'info',
      data: {
        component: 'ManualErrorTrackingExample',
        timestamp: new Date().toISOString(),
      },
    })
    
    addLog('Breadcrumb added to Sentry')
  }

  const handleCustomEvent = () => {
    Sentry.captureMessage('Custom event triggered', 'info')
    addLog('Custom event sent to Sentry')
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className='p-4 border border-gray-200 rounded-lg'>
      <h3 className='text-lg font-medium mb-4'>Manual Error Tracking Example</h3>
      
      <div className='space-y-2 mb-4'>
        <button
          onClick={handleCustomError}
          className='block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors'
        >
          Trigger Custom Error
        </button>
        
        <button
          onClick={handleBreadcrumb}
          className='block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
        >
          Add Breadcrumb
        </button>
        
        <button
          onClick={handleCustomEvent}
          className='block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'
        >
          Send Custom Event
        </button>
        
        <button
          onClick={clearLogs}
          className='block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors'
        >
          Clear Logs
        </button>
      </div>

      {logs.length > 0 && (
        <div className='mt-4'>
          <h4 className='text-sm font-medium text-gray-700 mb-2'>Activity Log:</h4>
          <div className='bg-gray-50 border rounded p-3 max-h-32 overflow-auto'>
            {logs.map((log, index) => (
              <div key={index} className='text-xs text-gray-600'>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Container component showing all examples
 */
export function ErrorHandlingExamples() {
  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>
          Sentry Error Handling Examples
        </h2>
        <p className='text-gray-600'>
          These examples demonstrate proper error handling and Sentry integration patterns.
          Check your Sentry dashboard to see captured errors and events.
        </p>
      </div>

      <ApiCallExample />
      <FormWithErrorBoundaryExample />
      <BusinessLogicExample />
      <AsyncErrorExample />
      <ManualErrorTrackingExample />
    </div>
  )
}
