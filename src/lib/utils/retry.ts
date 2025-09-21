/**
 * Retry utility with exponential backoff
 */

export interface RetryOptions {
  maxAttempts?: number
  baseDelay?: number
  maxDelay?: number
  backoffFactor?: number
  shouldRetry?: (error: Error, attempt: number) => boolean
}

export class RetryError extends Error {
  constructor(
    message: string,
    public readonly attempts: number,
    public readonly lastError: Error
  ) {
    super(message)
    this.name = 'RetryError'
  }
}

/**
 * Retry an async operation with exponential backoff
 */
export async function retry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    shouldRetry = defaultShouldRetry
  } = options

  let lastError: Error
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      // Don't retry on the last attempt
      if (attempt === maxAttempts) {
        break
      }
      
      // Check if we should retry this error
      if (!shouldRetry(lastError, attempt)) {
        throw lastError
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        baseDelay * Math.pow(backoffFactor, attempt - 1),
        maxDelay
      )
      
      // Add some jitter to prevent thundering herd
      const jitteredDelay = delay + Math.random() * 1000
      
      await sleep(jitteredDelay)
    }
  }
  
  throw new RetryError(
    `Operation failed after ${maxAttempts} attempts: ${lastError!.message}`,
    maxAttempts,
    lastError!
  )
}

/**
 * Default retry logic - retry on network errors and server errors
 */
function defaultShouldRetry(error: Error, _attempt: number): boolean {
  // Don't retry client errors (4xx)
  if (error.message.includes('400') || 
      error.message.includes('401') || 
      error.message.includes('403') || 
      error.message.includes('404')) {
    return false
  }
  
  // Retry on network errors, timeouts, and server errors
  return (
    error.message.includes('fetch') ||
    error.message.includes('timeout') ||
    error.message.includes('network') ||
    error.message.includes('500') ||
    error.message.includes('502') ||
    error.message.includes('503') ||
    error.message.includes('504') ||
    error.name === 'AbortError'
  )
}

/**
 * BGG-specific retry logic
 */
export function bggShouldRetry(error: Error, attempt: number): boolean {
  // BGG often returns temporary errors, so be more aggressive with retries
  if (error.message.includes('BGG API returned an error response')) {
    return attempt < 3
  }
  
  if (error.message.includes('timed out')) {
    return attempt < 2 // BGG can be slow, but don't wait too long
  }
  
  return defaultShouldRetry(error, attempt)
}

/**
 * Image upload retry logic
 */
export function uploadShouldRetry(error: Error, attempt: number): boolean {
  // Don't retry file validation errors
  if (error.message.includes('file too large') ||
      error.message.includes('invalid file type') ||
      error.message.includes('file not found')) {
    return false
  }
  
  return defaultShouldRetry(error, attempt)
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retry with custom error mapping
 */
export async function retryWithErrorMapping<T>(
  operation: () => Promise<T>,
  errorMapper: (error: Error) => string,
  options: RetryOptions = {}
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const result = await retry(operation, options)
    return { success: true, data: result }
  } catch (error) {
    const errorMessage = error instanceof RetryError 
      ? errorMapper(error.lastError)
      : errorMapper(error instanceof Error ? error : new Error(String(error)))
    
    return { success: false, error: errorMessage }
  }
}

/**
 * Create a retry-enabled version of a function
 */
export function withRetry<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  options: RetryOptions = {}
) {
  return (...args: TArgs): Promise<TReturn> => {
    return retry(() => fn(...args), options)
  }
}
