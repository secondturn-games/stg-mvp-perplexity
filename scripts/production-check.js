#!/usr/bin/env node

/**
 * Production Readiness Checker for Second Turn Games
 * Validates that the application is ready for production deployment
 */

const fs = require('fs')
const path = require('path')

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue')
}

class ProductionChecker {
  constructor() {
    this.errors = []
    this.warnings = []
    this.passed = 0
    this.total = 0
  }

  check(description, testFn) {
    this.total++
    try {
      const result = testFn()
      if (result === true || result === undefined) {
        logSuccess(description)
        this.passed++
      } else {
        logWarning(`${description}: ${result}`)
        this.warnings.push(description)
      }
    } catch (error) {
      logError(`${description}: ${error.message}`)
      this.errors.push(description)
    }
  }

  checkFileExists(filePath, description) {
    this.check(description, () => {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`)
      }
    })
  }

  checkPackageJson() {
    this.check('package.json has required scripts', () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
      const requiredScripts = ['build', 'start', 'dev']
      
      for (const script of requiredScripts) {
        if (!packageJson.scripts[script]) {
          throw new Error(`Missing script: ${script}`)
        }
      }
    })
  }

  checkNextConfig() {
    this.check('Next.js configuration is production-ready', () => {
      if (!fs.existsSync('next.config.ts')) {
        throw new Error('next.config.ts not found')
      }
      
      const config = fs.readFileSync('next.config.ts', 'utf8')
      
      // Check for production optimizations
      if (!config.includes('compress: true')) {
        return 'Compression not enabled'
      }
      
      if (!config.includes('swcMinify: true')) {
        return 'SWC minification not enabled'
      }
      
      if (!config.includes('poweredByHeader: false')) {
        return 'X-Powered-By header not disabled'
      }
    })
  }

  checkSecurityFiles() {
    const securityFiles = [
      'SECURITY_AUDIT.md',
      'src/lib/security/rate-limiting.ts',
      'src/lib/security/file-validation.ts',
      'supabase/migrations/005_secure_email_access.sql'
    ]

    securityFiles.forEach(file => {
      this.checkFileExists(file, `Security file exists: ${file}`)
    })
  }

  checkSupabaseMigrations() {
    this.check('Supabase migrations are ready', () => {
      const migrationsDir = 'supabase/migrations'
      if (!fs.existsSync(migrationsDir)) {
        throw new Error('Migrations directory not found')
      }

      const migrations = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort()

      if (migrations.length === 0) {
        throw new Error('No migration files found')
      }

      // Check for required migrations
      const requiredMigrations = [
        '001_board_game_marketplace.sql',
        '002_storage_setup.sql',
        '005_secure_email_access.sql'
      ]

      for (const required of requiredMigrations) {
        if (!migrations.includes(required)) {
          throw new Error(`Required migration missing: ${required}`)
        }
      }

      return `Found ${migrations.length} migration files`
    })
  }

  checkEnvironmentTemplate() {
    this.check('Environment template exists', () => {
      if (!fs.existsSync('env.example')) {
        throw new Error('env.example file not found')
      }

      const template = fs.readFileSync('env.example', 'utf8')
      const requiredVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
        'SUPABASE_SERVICE_ROLE_KEY',
        'NEXT_PUBLIC_SITE_URL',
        'CRON_SECRET'
      ]

      for (const envVar of requiredVars) {
        if (!template.includes(envVar)) {
          throw new Error(`Missing environment variable in template: ${envVar}`)
        }
      }
    })
  }

  checkBuildOutput() {
    this.check('Application builds successfully', () => {
      // Check if .next directory exists (from previous build)
      if (fs.existsSync('.next')) {
        return 'Build output found (run npm run build to verify latest)'
      } else {
        return 'No build output found - run npm run build first'
      }
    })
  }

  checkDeploymentFiles() {
    const deploymentFiles = [
      'vercel.json',
      'DEPLOYMENT_GUIDE.md',
      'scripts/deploy.sh'
    ]

    deploymentFiles.forEach(file => {
      this.checkFileExists(file, `Deployment file exists: ${file}`)
    })
  }

  checkAPIEndpoints() {
    const apiEndpoints = [
      'src/app/api/health/route.ts',
      'src/app/api/cleanup/route.ts',
      'src/app/api/listings/route.ts',
      'src/app/api/listings/[id]/contact/route.ts'
    ]

    apiEndpoints.forEach(endpoint => {
      this.checkFileExists(endpoint, `API endpoint exists: ${endpoint}`)
    })
  }

  checkSecurityImplementation() {
    this.check('Security measures implemented', () => {
      const securityFiles = [
        'middleware.ts',
        'src/lib/security/rate-limiting.ts',
        'src/lib/security/file-validation.ts'
      ]

      for (const file of securityFiles) {
        if (!fs.existsSync(file)) {
          throw new Error(`Security file missing: ${file}`)
        }
      }

      // Check middleware configuration
      const middleware = fs.readFileSync('middleware.ts', 'utf8')
      if (!middleware.includes('protectedRoutes')) {
        return 'Route protection not configured in middleware'
      }
    })
  }

  checkPerformanceOptimizations() {
    this.check('Performance optimizations applied', () => {
      // Check for Image component usage
      const components = [
        'src/components/listings/listing-card.tsx',
        'src/components/listings/bgg-game-selector.tsx',
        'src/app/dashboard/page.tsx'
      ]

      for (const component of components) {
        if (fs.existsSync(component)) {
          const content = fs.readFileSync(component, 'utf8')
          if (content.includes('<img') && !content.includes('from \'next/image\'')) {
            return `Component ${component} may be using unoptimized images`
          }
        }
      }
    })
  }

  run() {
    log('\n🔍 Second Turn Games - Production Readiness Check\n', 'cyan')

    // Run all checks
    this.checkPackageJson()
    this.checkNextConfig()
    this.checkEnvironmentTemplate()
    this.checkSupabaseMigrations()
    this.checkSecurityFiles()
    this.checkSecurityImplementation()
    this.checkDeploymentFiles()
    this.checkAPIEndpoints()
    this.checkBuildOutput()
    this.checkPerformanceOptimizations()

    // Summary
    log('\n📊 Summary:', 'cyan')
    log(`Total checks: ${this.total}`)
    logSuccess(`Passed: ${this.passed}`)
    
    if (this.warnings.length > 0) {
      logWarning(`Warnings: ${this.warnings.length}`)
      this.warnings.forEach(warning => logWarning(`  • ${warning}`))
    }
    
    if (this.errors.length > 0) {
      logError(`Errors: ${this.errors.length}`)
      this.errors.forEach(error => logError(`  • ${error}`))
    }

    // Final verdict
    if (this.errors.length === 0) {
      if (this.warnings.length === 0) {
        log('\n🎉 Production Ready! All checks passed.', 'green')
        log('\nNext steps:', 'blue')
        log('1. Run: chmod +x scripts/deploy.sh')
        log('2. Run: ./scripts/deploy.sh')
        log('3. Follow the deployment guide in DEPLOYMENT_GUIDE.md')
      } else {
        log('\n✅ Ready for deployment with warnings.', 'yellow')
        log('Consider addressing warnings before production deployment.', 'yellow')
      }
      return 0
    } else {
      log('\n❌ Not ready for production deployment.', 'red')
      log('Please fix the errors above before deploying.', 'red')
      return 1
    }
  }
}

// Run the checker
const checker = new ProductionChecker()
const exitCode = checker.run()
process.exit(exitCode)
