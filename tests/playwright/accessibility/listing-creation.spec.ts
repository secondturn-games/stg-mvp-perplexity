import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Listing Creation Accessibility', () => {
  const testUser = {
    email: 'playwright.creator@example.com',
    password: 'PlaywrightTest123!',
    name: 'Playwright Creator'
  }

  test.beforeEach(async ({ page }) => {
    // Mock BGG API responses
    await page.route('**/api.boardgamegeek.com/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/xml',
        body: `<?xml version="1.0" encoding="UTF-8"?>
        <items total="1">
          <item type="boardgame" id="13">
            <name type="primary" value="Catan"/>
            <yearpublished value="1995"/>
            <image>https://example.com/catan.jpg</image>
            <thumbnail>https://example.com/catan-thumb.jpg</thumbnail>
          </item>
        </items>`
      })
    })

    // Sign up and sign in
    await page.goto('/auth/sign-up')
    await page.fill('input[name="name"]', testUser.name)
    await page.fill('input[name="email"]', testUser.email)
    await page.fill('input[name="password"]', testUser.password)
    await page.fill('input[name="confirmPassword"]', testUser.password)
    await page.click('button[type="submit"]')
    
    // Handle potential redirect to sign-in
    try {
      await page.waitForURL('/auth/sign-in', { timeout: 3000 })
      await page.fill('input[name="email"]', testUser.email)
      await page.fill('input[name="password"]', testUser.password)
      await page.click('button[type="submit"]')
    } catch {
      // Already signed in or different flow
    }
    
    await page.waitForURL('/', { timeout: 10000 })
  })

  test('Create listing page should be fully accessible', async ({ page }) => {
    // Test create listing page accessibility
    await page.goto('/listings/create')
    await page.waitForLoadState('networkidle')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .withRules([
        'color-contrast',
        'keyboard-navigation',
        'label',
        'aria-required-attr',
        'form-field-multiple-labels',
        'button-name'
      ])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('BGG game selector should be accessible', async ({ page }) => {
    // Test BGG game search accessibility
    await page.goto('/listings/create')
    
    // Check combobox implementation
    const gameSelector = page.locator('[data-testid="bgg-search-input"]')
    await expect(gameSelector).toHaveAttribute('role', 'combobox')
    await expect(gameSelector).toHaveAttribute('aria-autocomplete', 'list')
    await expect(gameSelector).toHaveAttribute('aria-expanded', 'false')
    
    // Test search functionality
    await gameSelector.focus()
    await expect(gameSelector).toBeFocused()
    
    await gameSelector.fill('Catan')
    
    // Wait for search results
    await page.waitForSelector('[data-testid="bgg-search-results"]', { timeout: 5000 })
    
    // Check search results accessibility
    const searchResults = page.locator('[data-testid="bgg-search-results"]')
    await expect(searchResults).toHaveAttribute('role', 'listbox')
    
    const options = await page.locator('[data-testid="bgg-game-option"]').all()
    expect(options.length).toBeGreaterThan(0)
    
    // Check first option accessibility
    await options[0].focus()
    await expect(options[0]).toBeFocused()
    
    // Select game and verify accessibility
    await options[0].click()
    
    // Check selected game display
    const selectedGame = page.locator('[data-testid="selected-game"]')
    await expect(selectedGame).toBeVisible()
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Form validation should be accessible', async ({ page }) => {
    // Test form validation accessibility
    await page.goto('/listings/create')
    
    // Submit form without filling required fields
    await page.click('button[type="submit"]')
    
    // Wait for validation errors
    await page.waitForSelector('[role="alert"], [aria-invalid="true"]', { timeout: 5000 })
    
    // Check that errors are properly announced
    const errorAlerts = await page.locator('[role="alert"]').all()
    expect(errorAlerts.length).toBeGreaterThan(0)
    
    // Check that inputs have aria-invalid
    const invalidInputs = await page.locator('[aria-invalid="true"]').all()
    expect(invalidInputs.length).toBeGreaterThan(0)
    
    // Verify error messages are associated with form fields
    for (const input of invalidInputs) {
      const describedBy = await input.getAttribute('aria-describedby')
      if (describedBy) {
        const errorIds = describedBy.split(' ')
        for (const errorId of errorIds) {
          await expect(page.locator(`#${errorId}`)).toBeAttached()
        }
      }
    }
    
    // Run accessibility check with validation errors
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Price input should be accessible', async ({ page }) => {
    // Test price input specific accessibility
    await page.goto('/listings/create')
    
    const priceInput = page.locator('#price-input')
    await expect(priceInput).toBeVisible()
    
    // Check label association
    await expect(page.locator('label[for="price-input"]')).toBeVisible()
    
    // Check help text association
    await expect(priceInput).toHaveAttribute('aria-describedby')
    const describedBy = await priceInput.getAttribute('aria-describedby')
    
    if (describedBy) {
      const helpIds = describedBy.split(' ')
      for (const helpId of helpIds) {
        await expect(page.locator(`#${helpId}`)).toBeAttached()
      }
    }
    
    // Test invalid price input
    await priceInput.fill('-100')
    await page.click('button[type="submit"]')
    
    // Check error state accessibility
    await page.waitForSelector('[aria-invalid="true"]', { timeout: 3000 })
    await expect(priceInput).toHaveAttribute('aria-invalid', 'true')
    
    // Check error message
    const errorMessage = page.locator('#price-error')
    await expect(errorMessage).toBeVisible()
    await expect(errorMessage).toHaveAttribute('role', 'alert')
  })

  test('Condition selector should be accessible', async ({ page }) => {
    // Test condition dropdown accessibility
    await page.goto('/listings/create')
    
    const conditionButton = page.locator('button[aria-haspopup="listbox"]')
    await expect(conditionButton).toBeVisible()
    
    // Check ARIA attributes
    await expect(conditionButton).toHaveAttribute('aria-expanded', 'false')
    await expect(conditionButton).toHaveAttribute('aria-haspopup', 'listbox')
    
    // Open dropdown
    await conditionButton.click()
    await expect(conditionButton).toHaveAttribute('aria-expanded', 'true')
    
    // Check listbox accessibility
    const listbox = page.locator('[role="listbox"]')
    await expect(listbox).toBeVisible()
    
    const options = await page.locator('[role="option"]').all()
    expect(options.length).toBeGreaterThan(0)
    
    // Test keyboard navigation
    await page.keyboard.press('ArrowDown')
    
    // Check that option is focused/selected
    const selectedOption = page.locator('[role="option"][aria-selected="true"]')
    if (await selectedOption.count() > 0) {
      await expect(selectedOption).toBeVisible()
    }
    
    // Test escape key closes dropdown
    await page.keyboard.press('Escape')
    await expect(listbox).not.toBeVisible()
    await expect(conditionButton).toHaveAttribute('aria-expanded', 'false')
  })

  test('Image upload should be accessible', async ({ page }) => {
    // Test image upload accessibility
    await page.goto('/listings/create')
    
    // Check file input accessibility
    const fileInput = page.locator('#image-upload-input')
    await expect(fileInput).toBeAttached()
    
    // Check label association
    const label = page.locator('label[for="image-upload-input"]')
    await expect(label).toBeVisible()
    
    // Check help text
    const helpText = page.locator('#image-upload-help')
    await expect(helpText).toBeVisible()
    
    // Check upload button accessibility
    const uploadButton = page.locator('button:has-text("Upload photos")')
    await uploadButton.focus()
    await expect(uploadButton).toBeFocused()
    
    // Check drag and drop area accessibility
    const dropArea = page.locator('div:has(input[type="file"])')
    
    // Simulate file upload (mock)
    await page.setInputFiles('#image-upload-input', {
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image-data')
    })
    
    // Check for upload status accessibility
    await page.waitForTimeout(1000)
    
    // Look for image previews or upload status
    const imagePreview = page.locator('[data-testid="image-preview"]')
    if (await imagePreview.count() > 0) {
      const previewImage = imagePreview.locator('img')
      await expect(previewImage).toHaveAttribute('alt')
      
      // Check remove button accessibility
      const removeButton = page.locator('[aria-label*="Remove image"]')
      if (await removeButton.count() > 0) {
        await removeButton.focus()
        await expect(removeButton).toBeFocused()
      }
    }
  })

  test('Form submission should be accessible', async ({ page }) => {
    // Test complete form submission accessibility
    await page.goto('/listings/create')
    
    // Fill out form completely
    
    // Search and select game
    await page.fill('[data-testid="bgg-search-input"]', 'Catan')
    await page.waitForSelector('[data-testid="bgg-search-results"]', { timeout: 5000 })
    await page.click('[data-testid="bgg-game-option"]')
    
    // Fill price
    await page.fill('#price-input', '25.00')
    
    // Select condition
    await page.click('button[aria-haspopup="listbox"]')
    await page.click('[role="option"]:has-text("Good")')
    
    // Fill description
    await page.fill('#description-input', 'Great game in good condition')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Check loading state accessibility
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeDisabled()
    
    // Check for loading announcement
    const loadingStatus = page.locator('#submit-status')
    if (await loadingStatus.count() > 0) {
      await expect(loadingStatus).toHaveClass(/sr-only/)
    }
    
    // Mock successful submission
    await page.route('**/api/listings', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          id: '123'
        })
      })
    })
    
    // Wait for success message or redirect
    try {
      await page.waitForSelector('[data-testid="success-alert"]', { timeout: 10000 })
      
      // Check success message accessibility
      const successAlert = page.locator('[data-testid="success-alert"]')
      await expect(successAlert).toHaveAttribute('role', 'status')
      await expect(successAlert).toHaveAttribute('aria-live', 'polite')
      
    } catch {
      // Might redirect instead of showing success message
      await page.waitForURL('/dashboard', { timeout: 10000 })
    }
  })

  test('Form should handle server errors accessibly', async ({ page }) => {
    // Test server error handling accessibility
    await page.goto('/listings/create')
    
    // Mock server error
    await page.route('**/api/listings', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Server error occurred'
        })
      })
    })
    
    // Fill and submit form
    await page.fill('[data-testid="bgg-search-input"]', 'Catan')
    await page.waitForSelector('[data-testid="bgg-search-results"]', { timeout: 5000 })
    await page.click('[data-testid="bgg-game-option"]')
    await page.fill('#price-input', '25.00')
    await page.click('button[aria-haspopup="listbox"]')
    await page.click('[role="option"]:has-text("Good")')
    
    await page.click('button[type="submit"]')
    
    // Wait for error message
    await page.waitForSelector('[role="alert"]', { timeout: 5000 })
    
    // Check error accessibility
    const errorAlert = page.locator('[role="alert"]')
    await expect(errorAlert).toBeVisible()
    await expect(errorAlert).toHaveAttribute('aria-live', 'polite')
    
    // Verify form remains accessible after error
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Form should be accessible on mobile', async ({ page }) => {
    // Test mobile form accessibility
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/listings/create')
    await page.waitForLoadState('networkidle')
    
    // Check mobile accessibility
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
    
    // Check touch targets meet minimum size
    const interactiveElements = await page.locator('button, a, input, select, textarea').all()
    for (const element of interactiveElements) {
      const boundingBox = await element.boundingBox()
      if (boundingBox && await element.isVisible()) {
        expect(boundingBox.width).toBeGreaterThanOrEqual(44)
        expect(boundingBox.height).toBeGreaterThanOrEqual(44)
      }
    }
  })

  test('Custom dropdown components should be accessible', async ({ page }) => {
    // Test all custom dropdown components
    await page.goto('/listings/create')
    
    // Test condition selector
    const conditionButton = page.locator('button[aria-haspopup="listbox"]')
    await conditionButton.focus()
    await expect(conditionButton).toBeFocused()
    
    // Test keyboard interaction
    await conditionButton.press('Enter')
    await expect(conditionButton).toHaveAttribute('aria-expanded', 'true')
    
    // Test option selection with keyboard
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
    
    // Check that selection is announced
    await expect(conditionButton).toHaveAttribute('aria-expanded', 'false')
    
    // Test city selector if present
    const cityButton = page.locator('button[aria-haspopup="listbox"]:not(:first-of-type)')
    if (await cityButton.count() > 0) {
      await cityButton.focus()
      await expect(cityButton).toBeFocused()
      
      await cityButton.press('Space')
      await expect(cityButton).toHaveAttribute('aria-expanded', 'true')
      
      // Test escape key
      await page.keyboard.press('Escape')
      await expect(cityButton).toHaveAttribute('aria-expanded', 'false')
    }
  })

  test('Character counter should be accessible', async ({ page }) => {
    // Test description character counter accessibility
    await page.goto('/listings/create')
    
    const descriptionTextarea = page.locator('#description-input')
    await expect(descriptionTextarea).toBeVisible()
    
    // Check character counter association
    await expect(descriptionTextarea).toHaveAttribute('aria-describedby')
    const describedBy = await descriptionTextarea.getAttribute('aria-describedby')
    
    expect(describedBy).toContain('description-counter')
    
    // Test character counter updates
    await descriptionTextarea.fill('Test description')
    
    const counter = page.locator('#description-counter')
    await expect(counter).toBeVisible()
    await expect(counter).toHaveAttribute('aria-live', 'polite')
    
    const counterText = await counter.textContent()
    expect(counterText).toContain('16/500') // Length of "Test description"
  })

  test('Required field indicators should be accessible', async ({ page }) => {
    // Test required field accessibility
    await page.goto('/listings/create')
    
    // Check that required fields are properly marked
    const requiredLabels = await page.locator('label:has(span[aria-label="required"])').all()
    expect(requiredLabels.length).toBeGreaterThan(0)
    
    // Check that required spans have proper ARIA
    const requiredSpans = await page.locator('span[aria-label="required"]').all()
    for (const span of requiredSpans) {
      const ariaLabel = await span.getAttribute('aria-label')
      expect(ariaLabel).toBe('required')
    }
    
    // Check that required inputs have required attribute
    const requiredInputs = await page.locator('input[required], select[required], textarea[required]').all()
    expect(requiredInputs.length).toBeGreaterThan(0)
  })

  test('Help text should be accessible', async ({ page }) => {
    // Test help text accessibility
    await page.goto('/listings/create')
    
    // Check that form fields have associated help text
    const inputsWithHelp = await page.locator('input[aria-describedby], textarea[aria-describedby]').all()
    
    for (const input of inputsWithHelp) {
      const describedBy = await input.getAttribute('aria-describedby')
      if (describedBy) {
        const helpIds = describedBy.split(' ')
        for (const helpId of helpIds) {
          if (helpId.includes('help')) {
            const helpElement = page.locator(`#${helpId}`)
            await expect(helpElement).toBeAttached()
            
            const helpText = await helpElement.textContent()
            expect(helpText).toBeTruthy()
            expect(helpText.length).toBeGreaterThan(10) // Should be descriptive
          }
        }
      }
    }
  })

  test('Cancel and submit buttons should be accessible', async ({ page }) => {
    // Test action button accessibility
    await page.goto('/listings/create')
    
    // Test cancel button
    const cancelButton = page.locator('button:has-text("Cancel")')
    await expect(cancelButton).toBeVisible()
    await expect(cancelButton).toHaveAttribute('aria-label')
    
    await cancelButton.focus()
    await expect(cancelButton).toBeFocused()
    
    // Test submit button
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
    
    await submitButton.focus()
    await expect(submitButton).toBeFocused()
    
    // Check button has descriptive content
    const submitText = await submitButton.textContent()
    expect(submitText).toBeTruthy()
    expect(submitText.toLowerCase()).toContain('create')
  })
})
