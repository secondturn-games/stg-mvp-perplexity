/// <reference types="cypress" />

import { testUsers } from '../../fixtures/test-users.json'

describe('Authentication Flow', () => {
  const testUser = testUsers.validUser
  const testUser2 = testUsers.validUser2
  const invalidUser = testUsers.invalidUser

  beforeEach(() => {
    // Clean up any existing sessions
    cy.clearCookies()
    cy.clearLocalStorage()
    
    // Intercept BGG API calls to prevent external dependencies
    cy.intercept('GET', '**/api.boardgamegeek.com/**', { fixture: 'bgg-responses.json' })
  })

  afterEach(() => {
    // Clean up test data after each test
    cy.cleanupTestData()
  })

  describe('Sign Up Process', () => {
    it('should successfully sign up a new user', () => {
      cy.visit('/auth/sign-up')
      cy.waitForPageLoad()

      // Verify sign-up page elements
      cy.get('h1').should('contain.text', 'Create your account')
      cy.get('input[name="name"]').should('be.visible')
      cy.get('input[name="email"]').should('be.visible')
      cy.get('input[name="password"]').should('be.visible')
      cy.get('input[name="confirmPassword"]').should('be.visible')

      // Fill out the form
      cy.get('input[name="name"]').type(testUser.name)
      cy.get('input[name="email"]').type(testUser.email)
      cy.get('input[name="password"]').type(testUser.password)
      cy.get('input[name="confirmPassword"]').type(testUser.password)

      // Submit the form
      cy.get('button[type="submit"]').click()

      // Verify success message
      cy.get('[data-testid="success-alert"]', { timeout: 10000 })
        .should('be.visible')
        .and('contain.text', 'Account created successfully')

      // Verify link to sign in page
      cy.get('a[href="/auth/sign-in"]').should('be.visible')
    })

    it('should show validation errors for invalid input', () => {
      cy.visit('/auth/sign-up')
      cy.waitForPageLoad()

      // Try to submit with invalid data
      cy.get('input[name="name"]').type(invalidUser.name)
      cy.get('input[name="email"]').type(invalidUser.email)
      cy.get('input[name="password"]').type(invalidUser.password)
      cy.get('input[name="confirmPassword"]').type('different-password')

      cy.get('button[type="submit"]').click()

      // Should show validation errors
      cy.get('[data-testid="error-alert"]', { timeout: 5000 })
        .should('be.visible')
    })

    it('should prevent duplicate email registration', () => {
      // First, sign up a user
      cy.signUp(testUser.email, testUser.password, testUser.name)

      // Try to sign up with the same email again
      cy.visit('/auth/sign-up')
      cy.waitForPageLoad()

      cy.get('input[name="name"]').type('Another User')
      cy.get('input[name="email"]').type(testUser.email)
      cy.get('input[name="password"]').type('DifferentPassword123!')
      cy.get('input[name="confirmPassword"]').type('DifferentPassword123!')

      cy.get('button[type="submit"]').click()

      // Should show error about existing email
      cy.get('[data-testid="error-alert"]', { timeout: 5000 })
        .should('be.visible')
        .and('contain.text', 'email')
    })
  })

  describe('Email Verification Process', () => {
    it('should display verification message after signup', () => {
      cy.visit('/auth/sign-up')
      cy.waitForPageLoad()

      // Sign up a new user
      cy.get('input[name="name"]').type(testUser2.name)
      cy.get('input[name="email"]').type(testUser2.email)
      cy.get('input[name="password"]').type(testUser2.password)
      cy.get('input[name="confirmPassword"]').type(testUser2.password)
      cy.get('button[type="submit"]').click()

      // Should show verification message
      cy.get('[data-testid="success-alert"]', { timeout: 10000 })
        .should('be.visible')
        .and('contain.text', 'verification')
    })

    it('should handle email verification page', () => {
      cy.visit('/auth/verify-email')
      cy.waitForPageLoad()

      // Should show verification instructions
      cy.get('h1').should('contain.text', 'Verify')
      cy.get('body').should('contain.text', 'email')
    })

    it('should handle verification errors', () => {
      // Visit with invalid token
      cy.visit('/auth/verify-email?token=invalid-token')
      cy.waitForPageLoad()

      // Should show error message
      cy.get('[data-testid="error-alert"]', { timeout: 5000 })
        .should('be.visible')
    })
  })

  describe('Sign In Process', () => {
    beforeEach(() => {
      // Create a verified test user before each sign-in test
      cy.signUp(testUser.email, testUser.password, testUser.name)
    })

    it('should successfully sign in with valid credentials', () => {
      cy.visit('/auth/sign-in')
      cy.waitForPageLoad()

      // Verify sign-in page elements
      cy.get('h1').should('contain.text', 'Sign in')
      cy.get('input[name="email"]').should('be.visible')
      cy.get('input[name="password"]').should('be.visible')

      // Sign in
      cy.get('input[name="email"]').type(testUser.email)
      cy.get('input[name="password"]').type(testUser.password)
      cy.get('button[type="submit"]').click()

      // Should redirect to home page
      cy.url().should('not.include', '/auth/sign-in')
      cy.waitForPageLoad()

      // Should show user menu indicating successful login
      cy.get('[data-testid="user-menu"]', { timeout: 10000 }).should('be.visible')
    })

    it('should show error for invalid credentials', () => {
      cy.visit('/auth/sign-in')
      cy.waitForPageLoad()

      // Try to sign in with wrong password
      cy.get('input[name="email"]').type(testUser.email)
      cy.get('input[name="password"]').type('wrong-password')
      cy.get('button[type="submit"]').click()

      // Should show error message
      cy.get('[data-testid="error-alert"]', { timeout: 5000 })
        .should('be.visible')
        .and('contain.text', 'Invalid')
    })

    it('should show error for non-existent user', () => {
      cy.visit('/auth/sign-in')
      cy.waitForPageLoad()

      // Try to sign in with non-existent email
      cy.get('input[name="email"]').type('nonexistent@example.com')
      cy.get('input[name="password"]').type('password123')
      cy.get('button[type="submit"]').click()

      // Should show error message
      cy.get('[data-testid="error-alert"]', { timeout: 5000 })
        .should('be.visible')
    })

    it('should redirect to intended page after sign in', () => {
      // Try to access protected page first
      cy.visit('/dashboard')
      
      // Should redirect to sign in
      cy.url().should('include', '/auth/sign-in')

      // Sign in
      cy.get('input[name="email"]').type(testUser.email)
      cy.get('input[name="password"]').type(testUser.password)
      cy.get('button[type="submit"]').click()

      // Should redirect back to dashboard
      cy.url().should('include', '/dashboard')
      cy.waitForPageLoad()
    })
  })

  describe('Sign Out Process', () => {
    beforeEach(() => {
      // Sign in before each sign-out test
      cy.signUp(testUser.email, testUser.password, testUser.name)
      cy.signIn(testUser.email, testUser.password)
    })

    it('should successfully sign out', () => {
      // Verify user is signed in
      cy.get('[data-testid="user-menu"]').should('be.visible')

      // Sign out
      cy.signOut()

      // Should redirect to home page
      cy.url().should('not.include', '/dashboard')
      
      // User menu should not be visible
      cy.get('[data-testid="user-menu"]').should('not.exist')

      // Sign in link should be visible
      cy.get('a[href="/auth/sign-in"]').should('be.visible')
    })

    it('should prevent access to protected pages after sign out', () => {
      // Sign out
      cy.signOut()

      // Try to access protected page
      cy.visit('/dashboard')

      // Should redirect to sign in
      cy.url().should('include', '/auth/sign-in')
    })
  })

  describe('Password Reset Process', () => {
    beforeEach(() => {
      // Create a test user for password reset tests
      cy.signUp(testUser.email, testUser.password, testUser.name)
    })

    it('should display forgot password page', () => {
      cy.visit('/auth/forgot-password')
      cy.waitForPageLoad()

      // Should show forgot password form
      cy.get('h1').should('contain.text', 'Forgot')
      cy.get('input[name="email"]').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
    })

    it('should send password reset email', () => {
      cy.visit('/auth/forgot-password')
      cy.waitForPageLoad()

      // Submit email for password reset
      cy.get('input[name="email"]').type(testUser.email)
      cy.get('button[type="submit"]').click()

      // Should show success message
      cy.get('[data-testid="success-alert"]', { timeout: 10000 })
        .should('be.visible')
        .and('contain.text', 'email sent')
    })

    it('should handle password reset page', () => {
      cy.visit('/auth/reset-password?token=test-token')
      cy.waitForPageLoad()

      // Should show password reset form
      cy.get('h1').should('contain.text', 'Reset')
      cy.get('input[name="password"]').should('be.visible')
      cy.get('input[name="confirmPassword"]').should('be.visible')
    })
  })

  describe('Navigation and Links', () => {
    it('should navigate between auth pages', () => {
      // Start at sign-in page
      cy.visit('/auth/sign-in')
      cy.waitForPageLoad()

      // Click sign-up link
      cy.get('a[href="/auth/sign-up"]').click()
      cy.url().should('include', '/auth/sign-up')

      // Click sign-in link
      cy.get('a[href="/auth/sign-in"]').click()
      cy.url().should('include', '/auth/sign-in')

      // Click forgot password link
      cy.get('a[href="/auth/forgot-password"]').click()
      cy.url().should('include', '/auth/forgot-password')
    })

    it('should show proper loading states', () => {
      cy.visit('/auth/sign-in')
      cy.waitForPageLoad()

      // Fill in form
      cy.get('input[name="email"]').type(testUser.email)
      cy.get('input[name="password"]').type(testUser.password)

      // Submit and check loading state
      cy.get('button[type="submit"]').click()
      cy.get('button[type="submit"]')
        .should('contain.text', 'Loading')
        .and('be.disabled')
    })
  })
})
