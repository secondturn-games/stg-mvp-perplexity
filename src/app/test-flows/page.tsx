'use client'

import { useState } from 'react'
import { runAllFlowTests, logTestingChecklist, MANUAL_TESTING_CHECKLIST, type FlowTestResult } from '@/lib/testing/user-flow-tests'
import { performanceMonitor } from '@/lib/utils/performance'

export default function TestFlowsPage() {
  const [testResults, setTestResults] = useState<FlowTestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runTests = async () => {
    setIsRunning(true)
    setTestResults([])
    
    try {
      const results = await runAllFlowTests()
      setTestResults(results)
    } catch (error) {
      console.error('Test execution failed:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const logChecklist = () => {
    logTestingChecklist()
  }

  const checkPerformance = () => {
    const metrics = performanceMonitor.getMetrics()
    console.log('📊 Current Performance Metrics:', metrics)
    performanceMonitor.logMetrics()
  }

  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>Test Page</h1>
          <p className='text-gray-600'>This page is only available in development mode.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>User Flow Testing</h1>
          <p className='text-gray-600'>
            Comprehensive testing suite for Second Turn Games critical user flows
          </p>
        </div>

        {/* Test Controls */}
        <div className='bg-white rounded-lg border border-gray-200 p-6 mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>Automated Tests</h2>
          <div className='flex flex-wrap gap-4'>
            <button
              onClick={runTests}
              disabled={isRunning}
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {isRunning ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                  Running Tests...
                </>
              ) : (
                'Run All Tests'
              )}
            </button>
            
            <button
              onClick={logChecklist}
              className='inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
            >
              Log Manual Checklist
            </button>
            
            <button
              onClick={checkPerformance}
              className='inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
            >
              Check Performance
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className='bg-white rounded-lg border border-gray-200 p-6 mb-8'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>Test Results</h2>
            
            {/* Summary */}
            <div className='mb-6 p-4 rounded-lg bg-gray-50'>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-center'>
                <div>
                  <div className='text-2xl font-bold text-blue-600'>
                    {testResults.length}
                  </div>
                  <div className='text-sm text-gray-600'>Total Flows</div>
                </div>
                <div>
                  <div className='text-2xl font-bold text-green-600'>
                    {testResults.filter(r => r.overallSuccess).length}
                  </div>
                  <div className='text-sm text-gray-600'>Passed</div>
                </div>
                <div>
                  <div className='text-2xl font-bold text-red-600'>
                    {testResults.filter(r => !r.overallSuccess).length}
                  </div>
                  <div className='text-sm text-gray-600'>Failed</div>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className='space-y-4'>
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${
                    result.overallSuccess ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className='flex items-center justify-between mb-3'>
                    <h3 className='font-semibold text-gray-900'>{result.flowName}</h3>
                    <div className='flex items-center space-x-2'>
                      <span className='text-sm text-gray-600'>{result.duration}ms</span>
                      <span className={`text-sm font-medium ${
                        result.overallSuccess ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {result.overallSuccess ? '✅ PASS' : '❌ FAIL'}
                      </span>
                    </div>
                  </div>
                  
                  <div className='space-y-2'>
                    {result.steps.map((step, stepIndex) => (
                      <div
                        key={stepIndex}
                        className={`text-sm ${
                          step.success ? 'text-green-700' : 'text-red-700'
                        }`}
                      >
                        {step.success ? '✅' : '❌'} {step.message}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manual Testing Checklist */}
        <div className='bg-white rounded-lg border border-gray-200 p-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>Manual Testing Checklist</h2>
          <p className='text-gray-600 mb-6'>
            Use this checklist to manually verify all critical user flows work correctly:
          </p>
          
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {Object.entries(MANUAL_TESTING_CHECKLIST).map(([category, items]) => (
              <div key={category} className='border border-gray-200 rounded-lg p-4'>
                <h3 className='font-semibold text-gray-900 mb-3 capitalize'>
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <ul className='space-y-2'>
                  {items.map((item, index) => (
                    <li key={index} className='text-sm text-gray-700 flex items-start'>
                      <span className='mr-2 mt-0.5'>•</span>
                      <span>{item.replace('✅ ', '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Browser Testing Guide */}
        <div className='mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6'>
          <h3 className='text-lg font-semibold text-blue-900 mb-3'>Browser Testing Guide</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <h4 className='font-medium text-blue-800 mb-2'>Desktop Browsers</h4>
              <ul className='text-sm text-blue-700 space-y-1'>
                <li>• Chrome (latest)</li>
                <li>• Firefox (latest)</li>
                <li>• Safari (latest)</li>
                <li>• Edge (latest)</li>
              </ul>
            </div>
            <div>
              <h4 className='font-medium text-blue-800 mb-2'>Mobile Browsers</h4>
              <ul className='text-sm text-blue-700 space-y-1'>
                <li>• iOS Safari</li>
                <li>• Chrome Mobile</li>
                <li>• Samsung Internet</li>
                <li>• Firefox Mobile</li>
              </ul>
            </div>
          </div>
          
          <div className='mt-4 p-4 bg-blue-100 rounded-md'>
            <h4 className='font-medium text-blue-800 mb-2'>Performance Testing</h4>
            <p className='text-sm text-blue-700'>
              Use browser dev tools to simulate 3G connections and verify:
            </p>
            <ul className='text-sm text-blue-700 mt-2 space-y-1'>
              <li>• First Contentful Paint &lt; 1.5s</li>
              <li>• Largest Contentful Paint &lt; 2.5s</li>
              <li>• Time to Interactive &lt; 3.0s</li>
              <li>• Cumulative Layout Shift &lt; 0.1</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
