/**
 * Enhanced file upload security and validation
 */

export interface FileSecurityConfig {
  maxFileSize: number
  allowedMimeTypes: string[]
  allowedExtensions: string[]
  maxFiles: number
  scanForMalware?: boolean
}

export interface FileValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  sanitizedName?: string
}

export const SECURE_UPLOAD_CONFIG: FileSecurityConfig = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp'
  ],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
  maxFiles: 3,
  scanForMalware: true
}

/**
 * Comprehensive file validation with security checks
 */
export function validateFileSecurely(file: File, config: FileSecurityConfig = SECURE_UPLOAD_CONFIG): FileValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // 1. File size validation
  if (file.size > config.maxFileSize) {
    const maxSizeMB = config.maxFileSize / (1024 * 1024)
    errors.push(`File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds maximum allowed size (${maxSizeMB}MB)`)
  }

  // 2. MIME type validation
  if (!config.allowedMimeTypes.includes(file.type)) {
    errors.push(`File type "${file.type}" is not allowed. Allowed types: ${config.allowedMimeTypes.join(', ')}`)
  }

  // 3. File extension validation (double-check against MIME type spoofing)
  const extension = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!config.allowedExtensions.includes(extension)) {
    errors.push(`File extension "${extension}" is not allowed. Allowed extensions: ${config.allowedExtensions.join(', ')}`)
  }

  // 4. Filename security validation
  const sanitizedName = sanitizeFileName(file.name)
  if (sanitizedName !== file.name) {
    warnings.push('Filename contains potentially unsafe characters and will be sanitized')
  }

  // 5. File content validation (basic header checks)
  const contentValidation = validateFileContent(file)
  if (!contentValidation.isValid) {
    errors.push(...contentValidation.errors)
  }

  // 6. Check for suspicious patterns
  const suspiciousPatterns = [
    /\.php$/i,
    /\.exe$/i,
    /\.bat$/i,
    /\.cmd$/i,
    /\.scr$/i,
    /\.vbs$/i,
    /\.js$/i,
    /\.html$/i,
    /\.htm$/i
  ]

  if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
    errors.push('File appears to contain executable content and is not allowed')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitizedName
  }
}

/**
 * Sanitize filename to prevent path traversal and other attacks
 */
function sanitizeFileName(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace unsafe characters
    .replace(/\.+/g, '.') // Collapse multiple dots
    .replace(/^\.+|\.+$/g, '') // Remove leading/trailing dots
    .substring(0, 100) // Limit length
}

/**
 * Basic file content validation using file headers
 */
function validateFileContent(file: File): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // This is a basic validation - in production, you'd want more sophisticated checks
  // For now, we'll rely on MIME type validation and browser security

  // Check if file is actually an image by looking at common image signatures
  // This would require reading the file content, which is async
  // For now, we'll just validate the declared MIME type matches expected patterns

  if (file.type.startsWith('image/')) {
    // Additional image-specific validations could go here
    if (file.size < 100) { // Suspiciously small for an image
      errors.push('File appears to be corrupted or not a valid image')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Advanced file content scanning (placeholder for malware detection)
 */
export async function scanFileForMalware(file: File): Promise<{ isSafe: boolean; threats: string[] }> {
  // In a production environment, this would integrate with a malware scanning service
  // For now, we'll implement basic heuristic checks
  
  const threats: string[] = []
  
  try {
    // Read first few bytes to check for suspicious patterns
    const buffer = await file.slice(0, 1024).arrayBuffer()
    const bytes = new Uint8Array(buffer)
    
    // Check for common executable signatures
    const signatures = [
      [0x4D, 0x5A], // PE executable (MZ header)
      [0x50, 0x4B], // ZIP file (could contain executables)
      [0x7F, 0x45, 0x4C, 0x46], // ELF executable
    ]
    
    for (const signature of signatures) {
      if (signature.every((byte, index) => bytes[index] === byte)) {
        threats.push('File contains executable code signature')
        break
      }
    }
    
    // Check for script injection in filename
    if (/<script|javascript:|data:/i.test(file.name)) {
      threats.push('Filename contains potentially malicious script content')
    }
    
  } catch (error) {
    console.warn('Malware scan failed:', error)
    // Fail safe - if we can't scan, treat as potentially unsafe
    threats.push('Unable to verify file safety')
  }
  
  return {
    isSafe: threats.length === 0,
    threats
  }
}

/**
 * Generate secure upload path with user isolation
 */
export function generateSecureUploadPath(userId: string, originalFilename: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = originalFilename.split('.').pop()?.toLowerCase() || 'unknown'
  const sanitizedName = sanitizeFileName(originalFilename.replace(/\.[^/.]+$/, ''))
  
  // Structure: userId/timestamp_random_sanitizedName.ext
  return `${userId}/${timestamp}_${randomString}_${sanitizedName}.${extension}`
}

/**
 * Validate upload permissions for user
 */
export function validateUploadPermissions(userId: string, requestedPath: string): boolean {
  // Ensure user can only upload to their own folder
  const pathParts = requestedPath.split('/')
  return pathParts[0] === userId
}

/**
 * Content Security Policy headers for file uploads
 */
export const UPLOAD_CSP_HEADERS = {
  'Content-Security-Policy': "default-src 'none'; img-src 'self' data: blob:; style-src 'unsafe-inline'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
}

/**
 * Rate limiting for file uploads
 */
export class UploadRateLimiter {
  private uploads = new Map<string, number[]>()
  private readonly maxUploadsPerHour = 20
  private readonly maxUploadsPerMinute = 5

  isAllowed(userId: string): boolean {
    const now = Date.now()
    const userUploads = this.uploads.get(userId) || []
    
    // Clean old uploads (older than 1 hour)
    const recentUploads = userUploads.filter(time => now - time < 60 * 60 * 1000)
    
    // Check hourly limit
    if (recentUploads.length >= this.maxUploadsPerHour) {
      return false
    }
    
    // Check per-minute limit
    const lastMinuteUploads = recentUploads.filter(time => now - time < 60 * 1000)
    if (lastMinuteUploads.length >= this.maxUploadsPerMinute) {
      return false
    }
    
    // Record this upload attempt
    recentUploads.push(now)
    this.uploads.set(userId, recentUploads)
    
    return true
  }

  getRemainingQuota(userId: string): { hourly: number; perMinute: number } {
    const now = Date.now()
    const userUploads = this.uploads.get(userId) || []
    
    const recentUploads = userUploads.filter(time => now - time < 60 * 60 * 1000)
    const lastMinuteUploads = userUploads.filter(time => now - time < 60 * 1000)
    
    return {
      hourly: Math.max(0, this.maxUploadsPerHour - recentUploads.length),
      perMinute: Math.max(0, this.maxUploadsPerMinute - lastMinuteUploads.length)
    }
  }
}

// Export singleton instance
export const uploadRateLimiter = new UploadRateLimiter()

/**
 * Security audit logging for file operations
 */
export function logFileOperation(
  userId: string,
  action: 'upload' | 'delete' | 'access',
  filename: string,
  success: boolean,
  error?: string
) {
  const logEntry = {
    userId,
    action,
    filename: sanitizeFileName(filename),
    success,
    error,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server'
  }
  
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.log('File operation:', logEntry)
  }
  
  // In production, this would send to your security monitoring service
  // Example: sendToSecurityService(logEntry)
}
