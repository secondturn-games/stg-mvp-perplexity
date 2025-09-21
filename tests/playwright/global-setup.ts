import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for accessibility tests...')
  
  // Launch browser for setup
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  try {
    // Verify the application is running
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
    console.log('✅ Application is running and accessible')
    
    // Setup test data if needed
    // This could include creating test users, listings, etc.
    
  } catch (error) {
    console.error('❌ Global setup failed:', error)
    throw error
  } finally {
    await browser.close()
  }
  
  console.log('✅ Global setup completed successfully')
}

export default globalSetup
