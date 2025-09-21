# Cypress E2E Testing Guide

This document provides comprehensive guidance for running and maintaining Cypress tests for the Second Turn Games application.

## Setup

### Prerequisites

- Node.js 18+ installed
- Application running locally on `http://localhost:3000`
- Supabase project configured (for integration tests)

### Installation

Cypress and dependencies are already installed. To verify:

```bash
npm run cypress:verify
npm run cypress:info
```

## Test Structure

```
cypress/
├── e2e/                    # End-to-end tests
│   ├── auth/              # Authentication tests
│   ├── listings/          # Listing creation and marketplace tests
│   └── smoke/             # Basic functionality tests
├── fixtures/              # Test data
│   ├── test-users.json    # User credentials and listing data
│   ├── test-image.jpg     # Sample image for upload tests
│   └── bgg-responses.json # Mock BGG API responses
├── support/               # Support files and custom commands
│   ├── commands.ts        # Custom Cypress commands
│   ├── e2e.ts            # E2E test setup
│   └── component.ts       # Component test setup
└── tsconfig.json          # TypeScript configuration

cypress.config.ts          # Main Cypress configuration
cypress.env.json           # Environment variables for tests
```

## Running Tests

### Interactive Mode (Development)

```bash
# Open Cypress Test Runner
npm run cypress:open
npm run test:e2e:dev

# Open Component Test Runner
npm run test:component:dev
```

### Headless Mode (CI/CD)

```bash
# Run all E2E tests
npm run test:e2e
npm run cypress:run

# Run with specific browser
npm run cypress:run:chrome
npm run cypress:run:firefox
npm run cypress:run:edge

# Run with headed browser (see tests execute)
npm run test:e2e:headed

# Run specific test suites
npm run test:smoke      # Basic functionality tests
npm run test:auth       # Authentication tests
npm run test:listings   # Listing and marketplace tests

# Run component tests
npm run test:component
```

### Code Coverage

```bash
# Run tests with code coverage
npm run test:coverage
```

## Test Suites

### 1. Authentication Tests (`cypress/e2e/auth/authentication.cy.ts`)

**Coverage:**

- User sign-up process with validation
- Email verification workflow
- Sign-in with valid/invalid credentials
- Sign-out functionality
- Password reset process
- Navigation between auth pages
- Form validation and error handling

**Test Users:**

- Primary: `cypress.test@example.com` / `CypressTest123!`
- Secondary: `cypress.test2@example.com` / `CypressTest456!`

### 2. Listing Creation Tests (`cypress/e2e/listings/listing-creation.cy.ts`)

**Coverage:**

- Create listing form validation
- BGG game search and selection
- Image upload functionality
- Complete listing creation workflow
- Marketplace display and filtering
- Seller contact functionality
- Dashboard listing management

**Test Data:**

- Catan listing (€25.00, good condition)
- Ticket to Ride listing (€35.50, excellent condition)
- Wingspan listing (€42.99, new condition)

### 3. Smoke Tests (`cypress/e2e/smoke/basic-functionality.cy.ts`)

**Coverage:**

- Homepage loading and navigation
- Marketplace page functionality
- Authentication page accessibility
- Error handling (404, network errors)
- Responsive design testing
- Performance checks
- SEO and accessibility basics

## Custom Commands

The test suite includes custom Cypress commands for common operations:

### Authentication Commands

```typescript
// Sign up a new user
cy.signUp('email@example.com', 'password123', 'User Name')

// Sign in existing user
cy.signIn('email@example.com', 'password123')

// Sign out current user
cy.signOut()
```

### Utility Commands

```typescript
// Wait for page to fully load
cy.waitForPageLoad()

// Upload test image
cy.uploadTestImage('input[type="file"]', 'test-image.jpg')

// Create a complete test listing
cy.createTestListing({
  gameName: 'Catan',
  price: '25.00',
  condition: 'good',
  description: 'Great game!',
  city: 'Riga',
})

// Clean up test data
cy.cleanupTestData()
```

## Environment Configuration

### Test Environment Variables

Configure in `cypress.env.json`:

```json
{
  "TEST_USER_EMAIL": "cypress.test@example.com",
  "TEST_USER_PASSWORD": "CypressTest123!",
  "BASE_URL": "http://localhost:3000",
  "API_TIMEOUT": 10000
}
```

### Supabase Configuration

For integration tests, ensure these environment variables are set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Mock Data and API Intercepting

### BGG API Mocking

Tests intercept BoardGameGeek API calls to ensure consistent, fast testing:

```typescript
cy.intercept('GET', '**/api.boardgamegeek.com/**', {
  fixture: 'bgg-responses.json',
})
```

### Image Upload Mocking

File uploads are mocked to avoid external dependencies:

```typescript
cy.intercept('POST', '**/storage/v1/object/**', {
  statusCode: 200,
  body: { Key: 'test-image-url.jpg' },
})
```

## Best Practices

### 1. Test Isolation

- Each test is independent and can run alone
- Tests clean up after themselves
- Use `beforeEach()` and `afterEach()` hooks properly

### 2. Reliable Selectors

- Use `data-testid` attributes for test selectors
- Avoid relying on CSS classes or text content that may change
- Prefer semantic selectors when possible

### 3. Waiting Strategies

- Use `cy.waitForPageLoad()` custom command
- Wait for specific elements rather than arbitrary timeouts
- Handle loading states explicitly

### 4. Error Handling

- Tests handle application errors gracefully
- Mock API failures to test error scenarios
- Verify error messages and user feedback

## Debugging Tests

### 1. Interactive Debugging

```bash
# Open test runner for step-by-step debugging
npm run test:e2e:dev
```

### 2. Screenshots and Videos

- Screenshots taken automatically on test failures
- Videos recorded for all test runs
- Located in `cypress/screenshots/` and `cypress/videos/`

### 3. Console Logs

```typescript
// Add debug information
cy.log('Debug: Testing user sign-up')
cy.debug() // Pause test execution
```

### 4. Browser DevTools

- Use `.debug()` to pause and inspect
- Access browser console during test execution
- Inspect network requests and responses

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run Cypress Tests
  run: |
    npm run build
    npm run start &
    npm run cypress:run
  env:
    CYPRESS_baseUrl: http://localhost:3000
```

### Test Reporting

- JUnit XML reports for CI integration
- Screenshots and videos for failed tests
- Code coverage reports (when enabled)

## Troubleshooting

### Common Issues

1. **Tests failing due to timing**
   - Increase timeouts in `cypress.config.ts`
   - Use proper waiting strategies
   - Ensure application is fully loaded

2. **Authentication tests failing**
   - Verify test user credentials
   - Check Supabase configuration
   - Ensure email verification is handled

3. **File upload tests failing**
   - Verify test image fixtures exist
   - Check file upload interceptors
   - Ensure proper file permissions

4. **BGG API tests failing**
   - Verify API mocking is working
   - Check fixture data structure
   - Ensure network interceptors are set up

### Debug Commands

```bash
# Verify Cypress installation
npm run cypress:verify

# Get system information
npm run cypress:info

# Run specific test file
npx cypress run --spec "cypress/e2e/auth/authentication.cy.ts"

# Run with debug output
DEBUG=cypress:* npm run cypress:run
```

## Maintenance

### Regular Tasks

1. Update test data fixtures as application evolves
2. Review and update custom commands
3. Maintain mock API responses
4. Update selectors when UI changes
5. Review and optimize test performance

### Adding New Tests

1. Follow existing test structure and naming conventions
2. Use appropriate test data from fixtures
3. Include proper setup and cleanup
4. Add data-testid attributes to new UI elements
5. Update this documentation

## Test Data Management

### User Accounts

- Test users are created and cleaned up automatically
- Use different email addresses for different test scenarios
- Avoid hardcoding sensitive data in tests

### Listing Data

- Sample listings defined in `cypress/fixtures/test-users.json`
- Cover different game types, prices, and conditions
- Include edge cases (minimum/maximum values)

### Image Assets

- Test images should be small and optimized
- Use consistent file formats (JPEG/PNG)
- Include various image sizes for testing

For more information, see the [Cypress documentation](https://docs.cypress.io/).
