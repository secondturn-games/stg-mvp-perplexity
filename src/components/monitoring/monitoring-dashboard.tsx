'use client'

import { useState, useEffect } from 'react'
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Database, 
  Globe, 
  TrendingUp, 
  Users, 
  Zap,
  AlertTriangle,
  Server,
  Monitor
} from 'lucide-react'

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical'
  uptime: string
  responseTime: number
  errorRate: number
  lastChecked: string
}

interface PerformanceMetrics {
  apiResponseTime: number
  databaseQueryTime: number
  pageLoadTime: number
  coreWebVitals: {
    lcp: number
    fid: number
    cls: number
  }
}

interface BusinessMetrics {
  dailyActiveUsers: number
  listingsCreated: number
  searchQueries: number
  conversionRate: number
}

/**
 * Monitoring Dashboard Component
 * Displays real-time system health, performance, and business metrics
 */
export function MonitoringDashboard() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null)
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMonitoringData()
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchMonitoringData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchMonitoringData = async () => {
    try {
      // In a real implementation, these would be actual API calls
      // For now, we'll simulate the data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data - replace with actual API calls
      setSystemHealth({
        status: 'healthy',
        uptime: '99.9%',
        responseTime: 145,
        errorRate: 0.2,
        lastChecked: new Date().toISOString(),
      })

      setPerformanceMetrics({
        apiResponseTime: 234,
        databaseQueryTime: 89,
        pageLoadTime: 1.8,
        coreWebVitals: {
          lcp: 1.2,
          fid: 45,
          cls: 0.05,
        },
      })

      setBusinessMetrics({
        dailyActiveUsers: 127,
        listingsCreated: 8,
        searchQueries: 342,
        conversionRate: 6.3,
      })

      setLoading(false)
    } catch (err) {
      setError('Failed to fetch monitoring data')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        <span className='ml-3 text-gray-600'>Loading monitoring data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
        <div className='flex items-center'>
          <AlertCircle className='h-6 w-6 text-red-600 mr-3' />
          <div>
            <h3 className='text-lg font-medium text-red-800'>Monitoring Error</h3>
            <p className='text-red-700 mt-1'>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {/* System Health Overview */}
      <div className='bg-white rounded-lg shadow p-6'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
          <Activity className='h-6 w-6 mr-2 text-green-600' />
          System Health
        </h2>
        
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <HealthCard
            title='System Status'
            value={systemHealth?.status || 'Unknown'}
            icon={systemHealth?.status === 'healthy' ? CheckCircle : AlertTriangle}
            color={systemHealth?.status === 'healthy' ? 'green' : 'yellow'}
          />
          
          <HealthCard
            title='Uptime'
            value={systemHealth?.uptime || 'N/A'}
            icon={Server}
            color='blue'
          />
          
          <HealthCard
            title='Response Time'
            value={`${systemHealth?.responseTime || 0}ms`}
            icon={Zap}
            color={systemHealth && systemHealth.responseTime < 200 ? 'green' : 'yellow'}
          />
          
          <HealthCard
            title='Error Rate'
            value={`${systemHealth?.errorRate || 0}%`}
            icon={AlertCircle}
            color={systemHealth && systemHealth.errorRate < 1 ? 'green' : 'red'}
          />
        </div>
      </div>

      {/* Performance Metrics */}
      <div className='bg-white rounded-lg shadow p-6'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
          <Monitor className='h-6 w-6 mr-2 text-blue-600' />
          Performance Metrics
        </h2>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <MetricCard
            title='API Response Time'
            value={`${performanceMetrics?.apiResponseTime || 0}ms`}
            target='< 500ms'
            status={performanceMetrics && performanceMetrics.apiResponseTime < 500 ? 'good' : 'warning'}
          />
          
          <MetricCard
            title='Database Query Time'
            value={`${performanceMetrics?.databaseQueryTime || 0}ms`}
            target='< 100ms'
            status={performanceMetrics && performanceMetrics.databaseQueryTime < 100 ? 'good' : 'warning'}
          />
          
          <MetricCard
            title='Page Load Time'
            value={`${performanceMetrics?.pageLoadTime || 0}s`}
            target='< 2.5s'
            status={performanceMetrics && performanceMetrics.pageLoadTime < 2.5 ? 'good' : 'warning'}
          />
          
          <MetricCard
            title='Core Web Vitals'
            value='Good'
            target='All metrics in good range'
            status='good'
          />
        </div>

        {/* Core Web Vitals Detail */}
        {performanceMetrics && (
          <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-4'>
            <WebVitalCard
              title='LCP (Largest Contentful Paint)'
              value={`${performanceMetrics.coreWebVitals.lcp}s`}
              target='< 2.5s'
              status={performanceMetrics.coreWebVitals.lcp < 2.5 ? 'good' : 'warning'}
            />
            
            <WebVitalCard
              title='FID (First Input Delay)'
              value={`${performanceMetrics.coreWebVitals.fid}ms`}
              target='< 100ms'
              status={performanceMetrics.coreWebVitals.fid < 100 ? 'good' : 'warning'}
            />
            
            <WebVitalCard
              title='CLS (Cumulative Layout Shift)'
              value={performanceMetrics.coreWebVitals.cls.toFixed(3)}
              target='< 0.1'
              status={performanceMetrics.coreWebVitals.cls < 0.1 ? 'good' : 'warning'}
            />
          </div>
        )}
      </div>

      {/* Business Metrics */}
      <div className='bg-white rounded-lg shadow p-6'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
          <TrendingUp className='h-6 w-6 mr-2 text-purple-600' />
          Business Metrics (Last 24h)
        </h2>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <BusinessCard
            title='Daily Active Users'
            value={businessMetrics?.dailyActiveUsers || 0}
            icon={Users}
            trend='+12%'
            trendDirection='up'
          />
          
          <BusinessCard
            title='Listings Created'
            value={businessMetrics?.listingsCreated || 0}
            icon={Globe}
            trend='+5%'
            trendDirection='up'
          />
          
          <BusinessCard
            title='Search Queries'
            value={businessMetrics?.searchQueries || 0}
            icon={Database}
            trend='+18%'
            trendDirection='up'
          />
          
          <BusinessCard
            title='Conversion Rate'
            value={`${businessMetrics?.conversionRate || 0}%`}
            icon={TrendingUp}
            trend='+0.8%'
            trendDirection='up'
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className='bg-white rounded-lg shadow p-6'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>
          Quick Actions
        </h2>
        
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <ActionButton
            title='View Vercel Analytics'
            description='Check detailed user analytics and traffic patterns'
            href='https://vercel.com/dashboard'
            external
          />
          
          <ActionButton
            title='Open Logflare Dashboard'
            description='Analyze logs and system performance metrics'
            href='https://logflare.app'
            external
          />
          
          <ActionButton
            title='Supabase Monitoring'
            description='Monitor database performance and operations'
            href='https://supabase.com/dashboard'
            external
          />
        </div>
      </div>

      {/* System Information */}
      <div className='bg-gray-50 rounded-lg p-4 text-sm text-gray-600'>
        <div className='flex items-center justify-between'>
          <span>Last updated: {systemHealth ? new Date(systemHealth.lastChecked).toLocaleString() : 'Never'}</span>
          <button
            onClick={fetchMonitoringData}
            className='text-blue-600 hover:text-blue-700 font-medium'
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper Components

function HealthCard({ 
  title, 
  value, 
  icon: Icon, 
  color 
}: {
  title: string
  value: string
  icon: any
  color: 'green' | 'yellow' | 'red' | 'blue'
}) {
  const colorClasses = {
    green: 'text-green-600 bg-green-50 border-green-200',
    yellow: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    red: 'text-red-600 bg-red-50 border-red-200',
    blue: 'text-blue-600 bg-blue-50 border-blue-200',
  }

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium text-gray-600'>{title}</p>
          <p className='text-2xl font-bold mt-1'>{value}</p>
        </div>
        <Icon className='h-8 w-8' />
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  target,
  status
}: {
  title: string
  value: string
  target: string
  status: 'good' | 'warning' | 'critical'
}) {
  const statusColors = {
    good: 'text-green-600',
    warning: 'text-yellow-600',
    critical: 'text-red-600',
  }

  return (
    <div className='p-4 bg-gray-50 rounded-lg'>
      <h3 className='text-sm font-medium text-gray-700'>{title}</h3>
      <p className={`text-2xl font-bold mt-1 ${statusColors[status]}`}>{value}</p>
      <p className='text-xs text-gray-500 mt-1'>Target: {target}</p>
    </div>
  )
}

function WebVitalCard({
  title,
  value,
  target,
  status
}: {
  title: string
  value: string
  target: string
  status: 'good' | 'warning' | 'critical'
}) {
  const statusColors = {
    good: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    critical: 'bg-red-100 text-red-800 border-red-200',
  }

  return (
    <div className={`p-3 rounded-lg border ${statusColors[status]}`}>
      <h4 className='text-sm font-medium'>{title}</h4>
      <p className='text-xl font-bold mt-1'>{value}</p>
      <p className='text-xs mt-1'>Target: {target}</p>
    </div>
  )
}

function BusinessCard({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection
}: {
  title: string
  value: number | string
  icon: any
  trend: string
  trendDirection: 'up' | 'down'
}) {
  return (
    <div className='p-4 bg-gray-50 rounded-lg'>
      <div className='flex items-center justify-between'>
        <div className='flex-1'>
          <p className='text-sm font-medium text-gray-600'>{title}</p>
          <p className='text-2xl font-bold mt-1'>{value}</p>
          <div className='flex items-center mt-1'>
            <span className={`text-sm font-medium ${
              trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend}
            </span>
          </div>
        </div>
        <Icon className='h-8 w-8 text-gray-400' />
      </div>
    </div>
  )
}

function ActionButton({
  title,
  description,
  href,
  external = false
}: {
  title: string
  description: string
  href: string
  external?: boolean
}) {
  const Component = external ? 'a' : 'button'
  const props = external ? { href, target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <Component
      {...props}
      className='p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300'
    >
      <h3 className='font-medium text-gray-900'>{title}</h3>
      <p className='text-sm text-gray-600 mt-1'>{description}</p>
    </Component>
  )
}
