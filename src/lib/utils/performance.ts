/**
 * Performance monitoring and optimization utilities
 */

// Performance metrics tracking
export interface PerformanceMetrics {
  FCP: number // First Contentful Paint
  LCP: number // Largest Contentful Paint
  FID: number // First Input Delay
  CLS: number // Cumulative Layout Shift
  TTFB: number // Time to First Byte
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {}
  private observer: PerformanceObserver | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObserver()
    }
  }

  private initializeObserver() {
    try {
      // Observe paint metrics
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.FCP = entry.startTime
          }
        }
      })
      this.observer.observe({ entryTypes: ['paint'] })

      // Observe LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        this.metrics.LCP = lastEntry.startTime
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // Observe FID
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.FID = (entry as any).processingStart - entry.startTime
        }
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // Observe CLS
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        this.metrics.CLS = clsValue
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

    } catch (error) {
      console.warn('Performance monitoring not supported:', error)
    }
  }

  getMetrics(): Partial<PerformanceMetrics> {
    // Add TTFB if available
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        this.metrics.TTFB = navigation.responseStart - navigation.requestStart
      }
    }

    return { ...this.metrics }
  }

  // Log performance metrics to console (development only)
  logMetrics() {
    if (process.env.NODE_ENV === 'development') {
      console.table(this.getMetrics())
    }
  }

  // Send metrics to analytics (placeholder)
  sendMetrics() {
    const metrics = this.getMetrics()
    // In production, send to your analytics service
    console.log('Performance metrics:', metrics)
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Utility functions for performance optimization

/**
 * Debounce function for expensive operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function for frequent events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImages(selector: string = 'img[data-src]') {
  if (typeof window === 'undefined') return

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        img.src = img.dataset.src || ''
        img.classList.remove('lazy')
        observer.unobserve(img)
      }
    })
  })

  document.querySelectorAll(selector).forEach(img => {
    imageObserver.observe(img)
  })
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: 'script' | 'style' | 'font' | 'image') {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  
  if (as === 'font') {
    link.crossOrigin = 'anonymous'
  }
  
  document.head.appendChild(link)
}

/**
 * Measure and log component render time
 */
export function measureRenderTime(componentName: string) {
  if (process.env.NODE_ENV !== 'development') return

  const startTime = performance.now()
  
  return () => {
    const endTime = performance.now()
    console.log(`${componentName} render time: ${endTime - startTime}ms`)
  }
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get connection information for adaptive loading
 */
export function getConnectionInfo() {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return { effectiveType: '4g', downlink: 10 }
  }

  const connection = (navigator as any).connection
  return {
    effectiveType: connection.effectiveType || '4g',
    downlink: connection.downlink || 10,
    rtt: connection.rtt || 50,
    saveData: connection.saveData || false
  }
}

/**
 * Adaptive loading based on network conditions
 */
export function shouldLoadHighQuality(): boolean {
  const connection = getConnectionInfo()
  
  // Don't load high quality on slow connections or save-data mode
  if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
    return false
  }
  
  return true
}

/**
 * Bundle size analyzer (development only)
 */
export function analyzeBundleSize() {
  if (process.env.NODE_ENV !== 'development') return

  // This would integrate with webpack-bundle-analyzer in a real setup
  console.log('Bundle analysis would go here in development')
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  // Log metrics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceMonitor.logMetrics()
    }, 1000)
  })
}
