'use client'

import { useEffect, useState } from 'react'
import { trackPagePerformance } from '@/lib/monitoring/analytics'
import { log } from '@/lib/monitoring/logflare'

interface PerformanceMetrics {
  loadTime?: number
  renderTime?: number
  interactionTime?: number
  cumulativeLayoutShift?: number
  firstContentfulPaint?: number
  largestContentfulPaint?: number
}

interface PerformanceMonitorProps {
  pageName: string
  children: React.ReactNode
}

/**
 * Performance Monitor Component
 * Tracks Core Web Vitals and custom performance metrics
 */
export function PerformanceMonitor({ pageName, children }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const startTime = performance.now()
    let renderTime: number

    // Track initial render time
    const trackRenderTime = () => {
      renderTime = performance.now() - startTime
      setMetrics(prev => ({ ...prev, renderTime }))
    }

    // Track when component finishes loading
    const trackLoadComplete = () => {
      const loadTime = performance.now() - startTime
      setMetrics(prev => ({ ...prev, loadTime }))
      setIsLoading(false)
    }

    // Track Core Web Vitals using Web Vitals API
    const trackWebVitals = () => {
      // Check if Performance Observer is supported
      if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
        // Track Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as any
          if (lastEntry) {
            setMetrics(prev => ({ 
              ...prev, 
              largestContentfulPaint: lastEntry.startTime 
            }))
          }
        })

        try {
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
        } catch (error) {
          console.warn('LCP observer not supported:', error)
        }

        // Track First Contentful Paint (FCP)
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
          if (fcpEntry) {
            setMetrics(prev => ({ 
              ...prev, 
              firstContentfulPaint: fcpEntry.startTime 
            }))
          }
        })

        try {
          fcpObserver.observe({ entryTypes: ['paint'] })
        } catch (error) {
          console.warn('FCP observer not supported:', error)
        }

        // Track Cumulative Layout Shift (CLS)
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0
          const entries = list.getEntries() as any[]
          
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })

          if (clsValue > 0) {
            setMetrics(prev => ({ 
              ...prev, 
              cumulativeLayoutShift: clsValue 
            }))
          }
        })

        try {
          clsObserver.observe({ entryTypes: ['layout-shift'] })
        } catch (error) {
          console.warn('CLS observer not supported:', error)
        }

        // Cleanup observers
        return () => {
          lcpObserver.disconnect()
          fcpObserver.disconnect()
          clsObserver.disconnect()
        }
      }
    }

    // Track first interaction
    const trackFirstInteraction = () => {
      const interactionTime = performance.now() - startTime
      setMetrics(prev => ({ ...prev, interactionTime }))
    }

    // Set up event listeners
    trackRenderTime()
    
    // Track load complete after a short delay to ensure DOM is ready
    setTimeout(trackLoadComplete, 100)
    
    // Set up Web Vitals tracking
    const cleanupWebVitals = trackWebVitals()

    // Track first user interaction
    const interactionEvents = ['click', 'keydown', 'touchstart']
    interactionEvents.forEach(event => {
      document.addEventListener(event, trackFirstInteraction, { once: true })
    })

    // Cleanup function
    return () => {
      cleanupWebVitals?.()
      interactionEvents.forEach(event => {
        document.removeEventListener(event, trackFirstInteraction)
      })
    }
  }, [pageName])

  // Send metrics when component unmounts or metrics are complete
  useEffect(() => {
    const sendMetrics = () => {
      if (!isLoading && Object.keys(metrics).length > 0) {
        // Track with analytics
        trackPagePerformance(pageName, {
          loadTime: metrics.loadTime,
          renderTime: metrics.renderTime,
          interactionTime: metrics.interactionTime,
        })

        // Log performance metrics
        log.performance('page_load_time', metrics.loadTime || 0, 3000, {
          pageName,
          metrics,
        })

        // Log Core Web Vitals if they exceed thresholds
        if (metrics.largestContentfulPaint && metrics.largestContentfulPaint > 2500) {
          log.performance('lcp_slow', metrics.largestContentfulPaint, 2500, {
            pageName,
            metric: 'largest-contentful-paint',
          })
        }

        if (metrics.firstContentfulPaint && metrics.firstContentfulPaint > 1800) {
          log.performance('fcp_slow', metrics.firstContentfulPaint, 1800, {
            pageName,
            metric: 'first-contentful-paint',
          })
        }

        if (metrics.cumulativeLayoutShift && metrics.cumulativeLayoutShift > 0.1) {
          log.performance('cls_high', metrics.cumulativeLayoutShift, 0.1, {
            pageName,
            metric: 'cumulative-layout-shift',
          })
        }
      }
    }

    // Send metrics when loading is complete
    if (!isLoading) {
      sendMetrics()
    }

    // Send metrics on page unload
    const handleUnload = () => {
      sendMetrics()
    }

    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [isLoading, metrics, pageName])

  return (
    <>
      {children}
      {/* Performance metrics display in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className='fixed bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded max-w-xs'>
          <div className='font-bold mb-1'>Performance: {pageName}</div>
          {metrics.loadTime && (
            <div>Load: {Math.round(metrics.loadTime)}ms</div>
          )}
          {metrics.renderTime && (
            <div>Render: {Math.round(metrics.renderTime)}ms</div>
          )}
          {metrics.largestContentfulPaint && (
            <div>LCP: {Math.round(metrics.largestContentfulPaint)}ms</div>
          )}
          {metrics.firstContentfulPaint && (
            <div>FCP: {Math.round(metrics.firstContentfulPaint)}ms</div>
          )}
          {metrics.cumulativeLayoutShift && (
            <div>CLS: {metrics.cumulativeLayoutShift.toFixed(3)}</div>
          )}
        </div>
      )}
    </>
  )
}

/**
 * Hook for tracking custom performance metrics
 */
export function usePerformanceTracking(operation: string) {
  const [startTime] = useState(() => performance.now())

  const trackOperation = (metadata?: Record<string, any>) => {
    const duration = performance.now() - startTime
    
    log.performance(operation, duration, 1000, {
      operation,
      ...metadata,
    })

    return duration
  }

  return { trackOperation }
}
