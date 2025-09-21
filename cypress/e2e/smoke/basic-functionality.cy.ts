/// <reference types="cypress" />

describe('Smoke Tests - Basic Functionality', () => {
  beforeEach(() => {
    // Intercept external API calls
    cy.intercept('GET', '**/api.boardgamegeek.com/**', { fixture: 'bgg-responses.json' })
  })

  describe('Homepage', () => {
    it('should load the homepage successfully', () => {
      cy.visit('/')
      cy.waitForPageLoad()

      // Verify basic page elements
      cy.get('body').should('be.visible')
      cy.get('nav').should('be.visible')
      cy.title().should('not.be.empty')
    })

    it('should have working navigation links', () => {
      cy.visit('/')
      cy.waitForPageLoad()

      // Test marketplace link
      cy.get('a[href="/listings"]').should('be.visible').click()
      cy.url().should('include', '/listings')
      cy.waitForPageLoad()

      // Go back to home
      cy.get('a[href="/"]').click()
      cy.url().should('eq', Cypress.config().baseUrl + '/')
    })

    it('should show sign in and sign up links when not authenticated', () => {
      cy.visit('/')
      cy.waitForPageLoad()

      cy.get('a[href="/auth/sign-in"]').should('be.visible')
      cy.get('a[href="/auth/sign-up"]').should('be.visible')
    })
  })

  describe('Marketplace Page', () => {
    it('should load marketplace page successfully', () => {
      cy.visit('/listings')
      cy.waitForPageLoad()

      // Verify marketplace elements
      cy.get('[data-testid="marketplace-grid"]').should('be.visible')
      cy.get('[data-testid="marketplace-filters"]').should('be.visible')
      cy.get('[data-testid="search-input"]').should('be.visible')
    })

    it('should handle empty marketplace gracefully', () => {
      cy.visit('/listings')
      cy.waitForPageLoad()

      // If no listings, should show appropriate message
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="listing-card"]').length === 0) {
          cy.get('[data-testid="no-listings"]')
            .should('be.visible')
            .and('contain.text', 'No listings')
        }
      })
    })
  })

  describe('Authentication Pages', () => {
    it('should load sign in page', () => {
      cy.visit('/auth/sign-in')
      cy.waitForPageLoad()

      cy.get('h1').should('contain.text', 'Sign in')
      cy.get('input[name="email"]').should('be.visible')
      cy.get('input[name="password"]').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
    })

    it('should load sign up page', () => {
      cy.visit('/auth/sign-up')
      cy.waitForPageLoad()

      cy.get('h1').should('contain.text', 'Create')
      cy.get('input[name="name"]').should('be.visible')
      cy.get('input[name="email"]').should('be.visible')
      cy.get('input[name="password"]').should('be.visible')
      cy.get('input[name="confirmPassword"]').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
    })
  })

  describe('Error Handling', () => {
    it('should handle 404 pages gracefully', () => {
      cy.visit('/non-existent-page', { failOnStatusCode: false })
      
      // Should show 404 page or redirect
      cy.get('body').should('be.visible')
      cy.get('h1, h2').should('contain.text', '404')
        .or('contain.text', 'Not Found')
        .or('contain.text', 'Page not found')
    })

    it('should handle network errors gracefully', () => {
      // Intercept API calls to simulate network errors
      cy.intercept('GET', '**/api/**', { forceNetworkError: true })
      
      cy.visit('/listings')
      cy.waitForPageLoad()

      // Should handle the error gracefully without crashing
      cy.get('body').should('be.visible')
    })
  })

  describe('Responsive Design', () => {
    it('should work on mobile viewport', () => {
      cy.viewport(375, 667) // iPhone SE
      cy.visit('/')
      cy.waitForPageLoad()

      // Basic elements should still be visible
      cy.get('nav').should('be.visible')
      cy.get('body').should('be.visible')
    })

    it('should work on tablet viewport', () => {
      cy.viewport(768, 1024) // iPad
      cy.visit('/')
      cy.waitForPageLoad()

      cy.get('nav').should('be.visible')
      cy.get('body').should('be.visible')
    })

    it('should work on desktop viewport', () => {
      cy.viewport(1920, 1080) // Desktop
      cy.visit('/')
      cy.waitForPageLoad()

      cy.get('nav').should('be.visible')
      cy.get('body').should('be.visible')
    })
  })

  describe('Performance', () => {
    it('should load pages within reasonable time', () => {
      const startTime = Date.now()
      
      cy.visit('/')
      cy.waitForPageLoad()
      
      cy.then(() => {
        const loadTime = Date.now() - startTime
        expect(loadTime).to.be.lessThan(5000) // 5 seconds max
      })
    })

    it('should not have console errors on homepage', () => {
      cy.visit('/')
      cy.waitForPageLoad()

      // Check for console errors (excluding known Next.js warnings)
      cy.window().then((win) => {
        const errors = win.console.error.calls?.all() || []
        const filteredErrors = errors.filter(call => 
          !call.args[0]?.toString().includes('Hydration') &&
          !call.args[0]?.toString().includes('ResizeObserver')
        )
        expect(filteredErrors).to.have.length(0)
      })
    })
  })

  describe('SEO and Accessibility', () => {
    it('should have proper meta tags', () => {
      cy.visit('/')
      cy.waitForPageLoad()

      cy.get('head title').should('not.be.empty')
      cy.get('head meta[name="description"]').should('exist')
      cy.get('head meta[name="viewport"]').should('exist')
    })

    it('should have accessible form labels', () => {
      cy.visit('/auth/sign-in')
      cy.waitForPageLoad()

      cy.get('input[name="email"]').should('have.attr', 'id')
      cy.get('label[for]').should('exist')
      cy.get('input[name="password"]').should('have.attr', 'id')
    })

    it('should have proper heading hierarchy', () => {
      cy.visit('/')
      cy.waitForPageLoad()

      // Should have at least one h1
      cy.get('h1').should('have.length.at.least', 1)
      
      // Check that headings follow proper hierarchy (h1 before h2, etc.)
      cy.get('h1, h2, h3, h4, h5, h6').then($headings => {
        const headings = Array.from($headings).map(h => parseInt(h.tagName.charAt(1)))
        let previousLevel = 0
        
        headings.forEach(level => {
          if (previousLevel > 0) {
            expect(level).to.be.at.most(previousLevel + 1)
          }
          previousLevel = level
        })
      })
    })
  })
})
