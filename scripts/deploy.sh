#!/bin/bash

# Second Turn Games - Production Deployment Script
# This script automates the deployment process to Vercel

set -e  # Exit on any error

echo "🚀 Starting Second Turn Games deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm and try again."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

print_success "Prerequisites check passed"

# Check environment variables
print_status "Checking environment variables..."

if [ ! -f ".env.local" ]; then
    print_error ".env.local file not found. Please create it using env.example as template."
    exit 1
fi

# Check required environment variables
required_vars=("NEXT_PUBLIC_SUPABASE_URL" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "SUPABASE_SERVICE_ROLE_KEY")
missing_vars=()

for var in "${required_vars[@]}"; do
    if ! grep -q "^$var=" .env.local; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    print_error "Missing required environment variables: ${missing_vars[*]}"
    print_error "Please check your .env.local file and add the missing variables."
    exit 1
fi

print_success "Environment variables check passed"

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Run tests (if available)
print_status "Running tests..."
if npm run test --if-present; then
    print_success "Tests passed"
else
    print_warning "No tests found or tests failed"
fi

# Build the application
print_status "Building application..."
if npm run build; then
    print_success "Build completed successfully"
else
    print_error "Build failed. Please fix the issues and try again."
    exit 1
fi

# Check if user is logged in to Vercel
print_status "Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    print_warning "Not logged in to Vercel. Please login:"
    vercel login
fi

# Deploy to Vercel
print_status "Deploying to Vercel..."

# Ask for deployment type
echo "Select deployment type:"
echo "1) Preview deployment"
echo "2) Production deployment"
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        print_status "Deploying preview..."
        DEPLOY_URL=$(vercel --yes)
        print_success "Preview deployment completed!"
        print_status "Preview URL: $DEPLOY_URL"
        ;;
    2)
        print_status "Deploying to production..."
        read -p "Are you sure you want to deploy to production? (y/N): " confirm
        if [[ $confirm =~ ^[Yy]$ ]]; then
            DEPLOY_URL=$(vercel --prod --yes)
            print_success "Production deployment completed!"
            print_status "Production URL: $DEPLOY_URL"
            
            # Run post-deployment checks
            print_status "Running post-deployment health checks..."
            sleep 10  # Wait for deployment to be ready
            
            if curl -f "$DEPLOY_URL/api/health" > /dev/null 2>&1; then
                print_success "Health check passed"
            else
                print_warning "Health check failed - please verify manually"
            fi
        else
            print_status "Production deployment cancelled"
            exit 0
        fi
        ;;
    *)
        print_error "Invalid choice. Exiting."
        exit 1
        ;;
esac

# Post-deployment instructions
echo ""
print_success "Deployment completed successfully!"
echo ""
echo "📋 Post-deployment checklist:"
echo "1. Verify all pages load correctly"
echo "2. Test user registration and login"
echo "3. Test listing creation and image upload"
echo "4. Verify BGG integration works"
echo "5. Check mobile responsiveness"
echo "6. Monitor error logs for issues"
echo ""
echo "🔗 Useful links:"
echo "• Vercel Dashboard: https://vercel.com/dashboard"
echo "• Supabase Dashboard: https://supabase.com/dashboard"
echo "• Application: $DEPLOY_URL"
echo "• Health Check: $DEPLOY_URL/api/health"
echo ""
print_status "Happy gaming! 🎲"
