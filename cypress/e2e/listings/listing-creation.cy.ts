/// <reference types="cypress" />

import { testUsers, testListings } from '../../fixtures/test-users.json'

describe('Listing Creation and Marketplace', () => {
  const testUser = testUsers.validUser
  const catanListing = testListings.catan
  const ticketListing = testListings.ticket
  const wingspanListing = testListings.wingspan

  beforeEach(() => {
    // Clean up any existing sessions
    cy.clearCookies()
    cy.clearLocalStorage()
    
    // Intercept BGG API calls with mock responses
    cy.intercept('GET', '**/api.boardgamegeek.com/xmlapi2/search*', (req) => {
      const query = req.query.query as string
      if (query?.toLowerCase().includes('catan')) {
        req.reply({ fixture: 'bgg-responses.json', property: 'catanSearchResponse' })
      } else if (query?.toLowerCase().includes('ticket')) {
        req.reply({ fixture: 'bgg-responses.json', property: 'ticketSearchResponse' })
      } else {
        req.reply({ fixture: 'bgg-responses.json', property: 'emptySearchResponse' })
      }
    })

    // Intercept image upload requests
    cy.intercept('POST', '**/storage/v1/object/**', {
      statusCode: 200,
      body: { Key: 'test-image-url.jpg' }
    })

    // Sign up and sign in a test user before each test
    cy.signUp(testUser.email, testUser.password, testUser.name)
    cy.signIn(testUser.email, testUser.password)
  })

  afterEach(() => {
    // Clean up test data
    cy.cleanupTestData()
  })

  describe('Listing Creation Form', () => {
    it('should display the create listing form', () => {
      cy.visit('/listings/create')
      cy.waitForPageLoad()

      // Verify form elements are present
      cy.get('[data-testid="bgg-search-input"]').should('be.visible')
      cy.get('input[type="number"]').should('be.visible')
      cy.get('select[name="condition"]').should('be.visible')
      cy.get('textarea').should('be.visible')
      cy.get('input[type="file"]').should('exist')
      cy.get('button[type="submit"]').should('be.visible').and('contain.text', 'Create Listing')
    })

    it('should search and select a board game from BGG', () => {
      cy.visit('/listings/create')
      cy.waitForPageLoad()

      // Search for a game
      cy.get('[data-testid="bgg-search-input"]').type('Catan')
      
      // Wait for search results
      cy.get('[data-testid="bgg-search-results"]', { timeout: 10000 }).should('be.visible')
      
      // Select the first game
      cy.get('[data-testid="bgg-game-option"]').first().click()
      
      // Verify game is selected
      cy.get('[data-testid="selected-game"]').should('be.visible').and('contain.text', 'Catan')
    })

    it('should validate required fields', () => {
      cy.visit('/listings/create')
      cy.waitForPageLoad()

      // Try to submit without filling required fields
      cy.get('button[type="submit"]').click()

      // Should show validation errors
      cy.get('[data-testid="form-error"]').should('be.visible')
      cy.get('input[type="number"]').should('have.class', 'border-red-300')
      cy.get('select[name="condition"]').should('have.class', 'border-red-300')
    })

    it('should validate price input', () => {
      cy.visit('/listings/create')
      cy.waitForPageLoad()

      // Test invalid price values
      cy.get('input[type="number"]').type('-5')
      cy.get('button[type="submit"]').click()
      cy.get('[data-testid="price-error"]').should('contain.text', 'valid price')

      // Test price too high
      cy.get('input[type="number"]').clear().type('15000')
      cy.get('button[type="submit"]').click()
      cy.get('[data-testid="price-error"]').should('contain.text', 'cannot exceed')

      // Test valid price
      cy.get('input[type="number"]').clear().type('25.50')
      cy.get('[data-testid="price-error"]').should('not.exist')
    })
  })

  describe('Image Upload Functionality', () => {
    it('should upload and display images', () => {
      cy.visit('/listings/create')
      cy.waitForPageLoad()

      // Upload test image
      cy.uploadTestImage('input[type="file"]', 'test-image.jpg')

      // Verify image preview appears
      cy.get('[data-testid="image-preview"]', { timeout: 10000 }).should('be.visible')
      cy.get('[data-testid="image-count"]').should('contain.text', '1')
    })

    it('should handle multiple image uploads', () => {
      cy.visit('/listings/create')
      cy.waitForPageLoad()

      // Upload multiple images (if supported)
      cy.uploadTestImage('input[type="file"]', 'test-image.jpg')
      cy.get('[data-testid="image-preview"]').should('have.length', 1)

      // Test maximum image limit
      cy.get('[data-testid="max-images-warning"]').should('not.exist')
    })

    it('should allow removing uploaded images', () => {
      cy.visit('/listings/create')
      cy.waitForPageLoad()

      // Upload an image
      cy.uploadTestImage('input[type="file"]', 'test-image.jpg')
      cy.get('[data-testid="image-preview"]').should('be.visible')

      // Remove the image
      cy.get('[data-testid="remove-image-button"]').click()
      cy.get('[data-testid="image-preview"]').should('not.exist')
    })
  })

  describe('Complete Listing Creation', () => {
    it('should create a listing with all required fields', () => {
      cy.visit('/listings/create')
      cy.waitForPageLoad()

      // Search and select a game
      cy.get('[data-testid="bgg-search-input"]').type(catanListing.gameName)
      cy.get('[data-testid="bgg-search-results"]', { timeout: 10000 }).should('be.visible')
      cy.get('[data-testid="bgg-game-option"]').first().click()

      // Fill in the form
      cy.get('input[type="number"]').clear().type(catanListing.price)
      cy.get('select[name="condition"]').select(catanListing.condition)
      cy.get('textarea').type(catanListing.description)
      cy.get('select[name="city"]').select(catanListing.city)

      // Upload an image
      cy.uploadTestImage('input[type="file"]', 'test-image.jpg')

      // Submit the form
      cy.get('button[type="submit"]').click()

      // Verify success message
      cy.get('[data-testid="success-alert"]', { timeout: 15000 })
        .should('be.visible')
        .and('contain.text', 'Listing created successfully')

      // Should redirect to dashboard or listing page
      cy.url().should('not.include', '/listings/create')
    })

    it('should create a minimal listing with only required fields', () => {
      cy.visit('/listings/create')
      cy.waitForPageLoad()

      // Search and select a game
      cy.get('[data-testid="bgg-search-input"]').type('Ticket to Ride')
      cy.get('[data-testid="bgg-search-results"]', { timeout: 10000 }).should('be.visible')
      cy.get('[data-testid="bgg-game-option"]').first().click()

      // Fill in only required fields
      cy.get('input[type="number"]').clear().type('30.00')
      cy.get('select[name="condition"]').select('good')

      // Submit the form
      cy.get('button[type="submit"]').click()

      // Verify success
      cy.get('[data-testid="success-alert"]', { timeout: 15000 })
        .should('be.visible')
    })

    it('should handle server errors gracefully', () => {
      // Intercept create listing API to return error
      cy.intercept('POST', '**/api/listings', {
        statusCode: 500,
        body: { error: 'Server error' }
      })

      cy.visit('/listings/create')
      cy.waitForPageLoad()

      // Fill in form
      cy.get('[data-testid="bgg-search-input"]').type('Catan')
      cy.get('[data-testid="bgg-search-results"]', { timeout: 10000 }).should('be.visible')
      cy.get('[data-testid="bgg-game-option"]').first().click()
      cy.get('input[type="number"]').type('25.00')
      cy.get('select[name="condition"]').select('excellent')

      // Submit form
      cy.get('button[type="submit"]').click()

      // Should show error message
      cy.get('[data-testid="error-alert"]', { timeout: 10000 })
        .should('be.visible')
        .and('contain.text', 'error')
    })
  })

  describe('Marketplace Integration', () => {
    beforeEach(() => {
      // Create a test listing first
      cy.createTestListing(catanListing)
    })

    it('should display created listing in marketplace', () => {
      cy.visit('/listings')
      cy.waitForPageLoad()

      // Verify marketplace page loads
      cy.get('[data-testid="marketplace-grid"]').should('be.visible')

      // Look for the created listing
      cy.get('[data-testid="listing-card"]')
        .should('be.visible')
        .and('contain.text', catanListing.gameName)
        .and('contain.text', `€${catanListing.price}`)
    })

    it('should show listing details when clicked', () => {
      cy.visit('/listings')
      cy.waitForPageLoad()

      // Click on a listing card
      cy.get('[data-testid="listing-card"]').first().click()

      // Should navigate to listing detail page
      cy.url().should('include', '/listings/')
      cy.waitForPageLoad()

      // Verify listing details are shown
      cy.get('[data-testid="listing-title"]').should('contain.text', catanListing.gameName)
      cy.get('[data-testid="listing-price"]').should('contain.text', catanListing.price)
      cy.get('[data-testid="listing-condition"]').should('contain.text', catanListing.condition)
      cy.get('[data-testid="listing-description"]').should('contain.text', catanListing.description)
    })

    it('should filter listings by search', () => {
      // Create multiple listings for testing filters
      cy.createTestListing(ticketListing)
      
      cy.visit('/listings')
      cy.waitForPageLoad()

      // Use search filter
      cy.get('[data-testid="search-input"]').type('Catan')
      cy.get('[data-testid="search-button"]').click()

      // Should show only Catan listings
      cy.get('[data-testid="listing-card"]')
        .should('have.length.at.least', 1)
        .and('contain.text', 'Catan')

      // Should not show other games
      cy.get('[data-testid="listing-card"]')
        .should('not.contain.text', 'Ticket to Ride')
    })

    it('should filter listings by condition', () => {
      // Create listings with different conditions
      cy.createTestListing(wingspanListing) // condition: 'new'
      
      cy.visit('/listings')
      cy.waitForPageLoad()

      // Filter by condition
      cy.get('[data-testid="condition-filter"]').select('new')
      cy.get('[data-testid="apply-filters-button"]').click()

      // Should show only new condition listings
      cy.get('[data-testid="listing-card"]')
        .should('contain.text', 'Wingspan')
        .and('contain.text', 'New')
    })

    it('should handle empty search results', () => {
      cy.visit('/listings')
      cy.waitForPageLoad()

      // Search for non-existent game
      cy.get('[data-testid="search-input"]').type('NonExistentGame12345')
      cy.get('[data-testid="search-button"]').click()

      // Should show no results message
      cy.get('[data-testid="no-results"]')
        .should('be.visible')
        .and('contain.text', 'No listings found')
    })
  })

  describe('Seller Contact Functionality', () => {
    beforeEach(() => {
      // Create a listing and then sign out to test as different user
      cy.createTestListing(catanListing)
      cy.signOut()
      
      // Sign up and sign in as different user
      cy.signUp(testUsers.validUser2.email, testUsers.validUser2.password, testUsers.validUser2.name)
      cy.signIn(testUsers.validUser2.email, testUsers.validUser2.password)
    })

    it('should show contact seller button on listing details', () => {
      cy.visit('/listings')
      cy.waitForPageLoad()

      // Click on listing to view details
      cy.get('[data-testid="listing-card"]').first().click()
      cy.waitForPageLoad()

      // Should show contact seller button
      cy.get('[data-testid="contact-seller-button"]')
        .should('be.visible')
        .and('contain.text', 'Contact Seller')
    })

    it('should open contact modal when contact button clicked', () => {
      cy.visit('/listings')
      cy.waitForPageLoad()
      cy.get('[data-testid="listing-card"]').first().click()
      cy.waitForPageLoad()

      // Click contact seller button
      cy.get('[data-testid="contact-seller-button"]').click()

      // Should open contact modal
      cy.get('[data-testid="contact-modal"]').should('be.visible')
      cy.get('[data-testid="contact-form"]').should('be.visible')
      cy.get('textarea[name="message"]').should('be.visible')
    })

    it('should send contact message successfully', () => {
      cy.visit('/listings')
      cy.waitForPageLoad()
      cy.get('[data-testid="listing-card"]').first().click()
      cy.waitForPageLoad()

      // Open contact modal
      cy.get('[data-testid="contact-seller-button"]').click()

      // Fill and submit contact form
      cy.get('textarea[name="message"]').type('Hi, I\'m interested in buying this game. Is it still available?')
      cy.get('[data-testid="send-message-button"]').click()

      // Should show success message
      cy.get('[data-testid="message-sent-success"]', { timeout: 10000 })
        .should('be.visible')
        .and('contain.text', 'Message sent')
    })
  })

  describe('User Dashboard Integration', () => {
    beforeEach(() => {
      // Create some test listings
      cy.createTestListing(catanListing)
      cy.createTestListing(ticketListing)
    })

    it('should show user listings in dashboard', () => {
      cy.visit('/dashboard')
      cy.waitForPageLoad()

      // Should show user's listings
      cy.get('[data-testid="user-listings"]').should('be.visible')
      cy.get('[data-testid="user-listing-card"]')
        .should('have.length.at.least', 2)
        .and('contain.text', catanListing.gameName)
        .and('contain.text', ticketListing.gameName)
    })

    it('should allow editing listings from dashboard', () => {
      cy.visit('/dashboard')
      cy.waitForPageLoad()

      // Click edit on first listing
      cy.get('[data-testid="edit-listing-button"]').first().click()

      // Should navigate to edit page
      cy.url().should('include', '/edit')
      cy.waitForPageLoad()

      // Should pre-populate form with existing data
      cy.get('input[type="number"]').should('have.value', catanListing.price)
      cy.get('select[name="condition"]').should('have.value', catanListing.condition)
    })

    it('should allow deleting listings from dashboard', () => {
      cy.visit('/dashboard')
      cy.waitForPageLoad()

      // Get initial listing count
      cy.get('[data-testid="user-listing-card"]').its('length').as('initialCount')

      // Delete first listing
      cy.get('[data-testid="delete-listing-button"]').first().click()
      cy.get('[data-testid="confirm-delete-button"]').click()

      // Should show success message
      cy.get('[data-testid="delete-success"]', { timeout: 10000 })
        .should('be.visible')

      // Should have one fewer listing
      cy.get('@initialCount').then((initialCount) => {
        cy.get('[data-testid="user-listing-card"]')
          .should('have.length', Number(initialCount) - 1)
      })
    })
  })
})
