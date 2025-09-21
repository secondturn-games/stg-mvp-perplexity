import { FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown...')
  
  try {
    // Cleanup test data if needed
    // This could include removing test users, listings, uploaded images, etc.
    
    console.log('✅ Global teardown completed successfully')
  } catch (error) {
    console.error('❌ Global teardown failed:', error)
    // Don't throw error in teardown to avoid masking test failures
  }
}

export default globalTeardown
