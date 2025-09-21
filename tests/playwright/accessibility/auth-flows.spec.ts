import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Authentication Flow Accessibility', () => {
  test('Sign-in page should be fully accessible', async ({ page }) => {
    // Test sign-in page accessibility
    await page.goto('/auth/sign-in')
    await page.waitForLoadState('networkidle')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .withRules(['color-contrast', 'keyboard-navigation', 'label', 'aria-required-attr'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Sign-in form should have proper form accessibility', async ({ page }) => {
    // Test form-specific accessibility features
    await page.goto('/auth/sign-in')
    
    // Check that all form inputs have associated labels
    const inputs = await page.locator('input').all()
    for (const input of inputs) {
      const id = await input.getAttribute('id')
      expect(id).toBeTruthy()
      
      const label = page.locator(`label[for="${id}"]`)
      await expect(label).toBeAttached()
    }
    
    // Check form has proper structure
    await expect(page.locator('form')).toBeVisible()
    await expect(page.locator('h1')).toBeVisible()
    
    // Check submit button is accessible
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
    await expect(submitButton).toBeEnabled()
  })

  test('Sign-in form validation should be accessible', async ({ page }) => {
    // Test form validation accessibility
    await page.goto('/auth/sign-in')
    
    // Submit empty form to trigger validation
    await page.locator('button[type="submit"]').click()
    
    // Wait for error messages to appear
    await page.waitForSelector('[role="alert"]', { timeout: 5000 })
    
    // Check that errors are properly announced
    const errorMessages = await page.locator('[role="alert"]').all()
    expect(errorMessages.length).toBeGreaterThan(0)
    
    // Check that inputs have aria-invalid when errors occur
    const invalidInputs = await page.locator('[aria-invalid="true"]').all()
    expect(invalidInputs.length).toBeGreaterThan(0)
    
    // Run accessibility check with errors present
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Sign-up page should be fully accessible', async ({ page }) => {
    // Test sign-up page accessibility
    await page.goto('/auth/sign-up')
    await page.waitForLoadState('networkidle')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Sign-up form should handle password confirmation accessibility', async ({ page }) => {
    // Test password confirmation field accessibility
    await page.goto('/auth/sign-up')
    
    // Check password fields have proper autocomplete attributes
    const passwordInput = page.locator('input[name="password"]')
    await expect(passwordInput).toHaveAttribute('autocomplete', 'new-password')
    
    const confirmPasswordInput = page.locator('input[name="confirmPassword"]')
    await expect(confirmPasswordInput).toHaveAttribute('autocomplete', 'new-password')
    
    // Test that both fields are properly labeled
    await expect(passwordInput).toHaveAttribute('id')
    await expect(confirmPasswordInput).toHaveAttribute('id')
    
    const passwordId = await passwordInput.getAttribute('id')
    const confirmPasswordId = await confirmPasswordInput.getAttribute('id')
    
    await expect(page.locator(`label[for="${passwordId}"]`)).toBeVisible()
    await expect(page.locator(`label[for="${confirmPasswordId}"]`)).toBeVisible()
  })

  test('Forgot password page should be accessible', async ({ page }) => {
    // Test forgot password page accessibility
    await page.goto('/auth/forgot-password')
    await page.waitForLoadState('networkidle')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Email verification page should be accessible', async ({ page }) => {
    // Test email verification page accessibility
    await page.goto('/auth/verify-email')
    await page.waitForLoadState('networkidle')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Reset password page should be accessible', async ({ page }) => {
    // Test reset password page accessibility
    await page.goto('/auth/reset-password?token=test-token')
    await page.waitForLoadState('networkidle')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Authentication links should be accessible', async ({ page }) => {
    // Test navigation between auth pages
    await page.goto('/auth/sign-in')
    
    // Check that auth links have proper focus indicators
    const authLinks = await page.locator('a[href*="/auth/"]').all()
    
    for (const link of authLinks) {
      await link.focus()
      
      // Check that focused link is visible and has focus styles
      await expect(link).toBeFocused()
      
      // Check link has descriptive text or aria-label
      const text = await link.textContent()
      const ariaLabel = await link.getAttribute('aria-label')
      expect(text || ariaLabel).toBeTruthy()
    }
  })

  test('Form error states should be accessible', async ({ page }) => {
    // Test comprehensive form error accessibility
    await page.goto('/auth/sign-up')
    
    // Fill form with invalid data to trigger various errors
    await page.fill('input[name="name"]', '')
    await page.fill('input[name="email"]', 'invalid-email')
    await page.fill('input[name="password"]', '123')
    await page.fill('input[name="confirmPassword"]', '456')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Wait for errors to appear
    await page.waitForSelector('[role="alert"]', { timeout: 5000 })
    
    // Check accessibility with errors present
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .withRules(['aria-valid-attr-value', 'aria-required-attr', 'label'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
    
    // Verify error messages are properly associated
    const invalidInputs = await page.locator('[aria-invalid="true"]').all()
    
    for (const input of invalidInputs) {
      const describedBy = await input.getAttribute('aria-describedby')
      if (describedBy) {
        const errorElements = describedBy.split(' ')
        for (const errorId of errorElements) {
          await expect(page.locator(`#${errorId}`)).toBeAttached()
        }
      }
    }
  })
})
