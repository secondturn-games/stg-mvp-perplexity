// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import '@cypress/code-coverage/support'
import 'cypress-axe'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // on uncaught exceptions from the application
  
  // Ignore Next.js hydration errors and other common client-side errors
  if (
    err.message.includes('Hydration failed') ||
    err.message.includes('There was an error while hydrating') ||
    err.message.includes('Text content does not match server-rendered HTML') ||
    err.message.includes('ResizeObserver loop limit exceeded')
  ) {
    return false
  }
  
  // Let other errors fail the test
  return true
})

// Global before hook for all tests
beforeEach(() => {
  // Clear cookies and local storage before each test
  cy.clearCookies()
  cy.clearLocalStorage()
  
  // Set viewport for consistent testing
  cy.viewport(1280, 720)
  
  // Wait for the app to be ready
  cy.visit('/')
  cy.get('body').should('be.visible')
})

// Global after hook
afterEach(() => {
  // Clean up any test data if needed
  // This could include API calls to clean up test users, listings, etc.
})
