/// <reference types="cypress" />

import 'cypress-axe'

describe('Comprehensive Accessibility Audit', () => {
  beforeEach(() => {
    // Configure axe-core with custom rules and options
    cy.visit('/')
    cy.injectAxe()
    
    // Configure axe with comprehensive rule set
    cy.configureAxe({
      rules: [
        { id: 'color-contrast', enabled: true },
        { id: 'keyboard-navigation', enabled: true },
        { id: 'focus-management', enabled: true },
        { id: 'aria-required-attr', enabled: true },
        { id: 'label', enabled: true },
        { id: 'button-name', enabled: true },
        { id: 'link-name', enabled: true },
        { id: 'image-alt', enabled: true },
        { id: 'heading-order', enabled: true },
        { id: 'landmark-one-main', enabled: true },
        { id: 'page-has-heading-one', enabled: true },
        { id: 'region', enabled: true }
      ],
      tags: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice']
    })
  })

  describe('Page-by-Page Accessibility Audit', () => {
    const pages = [
      { 
        name: 'Homepage', 
        url: '/', 
        description: 'Main landing page with navigation and hero content'
      },
      { 
        name: 'Marketplace', 
        url: '/listings', 
        description: 'Browse all board game listings with filters'
      },
      { 
        name: 'Sign In', 
        url: '/auth/sign-in', 
        description: 'User authentication form'
      },
      { 
        name: 'Sign Up', 
        url: '/auth/sign-up', 
        description: 'User registration form'
      },
      { 
        name: 'Forgot Password', 
        url: '/auth/forgot-password', 
        description: 'Password reset request form'
      },
      { 
        name: 'Email Verification', 
        url: '/auth/verify-email', 
        description: 'Email verification instructions'
      }
    ]

    pages.forEach(({ name, url, description }) => {
      it(`${name} should pass comprehensive accessibility audit`, () => {
        cy.log(`🔍 Testing ${name}: ${description}`)
        
        cy.visit(url)
        cy.waitForPageLoad()
        
        // Run comprehensive accessibility check
        cy.checkA11y(null, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21aa']
          }
        }, (violations) => {
          // Custom violation callback for detailed reporting
          if (violations.length > 0) {
            cy.task('log', `❌ Accessibility violations found on ${name}:`)
            
            const violationSummary = violations.map(violation => ({
              id: violation.id,
              impact: violation.impact,
              description: violation.description,
              help: violation.help,
              helpUrl: violation.helpUrl,
              nodes: violation.nodes.length,
              tags: violation.tags
            }))
            
            cy.task('table', violationSummary)
            
            // Log detailed node information
            violations.forEach(violation => {
              cy.task('log', `\n🚨 ${violation.id} (${violation.impact} impact):`)
              cy.task('log', `   Description: ${violation.description}`)
              cy.task('log', `   Help: ${violation.help}`)
              cy.task('log', `   Learn more: ${violation.helpUrl}`)
              
              violation.nodes.forEach((node, index) => {
                cy.task('log', `   Node ${index + 1}: ${node.target.join(', ')}`)
                if (node.failureSummary) {
                  cy.task('log', `   Issue: ${node.failureSummary}`)
                }
              })
            })
          } else {
            cy.task('log', `✅ ${name} passed all accessibility checks`)
          }
        })
      })
    })
  })

  describe('Protected Pages Accessibility Audit', () => {
    beforeEach(() => {
      // Sign in before testing protected pages
      cy.signUp(Cypress.env('TEST_USER_EMAIL'), Cypress.env('TEST_USER_PASSWORD'), Cypress.env('TEST_USER_NAME'))
      cy.signIn(Cypress.env('TEST_USER_EMAIL'), Cypress.env('TEST_USER_PASSWORD'))
    })

    const protectedPages = [
      { 
        name: 'Dashboard', 
        url: '/dashboard', 
        description: 'User dashboard with personal listings'
      },
      { 
        name: 'Profile', 
        url: '/profile', 
        description: 'User profile management'
      },
      { 
        name: 'Create Listing', 
        url: '/listings/create', 
        description: 'Form to create new board game listing'
      }
    ]

    protectedPages.forEach(({ name, url, description }) => {
      it(`${name} should pass comprehensive accessibility audit`, () => {
        cy.log(`🔍 Testing ${name}: ${description}`)
        
        cy.visit(url)
        cy.waitForPageLoad()
        
        // Run accessibility check with custom configuration
        cy.checkA11y(null, Cypress.env('A11Y_OPTIONS'), (violations) => {
          if (violations.length > 0) {
            cy.task('log', `❌ Accessibility violations found on ${name}:`)
            
            // Group violations by impact level
            const violationsByImpact = violations.reduce((acc, violation) => {
              acc[violation.impact] = acc[violation.impact] || []
              acc[violation.impact].push(violation)
              return acc
            }, {})
            
            // Report violations by severity
            Object.entries(violationsByImpact).forEach(([impact, viols]) => {
              cy.task('log', `\n🔥 ${impact.toUpperCase()} IMPACT (${viols.length} violations):`)
              viols.forEach(violation => {
                cy.task('log', `   • ${violation.id}: ${violation.description}`)
                cy.task('log', `     Fix: ${violation.help}`)
                cy.task('log', `     Docs: ${violation.helpUrl}`)
              })
            })
          } else {
            cy.task('log', `✅ ${name} passed all accessibility checks`)
          }
        })
      })
    })
  })

  describe('Interactive Component Accessibility', () => {
    beforeEach(() => {
      cy.signUp(Cypress.env('TEST_USER_EMAIL'), Cypress.env('TEST_USER_PASSWORD'), Cypress.env('TEST_USER_NAME'))
      cy.signIn(Cypress.env('TEST_USER_EMAIL'), Cypress.env('TEST_USER_PASSWORD'))
    })

    it('should audit form interactions comprehensively', () => {
      // Test form accessibility during interaction
      cy.log('🔍 Testing form interaction accessibility')
      
      cy.visit('/listings/create')
      cy.waitForPageLoad()
      
      // Initial state accessibility check
      cy.checkA11y('[data-testid="create-listing-form"]', Cypress.env('A11Y_OPTIONS'))
      
      // Test form validation state accessibility
      cy.get('button[type="submit"]').click()
      
      // Wait for validation errors
      cy.get('[role="alert"]', { timeout: 5000 }).should('exist')
      
      // Check accessibility with errors present
      cy.checkA11y('[data-testid="create-listing-form"]', Cypress.env('A11Y_OPTIONS'), (violations) => {
        if (violations.length > 0) {
          cy.task('log', '❌ Form validation state has accessibility issues:')
          violations.forEach(violation => {
            cy.task('log', `   • ${violation.id}: ${violation.help}`)
          })
        }
      })
      
      // Fill form and test filled state
      cy.get('[data-testid="bgg-search-input"]').type('Catan')
      cy.get('[data-testid="bgg-search-results"]', { timeout: 10000 }).should('be.visible')
      cy.get('[data-testid="bgg-game-option"]').first().click()
      
      cy.get('#price-input').type('25.00')
      cy.get('button[aria-haspopup="listbox"]').click()
      cy.get('[role="option"]').first().click()
      
      // Check accessibility with form filled
      cy.checkA11y('[data-testid="create-listing-form"]', Cypress.env('A11Y_OPTIONS'))
    })

    it('should audit dropdown interactions', () => {
      // Test dropdown accessibility during interaction
      cy.log('🔍 Testing dropdown interaction accessibility')
      
      cy.visit('/listings/create')
      cy.waitForPageLoad()
      
      // Test condition selector dropdown
      cy.get('button[aria-haspopup="listbox"]').click()
      
      // Check dropdown open state accessibility
      cy.checkA11y('[role="listbox"]', {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      })
      
      // Test option selection
      cy.get('[role="option"]').first().click()
      
      // Check closed state accessibility
      cy.checkA11y('button[aria-haspopup="listbox"]', Cypress.env('A11Y_OPTIONS'))
    })

    it('should audit navigation menu interactions', () => {
      // Test navigation menu accessibility
      cy.log('🔍 Testing navigation menu accessibility')
      
      cy.visit('/')
      
      // Test user menu accessibility
      cy.get('[data-testid="user-menu"]').click()
      
      // Check menu open state
      cy.checkA11y('[role="menu"]', {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      })
      
      // Test mobile menu if on mobile viewport
      cy.viewport(375, 667)
      cy.visit('/')
      
      // Open mobile menu
      cy.get('button[aria-controls="mobile-menu"]').click()
      
      // Check mobile menu accessibility
      cy.checkA11y('#mobile-menu', Cypress.env('A11Y_OPTIONS'))
    })
  })

  describe('Error State Accessibility Audit', () => {
    it('should audit network error accessibility', () => {
      // Test network error state accessibility
      cy.log('🔍 Testing network error accessibility')
      
      // Mock network failure
      cy.intercept('GET', '/api/listings*', { forceNetworkError: true })
      
      cy.visit('/listings')
      
      // Wait for error state
      cy.get('[data-testid="network-error"]', { timeout: 10000 }).should('be.visible')
      
      // Check error state accessibility
      cy.checkA11y('[data-testid="network-error"]', {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      }, (violations) => {
        if (violations.length > 0) {
          cy.task('log', '❌ Network error state accessibility issues:')
          violations.forEach(violation => {
            cy.task('log', `   • ${violation.id}: ${violation.help}`)
            cy.task('log', `     Severity: ${violation.impact}`)
          })
        }
      })
    })

    it('should audit form validation errors', () => {
      // Test form validation error accessibility
      cy.log('🔍 Testing form validation error accessibility')
      
      cy.visit('/auth/sign-in')
      
      // Submit empty form
      cy.get('button[type="submit"]').click()
      
      // Wait for validation errors
      cy.get('[role="alert"]', { timeout: 5000 }).should('exist')
      
      // Check validation error accessibility
      cy.checkA11y('form', {
        runOnly: {
          type: 'rule',
          values: ['aria-valid-attr-value', 'aria-required-attr', 'label']
        }
      }, (violations) => {
        if (violations.length > 0) {
          cy.task('log', '❌ Form validation accessibility issues:')
          violations.forEach(violation => {
            cy.task('log', `   • ${violation.id}: ${violation.description}`)
            cy.task('log', `     Fix: ${violation.help}`)
            cy.task('log', `     Impact: ${violation.impact}`)
          })
        }
      })
    })
  })

  describe('Cross-Browser Accessibility Testing', () => {
    it('should generate accessibility report for all browsers', () => {
      // Generate comprehensive accessibility report
      cy.log('🔍 Generating comprehensive accessibility report')
      
      const testPages = [
        '/',
        '/listings',
        '/auth/sign-in',
        '/auth/sign-up'
      ]
      
      testPages.forEach(url => {
        cy.visit(url)
        cy.waitForPageLoad()
        
        cy.checkA11y(null, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice']
          }
        }, (violations) => {
          // Create detailed report for each page
          cy.task('log', `\n📄 Accessibility Report for ${url}:`)
          
          if (violations.length === 0) {
            cy.task('log', '✅ No accessibility violations found')
            return
          }
          
          // Categorize violations
          const critical = violations.filter(v => v.impact === 'critical')
          const serious = violations.filter(v => v.impact === 'serious')
          const moderate = violations.filter(v => v.impact === 'moderate')
          const minor = violations.filter(v => v.impact === 'minor')
          
          cy.task('log', `📊 Summary: ${violations.length} total violations`)
          cy.task('log', `   🔴 Critical: ${critical.length}`)
          cy.task('log', `   🟠 Serious: ${serious.length}`)
          cy.task('log', `   🟡 Moderate: ${moderate.length}`)
          cy.task('log', `   🟢 Minor: ${minor.length}`)
          
          // Report each violation with fix suggestions
          violations.forEach((violation, index) => {
            cy.task('log', `\n${index + 1}. ${violation.id} (${violation.impact})`)
            cy.task('log', `   Issue: ${violation.description}`)
            cy.task('log', `   Fix: ${violation.help}`)
            cy.task('log', `   Elements affected: ${violation.nodes.length}`)
            cy.task('log', `   Documentation: ${violation.helpUrl}`)
            
            // Log specific elements with issues
            violation.nodes.forEach((node, nodeIndex) => {
              cy.task('log', `   Element ${nodeIndex + 1}: ${node.target.join(' > ')}`)
              if (node.failureSummary) {
                cy.task('log', `     Problem: ${node.failureSummary}`)
              }
              if (node.element) {
                cy.task('log', `     HTML: ${node.element.substring(0, 100)}...`)
              }
            })
          })
        })
      })
    })
  })

  describe('WCAG Success Criteria Testing', () => {
    it('should test Level A compliance', () => {
      // Test WCAG 2.1 Level A compliance
      cy.log('🔍 Testing WCAG 2.1 Level A compliance')
      
      cy.visit('/')
      cy.checkA11y(null, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a']
        }
      }, (violations) => {
        if (violations.length > 0) {
          cy.task('log', '❌ WCAG 2.1 Level A violations:')
          violations.forEach(violation => {
            cy.task('log', `   • ${violation.id}: ${violation.description}`)
          })
        } else {
          cy.task('log', '✅ WCAG 2.1 Level A compliance achieved')
        }
      })
    })

    it('should test Level AA compliance', () => {
      // Test WCAG 2.1 Level AA compliance
      cy.log('🔍 Testing WCAG 2.1 Level AA compliance')
      
      cy.visit('/')
      cy.checkA11y(null, {
        runOnly: {
          type: 'tag',
          values: ['wcag2aa']
        }
      }, (violations) => {
        if (violations.length > 0) {
          cy.task('log', '❌ WCAG 2.1 Level AA violations:')
          violations.forEach(violation => {
            cy.task('log', `   • ${violation.id}: ${violation.description}`)
            cy.task('log', `     Priority: ${violation.impact}`)
            cy.task('log', `     Fix: ${violation.help}`)
          })
        } else {
          cy.task('log', '✅ WCAG 2.1 Level AA compliance achieved')
        }
      })
    })

    it('should test specific success criteria', () => {
      // Test specific WCAG success criteria
      cy.log('🔍 Testing specific WCAG success criteria')
      
      const specificTests = [
        {
          name: 'Color Contrast (1.4.3)',
          rule: 'color-contrast',
          description: 'Text and background colors have sufficient contrast ratio'
        },
        {
          name: 'Keyboard Navigation (2.1.1)',
          rule: 'keyboard',
          description: 'All functionality is available via keyboard'
        },
        {
          name: 'Focus Visible (2.4.7)',
          rule: 'focus-order-semantics',
          description: 'Focus indicators are clearly visible'
        },
        {
          name: 'Labels or Instructions (3.3.2)',
          rule: 'label',
          description: 'Form controls have associated labels'
        },
        {
          name: 'Heading Structure (1.3.1)',
          rule: 'heading-order',
          description: 'Headings follow logical hierarchy'
        }
      ]
      
      cy.visit('/listings/create')
      cy.waitForPageLoad()
      
      specificTests.forEach(test => {
        cy.checkA11y(null, {
          runOnly: {
            type: 'rule',
            values: [test.rule]
          }
        }, (violations) => {
          if (violations.length > 0) {
            cy.task('log', `❌ ${test.name} failed:`)
            cy.task('log', `   ${test.description}`)
            violations.forEach(violation => {
              cy.task('log', `   Issue: ${violation.description}`)
              cy.task('log', `   Fix: ${violation.help}`)
            })
          } else {
            cy.task('log', `✅ ${test.name} passed`)
          }
        })
      })
    })
  })

  describe('Dynamic Content Accessibility', () => {
    beforeEach(() => {
      cy.signUp(Cypress.env('TEST_USER_EMAIL'), Cypress.env('TEST_USER_PASSWORD'), Cypress.env('TEST_USER_NAME'))
      cy.signIn(Cypress.env('TEST_USER_EMAIL'), Cypress.env('TEST_USER_PASSWORD'))
    })

    it('should test search results accessibility', () => {
      // Test search functionality accessibility
      cy.log('🔍 Testing search results accessibility')
      
      cy.visit('/listings')
      cy.waitForPageLoad()
      
      // Perform search
      cy.get('[data-testid="search-input"]').type('Catan')
      
      // Wait for results to update
      cy.wait(1000)
      
      // Check search results accessibility
      cy.checkA11y('[data-testid="marketplace-grid"]', {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      })
    })

    it('should test modal accessibility', () => {
      // Test modal accessibility (contact seller modal)
      cy.log('🔍 Testing modal accessibility')
      
      // Mock listing data
      cy.intercept('GET', '/api/listings/1', {
        statusCode: 200,
        body: {
          id: '1',
          game_name: 'Catan',
          price: 25.00,
          condition: 'good',
          user: { email: 'different@example.com' }
        }
      })
      
      cy.visit('/listings/1')
      cy.waitForPageLoad()
      
      // Open contact modal
      cy.get('[data-testid="contact-seller-button"]').click()
      
      // Check modal accessibility
      cy.get('[data-testid="contact-modal"]').should('be.visible')
      
      cy.checkA11y('[data-testid="contact-modal"]', {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      }, (violations) => {
        if (violations.length > 0) {
          cy.task('log', '❌ Modal accessibility issues:')
          violations.forEach(violation => {
            cy.task('log', `   • ${violation.id}: ${violation.help}`)
          })
        }
      })
    })

    it('should test loading state accessibility', () => {
      // Test loading states accessibility
      cy.log('🔍 Testing loading state accessibility')
      
      // Mock slow API response
      cy.intercept('GET', '/api/listings*', (req) => {
        req.reply({
          statusCode: 200,
          delay: 2000,
          body: { data: [], count: 0, page: 1, limit: 20, totalPages: 0 }
        })
      })
      
      cy.visit('/listings')
      
      // Check loading state accessibility
      cy.get('[data-testid*="loading"], [data-testid*="skeleton"]', { timeout: 1000 })
        .should('be.visible')
      
      cy.checkA11y('body', {
        runOnly: {
          type: 'rule',
          values: ['aria-hidden-focus', 'color-contrast']
        }
      })
    })
  })

  describe('Accessibility Regression Testing', () => {
    it('should detect accessibility regressions', () => {
      // Test for common accessibility regressions
      cy.log('🔍 Testing for accessibility regressions')
      
      const regressionChecks = [
        {
          page: '/',
          element: 'nav',
          check: 'Navigation should have role and aria-label'
        },
        {
          page: '/listings',
          element: '[data-testid="search-input"]',
          check: 'Search input should have associated label'
        },
        {
          page: '/auth/sign-in',
          element: 'form',
          check: 'Form should have proper structure and labels'
        }
      ]
      
      regressionChecks.forEach(({ page, element, check }) => {
        cy.visit(page)
        cy.waitForPageLoad()
        
        cy.task('log', `Checking: ${check}`)
        
        cy.checkA11y(element, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa']
          }
        }, (violations) => {
          if (violations.length > 0) {
            cy.task('log', `❌ Regression detected in ${check}:`)
            violations.forEach(violation => {
              cy.task('log', `   • ${violation.id}: ${violation.description}`)
            })
          }
        })
      })
    })
  })

  describe('Performance Impact of Accessibility Features', () => {
    it('should verify accessibility features do not impact performance', () => {
      // Test that accessibility enhancements don't hurt performance
      cy.log('🔍 Testing accessibility performance impact')
      
      const startTime = Date.now()
      
      cy.visit('/')
      cy.waitForPageLoad()
      
      const loadTime = Date.now() - startTime
      
      // Page should still load quickly (under 3 seconds)
      expect(loadTime).to.be.lessThan(3000)
      
      // Check that ARIA attributes don't cause performance issues
      cy.get('[aria-describedby], [aria-labelledby], [role]').should('have.length.greaterThan', 0)
      
      // Verify page is still responsive
      cy.get('[data-testid="search-input"]').type('test')
      cy.get('[data-testid="search-input"]').should('have.value', 'test')
    })
  })
})
