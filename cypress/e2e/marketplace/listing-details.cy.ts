/// <reference types="cypress" />

import { testUsers } from '../../fixtures/test-users.json'

describe('Listing Details and Contact Functionality', () => {
  const testUser = testUsers.validUser
  const testUser2 = testUsers.validUser2

  beforeEach(() => {
    // Clean up any existing sessions
    cy.clearCookies()
    cy.clearLocalStorage()
    
    // Mock BGG API responses
    cy.intercept('GET', '**/api.boardgamegeek.com/**', { fixture: 'bgg-responses.json' })
    
    // Mock individual listing API response
    cy.intercept('GET', '/api/listings/1', {
      statusCode: 200,
      body: {
        id: '1',
        bgg_id: 13,
        game_name: 'Catan',
        price: 25.00,
        condition: 'good',
        city: 'Riga',
        description: 'Great strategy game in good condition. All pieces included. Perfect for family game nights.',
        images: [
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg',
          'https://example.com/image3.jpg'
        ],
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T10:00:00Z',
        user: {
          id: 'seller-123',
          email: 'seller@example.com',
          name: 'John Seller'
        },
        // Additional BGG data
        year_published: 1995,
        min_players: 3,
        max_players: 4,
        playing_time: 75,
        thumbnail: 'https://example.com/thumbnail.jpg'
      }
    }).as('getListing')
    
    // Mock contact seller API
    cy.intercept('POST', '/api/listings/1/contact', (req) => {
      // Simulate different responses based on request body
      const { message } = req.body
      
      if (message && message.length > 10) {
        req.reply({
          statusCode: 200,
          body: { success: true, message: 'Message sent successfully' }
        })
      } else {
        req.reply({
          statusCode: 400,
          body: { success: false, error: 'Message too short' }
        })
      }
    }).as('contactSeller')
    
    // Mock related listings API
    cy.intercept('GET', '/api/listings/1/related', {
      statusCode: 200,
      body: {
        data: [
          {
            id: '2',
            game_name: 'Catan: Cities & Knights',
            price: 35.00,
            condition: 'very_good',
            city: 'Riga',
            images: ['https://example.com/related1.jpg'],
            user: { email: 'seller2@example.com' }
          },
          {
            id: '3',
            game_name: 'Catan: Seafarers',
            price: 30.00,
            condition: 'good',
            city: 'Daugavpils',
            images: ['https://example.com/related2.jpg'],
            user: { email: 'seller3@example.com' }
          }
        ]
      }
    }).as('getRelatedListings')
  })

  describe('Listing Details Display', () => {
    it('should display all listing details correctly', () => {
      // Test that all listing information is properly displayed
      cy.log('Testing complete listing details display')
      
      // Visit listing details page
      cy.visit('/listings/1')
      cy.waitForPageLoad()
      
      // Wait for listing data to load
      cy.wait('@getListing')
      
      // Verify main listing information is displayed
      cy.get('[data-testid="listing-title"]')
        .should('be.visible')
        .and('contain.text', 'Catan')
      
      cy.get('[data-testid="listing-price"]')
        .should('be.visible')
        .and('contain.text', '€25.00')
      
      cy.get('[data-testid="listing-condition"]')
        .should('be.visible')
        .and('contain.text', 'Good')
      
      cy.get('[data-testid="listing-city"]')
        .should('be.visible')
        .and('contain.text', 'Riga')
      
      cy.get('[data-testid="listing-description"]')
        .should('be.visible')
        .and('contain.text', 'Great strategy game in good condition')
      
      // Verify game details from BGG
      cy.get('[data-testid="game-year"]')
        .should('be.visible')
        .and('contain.text', '1995')
      
      cy.get('[data-testid="game-players"]')
        .should('be.visible')
        .and('contain.text', '3-4 players')
      
      cy.get('[data-testid="game-time"]')
        .should('be.visible')
        .and('contain.text', '75 minutes')
      
      // Verify listing metadata
      cy.get('[data-testid="listing-date"]')
        .should('be.visible')
        .and('contain.text', 'Jan 1')
    })

    it('should display image gallery with navigation', () => {
      // Test image gallery functionality
      cy.log('Testing image gallery display and navigation')
      
      cy.visit('/listings/1')
      cy.wait('@getListing')
      
      // Verify main image is displayed
      cy.get('[data-testid="main-image"]')
        .should('be.visible')
        .and('have.attr', 'src')
        .and('include', 'image1.jpg')
      
      // Verify thumbnail navigation
      cy.get('[data-testid="image-thumbnail"]').should('have.length', 3)
      
      // Click on second thumbnail
      cy.get('[data-testid="image-thumbnail"]').eq(1).click()
      
      // Verify main image changes
      cy.get('[data-testid="main-image"]')
        .should('have.attr', 'src')
        .and('include', 'image2.jpg')
      
      // Test navigation arrows (if present)
      cy.get('[data-testid="image-next"]').should('be.visible').click()
      cy.get('[data-testid="main-image"]')
        .should('have.attr', 'src')
        .and('include', 'image3.jpg')
      
      cy.get('[data-testid="image-prev"]').should('be.visible').click()
      cy.get('[data-testid="main-image"]')
        .should('have.attr', 'src')
        .and('include', 'image2.jpg')
    })

    it('should handle listings with no images gracefully', () => {
      // Test edge case: listings without images
      cy.log('Testing listing with no images')
      
      // Mock listing without images
      cy.intercept('GET', '/api/listings/1', {
        statusCode: 200,
        body: {
          id: '1',
          game_name: 'Catan',
          price: 25.00,
          condition: 'good',
          city: 'Riga',
          description: 'Great game',
          images: [], // No images
          created_at: '2024-01-01T10:00:00Z',
          user: { email: 'seller@example.com' }
        }
      })
      
      cy.visit('/listings/1')
      cy.waitForPageLoad()
      
      // Verify placeholder image is shown
      cy.get('[data-testid="no-image-placeholder"]')
        .should('be.visible')
        .and('contain.text', 'No image available')
      
      // Verify no thumbnail navigation is shown
      cy.get('[data-testid="image-thumbnail"]').should('not.exist')
    })

    it('should display seller information appropriately', () => {
      // Test seller information display (without exposing sensitive data)
      cy.log('Testing seller information display')
      
      cy.visit('/listings/1')
      cy.wait('@getListing')
      
      // Verify seller section exists but email is not directly visible
      cy.get('[data-testid="seller-info"]').should('be.visible')
      
      // Verify seller name or username is shown (if available)
      cy.get('[data-testid="seller-name"]')
        .should('be.visible')
        .and('contain.text', 'John Seller')
      
      // Verify listing date is shown
      cy.get('[data-testid="listing-date"]').should('be.visible')
      
      // Verify seller email is NOT directly visible for privacy
      cy.get('[data-testid="seller-info"]')
        .should('not.contain.text', 'seller@example.com')
    })

    it('should show related listings section', () => {
      // Test related listings functionality
      cy.log('Testing related listings display')
      
      cy.visit('/listings/1')
      cy.wait('@getListing')
      cy.wait('@getRelatedListings')
      
      // Verify related listings section
      cy.get('[data-testid="related-listings"]')
        .should('be.visible')
        .and('contain.text', 'Related Games')
      
      // Verify related listing cards
      cy.get('[data-testid="related-listing-card"]')
        .should('have.length', 2)
        .first()
        .should('contain.text', 'Catan: Cities & Knights')
      
      // Test clicking on related listing
      cy.get('[data-testid="related-listing-card"]').first().click()
      
      // Should navigate to related listing
      cy.url().should('include', '/listings/2')
    })
  })

  describe('Contact Seller Functionality', () => {
    beforeEach(() => {
      // Sign in as a different user to test contact functionality
      cy.signUp(testUser2.email, testUser2.password, testUser2.name)
      cy.signIn(testUser2.email, testUser2.password)
    })

    it('should display contact seller button for authenticated users', () => {
      // Test contact button visibility for logged-in users
      cy.log('Testing contact seller button visibility')
      
      cy.visit('/listings/1')
      cy.wait('@getListing')
      
      // Verify contact seller button is visible
      cy.get('[data-testid="contact-seller-button"]')
        .should('be.visible')
        .and('contain.text', 'Contact Seller')
        .and('not.be.disabled')
    })

    it('should open contact modal when contact button is clicked', () => {
      // Test contact modal opening
      cy.log('Testing contact modal opening')
      
      cy.visit('/listings/1')
      cy.wait('@getListing')
      
      // Click contact seller button
      cy.get('[data-testid="contact-seller-button"]').click()
      
      // Verify modal opens
      cy.get('[data-testid="contact-modal"]')
        .should('be.visible')
        .and('contain.text', 'Contact Seller')
      
      // Verify modal content
      cy.get('[data-testid="contact-form"]').should('be.visible')
      cy.get('textarea[name="message"]').should('be.visible')
      cy.get('[data-testid="send-message-button"]').should('be.visible')
      cy.get('[data-testid="cancel-contact-button"]').should('be.visible')
      
      // Verify listing details are shown in modal
      cy.get('[data-testid="contact-modal"]')
        .should('contain.text', 'Catan')
        .and('contain.text', '€25.00')
    })

    it('should send contact message successfully', () => {
      // Test successful message sending
      cy.log('Testing successful contact message sending')
      
      cy.visit('/listings/1')
      cy.wait('@getListing')
      
      // Open contact modal
      cy.get('[data-testid="contact-seller-button"]').click()
      
      // Fill in message
      const message = 'Hi, I\'m interested in buying this game. Is it still available? Can we arrange a meeting in Riga?'
      cy.get('textarea[name="message"]').type(message)
      
      // Verify character count (if implemented)
      cy.get('[data-testid="message-counter"]')
        .should('be.visible')
        .and('contain.text', `${message.length}`)
      
      // Send message
      cy.get('[data-testid="send-message-button"]').click()
      
      // Wait for API call
      cy.wait('@contactSeller')
      
      // Verify success message
      cy.get('[data-testid="message-sent-success"]')
        .should('be.visible')
        .and('contain.text', 'Message sent successfully')
      
      // Verify modal closes after success
      cy.get('[data-testid="contact-modal"]').should('not.exist')
    })

    it('should validate message content before sending', () => {
      // Test message validation
      cy.log('Testing message validation')
      
      cy.visit('/listings/1')
      cy.wait('@getListing')
      
      // Open contact modal
      cy.get('[data-testid="contact-seller-button"]').click()
      
      // Try to send empty message
      cy.get('[data-testid="send-message-button"]').click()
      
      // Verify validation error
      cy.get('[data-testid="message-error"]')
        .should('be.visible')
        .and('contain.text', 'Message is required')
      
      // Try to send very short message
      cy.get('textarea[name="message"]').type('Hi')
      cy.get('[data-testid="send-message-button"]').click()
      
      // Wait for API response (should fail)
      cy.wait('@contactSeller')
      
      // Verify error message for short content
      cy.get('[data-testid="message-error"]')
        .should('be.visible')
        .and('contain.text', 'Message too short')
    })

    it('should handle contact form errors gracefully', () => {
      // Test error handling in contact form
      cy.log('Testing contact form error handling')
      
      // Mock API error
      cy.intercept('POST', '/api/listings/1/contact', {
        statusCode: 500,
        body: { success: false, error: 'Server error occurred' }
      }).as('contactError')
      
      cy.visit('/listings/1')
      cy.wait('@getListing')
      
      // Open contact modal and fill form
      cy.get('[data-testid="contact-seller-button"]').click()
      cy.get('textarea[name="message"]').type('I am interested in this game. Please let me know if it is still available.')
      cy.get('[data-testid="send-message-button"]').click()
      
      // Wait for error response
      cy.wait('@contactError')
      
      // Verify error message is displayed
      cy.get('[data-testid="contact-error"]')
        .should('be.visible')
        .and('contain.text', 'error occurred')
      
      // Verify modal remains open for retry
      cy.get('[data-testid="contact-modal"]').should('be.visible')
      cy.get('[data-testid="send-message-button"]').should('be.visible')
    })

    it('should close modal when cancel button is clicked', () => {
      // Test modal cancellation
      cy.log('Testing contact modal cancellation')
      
      cy.visit('/listings/1')
      cy.wait('@getListing')
      
      // Open contact modal
      cy.get('[data-testid="contact-seller-button"]').click()
      cy.get('[data-testid="contact-modal"]').should('be.visible')
      
      // Type some message
      cy.get('textarea[name="message"]').type('Test message')
      
      // Click cancel
      cy.get('[data-testid="cancel-contact-button"]').click()
      
      // Verify modal closes
      cy.get('[data-testid="contact-modal"]').should('not.exist')
    })

    it('should close modal when clicking outside', () => {
      // Test modal closing by clicking outside
      cy.log('Testing modal close by clicking outside')
      
      cy.visit('/listings/1')
      cy.wait('@getListing')
      
      // Open contact modal
      cy.get('[data-testid="contact-seller-button"]').click()
      cy.get('[data-testid="contact-modal"]').should('be.visible')
      
      // Click outside modal (on overlay)
      cy.get('[data-testid="modal-overlay"]').click({ force: true })
      
      // Verify modal closes
      cy.get('[data-testid="contact-modal"]').should('not.exist')
    })
  })

  describe('Authentication Requirements', () => {
    it('should redirect to login when unauthenticated user tries to contact seller', () => {
      // Test authentication requirement for contact functionality
      cy.log('Testing authentication requirement for contact')
      
      // Ensure user is not logged in
      cy.clearCookies()
      cy.clearLocalStorage()
      
      cy.visit('/listings/1')
      cy.wait('@getListing')
      
      // Click contact seller button
      cy.get('[data-testid="contact-seller-button"]').click()
      
      // Should redirect to login page
      cy.url().should('include', '/auth/sign-in')
      cy.url().should('include', 'redirectTo=/listings/1')
      
      // Verify login form is displayed
      cy.get('h1').should('contain.text', 'Sign in')
    })

    it('should show sign-in prompt for unauthenticated users', () => {
      // Test sign-in prompt for unauthenticated users
      cy.log('Testing sign-in prompt for unauthenticated users')
      
      cy.visit('/listings/1')
      cy.wait('@getListing')
      
      // Verify contact section shows sign-in prompt instead of button
      cy.get('[data-testid="sign-in-to-contact"]')
        .should('be.visible')
        .and('contain.text', 'Sign in to contact seller')
      
      // Verify sign-in link works
      cy.get('[data-testid="sign-in-link"]').click()
      cy.url().should('include', '/auth/sign-in')
    })

    it('should prevent own listing contact for listing owner', () => {
      // Test that users cannot contact themselves
      cy.log('Testing prevention of self-contact')
      
      // Mock listing owned by current user
      cy.intercept('GET', '/api/listings/1', {
        statusCode: 200,
        body: {
          id: '1',
          game_name: 'Catan',
          price: 25.00,
          condition: 'good',
          city: 'Riga',
          description: 'Great game',
          images: ['https://example.com/image1.jpg'],
          created_at: '2024-01-01T10:00:00Z',
          user: {
            email: testUser.email, // Same as logged-in user
            name: 'Test User'
          }
        }
      })
      
      // Sign in as test user
      cy.signUp(testUser.email, testUser.password, testUser.name)
      cy.signIn(testUser.email, testUser.password)
      
      cy.visit('/listings/1')
      cy.waitForPageLoad()
      
      // Verify contact button is not shown for own listing
      cy.get('[data-testid="contact-seller-button"]').should('not.exist')
      
      // Verify appropriate message is shown instead
      cy.get('[data-testid="own-listing-notice"]')
        .should('be.visible')
        .and('contain.text', 'This is your listing')
    })
  })

  describe('Error Handling and Edge Cases', () => {
    it('should handle non-existent listing gracefully', () => {
      // Test 404 handling for non-existent listings
      cy.log('Testing non-existent listing handling')
      
      // Mock 404 response
      cy.intercept('GET', '/api/listings/999', {
        statusCode: 404,
        body: { error: 'Listing not found' }
      }).as('listingNotFound')
      
      // Visit non-existent listing
      cy.visit('/listings/999', { failOnStatusCode: false })
      
      // Wait for API call
      cy.wait('@listingNotFound')
      
      // Verify 404 page or error message is shown
      cy.get('[data-testid="listing-not-found"]')
        .should('be.visible')
        .and('contain.text', 'Listing not found')
      
      // Verify link back to marketplace
      cy.get('[data-testid="back-to-marketplace"]')
        .should('be.visible')
        .and('contain.text', 'Browse all listings')
    })

    it('should handle server errors when loading listing', () => {
      // Test server error handling
      cy.log('Testing server error handling')
      
      // Mock server error
      cy.intercept('GET', '/api/listings/1', {
        statusCode: 500,
        body: { error: 'Internal server error' }
      }).as('serverError')
      
      cy.visit('/listings/1')
      
      // Wait for error response
      cy.wait('@serverError')
      
      // Verify error message is displayed
      cy.get('[data-testid="server-error"]')
        .should('be.visible')
        .and('contain.text', 'error occurred')
      
      // Verify retry button is available
      cy.get('[data-testid="retry-button"]').should('be.visible')
    })

    it('should handle network failures gracefully', () => {
      // Test network failure handling
      cy.log('Testing network failure handling')
      
      // Mock network failure
      cy.intercept('GET', '/api/listings/1', { forceNetworkError: true }).as('networkError')
      
      cy.visit('/listings/1')
      
      // Verify network error message
      cy.get('[data-testid="network-error"]')
        .should('be.visible')
        .and('contain.text', 'Network error')
      
      // Verify retry functionality
      cy.get('[data-testid="retry-button"]').should('be.visible')
    })

    it('should handle slow loading with appropriate loading states', () => {
      // Test loading states during slow responses
      cy.log('Testing loading states')
      
      // Mock slow response
      cy.intercept('GET', '/api/listings/1', (req) => {
        req.reply({
          statusCode: 200,
          delay: 2000,
          body: {
            id: '1',
            game_name: 'Catan',
            price: 25.00,
            condition: 'good',
            city: 'Riga',
            description: 'Great game',
            images: ['https://example.com/image1.jpg'],
            created_at: '2024-01-01T10:00:00Z',
            user: { email: 'seller@example.com' }
          }
        })
      }).as('slowListing')
      
      cy.visit('/listings/1')
      
      // Verify loading skeleton is shown
      cy.get('[data-testid="listing-skeleton"]').should('be.visible')
      
      // Wait for response
      cy.wait('@slowListing')
      
      // Verify loading is hidden and content is shown
      cy.get('[data-testid="listing-skeleton"]').should('not.exist')
      cy.get('[data-testid="listing-title"]').should('be.visible')
    })
  })

  describe('SEO and Meta Information', () => {
    it('should have appropriate page title and meta tags', () => {
      // Test SEO optimization for listing pages
      cy.log('Testing SEO meta information')
      
      cy.visit('/listings/1')
      cy.wait('@getListing')
      
      // Verify page title includes game name
      cy.title().should('include', 'Catan')
      
      // Verify meta description (if implemented)
      cy.get('head meta[name="description"]')
        .should('have.attr', 'content')
        .and('include', 'Catan')
      
      // Verify Open Graph tags (if implemented)
      cy.get('head meta[property="og:title"]')
        .should('have.attr', 'content')
        .and('include', 'Catan')
    })
  })

  describe('Responsive Design', () => {
    it('should display correctly on mobile devices', () => {
      // Test mobile responsiveness
      cy.log('Testing mobile responsiveness')
      
      cy.viewport(375, 667)
      cy.visit('/listings/1')
      cy.wait('@getListing')
      
      // Verify elements are properly sized for mobile
      cy.get('[data-testid="listing-title"]').should('be.visible')
      cy.get('[data-testid="main-image"]').should('be.visible')
      cy.get('[data-testid="contact-seller-button"]').should('be.visible')
      
      // Test contact modal on mobile
      cy.get('[data-testid="contact-seller-button"]').click()
      cy.get('[data-testid="contact-modal"]').should('be.visible')
      
      // Verify modal is properly sized for mobile
      cy.get('textarea[name="message"]').should('be.visible')
    })

    it('should display correctly on tablet devices', () => {
      // Test tablet responsiveness
      cy.log('Testing tablet responsiveness')
      
      cy.viewport(768, 1024)
      cy.visit('/listings/1')
      cy.wait('@getListing')
      
      // Verify layout works well on tablet
      cy.get('[data-testid="listing-details"]').should('be.visible')
      cy.get('[data-testid="image-gallery"]').should('be.visible')
      cy.get('[data-testid="related-listings"]').should('be.visible')
    })
  })
})
