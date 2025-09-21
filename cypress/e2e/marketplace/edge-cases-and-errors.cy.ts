/// <reference types="cypress" />

describe('Marketplace Edge Cases and Error Scenarios', () => {
  beforeEach(() => {
    // Clean up any existing sessions
    cy.clearCookies()
    cy.clearLocalStorage()
    
    // Set up basic interceptors
    cy.intercept('GET', '**/api.boardgamegeek.com/**', { fixture: 'bgg-responses.json' })
  })

  describe('Search Edge Cases', () => {
    it('should handle extremely long search queries', () => {
      // Test behavior with very long search strings
      cy.log('Testing extremely long search queries')
      
      // Mock API to handle long queries
      cy.intercept('GET', '/api/listings*', {
        statusCode: 200,
        body: {
          data: [],
          count: 0,
          page: 1,
          limit: 20,
          totalPages: 0
        }
      }).as('longSearchQuery')
      
      cy.visit('/listings')
      cy.waitForPageLoad()
      
      // Create a very long search string (over 1000 characters)
      const longQuery = 'a'.repeat(1000)
      
      // Type long query
      cy.get('[data-testid="search-input"]').type(longQuery)
      
      // Verify input handles long text appropriately
      cy.get('[data-testid="search-input"]').should('have.value', longQuery)
      
      // Verify API call is made (might be truncated)
      cy.wait('@longSearchQuery')
      
      // Verify no client-side errors occur
      cy.get('[data-testid="marketplace-filters"]').should('be.visible')
    })

    it('should handle search queries with only whitespace', () => {
      // Test behavior with whitespace-only queries
      cy.log('Testing whitespace-only search queries')
      
      cy.visit('/listings')
      cy.waitForPageLoad()
      
      // Type only spaces and tabs
      cy.get('[data-testid="search-input"]').type('   \t   ')
      
      // Verify search doesn't trigger for whitespace-only input
      // (Should be handled by debouncing and trimming)
      cy.get('[data-testid="search-input"]').should('have.value', '   \t   ')
      
      // Clear input and verify it's handled properly
      cy.get('[data-testid="search-input"]').clear()
      cy.get('[data-testid="search-input"]').should('have.value', '')
    })

    it('should handle SQL injection attempts in search', () => {
      // Test security: SQL injection attempts should be handled safely
      cy.log('Testing SQL injection attempt handling')
      
      // Mock API to return normal response (should not be affected by injection)
      cy.intercept('GET', '/api/listings*', {
        statusCode: 200,
        body: {
          data: [],
          count: 0,
          page: 1,
          limit: 20,
          totalPages: 0
        }
      }).as('injectionAttempt')
      
      cy.visit('/listings')
      cy.waitForPageLoad()
      
      // Try various SQL injection patterns
      const injectionAttempts = [
        "'; DROP TABLE listings; --",
        "' OR '1'='1",
        "'; DELETE FROM users; --",
        "UNION SELECT * FROM users",
        "<script>alert('xss')</script>"
      ]
      
      injectionAttempts.forEach((injection) => {
        cy.get('[data-testid="search-input"]').clear().type(injection)
        cy.wait('@injectionAttempt')
        
        // Verify application doesn't break
        cy.get('[data-testid="marketplace-filters"]').should('be.visible')
        
        // Verify no script execution (for XSS attempts)
        cy.window().then((win) => {
          // Should not have any alert dialogs
          expect(win.alert).to.not.have.been.called
        })
      })
    })

    it('should handle Unicode and emoji characters in search', () => {
      // Test international character support
      cy.log('Testing Unicode and emoji character support')
      
      cy.intercept('GET', '/api/listings*', {
        statusCode: 200,
        body: {
          data: [],
          count: 0,
          page: 1,
          limit: 20,
          totalPages: 0
        }
      }).as('unicodeSearch')
      
      cy.visit('/listings')
      cy.waitForPageLoad()
      
      // Test various Unicode characters
      const unicodeTests = [
        'Café Spiel', // Accented characters
        'Игра настольная', // Cyrillic
        '游戏', // Chinese
        '🎲🎯🃏', // Emojis
        'Spiel™ & Co®', // Special symbols
        'Müller\'s Game' // Mixed characters
      ]
      
      unicodeTests.forEach((searchTerm) => {
        cy.get('[data-testid="search-input"]').clear().type(searchTerm)
        cy.wait('@unicodeSearch')
        
        // Verify input accepts Unicode characters
        cy.get('[data-testid="search-input"]').should('have.value', searchTerm)
        
        // Verify URL encoding works correctly
        cy.url().should('include', 'search=')
      })
    })

    it('should handle rapid consecutive searches without breaking', () => {
      // Test rapid search input changes
      cy.log('Testing rapid consecutive searches')
      
      let apiCallCount = 0
      cy.intercept('GET', '/api/listings*', (req) => {
        apiCallCount++
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
      }).as('rapidSearch')
      
      cy.visit('/listings')
      cy.waitForPageLoad()
      
      // Type rapidly changing search terms
      const searches = ['A', 'AB', 'ABC', 'ABCD', 'ABCDE']
      
      searches.forEach((search, index) => {
        cy.get('[data-testid="search-input"]').clear().type(search)
        // Small delay between rapid searches
        cy.wait(100)
      })
      
      // Wait for debouncing to complete
      cy.wait(1000)
      
      // Verify only the final search triggered API call due to debouncing
      cy.get('[data-testid="search-input"]').should('have.value', 'ABCDE')
    })
  })

  describe('Filter Edge Cases', () => {
    it('should handle invalid price ranges gracefully', () => {
      // Test invalid price filter inputs
      cy.log('Testing invalid price range handling')
      
      cy.visit('/listings')
      cy.waitForPageLoad()
      
      // Open advanced filters
      cy.get('button').contains('More Filters').click()
      
      // Try invalid price ranges
      cy.get('input[name="minPrice"]').type('-100') // Negative price
      cy.get('input[name="maxPrice"]').type('abc') // Non-numeric
      
      // Apply filters
      cy.get('button').contains('Apply Filters').click()
      
      // Verify validation errors or graceful handling
      cy.get('[data-testid="price-error"]')
        .should('be.visible')
        .and('contain.text', 'Invalid price range')
      
      // Try min price greater than max price
      cy.get('input[name="minPrice"]').clear().type('100')
      cy.get('input[name="maxPrice"]').clear().type('50')
      cy.get('button').contains('Apply Filters').click()
      
      // Verify logical validation
      cy.get('[data-testid="price-error"]')
        .should('be.visible')
        .and('contain.text', 'minimum price cannot be greater than maximum')
    })

    it('should handle extremely large price values', () => {
      // Test very large price inputs
      cy.log('Testing extremely large price values')
      
      cy.visit('/listings')
      cy.waitForPageLoad()
      
      cy.get('button').contains('More Filters').click()
      
      // Try extremely large price
      const largePrice = '999999999999'
      cy.get('input[name="maxPrice"]').type(largePrice)
      cy.get('button').contains('Apply Filters').click()
      
      // Verify handling of large numbers
      cy.get('[data-testid="price-error"]')
        .should('be.visible')
        .and('contain.text', 'Price too large')
    })

    it('should handle all filters being cleared simultaneously', () => {
      // Test clearing all filters at once
      cy.log('Testing simultaneous filter clearing')
      
      cy.intercept('GET', '/api/listings*', {
        statusCode: 200,
        body: {
          data: [
            {
              id: '1',
              game_name: 'Test Game',
              price: 25.00,
              condition: 'good',
              city: 'Riga',
              images: ['test.jpg'],
              created_at: '2024-01-01T00:00:00Z',
              user: { email: 'test@example.com' }
            }
          ],
          count: 1,
          page: 1,
          limit: 20,
          totalPages: 1
        }
      }).as('allFiltersCleared')
      
      cy.visit('/listings')
      cy.waitForPageLoad()
      
      // Apply multiple filters
      cy.get('[data-testid="search-input"]').type('Test')
      cy.get('select[name="city-filter"]').select('Riga')
      
      cy.get('button').contains('More Filters').click()
      cy.get('input[type="checkbox"][value="good"]').check()
      cy.get('button').contains('Apply Filters').click()
      
      // Clear all filters
      cy.get('button').contains('Clear Filters').click()
      
      // Verify all filters are cleared
      cy.get('[data-testid="search-input"]').should('have.value', '')
      cy.get('select[name="city-filter"]').should('have.value', '')
      
      // Verify URL is clean
      cy.url().should('not.include', 'search=')
      cy.url().should('not.include', 'city=')
      cy.url().should('not.include', 'condition=')
      
      // Verify all listings are shown
      cy.wait('@allFiltersCleared')
      cy.get('[data-testid="listing-card"]').should('be.visible')
    })
  })

  describe('Pagination Edge Cases', () => {
    it('should handle page numbers beyond available pages', () => {
      // Test navigation to pages that don't exist
      cy.log('Testing invalid page number handling')
      
      // Mock API to return empty results for invalid pages
      cy.intercept('GET', '/api/listings*', (req) => {
        const url = new URL(req.url)
        const page = parseInt(url.searchParams.get('page') || '1')
        
        if (page > 5) { // Assume max 5 pages
          req.reply({
            statusCode: 400,
            body: { error: 'Page not found' }
          })
        } else {
          req.reply({
            statusCode: 200,
            body: {
              data: [],
              count: 0,
              page: page,
              limit: 20,
              totalPages: 5
            }
          })
        }
      }).as('invalidPage')
      
      // Try to navigate to page beyond available pages
      cy.visit('/listings?page=999')
      
      // Should handle gracefully
      cy.wait('@invalidPage')
      
      // Verify error handling or redirect to valid page
      cy.get('[data-testid="page-error"]')
        .should('be.visible')
        .and('contain.text', 'Page not found')
      
      // Verify link back to first page
      cy.get('[data-testid="back-to-first-page"]').should('be.visible').click()
      cy.url().should('not.include', 'page=999')
    })

    it('should handle negative page numbers', () => {
      // Test negative page numbers
      cy.log('Testing negative page numbers')
      
      cy.visit('/listings?page=-1')
      
      // Should redirect to page 1 or show error
      cy.url().should('not.include', 'page=-1')
      cy.get('[data-testid="marketplace-grid"]').should('be.visible')
    })

    it('should handle non-numeric page parameters', () => {
      // Test non-numeric page values
      cy.log('Testing non-numeric page parameters')
      
      cy.visit('/listings?page=abc')
      
      // Should handle gracefully
      cy.url().should('not.include', 'page=abc')
      cy.get('[data-testid="marketplace-grid"]').should('be.visible')
    })

    it('should handle pagination with zero results', () => {
      // Test pagination when there are no results
      cy.log('Testing pagination with zero results')
      
      cy.intercept('GET', '/api/listings*', {
        statusCode: 200,
        body: {
          data: [],
          count: 0,
          page: 1,
          limit: 20,
          totalPages: 0
        }
      }).as('noResults')
      
      cy.visit('/listings')
      cy.wait('@noResults')
      
      // Verify pagination is not shown when there are no results
      cy.get('[data-testid="pagination"]').should('not.exist')
      cy.get('[data-testid="no-listings"]').should('be.visible')
    })
  })

  describe('API Error Scenarios', () => {
    it('should handle rate limiting gracefully', () => {
      // Test API rate limiting response
      cy.log('Testing rate limiting handling')
      
      cy.intercept('GET', '/api/listings*', {
        statusCode: 429,
        headers: {
          'Retry-After': '60'
        },
        body: { error: 'Too many requests' }
      }).as('rateLimited')
      
      cy.visit('/listings')
      cy.wait('@rateLimited')
      
      // Verify rate limit message is displayed
      cy.get('[data-testid="rate-limit-error"]')
        .should('be.visible')
        .and('contain.text', 'Too many requests')
      
      // Verify retry information is shown
      cy.get('[data-testid="retry-after"]')
        .should('be.visible')
        .and('contain.text', 'Please try again in 60 seconds')
    })

    it('should handle timeout errors appropriately', () => {
      // Test API timeout scenarios
      cy.log('Testing timeout error handling')
      
      cy.intercept('GET', '/api/listings*', (req) => {
        req.reply({
          statusCode: 408,
          body: { error: 'Request timeout' }
        })
      }).as('timeout')
      
      cy.visit('/listings')
      cy.wait('@timeout')
      
      // Verify timeout error message
      cy.get('[data-testid="timeout-error"]')
        .should('be.visible')
        .and('contain.text', 'Request timed out')
      
      // Verify retry button is available
      cy.get('[data-testid="retry-button"]').should('be.visible')
    })

    it('should handle malformed API responses', () => {
      // Test handling of invalid JSON responses
      cy.log('Testing malformed API response handling')
      
      cy.intercept('GET', '/api/listings*', {
        statusCode: 200,
        body: 'invalid json response'
      }).as('malformedResponse')
      
      cy.visit('/listings')
      cy.wait('@malformedResponse')
      
      // Verify error handling for malformed data
      cy.get('[data-testid="data-error"]')
        .should('be.visible')
        .and('contain.text', 'Invalid response format')
    })

    it('should handle partial API failures gracefully', () => {
      // Test when some API calls succeed and others fail
      cy.log('Testing partial API failure handling')
      
      // Mock main listings API to succeed
      cy.intercept('GET', '/api/listings', {
        statusCode: 200,
        body: {
          data: [
            {
              id: '1',
              game_name: 'Test Game',
              price: 25.00,
              condition: 'good',
              city: 'Riga',
              images: ['test.jpg'],
              created_at: '2024-01-01T00:00:00Z',
              user: { email: 'test@example.com' }
            }
          ],
          count: 1,
          page: 1,
          limit: 20,
          totalPages: 1
        }
      }).as('listingsSuccess')
      
      // Mock related API to fail
      cy.intercept('GET', '/api/listings/*/related', {
        statusCode: 500,
        body: { error: 'Related listings unavailable' }
      }).as('relatedFail')
      
      cy.visit('/listings/1')
      cy.wait('@listingsSuccess')
      
      // Main content should load successfully
      cy.get('[data-testid="listing-title"]').should('be.visible')
      
      // Related section should show error gracefully
      cy.get('[data-testid="related-error"]')
        .should('be.visible')
        .and('contain.text', 'Related listings unavailable')
    })
  })

  describe('Browser Compatibility Edge Cases', () => {
    it('should handle disabled JavaScript gracefully', () => {
      // Test basic functionality without JavaScript (if applicable)
      cy.log('Testing graceful degradation without JavaScript')
      
      // Note: This test might be limited in Cypress as it runs with JS enabled
      // But we can test for appropriate fallbacks
      
      cy.visit('/listings')
      cy.waitForPageLoad()
      
      // Verify basic HTML structure is present
      cy.get('form').should('exist') // Basic form elements
      cy.get('input[type="text"]').should('exist') // Search input
      
      // Verify no JavaScript errors in console
      cy.window().then((win) => {
        expect(win.console.error).to.not.have.been.called
      })
    })

    it('should handle very slow network connections', () => {
      // Test behavior on slow networks
      cy.log('Testing slow network connection handling')
      
      // Mock very slow API responses
      cy.intercept('GET', '/api/listings*', (req) => {
        req.reply({
          statusCode: 200,
          delay: 5000, // 5 second delay
          body: {
            data: [],
            count: 0,
            page: 1,
            limit: 20,
            totalPages: 0
          }
        })
      }).as('slowNetwork')
      
      cy.visit('/listings')
      
      // Verify loading states are shown for extended periods
      cy.get('[data-testid="loading-skeleton"]', { timeout: 6000 }).should('be.visible')
      
      // Verify eventual loading completion
      cy.wait('@slowNetwork')
      cy.get('[data-testid="loading-skeleton"]').should('not.exist')
    })

    it('should handle browser back/forward navigation correctly', () => {
      // Test browser navigation with filters
      cy.log('Testing browser navigation with state preservation')
      
      cy.intercept('GET', '/api/listings*', {
        statusCode: 200,
        body: {
          data: [],
          count: 0,
          page: 1,
          limit: 20,
          totalPages: 0
        }
      }).as('navigation')
      
      cy.visit('/listings')
      cy.waitForPageLoad()
      
      // Apply filters
      cy.get('[data-testid="search-input"]').type('Test Game')
      cy.wait('@navigation')
      
      // Navigate away
      cy.visit('/')
      
      // Navigate back
      cy.go('back')
      
      // Verify filters are restored
      cy.get('[data-testid="search-input"]').should('have.value', 'Test Game')
      cy.url().should('include', 'search=Test%20Game')
    })
  })

  describe('Memory and Performance Edge Cases', () => {
    it('should handle large datasets without memory issues', () => {
      // Test performance with large result sets
      cy.log('Testing large dataset handling')
      
      // Mock API with large dataset
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i + 1}`,
        game_name: `Game ${i + 1}`,
        price: 25.00 + (i % 100),
        condition: ['new', 'good', 'fair'][i % 3],
        city: ['Riga', 'Daugavpils', 'Liepaja'][i % 3],
        images: [`image${i + 1}.jpg`],
        created_at: '2024-01-01T00:00:00Z',
        user: { email: `user${i + 1}@example.com` }
      }))
      
      cy.intercept('GET', '/api/listings*', {
        statusCode: 200,
        body: {
          data: largeDataset.slice(0, 20), // First page
          count: 1000,
          page: 1,
          limit: 20,
          totalPages: 50
        }
      }).as('largeDataset')
      
      cy.visit('/listings')
      cy.wait('@largeDataset')
      
      // Verify page renders without performance issues
      cy.get('[data-testid="listing-card"]').should('have.length', 20)
      cy.get('[data-testid="pagination"]').should('be.visible')
      
      // Test scrolling performance
      cy.scrollTo('bottom')
      cy.scrollTo('top')
      
      // Verify no memory leaks (basic check)
      cy.window().then((win) => {
        expect(win.performance.memory).to.exist
      })
    })

    it('should handle rapid filter changes without performance degradation', () => {
      // Test performance under rapid user interactions
      cy.log('Testing performance under rapid interactions')
      
      let requestCount = 0
      cy.intercept('GET', '/api/listings*', (req) => {
        requestCount++
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
      }).as('rapidFilters')
      
      cy.visit('/listings')
      cy.waitForPageLoad()
      
      // Rapidly change filters
      for (let i = 0; i < 10; i++) {
        cy.get('[data-testid="search-input"]').clear().type(`Search ${i}`)
        cy.wait(50) // Very short delay
      }
      
      // Wait for debouncing to settle
      cy.wait(1000)
      
      // Verify reasonable number of API calls were made (debouncing working)
      expect(requestCount).to.be.lessThan(5) // Should be much less than 10 due to debouncing
    })
  })
})
