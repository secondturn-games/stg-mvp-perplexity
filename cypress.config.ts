import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    
    // Test files pattern
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    
    // Support file
    supportFile: 'cypress/support/e2e.ts',
    
    // Fixtures folder
    fixturesFolder: 'cypress/fixtures',
    
    // Screenshots and videos
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
      
      // Code coverage setup
      require('@cypress/code-coverage/task')(on, config)
      
      // Terminal output for better debugging
      require('cypress-terminal-report/src/installLogsPrinter')(on, {
        printLogsToConsole: 'always',
        printLogsToFile: 'always',
        outputRoot: config.projectRoot + '/cypress/',
        outputTarget: {
          'cypress-logs.txt': 'txt',
          'cypress-logs.json': 'json',
        }
      })
      
      // Accessibility testing setup
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
        table(message) {
          console.table(message)
          return null
        }
      })
      
      // Environment variables
      config.env = {
        ...config.env,
        // Test user credentials
        TEST_USER_EMAIL: 'cypress.test@example.com',
        TEST_USER_PASSWORD: 'CypressTest123!',
        TEST_USER_NAME: 'Cypress Test User',
        
        // Alternative test user for multi-user scenarios
        TEST_USER_2_EMAIL: 'cypress.test2@example.com',
        TEST_USER_2_PASSWORD: 'CypressTest456!',
        TEST_USER_2_NAME: 'Cypress Test User 2',
        
        // API endpoints
        SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        
        // Accessibility testing configuration
        A11Y_OPTIONS: {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21aa']
          },
          rules: {
            'color-contrast': { enabled: true },
            'keyboard-navigation': { enabled: true },
            'focus-management': { enabled: true },
            'aria-required-attr': { enabled: true },
            'label': { enabled: true },
            'button-name': { enabled: true },
            'link-name': { enabled: true },
            'image-alt': { enabled: true }
          }
        }
      }
      
      return config
    },
    
    // Experimental features
    experimentalStudio: true,
    experimentalMemoryManagement: true,
  },
  
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
  },
  
  // Global configuration
  chromeWebSecurity: false,
  modifyObstructiveCode: false,
  
  // Environment variables that can be overridden
  env: {
    coverage: false,
    codeCoverage: {
      exclude: 'cypress/**/*.*',
    },
  },
})
