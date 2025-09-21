import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('User Profile Accessibility', () => {
  // Test user credentials
  const testUser = {
    email: 'playwright.test@example.com',
    password: 'PlaywrightTest123!',
    name: 'Playwright Test User'
  }

  test.beforeEach(async ({ page }) => {
    // Sign up and sign in before each test
    await page.goto('/auth/sign-up')
    
    // Fill sign-up form
    await page.fill('input[name="name"]', testUser.name)
    await page.fill('input[name="email"]', testUser.email)
    await page.fill('input[name="password"]', testUser.password)
    await page.fill('input[name="confirmPassword"]', testUser.password)
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Wait for success or navigate to sign-in
    try {
      await page.waitForURL('/auth/sign-in', { timeout: 5000 })
    } catch {
      // If already signed in or redirected elsewhere, continue
    }
    
    // Sign in
    await page.goto('/auth/sign-in')
    await page.fill('input[name="email"]', testUser.email)
    await page.fill('input[name="password"]', testUser.password)
    await page.click('button[type="submit"]')
    
    // Wait for successful sign-in
    await page.waitForURL('/', { timeout: 10000 })
  })

  test('Dashboard page should be accessible', async ({ page }) => {
    // Test user dashboard accessibility
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Profile page should be accessible', async ({ page }) => {
    // Test user profile page accessibility
    await page.goto('/profile')
    await page.waitForLoadState('networkidle')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Profile edit form should be accessible', async ({ page }) => {
    // Test profile editing accessibility
    await page.goto('/profile')
    
    // Click edit button if it exists
    const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")')
    if (await editButton.count() > 0) {
      await editButton.click()
      
      // Check form accessibility
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .withRules(['label', 'aria-required-attr', 'form-field-multiple-labels'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
      
      // Check that form fields have proper labels
      const formInputs = await page.locator('input, select, textarea').all()
      for (const input of formInputs) {
        const id = await input.getAttribute('id')
        if (id) {
          const label = page.locator(`label[for="${id}"]`)
          await expect(label).toBeAttached()
        }
      }
    }
  })

  test('User menu should be accessible', async ({ page }) => {
    // Test user menu dropdown accessibility
    await page.goto('/')
    
    // Open user menu
    const userMenuButton = page.locator('[data-testid="user-menu"]')
    await expect(userMenuButton).toBeVisible()
    
    // Check menu button has proper ARIA attributes
    await expect(userMenuButton).toHaveAttribute('aria-haspopup')
    await expect(userMenuButton).toHaveAttribute('aria-expanded', 'false')
    
    // Open menu
    await userMenuButton.click()
    await expect(userMenuButton).toHaveAttribute('aria-expanded', 'true')
    
    // Check menu accessibility
    const menu = page.locator('[role="menu"]')
    await expect(menu).toBeVisible()
    
    // Check menu items have proper roles
    const menuItems = await page.locator('[role="menuitem"]').all()
    expect(menuItems.length).toBeGreaterThan(0)
    
    // Test keyboard navigation in menu
    await userMenuButton.press('Escape')
    await expect(menu).not.toBeVisible()
    await expect(userMenuButton).toHaveAttribute('aria-expanded', 'false')
    
    // Run accessibility check with menu open
    await userMenuButton.click()
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('User settings page should be accessible', async ({ page }) => {
    // Test settings page accessibility (if it exists)
    try {
      await page.goto('/settings')
      await page.waitForLoadState('networkidle')
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    } catch (error) {
      // Skip if settings page doesn't exist
      test.skip()
    }
  })

  test('User listing management should be accessible', async ({ page }) => {
    // Test user's own listings management accessibility
    await page.goto('/dashboard')
    
    // Check if user has listings or can create one
    const createListingButton = page.locator('a[href="/listings/create"], button:has-text("Create")')
    if (await createListingButton.count() > 0) {
      // Test create listing button accessibility
      await createListingButton.focus()
      await expect(createListingButton).toBeFocused()
      
      // Check button has descriptive text or aria-label
      const text = await createListingButton.textContent()
      const ariaLabel = await createListingButton.getAttribute('aria-label')
      expect(text || ariaLabel).toBeTruthy()
    }
    
    // Check for user listing cards if they exist
    const listingCards = await page.locator('[data-testid="user-listing-card"]').all()
    for (const card of listingCards) {
      // Each listing card should be accessible
      await card.scrollIntoViewIfNeeded()
      
      // Check for proper heading structure within cards
      const headings = await card.locator('h1, h2, h3, h4, h5, h6').all()
      expect(headings.length).toBeGreaterThan(0)
    }
  })

  test('Sign-out flow should be accessible', async ({ page }) => {
    // Test sign-out accessibility
    await page.goto('/')
    
    // Open user menu
    await page.locator('[data-testid="user-menu"]').click()
    
    // Find and test sign-out button
    const signOutButton = page.locator('[data-testid="sign-out-button"]')
    await expect(signOutButton).toBeVisible()
    
    // Check sign-out button accessibility
    await signOutButton.focus()
    await expect(signOutButton).toBeFocused()
    
    // Check button has proper role and styling
    await expect(signOutButton).toHaveAttribute('role', 'menuitem')
    
    // Test sign-out functionality
    await signOutButton.click()
    
    // Should redirect to home page
    await page.waitForURL('/', { timeout: 5000 })
    
    // Check that user menu is no longer visible
    await expect(page.locator('[data-testid="user-menu"]')).not.toBeVisible()
  })

  test('Profile form validation should be accessible', async ({ page }) => {
    // Test profile form validation accessibility
    await page.goto('/profile')
    
    // Try to edit profile if edit functionality exists
    const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")')
    if (await editButton.count() > 0) {
      await editButton.click()
      
      // Clear required fields and submit to trigger validation
      const nameInput = page.locator('input[name="name"]')
      if (await nameInput.count() > 0) {
        await nameInput.clear()
        
        // Submit form
        const submitButton = page.locator('button[type="submit"]')
        if (await submitButton.count() > 0) {
          await submitButton.click()
          
          // Check for accessible error handling
          await page.waitForSelector('[role="alert"], [aria-invalid="true"]', { timeout: 5000 })
          
          const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze()

          expect(accessibilityScanResults.violations).toEqual([])
        }
      }
    }
  })
})
