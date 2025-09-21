import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Marketplace Browsing Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses for consistent testing
    await page.route('**/api/listings*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: '1',
              game_name: 'Catan',
              price: 25.00,
              condition: 'good',
              city: 'Riga',
              description: 'Great strategy game',
              images: ['https://example.com/catan.jpg'],
              created_at: '2024-01-01T00:00:00Z',
              seller_name: 'John Doe',
              bgg_id: 13
            },
            {
              id: '2',
              game_name: 'Ticket to Ride',
              price: 35.50,
              condition: 'excellent',
              city: 'Daugavpils',
              description: 'Family railway game',
              images: ['https://example.com/ticket.jpg'],
              created_at: '2024-01-02T00:00:00Z',
              seller_name: 'Jane Smith',
              bgg_id: 9209
            }
          ],
          count: 2,
          page: 1,
          limit: 20,
          totalPages: 1
        })
      })
    })

    await page.goto('/listings')
    await page.waitForLoadState('networkidle')
  })

  test('Marketplace page should be fully accessible', async ({ page }) => {
    // Comprehensive marketplace accessibility test
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .withRules([
        'color-contrast',
        'keyboard-navigation', 
        'label',
        'aria-required-attr',
        'button-name',
        'link-name',
        'image-alt'
      ])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Search functionality should be accessible', async ({ page }) => {
    // Test search input accessibility
    const searchInput = page.locator('[data-testid="search-input"]')
    
    // Check search input has proper labeling
    await expect(searchInput).toHaveAttribute('id')
    const inputId = await searchInput.getAttribute('id')
    
    // Should have associated label (visible or screen reader only)
    const label = page.locator(`label[for="${inputId}"]`)
    await expect(label).toBeAttached()
    
    // Test search input keyboard accessibility
    await searchInput.focus()
    await expect(searchInput).toBeFocused()
    
    // Type search query
    await searchInput.fill('Catan')
    
    // Check that search results update
    await page.waitForTimeout(1000) // Wait for debouncing
    
    // Verify URL updates with search parameter
    expect(page.url()).toContain('search=Catan')
    
    // Run accessibility check with search results
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Filter controls should be accessible', async ({ page }) => {
    // Test filter accessibility
    
    // Check city filter accessibility
    const cityFilter = page.locator('select[name="city-filter"], button[aria-haspopup="listbox"]')
    if (await cityFilter.count() > 0) {
      await cityFilter.focus()
      await expect(cityFilter).toBeFocused()
      
      // If it's a custom dropdown, test ARIA implementation
      const isCustomDropdown = await cityFilter.getAttribute('aria-haspopup')
      if (isCustomDropdown) {
        await expect(cityFilter).toHaveAttribute('aria-expanded')
        
        // Open dropdown
        await cityFilter.click()
        
        // Check listbox is accessible
        const listbox = page.locator('[role="listbox"]')
        await expect(listbox).toBeVisible()
        
        // Check options have proper roles
        const options = await page.locator('[role="option"]').all()
        expect(options.length).toBeGreaterThan(0)
        
        // Close dropdown with escape
        await page.keyboard.press('Escape')
        await expect(listbox).not.toBeVisible()
      }
    }
    
    // Test advanced filters if they exist
    const moreFiltersButton = page.locator('button:has-text("More Filters"), button:has-text("Advanced")')
    if (await moreFiltersButton.count() > 0) {
      await moreFiltersButton.click()
      
      // Check accessibility of revealed filters
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    }
  })

  test('Listing cards should be accessible', async ({ page }) => {
    // Test listing card accessibility
    const listingCards = await page.locator('[data-testid="listing-card"]').all()
    expect(listingCards.length).toBeGreaterThan(0)
    
    for (const card of listingCards) {
      // Check card has proper link structure
      const link = card.locator('a')
      await expect(link).toBeAttached()
      
      // Check link has descriptive text or aria-label
      const ariaLabel = await link.getAttribute('aria-label')
      expect(ariaLabel).toBeTruthy()
      expect(ariaLabel).toContain('€') // Should include price
      expect(ariaLabel).toContain('condition') // Should include condition
      
      // Check images have proper alt text
      const images = await card.locator('img').all()
      for (const img of images) {
        const alt = await img.getAttribute('alt')
        expect(alt).toBeTruthy()
        expect(alt.length).toBeGreaterThan(10) // Should be descriptive
      }
      
      // Check heading structure
      const headings = await card.locator('h1, h2, h3, h4, h5, h6').all()
      expect(headings.length).toBeGreaterThan(0)
    }
  })

  test('Pagination should be accessible', async ({ page }) => {
    // Mock API response with pagination
    await page.route('**/api/listings*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: Array.from({ length: 20 }, (_, i) => ({
            id: `${i + 1}`,
            game_name: `Game ${i + 1}`,
            price: 25.00 + i,
            condition: 'good',
            city: 'Riga',
            description: `Description ${i + 1}`,
            images: ['https://example.com/game.jpg'],
            created_at: '2024-01-01T00:00:00Z',
            seller_name: 'Seller',
            bgg_id: 100 + i
          })),
          count: 50, // Total items
          page: 1,
          limit: 20,
          totalPages: 3
        })
      })
    })

    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Check if pagination is visible
    const pagination = page.locator('[data-testid="pagination"]')
    if (await pagination.count() > 0) {
      // Test pagination accessibility
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('[data-testid="pagination"]')
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
      
      // Check pagination buttons have proper labels
      const prevButton = page.locator('[data-testid="pagination-prev"]')
      const nextButton = page.locator('[data-testid="pagination-next"]')
      
      await expect(prevButton).toHaveAttribute('aria-label')
      await expect(nextButton).toHaveAttribute('aria-label')
      
      // Test keyboard navigation
      await nextButton.focus()
      await expect(nextButton).toBeFocused()
      
      // Test page info is accessible
      const pageInfo = page.locator('[data-testid="pagination-info"]')
      await expect(pageInfo).toBeVisible()
      
      const infoText = await pageInfo.textContent()
      expect(infoText).toContain('of') // Should describe current position
    }
  })

  test('Empty state should be accessible', async ({ page }) => {
    // Test empty marketplace state accessibility
    await page.route('**/api/listings*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [],
          count: 0,
          page: 1,
          limit: 20,
          totalPages: 0
        })
      })
    })

    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Check empty state accessibility
    const emptyState = page.locator('[data-testid="no-listings"]')
    await expect(emptyState).toBeVisible()
    
    // Check empty state has proper heading structure
    const heading = emptyState.locator('h1, h2, h3, h4, h5, h6')
    await expect(heading).toBeVisible()
    
    // Check for helpful action buttons
    const actionButtons = await emptyState.locator('button, a').all()
    for (const button of actionButtons) {
      await button.focus()
      await expect(button).toBeFocused()
    }
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Loading states should be accessible', async ({ page }) => {
    // Test loading state accessibility
    await page.route('**/api/listings*', async route => {
      // Add delay to test loading states
      await new Promise(resolve => setTimeout(resolve, 2000))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [],
          count: 0,
          page: 1,
          limit: 20,
          totalPages: 0
        })
      })
    })

    // Navigate to trigger loading
    await page.goto('/listings')
    
    // Check for loading indicators
    const loadingElements = await page.locator('[data-testid*="loading"], [data-testid*="skeleton"]').all()
    if (loadingElements.length > 0) {
      // Check loading states have proper ARIA
      for (const loading of loadingElements) {
        const ariaLabel = await loading.getAttribute('aria-label')
        const role = await loading.getAttribute('role')
        
        // Should have either aria-label or role for screen readers
        expect(ariaLabel || role).toBeTruthy()
      }
    }
    
    // Wait for loading to complete
    await page.waitForLoadState('networkidle')
    
    // Check final state accessibility
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Error states should be accessible', async ({ page }) => {
    // Test error state accessibility
    await page.route('**/api/listings*', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal server error'
        })
      })
    })

    await page.reload()
    
    // Wait for error state
    await page.waitForSelector('[data-testid*="error"], [role="alert"]', { timeout: 10000 })
    
    // Check error message accessibility
    const errorElements = await page.locator('[role="alert"]').all()
    expect(errorElements.length).toBeGreaterThan(0)
    
    // Check for retry button accessibility
    const retryButton = page.locator('[data-testid="retry-button"]')
    if (await retryButton.count() > 0) {
      await retryButton.focus()
      await expect(retryButton).toBeFocused()
      
      // Check button has descriptive label
      const ariaLabel = await retryButton.getAttribute('aria-label')
      const text = await retryButton.textContent()
      expect(ariaLabel || text).toBeTruthy()
    }
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Mobile marketplace should be accessible', async ({ page }) => {
    // Test mobile marketplace accessibility
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/listings')
    await page.waitForLoadState('networkidle')
    
    // Check mobile-specific accessibility
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
    
    // Check touch target sizes
    const interactiveElements = await page.locator('button, a, input, select').all()
    for (const element of interactiveElements) {
      const boundingBox = await element.boundingBox()
      if (boundingBox) {
        // WCAG recommends minimum 44px touch targets
        expect(boundingBox.width).toBeGreaterThanOrEqual(44)
        expect(boundingBox.height).toBeGreaterThanOrEqual(44)
      }
    }
  })

  test('Marketplace filters should support keyboard navigation', async ({ page }) => {
    // Test keyboard navigation through filters
    
    // Test search input keyboard access
    const searchInput = page.locator('[data-testid="search-input"]')
    await searchInput.focus()
    await expect(searchInput).toBeFocused()
    
    // Tab to next interactive element
    await page.keyboard.press('Tab')
    
    // Should move to next filter control
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
    
    // Test dropdown keyboard interaction
    const dropdownButtons = await page.locator('button[aria-haspopup="listbox"]').all()
    for (const button of dropdownButtons) {
      await button.focus()
      await expect(button).toBeFocused()
      
      // Test opening with Enter key
      await button.press('Enter')
      
      // Check if dropdown opened
      const expanded = await button.getAttribute('aria-expanded')
      if (expanded === 'true') {
        // Test escape key closes dropdown
        await button.press('Escape')
        
        const expandedAfter = await button.getAttribute('aria-expanded')
        expect(expandedAfter).toBe('false')
      }
    }
  })

  test('Listing detail page should be accessible', async ({ page }) => {
    // Test individual listing page accessibility
    await page.route('**/api/listings/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          game_name: 'Catan',
          price: 25.00,
          condition: 'good',
          city: 'Riga',
          description: 'Great strategy game in good condition. All pieces included.',
          images: [
            'https://example.com/catan1.jpg',
            'https://example.com/catan2.jpg',
            'https://example.com/catan3.jpg'
          ],
          created_at: '2024-01-01T10:00:00Z',
          seller_name: 'John Doe',
          bgg_id: 13,
          year_published: 1995,
          min_players: 3,
          max_players: 4,
          playing_time: 75
        })
      })
    })

    await page.goto('/listings/1')
    await page.waitForLoadState('networkidle')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Image gallery should be accessible', async ({ page }) => {
    // Test image gallery accessibility on listing detail page
    await page.route('**/api/listings/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          game_name: 'Catan',
          price: 25.00,
          condition: 'good',
          images: [
            'https://example.com/catan1.jpg',
            'https://example.com/catan2.jpg',
            'https://example.com/catan3.jpg'
          ],
          created_at: '2024-01-01T10:00:00Z',
          seller_name: 'John Doe'
        })
      })
    })

    await page.goto('/listings/1')
    await page.waitForLoadState('networkidle')
    
    // Check main image accessibility
    const mainImage = page.locator('[data-testid="main-image"]')
    if (await mainImage.count() > 0) {
      await expect(mainImage).toHaveAttribute('alt')
      
      const alt = await mainImage.getAttribute('alt')
      expect(alt).toBeTruthy()
      expect(alt.length).toBeGreaterThan(10) // Should be descriptive
    }
    
    // Check thumbnail navigation accessibility
    const thumbnails = await page.locator('[data-testid="image-thumbnail"]').all()
    for (const thumbnail of thumbnails) {
      await thumbnail.focus()
      await expect(thumbnail).toBeFocused()
      
      // Check thumbnail has proper labeling
      const ariaLabel = await thumbnail.getAttribute('aria-label')
      expect(ariaLabel).toBeTruthy()
    }
    
    // Test image navigation with keyboard
    const nextButton = page.locator('[data-testid="image-next"]')
    const prevButton = page.locator('[data-testid="image-prev"]')
    
    if (await nextButton.count() > 0) {
      await nextButton.focus()
      await expect(nextButton).toBeFocused()
      await expect(nextButton).toHaveAttribute('aria-label')
    }
    
    if (await prevButton.count() > 0) {
      await prevButton.focus()
      await expect(prevButton).toBeFocused()
      await expect(prevButton).toHaveAttribute('aria-label')
    }
  })

  test('Contact seller functionality should be accessible', async ({ page }) => {
    // Test contact seller modal accessibility
    
    // First sign in as different user
    await page.goto('/auth/sign-up')
    await page.fill('input[name="name"]', 'Buyer User')
    await page.fill('input[name="email"]', 'buyer@example.com')
    await page.fill('input[name="password"]', 'BuyerTest123!')
    await page.fill('input[name="confirmPassword"]', 'BuyerTest123!')
    await page.click('button[type="submit"]')
    
    // Navigate to sign-in if needed
    try {
      await page.waitForURL('/auth/sign-in', { timeout: 3000 })
      await page.fill('input[name="email"]', 'buyer@example.com')
      await page.fill('input[name="password"]', 'BuyerTest123!')
      await page.click('button[type="submit"]')
    } catch {
      // Already signed in
    }
    
    // Mock listing detail
    await page.route('**/api/listings/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          game_name: 'Catan',
          price: 25.00,
          condition: 'good',
          city: 'Riga',
          description: 'Great game',
          images: ['https://example.com/catan.jpg'],
          created_at: '2024-01-01T10:00:00Z',
          seller_name: 'John Doe',
          user: { email: 'different@example.com' }
        })
      })
    })

    await page.goto('/listings/1')
    await page.waitForLoadState('networkidle')
    
    // Test contact button accessibility
    const contactButton = page.locator('[data-testid="contact-seller-button"]')
    if (await contactButton.count() > 0) {
      await contactButton.focus()
      await expect(contactButton).toBeFocused()
      
      // Open contact modal
      await contactButton.click()
      
      // Check modal accessibility
      const modal = page.locator('[data-testid="contact-modal"]')
      await expect(modal).toBeVisible()
      
      // Check modal has proper focus management
      const focusedElement = page.locator(':focus')
      const modalContainer = await modal.boundingBox()
      const focusedBox = await focusedElement.boundingBox()
      
      // Focus should be within modal bounds
      if (modalContainer && focusedBox) {
        expect(focusedBox.x).toBeGreaterThanOrEqual(modalContainer.x)
        expect(focusedBox.y).toBeGreaterThanOrEqual(modalContainer.y)
      }
      
      // Test modal form accessibility
      const messageTextarea = page.locator('textarea[name="message"]')
      await expect(messageTextarea).toHaveAttribute('id')
      
      const textareaId = await messageTextarea.getAttribute('id')
      const label = page.locator(`label[for="${textareaId}"]`)
      await expect(label).toBeAttached()
      
      // Test modal close with escape
      await page.keyboard.press('Escape')
      await expect(modal).not.toBeVisible()
      
      // Focus should return to trigger button
      await expect(contactButton).toBeFocused()
    }
  })

  test('Marketplace should handle high contrast mode', async ({ page }) => {
    // Test high contrast mode compatibility
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.addStyleTag({
      content: `
        * {
          filter: contrast(200%) !important;
        }
      `
    })
    
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Verify key elements are still visible
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="listing-card"]').first()).toBeVisible()
    
    // Run accessibility check in high contrast mode
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .withRules(['color-contrast'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Marketplace should be usable with screen reader simulation', async ({ page }) => {
    // Test screen reader experience simulation
    await page.goto('/listings')
    await page.waitForLoadState('networkidle')
    
    // Test tab navigation through key elements
    const tabStops = [
      '[data-testid="search-input"]',
      'select, button[aria-haspopup="listbox"]',
      '[data-testid="listing-card"] a',
      '[data-testid="pagination"] button'
    ]
    
    for (const selector of tabStops) {
      const elements = await page.locator(selector).all()
      if (elements.length > 0) {
        await elements[0].focus()
        await expect(elements[0]).toBeFocused()
        
        // Check element has accessible name
        const accessibleName = await elements[0].evaluate(el => {
          // Simulate screen reader accessible name calculation
          return el.getAttribute('aria-label') || 
                 el.getAttribute('title') || 
                 el.textContent?.trim() ||
                 el.getAttribute('alt')
        })
        
        expect(accessibleName).toBeTruthy()
      }
    }
  })
})
