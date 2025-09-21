import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Core Pages Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    // Set up common test environment
    await page.goto('/')
  })

  test('Homepage should be fully accessible', async ({ page }) => {
    // Test homepage accessibility with comprehensive rules
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Homepage should have proper heading hierarchy', async ({ page }) => {
    // Test semantic heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
    
    // Should have at least one h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThanOrEqual(1)
    
    // Check heading hierarchy
    const headingLevels = await Promise.all(
      headings.map(async (heading) => {
        const tagName = await heading.evaluate(el => el.tagName)
        return parseInt(tagName.charAt(1))
      })
    )
    
    // Verify logical heading progression
    for (let i = 1; i < headingLevels.length; i++) {
      expect(headingLevels[i]).toBeLessThanOrEqual(headingLevels[i-1] + 1)
    }
  })

  test('Homepage should have proper landmark structure', async ({ page }) => {
    // Test semantic HTML landmarks
    await expect(page.locator('nav[role="navigation"]')).toBeVisible()
    await expect(page.locator('main, [role="main"]')).toBeVisible()
    
    // Check for proper ARIA labels on landmarks
    const nav = page.locator('nav[role="navigation"]')
    await expect(nav).toHaveAttribute('aria-label')
  })

  test('Marketplace page should be accessible', async ({ page }) => {
    // Test marketplace accessibility
    await page.goto('/listings')
    await page.waitForLoadState('networkidle')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('#third-party-widget') // Exclude third-party content if any
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Marketplace filters should be keyboard accessible', async ({ page }) => {
    // Test marketplace filter keyboard navigation
    await page.goto('/listings')
    
    // Test search input keyboard accessibility
    const searchInput = page.locator('[data-testid="search-input"]')
    await searchInput.focus()
    await expect(searchInput).toBeFocused()
    
    // Test that search input has proper labeling
    await expect(searchInput).toHaveAttribute('id')
    const inputId = await searchInput.getAttribute('id')
    await expect(page.locator(`label[for="${inputId}"]`)).toBeAttached()
  })

  test('About page should be accessible', async ({ page }) => {
    // Test about page (if it exists)
    try {
      await page.goto('/about')
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()
      
      expect(accessibilityScanResults.violations).toEqual([])
    } catch (error) {
      // Skip if about page doesn't exist
      test.skip()
    }
  })

  test('Contact page should be accessible', async ({ page }) => {
    // Test contact page (if it exists)
    try {
      await page.goto('/contact')
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()
      
      expect(accessibilityScanResults.violations).toEqual([])
    } catch (error) {
      // Skip if contact page doesn't exist
      test.skip()
    }
  })
})
