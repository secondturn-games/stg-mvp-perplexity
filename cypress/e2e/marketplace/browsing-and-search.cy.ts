/// <reference types="cypress" />

import { testUsers, testListings } from '../../fixtures/test-users.json'

describe('Marketplace Browsing and Search', () => {
  const testUser = testUsers.validUser
  const catanListing = testListings.catan
  const ticketListing = testListings.ticket
  const wingspanListing = testListings.wingspan

  beforeEach(() => {
    // Clean up any existing sessions and set up test environment
    cy.clearCookies()
    cy.clearLocalStorage()
    
    // Mock BGG API responses for consistent testing
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

    // Mock listings API responses for different scenarios
    cy.intercept('GET', '/api/listings*', (req) => {
      const url = new URL(req.url)
      const searchParam = url.searchParams.get('search')
      const cityParam = url.searchParams.get('city')
      const conditionParam = url.searchParams.get('condition')
      const page = parseInt(url.searchParams.get('page') || '1')
      
      // Simulate different API responses based on parameters
      if (searchParam === 'nonexistent') {
        // Empty search results
        req.reply({
          statusCode: 200,
          body: {
            data: [],
            count: 0,
            page: 1,
            limit: 20,
            totalPages: 0
          }
        })
      } else if (cityParam === 'Riga') {
        // Filter by city - return only Riga listings
        req.reply({
          statusCode: 200,
          body: {
            data: [
              {
                id: '1',
                game_name: 'Catan',
                price: 25.00,
                condition: 'good',
                city: 'Riga',
                description: 'Great strategy game',
                images: ['test-image.jpg'],
                created_at: '2024-01-01T00:00:00Z',
                user: { email: 'seller@example.com' }
              }
            ],
            count: 1,
            page: 1,
            limit: 20,
            totalPages: 1
          }
        })
      } else if (conditionParam === 'new') {
        // Filter by condition - return only new condition listings
        req.reply({
          statusCode: 200,
          body: {
            data: [
              {
                id: '3',
                game_name: 'Wingspan',
                price: 42.99,
                condition: 'new',
                city: 'Liepaja',
                description: 'Brand new game',
                images: ['test-image.jpg'],
                created_at: '2024-01-03T00:00:00Z',
                user: { email: 'seller3@example.com' }
              }
            ],
            count: 1,
            page: 1,
            limit: 20,
            totalPages: 1
          }
        })
      } else if (page > 1) {
        // Pagination - return different listings for page 2
        req.reply({
          statusCode: 200,
          body: {
            data: [
              {
                id: '21',
                game_name: 'Azul',
                price: 30.00,
                condition: 'very_good',
                city: 'Ventspils',
                description: 'Beautiful tile game',
                images: ['test-image.jpg'],
                created_at: '2024-01-21T00:00:00Z',
                user: { email: 'seller21@example.com' }
              }
            ],
            count: 25,
            page: 2,
            limit: 20,
            totalPages: 2
          }
        })
      } else {
        // Default response with multiple listings
        req.reply({
          statusCode: 200,
          body: {
            data: [
              {
                id: '1',
                game_name: 'Catan',
                price: 25.00,
                condition: 'good',
                city: 'Riga',
                description: 'Great strategy game',
                images: ['test-image.jpg'],
                created_at: '2024-01-01T00:00:00Z',
                user: { email: 'seller@example.com' }
              },
              {
                id: '2',
                game_name: 'Ticket to Ride',
                price: 35.50,
                condition: 'excellent',
                city: 'Daugavpils',
                description: 'Family railway game',
                images: ['test-image.jpg'],
                created_at: '2024-01-02T00:00:00Z',
                user: { email: 'seller2@example.com' }
              },
              {
                id: '3',
                game_name: 'Wingspan',
                price: 42.99,
                condition: 'new',
                city: 'Liepaja',
                description: 'Brand new game',
                images: ['test-image.jpg'],
                created_at: '2024-01-03T00:00:00Z',
                user: { email: 'seller3@example.com' }
              }
            ],
            count: 3,
            page: 1,
            limit: 20,
            totalPages: 1
          }
        })
      }
    }).as('getListings')

    // Navigate to marketplace page
    cy.visit('/listings')
    cy.waitForPageLoad()
  })

  describe('Search Functionality', () => {
    it('should search listings by game name successfully', () => {
      // Test basic search functionality with a valid game name
      cy.log('Testing basic search functionality')
      
      // Verify search input is visible and functional
      cy.get('[data-testid="search-input"]')
        .should('be.visible')
        .and('have.attr', 'placeholder', 'Search board games...')
      
      // Type search query
      cy.get('[data-testid="search-input"]').type('Catan')
      
      // Verify the search updates the URL parameters
      cy.url().should('include', 'search=Catan')
      
      // Wait for API call and verify results
      cy.wait('@getListings')
      cy.get('[data-testid="marketplace-grid"]').should('be.visible')
      cy.get('[data-testid="listing-card"]')
        .should('have.length.at.least', 1)
        .first()
        .should('contain.text', 'Catan')
    })

    it('should handle empty search results gracefully', () => {
      // Test edge case: searching for non-existent games
      cy.log('Testing empty search results handling')
      
      // Search for a game that doesn't exist
      cy.get('[data-testid="search-input"]').type('nonexistent')
      
      // Wait for API response
      cy.wait('@getListings')
      
      // Verify empty state is displayed
      cy.get('[data-testid="no-listings"]')
        .should('be.visible')
        .and('contain.text', 'No listings found')
      
      // Verify helpful message and clear filters button
      cy.get('[data-testid="no-listings"]')
        .should('contain.text', 'Try adjusting your filters')
      
      cy.get('button').contains('Clear Filters').should('be.visible')
    })

    it('should clear search when clear filters is clicked', () => {
      // Test clearing search filters functionality
      cy.log('Testing search filter clearing')
      
      // First, perform a search
      cy.get('[data-testid="search-input"]').type('Catan')
      cy.url().should('include', 'search=Catan')
      
      // Click clear filters button
      cy.get('button').contains('Clear Filters').click()
      
      // Verify search input is cleared and URL is reset
      cy.get('[data-testid="search-input"]').should('have.value', '')
      cy.url().should('not.include', 'search=')
      
      // Verify all listings are shown again
      cy.wait('@getListings')
      cy.get('[data-testid="listing-card"]').should('have.length.at.least', 1)
    })

    it('should handle special characters in search', () => {
      // Test edge case: special characters in search input
      cy.log('Testing search with special characters')
      
      // Test various special characters
      const specialSearches = ['Catan!', 'Game@#$', 'Test & Game', 'Catan (2nd Edition)']
      
      specialSearches.forEach((searchTerm) => {
        cy.get('[data-testid="search-input"]').clear().type(searchTerm)
        cy.wait('@getListings')
        
        // Verify the search doesn't break the application
        cy.get('[data-testid="marketplace-filters"]').should('be.visible')
        cy.url().should('include', `search=${encodeURIComponent(searchTerm)}`)
      })
    })

    it('should debounce search input to avoid excessive API calls', () => {
      // Test search debouncing to ensure performance
      cy.log('Testing search input debouncing')
      
      // Type rapidly to test debouncing
      cy.get('[data-testid="search-input"]').type('C')
      cy.get('[data-testid="search-input"]').type('a')
      cy.get('[data-testid="search-input"]').type('t')
      cy.get('[data-testid="search-input"]').type('a')
      cy.get('[data-testid="search-input"]').type('n')
      
      // Wait for debounce delay and verify only one API call is made
      cy.wait(600) // Wait longer than debounce delay
      cy.wait('@getListings')
      
      // Verify search results appear
      cy.get('[data-testid="listing-card"]').should('be.visible')
    })
  })

  describe('Filter Functionality', () => {
    it('should filter listings by city successfully', () => {
      // Test city filtering functionality
      cy.log('Testing city filter functionality')
      
      // Open city filter dropdown
      cy.get('select[name="city-filter"]').should('be.visible')
      
      // Select a specific city
      cy.get('select[name="city-filter"]').select('Riga')
      
      // Verify URL is updated with city parameter
      cy.url().should('include', 'city=Riga')
      
      // Wait for filtered results
      cy.wait('@getListings')
      
      // Verify only Riga listings are shown
      cy.get('[data-testid="listing-card"]')
        .should('have.length', 1)
        .and('contain.text', 'Riga')
    })

    it('should filter listings by condition successfully', () => {
      // Test condition filtering functionality
      cy.log('Testing condition filter functionality')
      
      // Click on advanced filters to reveal condition filter
      cy.get('button').contains('More Filters').click()
      
      // Select condition filter
      cy.get('[data-testid="condition-filter"]').should('be.visible')
      cy.get('input[type="checkbox"][value="new"]').check()
      
      // Apply filters
      cy.get('button').contains('Apply Filters').click()
      
      // Verify URL contains condition parameter
      cy.url().should('include', 'condition=new')
      
      // Wait for filtered results
      cy.wait('@getListings')
      
      // Verify only 'new' condition listings are shown
      cy.get('[data-testid="listing-card"]')
        .should('have.length', 1)
        .should('contain.text', 'New')
    })

    it('should combine multiple filters correctly', () => {
      // Test combining search, city, and condition filters
      cy.log('Testing combined filters functionality')
      
      // Apply search filter
      cy.get('[data-testid="search-input"]').type('Game')
      
      // Apply city filter
      cy.get('select[name="city-filter"]').select('Riga')
      
      // Open advanced filters and apply condition filter
      cy.get('button').contains('More Filters').click()
      cy.get('input[type="checkbox"][value="good"]').check()
      cy.get('button').contains('Apply Filters').click()
      
      // Verify URL contains all parameters
      cy.url().should('include', 'search=Game')
      cy.url().should('include', 'city=Riga')
      cy.url().should('include', 'condition=good')
      
      // Wait for results with combined filters
      cy.wait('@getListings')
      
      // Verify results match all criteria
      cy.get('[data-testid="marketplace-grid"]').should('be.visible')
    })

    it('should handle invalid filter combinations gracefully', () => {
      // Test edge case: filter combinations that yield no results
      cy.log('Testing invalid filter combinations')
      
      // Apply filters that should return no results
      cy.get('[data-testid="search-input"]').type('nonexistent')
      cy.get('select[name="city-filter"]').select('Riga')
      
      // Wait for empty results
      cy.wait('@getListings')
      
      // Verify empty state with helpful message
      cy.get('[data-testid="no-listings"]')
        .should('be.visible')
        .and('contain.text', 'No listings found')
      
      // Verify clear filters option is available
      cy.get('button').contains('Clear Filters').should('be.visible')
    })

    it('should persist filters in URL for bookmarking', () => {
      // Test that filters are maintained in URL for sharing/bookmarking
      cy.log('Testing filter persistence in URL')
      
      // Apply multiple filters
      cy.get('[data-testid="search-input"]').type('Catan')
      cy.get('select[name="city-filter"]').select('Riga')
      
      // Get current URL with filters
      cy.url().then((urlWithFilters) => {
        // Navigate away and back to test persistence
        cy.visit('/')
        cy.visit(urlWithFilters)
        
        // Verify filters are restored from URL
        cy.get('[data-testid="search-input"]').should('have.value', 'Catan')
        cy.get('select[name="city-filter"]').should('have.value', 'Riga')
        
        // Verify filtered results are displayed
        cy.wait('@getListings')
        cy.get('[data-testid="listing-card"]').should('be.visible')
      })
    })
  })

  describe('Pagination Functionality', () => {
    beforeEach(() => {
      // Mock API response with pagination data
      cy.intercept('GET', '/api/listings*', (req) => {
        const url = new URL(req.url)
        const page = parseInt(url.searchParams.get('page') || '1')
        
        if (page === 1) {
          req.reply({
            statusCode: 200,
            body: {
              data: Array.from({ length: 20 }, (_, i) => ({
                id: `${i + 1}`,
                game_name: `Game ${i + 1}`,
                price: 25.00 + i,
                condition: 'good',
                city: 'Riga',
                description: `Description ${i + 1}`,
                images: ['test-image.jpg'],
                created_at: `2024-01-0${(i % 9) + 1}T00:00:00Z`,
                user: { email: `seller${i + 1}@example.com` }
              })),
              count: 45, // Total items across all pages
              page: 1,
              limit: 20,
              totalPages: 3
            }
          })
        } else if (page === 2) {
          req.reply({
            statusCode: 200,
            body: {
              data: Array.from({ length: 20 }, (_, i) => ({
                id: `${i + 21}`,
                game_name: `Game ${i + 21}`,
                price: 45.00 + i,
                condition: 'very_good',
                city: 'Daugavpils',
                description: `Description ${i + 21}`,
                images: ['test-image.jpg'],
                created_at: `2024-01-0${(i % 9) + 1}T00:00:00Z`,
                user: { email: `seller${i + 21}@example.com` }
              })),
              count: 45,
              page: 2,
              limit: 20,
              totalPages: 3
            }
          })
        } else {
          req.reply({
            statusCode: 200,
            body: {
              data: Array.from({ length: 5 }, (_, i) => ({
                id: `${i + 41}`,
                game_name: `Game ${i + 41}`,
                price: 65.00 + i,
                condition: 'new',
                city: 'Liepaja',
                description: `Description ${i + 41}`,
                images: ['test-image.jpg'],
                created_at: `2024-01-0${(i % 9) + 1}T00:00:00Z`,
                user: { email: `seller${i + 41}@example.com` }
              })),
              count: 45,
              page: 3,
              limit: 20,
              totalPages: 3
            }
          })
        }
      }).as('getPaginatedListings')
    })

    it('should display pagination controls when there are multiple pages', () => {
      // Test pagination controls visibility and functionality
      cy.log('Testing pagination controls display')
      
      // Wait for initial page load
      cy.wait('@getPaginatedListings')
      
      // Verify pagination controls are visible
      cy.get('[data-testid="pagination"]').should('be.visible')
      cy.get('[data-testid="pagination-info"]')
        .should('be.visible')
        .and('contain.text', '1-20 of 45 items')
      
      // Verify page buttons are present
      cy.get('[data-testid="pagination-next"]').should('be.visible').and('not.be.disabled')
      cy.get('[data-testid="pagination-prev"]').should('be.visible').and('be.disabled')
      
      // Verify page numbers are shown
      cy.get('[data-testid="pagination-page"]').should('contain.text', '1')
      cy.get('[data-testid="pagination-page"]').should('contain.text', '3')
    })

    it('should navigate to next page successfully', () => {
      // Test navigating to the next page of results
      cy.log('Testing next page navigation')
      
      // Wait for initial page load
      cy.wait('@getPaginatedListings')
      
      // Verify we're on page 1
      cy.get('[data-testid="listing-card"]').should('have.length', 20)
      cy.get('[data-testid="listing-card"]').first().should('contain.text', 'Game 1')
      
      // Click next page button
      cy.get('[data-testid="pagination-next"]').click()
      
      // Verify URL is updated with page parameter
      cy.url().should('include', 'page=2')
      
      // Wait for page 2 data
      cy.wait('@getPaginatedListings')
      
      // Verify page 2 content is loaded
      cy.get('[data-testid="listing-card"]').should('have.length', 20)
      cy.get('[data-testid="listing-card"]').first().should('contain.text', 'Game 21')
      
      // Verify pagination info is updated
      cy.get('[data-testid="pagination-info"]')
        .should('contain.text', '21-40 of 45 items')
      
      // Verify previous button is now enabled
      cy.get('[data-testid="pagination-prev"]').should('not.be.disabled')
    })

    it('should navigate to previous page successfully', () => {
      // Test navigating back to previous page
      cy.log('Testing previous page navigation')
      
      // Start on page 2
      cy.visit('/listings?page=2')
      cy.wait('@getPaginatedListings')
      
      // Verify we're on page 2
      cy.get('[data-testid="listing-card"]').first().should('contain.text', 'Game 21')
      
      // Click previous page button
      cy.get('[data-testid="pagination-prev"]').click()
      
      // Verify URL is updated
      cy.url().should('include', 'page=1')
      
      // Wait for page 1 data
      cy.wait('@getPaginatedListings')
      
      // Verify page 1 content is loaded
      cy.get('[data-testid="listing-card"]').first().should('contain.text', 'Game 1')
      
      // Verify pagination info is updated
      cy.get('[data-testid="pagination-info"]')
        .should('contain.text', '1-20 of 45 items')
    })

    it('should navigate to specific page by clicking page number', () => {
      // Test direct navigation to specific page numbers
      cy.log('Testing direct page number navigation')
      
      // Wait for initial page load
      cy.wait('@getPaginatedListings')
      
      // Click on page 3
      cy.get('[data-testid="pagination-page"]').contains('3').click()
      
      // Verify URL is updated
      cy.url().should('include', 'page=3')
      
      // Wait for page 3 data
      cy.wait('@getPaginatedListings')
      
      // Verify page 3 content (only 5 items on last page)
      cy.get('[data-testid="listing-card"]').should('have.length', 5)
      cy.get('[data-testid="listing-card"]').first().should('contain.text', 'Game 41')
      
      // Verify pagination info shows last page
      cy.get('[data-testid="pagination-info"]')
        .should('contain.text', '41-45 of 45 items')
      
      // Verify next button is disabled on last page
      cy.get('[data-testid="pagination-next"]').should('be.disabled')
    })

    it('should maintain filters when paginating', () => {
      // Test that filters persist across page navigation
      cy.log('Testing filter persistence during pagination')
      
      // Apply a search filter first
      cy.get('[data-testid="search-input"]').type('Game')
      cy.wait('@getPaginatedListings')
      
      // Navigate to page 2
      cy.get('[data-testid="pagination-next"]').click()
      
      // Verify filter is maintained in URL
      cy.url().should('include', 'search=Game')
      cy.url().should('include', 'page=2')
      
      // Verify search input still has the value
      cy.get('[data-testid="search-input"]').should('have.value', 'Game')
    })

    it('should handle invalid page numbers gracefully', () => {
      // Test edge case: invalid page numbers in URL
      cy.log('Testing invalid page number handling')
      
      // Navigate to invalid page number
      cy.visit('/listings?page=999')
      
      // Should redirect to page 1 or show appropriate error
      cy.url().should('not.include', 'page=999')
      cy.get('[data-testid="marketplace-grid"]').should('be.visible')
    })
  })

  describe('Network Failure Handling', () => {
    it('should display error message when API fails', () => {
      // Test handling of network failures during listing fetch
      cy.log('Testing network failure error handling')
      
      // Mock network failure
      cy.intercept('GET', '/api/listings*', { forceNetworkError: true }).as('networkError')
      
      // Reload page to trigger API call
      cy.reload()
      
      // Verify error message is displayed
      cy.get('[data-testid="network-error"]')
        .should('be.visible')
        .and('contain.text', 'Network error')
      
      // Verify retry button is available
      cy.get('[data-testid="retry-button"]').should('be.visible')
    })

    it('should retry failed requests when retry button is clicked', () => {
      // Test retry functionality after network failure
      cy.log('Testing retry functionality after network failure')
      
      // First, mock network failure
      cy.intercept('GET', '/api/listings*', { forceNetworkError: true }).as('networkError')
      
      // Reload to trigger failure
      cy.reload()
      cy.get('[data-testid="network-error"]').should('be.visible')
      
      // Now mock successful response for retry
      cy.intercept('GET', '/api/listings*', {
        statusCode: 200,
        body: {
          data: [
            {
              id: '1',
              game_name: 'Catan',
              price: 25.00,
              condition: 'good',
              city: 'Riga',
              description: 'Great game',
              images: ['test-image.jpg'],
              created_at: '2024-01-01T00:00:00Z',
              user: { email: 'seller@example.com' }
            }
          ],
          count: 1,
          page: 1,
          limit: 20,
          totalPages: 1
        }
      }).as('retrySuccess')
      
      // Click retry button
      cy.get('[data-testid="retry-button"]').click()
      
      // Verify successful retry
      cy.wait('@retrySuccess')
      cy.get('[data-testid="marketplace-grid"]').should('be.visible')
      cy.get('[data-testid="listing-card"]').should('have.length', 1)
    })

    it('should handle server errors (5xx) appropriately', () => {
      // Test handling of server errors
      cy.log('Testing server error handling')
      
      // Mock server error
      cy.intercept('GET', '/api/listings*', {
        statusCode: 500,
        body: { error: 'Internal server error' }
      }).as('serverError')
      
      // Reload page to trigger error
      cy.reload()
      
      // Verify server error message is displayed
      cy.get('[data-testid="server-error"]')
        .should('be.visible')
        .and('contain.text', 'server error')
      
      // Verify retry option is available
      cy.get('[data-testid="retry-button"]').should('be.visible')
    })

    it('should handle slow API responses with loading states', () => {
      // Test loading states during slow API responses
      cy.log('Testing loading states during slow responses')
      
      // Mock slow API response
      cy.intercept('GET', '/api/listings*', (req) => {
        req.reply({
          statusCode: 200,
          delay: 2000, // 2 second delay
          body: {
            data: [
              {
                id: '1',
                game_name: 'Catan',
                price: 25.00,
                condition: 'good',
                city: 'Riga',
                description: 'Great game',
                images: ['test-image.jpg'],
                created_at: '2024-01-01T00:00:00Z',
                user: { email: 'seller@example.com' }
              }
            ],
            count: 1,
            page: 1,
            limit: 20,
            totalPages: 1
          }
        })
      }).as('slowResponse')
      
      // Trigger search to show loading state
      cy.get('[data-testid="search-input"]').type('Catan')
      
      // Verify loading skeleton is shown during delay
      cy.get('[data-testid="listing-skeleton"]').should('be.visible')
      
      // Wait for response and verify loading is hidden
      cy.wait('@slowResponse')
      cy.get('[data-testid="listing-skeleton"]').should('not.exist')
      cy.get('[data-testid="listing-card"]').should('be.visible')
    })
  })

  describe('Responsive Design', () => {
    it('should work correctly on mobile viewport', () => {
      // Test marketplace functionality on mobile devices
      cy.log('Testing mobile viewport functionality')
      
      // Set mobile viewport
      cy.viewport(375, 667)
      
      // Verify marketplace elements are responsive
      cy.get('[data-testid="marketplace-filters"]').should('be.visible')
      cy.get('[data-testid="search-input"]').should('be.visible')
      
      // Test search functionality on mobile
      cy.get('[data-testid="search-input"]').type('Catan')
      cy.wait('@getListings')
      
      // Verify listing cards are properly sized for mobile
      cy.get('[data-testid="listing-card"]')
        .should('be.visible')
        .and('have.css', 'width')
    })

    it('should work correctly on tablet viewport', () => {
      // Test marketplace functionality on tablet devices
      cy.log('Testing tablet viewport functionality')
      
      // Set tablet viewport
      cy.viewport(768, 1024)
      
      // Verify elements are properly arranged for tablet
      cy.get('[data-testid="marketplace-grid"]').should('be.visible')
      cy.get('[data-testid="marketplace-filters"]').should('be.visible')
      
      // Test functionality works on tablet
      cy.get('[data-testid="search-input"]').type('Game')
      cy.wait('@getListings')
      cy.get('[data-testid="listing-card"]').should('be.visible')
    })
  })
})
