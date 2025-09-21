/**
 * Logflare Integration for Supabase Logs
 * Provides structured logging and monitoring for API routes and database operations
 */

interface LogflareEvent {
  message: string
  level: 'info' | 'warn' | 'error' | 'debug'
  timestamp?: string
  metadata?: Record<string, any>
  source?: string
  user_id?: string
  session_id?: string
}

interface LogflareConfig {
  sourceToken: string
  apiKey?: string
  endpoint?: string
}

class LogflareLogger {
  private config: LogflareConfig
  private buffer: LogflareEvent[] = []
  private flushInterval: NodeJS.Timeout | null = null

  constructor(config: LogflareConfig) {
    this.config = {
      endpoint: 'https://api.logflare.app/logs',
      ...config,
    }

    // Set up automatic flushing in browser
    if (typeof window !== 'undefined') {
      this.setupAutoFlush()
    }
  }

  /**
   * Log an info message
   */
  info(message: string, metadata?: Record<string, any>) {
    this.log('info', message, metadata)
  }

  /**
   * Log a warning message
   */
  warn(message: string, metadata?: Record<string, any>) {
    this.log('warn', message, metadata)
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error, metadata?: Record<string, any>) {
    this.log('error', message, {
      ...metadata,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : undefined,
    })
  }

  /**
   * Log a debug message
   */
  debug(message: string, metadata?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, metadata)
    }
  }

  /**
   * Log API request/response
   */
  logApiCall(
    method: string,
    endpoint: string,
    status: number,
    duration: number,
    metadata?: Record<string, any>
  ) {
    this.log('info', `API ${method} ${endpoint}`, {
      type: 'api_call',
      method,
      endpoint,
      status,
      duration,
      ...metadata,
    })
  }

  /**
   * Log database operation
   */
  logDatabaseOperation(
    operation: string,
    table: string,
    duration: number,
    metadata?: Record<string, any>
  ) {
    this.log('info', `DB ${operation} on ${table}`, {
      type: 'database_operation',
      operation,
      table,
      duration,
      ...metadata,
    })
  }

  /**
   * Log authentication event
   */
  logAuthEvent(
    event: string,
    userId?: string,
    metadata?: Record<string, any>
  ) {
    this.log('info', `Auth: ${event}`, {
      type: 'auth_event',
      event,
      user_id: userId,
      ...metadata,
    })
  }

  /**
   * Log business event
   */
  logBusinessEvent(
    event: string,
    value?: number,
    metadata?: Record<string, any>
  ) {
    this.log('info', `Business: ${event}`, {
      type: 'business_event',
      event,
      value,
      ...metadata,
    })
  }

  /**
   * Log performance metric
   */
  logPerformance(
    metric: string,
    value: number,
    threshold?: number,
    metadata?: Record<string, any>
  ) {
    const level = threshold && value > threshold ? 'warn' : 'info'
    this.log(level, `Performance: ${metric}`, {
      type: 'performance_metric',
      metric,
      value,
      threshold,
      exceeds_threshold: threshold ? value > threshold : false,
      ...metadata,
    })
  }

  /**
   * Core logging method
   */
  private log(level: LogflareEvent['level'], message: string, metadata?: Record<string, any>) {
    const event: LogflareEvent = {
      message,
      level,
      timestamp: new Date().toISOString(),
      metadata: {
        environment: process.env.NODE_ENV,
        source: 'second-turn-games',
        ...metadata,
      },
    }

    // Add to buffer
    this.buffer.push(event)

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${level.toUpperCase()}] ${message}`, metadata)
    }

    // Flush immediately for errors, or when buffer is full
    if (level === 'error' || this.buffer.length >= 10) {
      this.flush()
    }
  }

  /**
   * Flush buffered logs to Logflare
   */
  async flush(): Promise<void> {
    if (this.buffer.length === 0 || !this.config.sourceToken) {
      return
    }

    const logs = [...this.buffer]
    this.buffer = []

    try {
      const response = await fetch(`${this.config.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.config.apiKey || '',
        },
        body: JSON.stringify({
          source_token: this.config.sourceToken,
          logs: logs.map(log => ({
            message: log.message,
            level: log.level,
            timestamp: log.timestamp,
            metadata: log.metadata,
          })),
        }),
      })

      if (!response.ok) {
        console.warn('Failed to send logs to Logflare:', response.statusText)
      }
    } catch (error) {
      console.warn('Error sending logs to Logflare:', error)
      // Put logs back in buffer for retry
      this.buffer.unshift(...logs)
    }
  }

  /**
   * Set up automatic flushing
   */
  private setupAutoFlush() {
    // Flush every 30 seconds
    this.flushInterval = setInterval(() => {
      this.flush()
    }, 30000)

    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flush()
      })

      // Flush on page visibility change
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.flush()
        }
      })
    }
  }

  /**
   * Clean up resources
   */
  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
      this.flushInterval = null
    }
    this.flush()
  }
}

// Create logger instance
const logflareConfig: LogflareConfig = {
  sourceToken: process.env.LOGFLARE_SOURCE_TOKEN || '',
  apiKey: process.env.LOGFLARE_API_KEY || '',
}

export const logger = new LogflareLogger(logflareConfig)

/**
 * Structured logging utilities
 */
export const log = {
  info: (message: string, metadata?: Record<string, any>) => logger.info(message, metadata),
  warn: (message: string, metadata?: Record<string, any>) => logger.warn(message, metadata),
  error: (message: string, error?: Error, metadata?: Record<string, any>) => logger.error(message, error, metadata),
  debug: (message: string, metadata?: Record<string, any>) => logger.debug(message, metadata),
  
  // Specialized logging methods
  api: (method: string, endpoint: string, status: number, duration: number, metadata?: Record<string, any>) =>
    logger.logApiCall(method, endpoint, status, duration, metadata),
  
  database: (operation: string, table: string, duration: number, metadata?: Record<string, any>) =>
    logger.logDatabaseOperation(operation, table, duration, metadata),
  
  auth: (event: string, userId?: string, metadata?: Record<string, any>) =>
    logger.logAuthEvent(event, userId, metadata),
  
  business: (event: string, value?: number, metadata?: Record<string, any>) =>
    logger.logBusinessEvent(event, value, metadata),
  
  performance: (metric: string, value: number, threshold?: number, metadata?: Record<string, any>) =>
    logger.logPerformance(metric, value, threshold, metadata),
}

/**
 * Middleware wrapper for API routes
 */
export function withLogging<T extends (...args: any[]) => any>(
  handler: T,
  options: {
    route: string
    method: string
  }
): T {
  return (async (...args: Parameters<T>) => {
    const startTime = Date.now()
    const { route, method } = options

    try {
      logger.info(`API ${method} ${route} started`)
      
      const result = await handler(...args)
      const duration = Date.now() - startTime
      
      logger.logApiCall(method, route, 200, duration, {
        success: true,
      })
      
      return result
    } catch (error) {
      const duration = Date.now() - startTime
      
      logger.error(`API ${method} ${route} failed`, error as Error, {
        duration,
        route,
        method,
      })
      
      logger.logApiCall(method, route, 500, duration, {
        success: false,
        error: (error as Error).message,
      })
      
      throw error
    }
  }) as T
}

/**
 * Database operation wrapper
 */
export function withDatabaseLogging<T extends (...args: any[]) => any>(
  operation: T,
  tableName: string,
  operationType: string
): T {
  return (async (...args: Parameters<T>) => {
    const startTime = Date.now()
    
    try {
      const result = await operation(...args)
      const duration = Date.now() - startTime
      
      logger.logDatabaseOperation(operationType, tableName, duration, {
        success: true,
      })
      
      return result
    } catch (error) {
      const duration = Date.now() - startTime
      
      logger.error(`Database ${operationType} on ${tableName} failed`, error as Error)
      logger.logDatabaseOperation(operationType, tableName, duration, {
        success: false,
        error: (error as Error).message,
      })
      
      throw error
    }
  }) as T
}

/**
 * Export logger instance for direct use
 */
export { logger as logflare }
