// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/// <reference types="cypress" />

// Custom command type definitions
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to sign up a new user
       * @example cy.signUp('test@example.com', 'password123', 'Test User')
       */
      signUp(email: string, password: string, name: string): Chainable<Element>
      
      /**
       * Custom command to sign in an existing user
       * @example cy.signIn('test@example.com', 'password123')
       */
      signIn(email: string, password: string): Chainable<Element>
      
      /**
       * Custom command to sign out the current user
       * @example cy.signOut()
       */
      signOut(): Chainable<Element>
      
      /**
       * Custom command to wait for page to be fully loaded
       * @example cy.waitForPageLoad()
       */
      waitForPageLoad(): Chainable<Element>
      
      /**
       * Custom command to upload a test image file
       * @example cy.uploadTestImage('input[type="file"]', 'test-image.jpg')
       */
      uploadTestImage(selector: string, fileName: string): Chainable<Element>
      
      /**
       * Custom command to create a test listing
       * @example cy.createTestListing({ gameName: 'Catan', price: '25.00', condition: 'good' })
       */
      createTestListing(listingData: {
        gameName: string
        price: string
        condition: string
        description?: string
        city?: string
      }): Chainable<Element>
      
      /**
       * Custom command to clean up test data
       * @example cy.cleanupTestData()
       */
      cleanupTestData(): Chainable<Element>
      
      /**
       * Custom command to check accessibility
       * @example cy.checkAccessibility()
       */
      checkAccessibility(): Chainable<Element>
    }
  }
}

// Sign Up Command
Cypress.Commands.add('signUp', (email: string, password: string, name: string) => {
  cy.visit('/auth/sign-up')
  cy.waitForPageLoad()
  
  // Fill in the sign-up form
  cy.get('input[name="name"]').type(name)
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.get('input[name="confirmPassword"]').type(password)
  
  // Submit the form
  cy.get('button[type="submit"]').click()
  
  // Wait for success message or redirect
  cy.get('[data-testid="success-alert"], [data-testid="form-success"]', { timeout: 10000 })
    .should('be.visible')
})

// Sign In Command
Cypress.Commands.add('signIn', (email: string, password: string) => {
  cy.visit('/auth/sign-in')
  cy.waitForPageLoad()
  
  // Fill in the sign-in form
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  
  // Submit the form
  cy.get('button[type="submit"]').click()
  
  // Wait for successful sign in (redirect to home page or dashboard)
  cy.url().should('not.include', '/auth/sign-in')
  cy.get('body').should('be.visible')
})

// Sign Out Command
Cypress.Commands.add('signOut', () => {
  // Click on user menu or sign out button
  cy.get('[data-testid="user-menu"]', { timeout: 5000 }).should('be.visible').click()
  cy.get('[data-testid="sign-out-button"]', { timeout: 5000 }).should('be.visible').click()
  
  // Wait for redirect to home page
  cy.url().should('not.include', '/dashboard')
  cy.get('body').should('be.visible')
})

// Wait for Page Load Command
Cypress.Commands.add('waitForPageLoad', () => {
  // Wait for the page to be fully loaded
  cy.get('body').should('be.visible')
  
  // Wait for any loading spinners to disappear
  cy.get('[data-testid="loading-spinner"]', { timeout: 1000 }).should('not.exist')
  cy.get('[data-testid="page-loading"]', { timeout: 1000 }).should('not.exist')
  
  // Wait for Next.js to finish hydration
  cy.window().should('have.property', 'next')
})

// Upload Test Image Command
Cypress.Commands.add('uploadTestImage', (selector: string, fileName: string) => {
  // Use fixture file for upload
  cy.fixture(fileName, 'base64').then((fileContent) => {
    const blob = Cypress.Blob.base64StringToBlob(fileContent, 'image/jpeg')
    const file = new File([blob], fileName, { type: 'image/jpeg' })
    
    cy.get(selector).then((input) => {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      ;(input[0] as HTMLInputElement).files = dataTransfer.files
      
      // Trigger change event
      cy.wrap(input).trigger('change', { force: true })
    })
  })
})

// Create Test Listing Command
Cypress.Commands.add('createTestListing', (listingData) => {
  cy.visit('/listings/create')
  cy.waitForPageLoad()
  
  // Search and select a game
  cy.get('[data-testid="bgg-search-input"]').type(listingData.gameName)
  cy.get('[data-testid="bgg-search-results"]').should('be.visible')
  cy.get('[data-testid="bgg-game-option"]').first().click()
  
  // Fill in price
  cy.get('input[type="number"]').clear().type(listingData.price)
  
  // Select condition
  cy.get('select[name="condition"]').select(listingData.condition)
  
  // Add description if provided
  if (listingData.description) {
    cy.get('textarea[name="description"]').type(listingData.description)
  }
  
  // Select city if provided
  if (listingData.city) {
    cy.get('select[name="city"]').select(listingData.city)
  }
  
  // Submit the form
  cy.get('button[type="submit"]').click()
  
  // Wait for success message or redirect
  cy.get('[data-testid="success-alert"]', { timeout: 15000 }).should('be.visible')
})

// Cleanup Test Data Command
Cypress.Commands.add('cleanupTestData', () => {
  // This would typically make API calls to clean up test data
  // For now, we'll just clear browser storage
  cy.clearCookies()
  cy.clearLocalStorage()
  
  // In a real implementation, you might want to:
  // 1. Delete test user accounts
  // 2. Delete test listings
  // 3. Clean up uploaded test images
  // This would require API calls to your backend
})

// Accessibility Testing Command
Cypress.Commands.add('checkAccessibility', () => {
  // Inject axe-core and run accessibility check
  cy.injectAxe()
  cy.checkA11y(null, {
    tags: ['wcag2a', 'wcag2aa'],
    rules: {
      'color-contrast': { enabled: true },
      'keyboard-navigation': { enabled: true },
      'focus-management': { enabled: true },
      'aria-required-attr': { enabled: true },
      'label': { enabled: true }
    }
  })
})
