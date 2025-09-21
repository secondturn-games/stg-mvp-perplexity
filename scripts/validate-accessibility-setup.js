#!/usr/bin/env node

/**
 * Accessibility Setup Validator
 * Validates that all accessibility testing tools are properly configured
 */

const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

class AccessibilitySetupValidator {
  constructor() {
    this.errors = []
    this.warnings = []
    this.passed = []
  }

  async validate() {
    console.log('🔍 Validating accessibility testing setup...\n')

    // Check file structure
    this.checkFileStructure()
    
    // Check dependencies
    await this.checkDependencies()
    
    // Check configuration files
    this.checkConfiguration()
    
    // Check test files
    this.checkTestFiles()
    
    // Generate report
    this.generateReport()
  }

  checkFileStructure() {
    console.log('📁 Checking file structure...')
    
    const requiredFiles = [
      'cypress.config.ts',
      'playwright.config.ts',
      'cypress/support/e2e.ts',
      'cypress/e2e/accessibility/a11y-tests.cy.ts',
      'cypress/e2e/accessibility/comprehensive-a11y-audit.cy.ts',
      'tests/playwright/accessibility/core-pages.spec.ts',
      'tests/playwright/accessibility/auth-flows.spec.ts',
      'tests/playwright/accessibility/user-profiles.spec.ts',
      'tests/playwright/accessibility/listing-creation.spec.ts',
      'tests/accessibility-report-generator.js',
      'scripts/run-accessibility-audit.js',
      '.github/workflows/accessibility-testing.yml'
    ]

    requiredFiles.forEach(file => {
      if (fs.existsSync(file)) {
        this.passed.push(`✅ ${file} exists`)
      } else {
        this.errors.push(`❌ Missing required file: ${file}`)
      }
    })

    const requiredDirectories = [
      'cypress/e2e/accessibility',
      'tests/playwright/accessibility',
      'accessibility-reports'
    ]

    requiredDirectories.forEach(dir => {
      if (fs.existsSync(dir)) {
        this.passed.push(`✅ Directory ${dir} exists`)
      } else {
        try {
          fs.mkdirSync(dir, { recursive: true })
          this.passed.push(`✅ Created directory ${dir}`)
        } catch (error) {
          this.errors.push(`❌ Cannot create directory: ${dir}`)
        }
      }
    })
  }

  async checkDependencies() {
    console.log('📦 Checking dependencies...')
    
    const requiredDeps = [
      'cypress',
      'cypress-axe',
      'axe-core',
      '@playwright/test',
      '@axe-core/playwright',
      'mochawesome',
      'cypress-terminal-report'
    ]

    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
      const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies }

      requiredDeps.forEach(dep => {
        if (allDeps[dep]) {
          this.passed.push(`✅ ${dep} installed (${allDeps[dep]})`)
        } else {
          this.errors.push(`❌ Missing dependency: ${dep}`)
        }
      })
    } catch (error) {
      this.errors.push(`❌ Cannot read package.json: ${error.message}`)
    }
  }

  checkConfiguration() {
    console.log('⚙️ Checking configuration files...')
    
    // Check Cypress config
    try {
      const cypressConfig = fs.readFileSync('cypress.config.ts', 'utf8')
      
      if (cypressConfig.includes('cypress-axe')) {
        this.passed.push('✅ Cypress axe integration configured')
      } else {
        this.warnings.push('⚠️ Cypress axe integration not found in config')
      }
      
      if (cypressConfig.includes('A11Y_OPTIONS')) {
        this.passed.push('✅ Cypress accessibility options configured')
      } else {
        this.warnings.push('⚠️ Cypress accessibility options not configured')
      }
    } catch (error) {
      this.errors.push(`❌ Cannot read cypress.config.ts: ${error.message}`)
    }

    // Check Playwright config
    try {
      const playwrightConfig = fs.readFileSync('playwright.config.ts', 'utf8')
      
      if (playwrightConfig.includes('globalSetup')) {
        this.passed.push('✅ Playwright global setup configured')
      } else {
        this.warnings.push('⚠️ Playwright global setup not configured')
      }
      
      if (playwrightConfig.includes('reporter')) {
        this.passed.push('✅ Playwright reporting configured')
      } else {
        this.warnings.push('⚠️ Playwright reporting not configured')
      }
    } catch (error) {
      this.errors.push(`❌ Cannot read playwright.config.ts: ${error.message}`)
    }
  }

  checkTestFiles() {
    console.log('🧪 Checking test files...')
    
    const testFiles = [
      'cypress/e2e/accessibility/a11y-tests.cy.ts',
      'cypress/e2e/accessibility/comprehensive-a11y-audit.cy.ts',
      'tests/playwright/accessibility/core-pages.spec.ts',
      'tests/playwright/accessibility/auth-flows.spec.ts'
    ]

    testFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8')
        
        if (content.includes('checkA11y') || content.includes('AxeBuilder')) {
          this.passed.push(`✅ ${file} has accessibility tests`)
        } else {
          this.warnings.push(`⚠️ ${file} may not have accessibility tests`)
        }
        
        if (content.includes('wcag2a') || content.includes('wcag2aa')) {
          this.passed.push(`✅ ${file} tests WCAG compliance`)
        } else {
          this.warnings.push(`⚠️ ${file} may not test WCAG compliance`)
        }
      } catch (error) {
        this.errors.push(`❌ Cannot read test file: ${file}`)
      }
    })
  }

  generateReport() {
    console.log('\n📊 Validation Report:')
    console.log('='.repeat(50))
    
    if (this.passed.length > 0) {
      console.log('\n✅ PASSED CHECKS:')
      this.passed.forEach(item => console.log(`   ${item}`))
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️ WARNINGS:')
      this.warnings.forEach(item => console.log(`   ${item}`))
    }
    
    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS:')
      this.errors.forEach(item => console.log(`   ${item}`))
    }
    
    console.log('\n📈 SUMMARY:')
    console.log(`   ✅ Passed: ${this.passed.length}`)
    console.log(`   ⚠️ Warnings: ${this.warnings.length}`)
    console.log(`   ❌ Errors: ${this.errors.length}`)
    
    if (this.errors.length === 0) {
      console.log('\n🎉 Accessibility testing setup is valid!')
      console.log('🚀 You can now run: npm run audit:a11y')
    } else {
      console.log('\n🔧 Please fix the errors above before running accessibility tests.')
      process.exit(1)
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new AccessibilitySetupValidator()
  validator.validate().catch(error => {
    console.error('❌ Validation failed:', error)
    process.exit(1)
  })
}

module.exports = AccessibilitySetupValidator
