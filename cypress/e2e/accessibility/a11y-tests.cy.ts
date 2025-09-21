/// <reference types="cypress" />

import 'cypress-axe'

describe('Accessibility Tests', () => {
  beforeEach(() => {
    // Inject axe-core for accessibility testing
    cy.visit('/')
    cy.injectAxe()
  })

  describe('Homepage Accessibility', () => {
    it('should not have any accessibility violations on homepage', () => {
      // Test homepage for accessibility violations
      cy.log('Testing homepage accessibility')
      
      cy.checkA11y(undefined, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        },
        rules: {
          'color-contrast': { enabled: true },
          'keyboard-navigation': { enabled: true },
          'focus-management': { enabled: true }
        }
      })
    })

    it('should have proper heading hierarchy', () => {
      // Test heading structure
      cy.log('Testing heading hierarchy')
      
      cy.get('h1').should('have.length.at.least', 1)
      cy.get('h1, h2, h3, h4, h5, h6').then($headings => {
        const headings = Array.from($headings).map(h => parseInt((h as HTMLElement).tagName.charAt(1)))
        
        // Check that we start with h1
        expect(headings[0]).to.equal(1)
        
        // Check that heading levels don't skip (no h1 followed by h3)
        for (let i = 1; i < headings.length; i++) {
          const currentHeading = headings[i]
          const previousHeading = headings[i-1]
          if (currentHeading !== undefined && previousHeading !== undefined) {
            expect(currentHeading).to.be.at.most(previousHeading + 1)
          }
        }
      })
    })

    it('should have proper landmark structure', () => {
      // Test semantic HTML landmarks
      cy.log('Testing landmark structure')
      
      cy.get('nav').should('exist').and('have.attr', 'role', 'navigation')
      cy.get('main').should('exist')
      cy.get('header, [role="banner"]').should('exist')
    })
  })

  describe('Authentication Forms Accessibility', () => {
    it('should not have accessibility violations on sign-in page', () => {
      // Test sign-in form accessibility
      cy.log('Testing sign-in form accessibility')
      
      cy.visit('/auth/sign-in')
      cy.checkA11y(undefined, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        },
        rules: {
          'label': { enabled: true },
          'form-field-multiple-labels': { enabled: true },
          'aria-required-attr': { enabled: true }
        }
      })
    })

    it('should have properly labeled form fields', () => {
      // Test form field labeling
      cy.log('Testing form field labels')
      
      cy.visit('/auth/sign-in')
      
      // Check that all inputs have associated labels
      cy.get('input').each($input => {
        const id = $input.attr('id')
        expect(id).to.exist
        cy.get(`label[for="${id}"]`).should('exist')
      })
    })

    it('should announce form errors to screen readers', () => {
      // Test error announcement
      cy.log('Testing error announcements')
      
      cy.visit('/auth/sign-in')
      
      // Submit form with empty fields to trigger errors
      cy.get('button[type="submit"]').click()
      
      // Check for error messages with proper ARIA
      cy.get('[role="alert"]').should('exist')
      cy.get('[aria-live="polite"]').should('exist')
    })

    it('should not have accessibility violations on sign-up page', () => {
      // Test sign-up form accessibility
      cy.log('Testing sign-up form accessibility')
      
      cy.visit('/auth/sign-up')
      cy.checkA11y()
    })
  })

  describe('Marketplace Accessibility', () => {
    it('should not have accessibility violations on marketplace', () => {
      // Test marketplace page accessibility
      cy.log('Testing marketplace accessibility')
      
      cy.visit('/listings')
      cy.checkA11y(undefined, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      })
    })

    it('should have accessible search functionality', () => {
      // Test search accessibility
      cy.log('Testing search accessibility')
      
      cy.visit('/listings')
      
      // Check search input has proper labeling
      cy.get('[data-testid="search-input"]')
        .should('have.attr', 'id')
        .should('have.attr', 'aria-describedby')
      
      // Check for associated label (visible or screen reader only)
      cy.get('[data-testid="search-input"]').then($input => {
        const id = $input.attr('id')
        cy.get(`label[for="${id}"]`).should('exist')
      })
    })

    it('should have accessible listing cards', () => {
      // Test listing card accessibility
      cy.log('Testing listing card accessibility')
      
      cy.visit('/listings')
      cy.wait(1000) // Wait for page to load
      
      // Check that listing cards are properly structured
      cy.get('[data-testid="listing-card"]').first().within(() => {
        // Should have descriptive link text or aria-label
        cy.get('a').should('have.attr', 'aria-label')
        
        // Images should have alt text
        cy.get('img').should('have.attr', 'alt')
        
        // Should have proper heading structure
        cy.get('h3').should('exist')
      })
    })

    it('should have accessible filter controls', () => {
      // Test filter accessibility
      cy.log('Testing filter controls accessibility')
      
      cy.visit('/listings')
      
      // Check dropdown filters have proper ARIA
      cy.get('button[aria-haspopup="listbox"]').each($button => {
        cy.wrap($button)
          .should('have.attr', 'aria-expanded')
          .should('have.attr', 'id')
      })
    })
  })

  describe('Listing Creation Form Accessibility', () => {
    beforeEach(() => {
      // Visit protected page (authentication will be handled by the app)
      // Note: Custom commands would need to be properly implemented
      // For now, we'll test the pages without authentication
    })

    it('should not have accessibility violations on create listing page', () => {
      // Test listing creation form accessibility
      cy.log('Testing listing creation form accessibility')
      
      cy.visit('/listings/create')
      cy.checkA11y(undefined, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        },
        rules: {
          'label': { enabled: true },
          'aria-required-attr': { enabled: true },
          'form-field-multiple-labels': { enabled: true }
        }
      })
    })

    it('should have accessible game selector', () => {
      // Test BGG game selector accessibility
      cy.log('Testing game selector accessibility')
      
      cy.visit('/listings/create')
      
      // Check combobox implementation
      cy.get('[role="combobox"]')
        .should('have.attr', 'aria-expanded')
        .should('have.attr', 'aria-autocomplete', 'list')
    })

    it('should have accessible condition selector', () => {
      // Test condition dropdown accessibility
      cy.log('Testing condition selector accessibility')
      
      cy.visit('/listings/create')
      
      // Check listbox implementation
      cy.get('button[aria-haspopup="listbox"]').click()
      cy.get('[role="listbox"]').should('be.visible')
      cy.get('[role="option"]').should('have.length.greaterThan', 0)
    })

    it('should have accessible image upload', () => {
      // Test image upload accessibility
      cy.log('Testing image upload accessibility')
      
      cy.visit('/listings/create')
      
      // Check file input has proper labeling
      cy.get('input[type="file"]')
        .should('have.attr', 'id')
        .should('have.attr', 'aria-describedby')
      
      // Check for associated label
      cy.get('input[type="file"]').then($input => {
        const id = $input.attr('id')
        cy.get(`label[for="${id}"]`).should('exist')
      })
    })
  })

  describe('Keyboard Navigation', () => {
    it('should support full keyboard navigation on homepage', () => {
      // Test keyboard navigation
      cy.log('Testing keyboard navigation')
      
      cy.visit('/')
      
      // Test tab navigation through interactive elements
      cy.get('body').tab()
      cy.focused().should('be.visible')
      
      // Continue tabbing through main navigation
      cy.focused().tab()
      cy.focused().should('be.visible')
    })

    it('should support keyboard navigation in forms', () => {
      // Test form keyboard navigation
      cy.log('Testing form keyboard navigation')
      
      cy.visit('/auth/sign-in')
      
      // Tab through form fields
      cy.get('input[name="email"]').focus()
      cy.focused().should('have.attr', 'name', 'email')
      
      cy.focused().tab()
      cy.focused().should('have.attr', 'name', 'password')
      
      cy.focused().tab()
      cy.focused().should('have.attr', 'type', 'submit')
    })

    it('should support keyboard navigation in dropdowns', () => {
      // Test dropdown keyboard navigation
      cy.log('Testing dropdown keyboard navigation')
      
      cy.signUp('cypress.test@example.com', 'CypressTest123!', 'Test User')
      cy.signIn('cypress.test@example.com', 'CypressTest123!')
      
      cy.visit('/listings/create')
      
      // Test condition selector keyboard navigation
      cy.get('button[aria-haspopup="listbox"]').focus()
      cy.focused().type('{enter}') // Open dropdown
      cy.get('[role="listbox"]').should('be.visible')
      
      // Test escape key closes dropdown
      cy.focused().type('{esc}')
      cy.get('[role="listbox"]').should('not.exist')
    })
  })

  describe('Color Contrast and Visual Accessibility', () => {
    it('should meet color contrast requirements', () => {
      // Test color contrast ratios
      cy.log('Testing color contrast')
      
      cy.visit('/')
      cy.checkA11y(null, {
        rules: {
          'color-contrast': { enabled: true }
        }
      })
    })

    it('should be usable in high contrast mode', () => {
      // Test high contrast mode compatibility
      cy.log('Testing high contrast mode')
      
      // Simulate high contrast mode
      cy.visit('/', {
        onBeforeLoad: (win) => {
          win.document.documentElement.style.filter = 'contrast(200%)'
        }
      })
      
      // Verify key elements are still visible
      cy.get('nav').should('be.visible')
      cy.get('h1').should('be.visible')
      cy.get('button, a').should('be.visible')
    })

    it('should provide non-color indicators for status', () => {
      // Test that status is not conveyed by color alone
      cy.log('Testing non-color status indicators')
      
      cy.visit('/auth/sign-in')
      
      // Submit empty form to trigger errors
      cy.get('button[type="submit"]').click()
      
      // Check that errors have text content, not just red color
      cy.get('[role="alert"]').should('contain.text')
      
      // Check for icons or other visual indicators
      cy.get('[role="alert"] svg').should('exist')
    })
  })

  describe('Screen Reader Experience', () => {
    it('should have proper page titles', () => {
      // Test page titles for screen readers
      cy.log('Testing page titles')
      
      const pages = [
        { url: '/', title: 'Second Turn Games' },
        { url: '/listings', title: 'Browse Board Games' },
        { url: '/auth/sign-in', title: 'Sign In' },
        { url: '/auth/sign-up', title: 'Sign Up' }
      ]
      
      pages.forEach(page => {
        cy.visit(page.url)
        cy.title().should('include', page.title)
      })
    })

    it('should have descriptive link text', () => {
      // Test link accessibility
      cy.log('Testing link descriptions')
      
      cy.visit('/')
      
      // Check that links have descriptive text or aria-label
      cy.get('a').each($link => {
        const text = $link.text().trim()
        const ariaLabel = $link.attr('aria-label')
        
        // Link should have either descriptive text or aria-label
        expect(text.length > 0 || ariaLabel).to.be.true
        
        // Avoid generic text like "click here" or "read more"
        if (text) {
          expect(text.toLowerCase()).to.not.include('click here')
          expect(text.toLowerCase()).to.not.include('read more')
        }
      })
    })

    it('should announce dynamic content changes', () => {
      // Test live regions and dynamic content
      cy.log('Testing dynamic content announcements')
      
      cy.visit('/listings')
      
      // Perform search to trigger dynamic content update
      cy.get('[data-testid="search-input"]').type('Catan')
      
      // Check for live regions that announce changes
      cy.get('[aria-live]').should('exist')
    })
  })

  describe('Mobile Accessibility', () => {
    it('should be accessible on mobile viewport', () => {
      // Test mobile accessibility
      cy.log('Testing mobile accessibility')
      
      cy.viewport(375, 667)
      cy.visit('/')
      cy.checkA11y()
    })

    it('should have adequate touch targets on mobile', () => {
      // Test touch target sizes
      cy.log('Testing touch target sizes')
      
      cy.viewport(375, 667)
      cy.visit('/')
      
      // Check that interactive elements meet minimum size requirements
      cy.get('button, a, input, select').each($el => {
        const rect = $el[0].getBoundingClientRect()
        
        // WCAG recommends minimum 44px touch targets
        expect(rect.width).to.be.at.least(44)
        expect(rect.height).to.be.at.least(44)
      })
    })

    it('should support mobile screen readers', () => {
      // Test mobile screen reader support
      cy.log('Testing mobile screen reader support')
      
      cy.viewport(375, 667)
      cy.visit('/listings')
      
      // Check that mobile menu has proper ARIA
      cy.get('button[aria-controls="mobile-menu"]')
        .should('have.attr', 'aria-expanded')
        .should('have.attr', 'aria-label')
    })
  })

  describe('Form Accessibility', () => {
    beforeEach(() => {
      cy.signUp('cypress.test@example.com', 'CypressTest123!', 'Test User')
      cy.signIn('cypress.test@example.com', 'CypressTest123!')
    })

    it('should have accessible form validation', () => {
      // Test form validation accessibility
      cy.log('Testing form validation accessibility')
      
      cy.visit('/listings/create')
      
      // Submit form to trigger validation
      cy.get('button[type="submit"]').click()
      
      // Check that errors are properly announced
      cy.get('[aria-invalid="true"]').should('exist')
      cy.get('[role="alert"]').should('exist')
      
      // Check that errors are associated with form fields
      cy.get('input[aria-invalid="true"]').each($input => {
        const describedBy = $input.attr('aria-describedby')
        if (describedBy) {
          cy.get(`#${describedBy}`).should('exist')
        }
      })
    })

    it('should support keyboard navigation in custom dropdowns', () => {
      // Test custom dropdown keyboard support
      cy.log('Testing dropdown keyboard navigation')
      
      cy.visit('/listings/create')
      
      // Test condition selector keyboard navigation
      cy.get('button[aria-haspopup="listbox"]').focus().type('{enter}')
      cy.get('[role="listbox"]').should('be.visible')
      
      // Test escape key
      cy.focused().type('{esc}')
      cy.get('[role="listbox"]').should('not.exist')
    })
  })

  describe('Error Handling Accessibility', () => {
    it('should announce errors appropriately', () => {
      // Test error announcement patterns
      cy.log('Testing error announcements')
      
      // Mock network error
      cy.intercept('GET', '/api/listings*', { forceNetworkError: true })
      
      cy.visit('/listings')
      
      // Check that error is announced to screen readers
      cy.get('[role="alert"]', { timeout: 10000 }).should('exist')
      cy.get('[aria-live]').should('exist')
    })

    it('should provide accessible retry mechanisms', () => {
      // Test retry button accessibility
      cy.log('Testing retry button accessibility')
      
      cy.intercept('GET', '/api/listings*', { forceNetworkError: true })
      cy.visit('/listings')
      
      // Check retry button is accessible
      cy.get('[data-testid="retry-button"]')
        .should('be.visible')
        .should('have.attr', 'aria-label')
        .should('not.have.attr', 'disabled')
    })
  })

  describe('Loading States Accessibility', () => {
    it('should announce loading states to screen readers', () => {
      // Test loading state announcements
      cy.log('Testing loading state announcements')
      
      // Mock slow API response
      cy.intercept('GET', '/api/listings*', { delay: 2000, body: { data: [], count: 0 } })
      
      cy.visit('/listings')
      
      // Check for loading announcements
      cy.get('[aria-live]').should('exist')
      cy.get('[role="status"]').should('exist')
    })

    it('should provide skip links for repetitive content', () => {
      // Test skip link functionality (if implemented)
      cy.log('Testing skip links')
      
      cy.visit('/')
      
      // Tab to first element and check for skip link
      cy.get('body').tab()
      cy.focused().then($el => {
        const text = $el.text().toLowerCase()
        if (text.includes('skip')) {
          // If skip link exists, test it
          cy.focused().type('{enter}')
          cy.focused().should('not.contain.text', 'skip')
        }
      })
    })
  })

  describe('Focus Management', () => {
    it('should manage focus properly in modals', () => {
      // Test modal focus management
      cy.log('Testing modal focus management')
      
      cy.signUp('cypress.test@example.com', 'CypressTest123!', 'Test User')
      cy.signIn('cypress.test@example.com', 'CypressTest123!')
      
      cy.visit('/listings/1') // Assuming a listing exists
      
      // Open contact modal
      cy.get('[data-testid="contact-seller-button"]').click()
      
      // Focus should move to modal
      cy.get('[data-testid="contact-modal"]').should('be.visible')
      cy.focused().should('be.within', '[data-testid="contact-modal"]')
      
      // Escape should close modal and return focus
      cy.focused().type('{esc}')
      cy.get('[data-testid="contact-modal"]').should('not.exist')
    })

    it('should trap focus within dropdowns', () => {
      // Test focus trapping in dropdowns
      cy.log('Testing dropdown focus trapping')
      
      cy.visit('/')
      
      // Open user menu
      cy.get('[data-testid="user-menu"]').click()
      
      // Focus should be within menu
      cy.get('[role="menu"]').should('be.visible')
      
      // Tab through menu items
      cy.focused().tab()
      cy.focused().should('be.within', '[role="menu"]')
    })
  })
})
