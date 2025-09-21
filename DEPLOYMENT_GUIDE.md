# Production Deployment Guide - Second Turn Games

## 🚀 **Vercel Deployment Instructions**

This guide covers the complete deployment process for the Second Turn Games marketplace to Vercel production environment.

---

## **Pre-Deployment Checklist** ✅

### **1. Code Preparation**

- [ ] All features tested locally
- [ ] Security audit completed
- [ ] Performance optimizations applied
- [ ] Mobile responsiveness verified
- [ ] Error handling implemented
- [ ] Loading states functional

### **2. Environment Setup**

- [ ] Production Supabase project created
- [ ] Database migrations applied
- [ ] Storage bucket configured
- [ ] Authentication settings configured
- [ ] Environment variables documented

### **3. Security Verification**

- [ ] RLS policies enabled and tested
- [ ] API endpoints secured
- [ ] File upload restrictions verified
- [ ] Rate limiting implemented
- [ ] Email privacy protection active

---

## **🔧 Vercel Deployment Steps**

### **Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

### **Step 2: Login to Vercel**

```bash
vercel login
```

### **Step 3: Link Project**

```bash
# Run from project root
vercel link
```

### **Step 4: Configure Environment Variables**

```bash
# Set production environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_SITE_URL
vercel env add CRON_SECRET
```

### **Step 5: Deploy**

```bash
# Deploy to production
vercel --prod
```

---

## **🌍 Environment Variables Configuration**

### **Required Production Variables:**

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app

# Security
CRON_SECRET=your-random-secret-for-cron-jobs

# Optional: Analytics & Monitoring
VERCEL_ANALYTICS_ID=your-analytics-id
SENTRY_DSN=your-sentry-dsn
```

### **Setting Environment Variables in Vercel:**

1. Go to your project dashboard on Vercel
2. Navigate to Settings → Environment Variables
3. Add each variable for **Production** environment
4. Ensure sensitive variables are marked as sensitive

---

## **🗄️ Supabase Production Setup**

### **1. Create Production Project**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create new project for production
3. Choose region closest to your users (EU for Latvia)
4. Set strong database password

### **2. Apply Database Migrations**

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to production project
supabase link --project-ref your-production-project-id

# Apply migrations
supabase db push
```

### **3. Configure Authentication**

1. **Email Settings**:
   - Configure SMTP settings for production emails
   - Set up custom email templates
   - Configure email rate limiting

2. **URL Configuration**:
   - Site URL: `https://your-domain.vercel.app`
   - Redirect URLs: `https://your-domain.vercel.app/auth/callback`

3. **Security Settings**:
   - Enable email confirmation
   - Set session timeout (24 hours recommended)
   - Configure password requirements

### **4. Storage Configuration**

1. **Bucket Settings**:
   - Verify `listing-images` bucket exists
   - Confirm RLS policies are applied
   - Set up automatic cleanup

2. **Image Optimization**:
   - Configure image transformations
   - Set cache headers
   - Enable WebP conversion

---

## **📊 Monitoring & Error Tracking Setup**

### **1. Vercel Analytics**

```typescript
// Add to app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### **2. Error Tracking with Sentry** (Optional)

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
})
```

### **3. Performance Monitoring**

```typescript
// Add to app/layout.tsx
import { performanceMonitor } from '@/lib/utils/performance'

// Initialize performance monitoring in production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  performanceMonitor.sendMetrics()
}
```

---

## **🔍 Production Testing Checklist**

### **Post-Deployment Verification:**

#### **Core Functionality**

- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] User login/logout works
- [ ] Marketplace browsing functional
- [ ] Listing creation works
- [ ] Image uploads successful
- [ ] BGG integration working
- [ ] Email notifications sent
- [ ] Mobile responsiveness verified

#### **Security Testing**

- [ ] Authentication required for protected routes
- [ ] Email addresses not exposed publicly
- [ ] File upload restrictions enforced
- [ ] Rate limiting active
- [ ] Security headers present
- [ ] HTTPS enforced

#### **Performance Testing**

- [ ] Page load times < 3s on 3G
- [ ] Images optimized and loading
- [ ] API responses < 500ms
- [ ] BGG API caching working
- [ ] Database queries optimized

---

## **📈 Monitoring Dashboard Setup**

### **1. Vercel Dashboard Monitoring**

- **Function Logs**: Monitor API endpoint performance
- **Analytics**: Track user engagement
- **Performance**: Monitor Core Web Vitals
- **Errors**: Track deployment issues

### **2. Supabase Dashboard Monitoring**

- **Database Performance**: Query performance metrics
- **Authentication**: User signup/login rates
- **Storage**: File upload statistics
- **API Usage**: Request volume and errors

### **3. Custom Monitoring Endpoints**

```typescript
// Health check endpoint
GET / api / health
// Returns: database status, environment info, version

// Security audit endpoint (admin only)
GET / api / admin / security - audit
// Returns: recent security events, rate limit status
```

---

## **🚨 Rollback Plan**

### **Immediate Rollback (< 5 minutes)**

1. **Vercel Dashboard**:
   - Go to Deployments tab
   - Click "Promote to Production" on previous stable deployment
   - Verify rollback successful

2. **Database Rollback** (if needed):
   ```bash
   # Revert to previous migration
   supabase db reset --db-url your-production-db-url
   # Re-apply migrations up to stable version
   ```

### **Emergency Procedures**

1. **Take site offline**: Deploy maintenance page
2. **Disable user registration**: Temporarily disable new signups
3. **Contact users**: Email notification if data affected
4. **Investigate**: Use security audit logs
5. **Fix and redeploy**: Apply fixes and redeploy

---

## **🔒 Production Security Configuration**

### **1. Domain Security**

```bash
# Add custom domain in Vercel
vercel domains add your-domain.com

# Configure DNS
# Add CNAME record: your-domain.com → your-project.vercel.app
```

### **2. SSL/TLS Configuration**

- Vercel automatically provides SSL certificates
- Verify HTTPS redirect is working
- Check SSL rating at SSLLabs.com

### **3. Environment Security**

- Use Vercel's encrypted environment variables
- Rotate secrets regularly
- Implement secret scanning in CI/CD

---

## **📋 Deployment Commands**

### **Production Deployment**

```bash
# Build and test locally first
npm run build
npm run start

# Deploy to production
vercel --prod

# Verify deployment
curl https://your-domain.vercel.app/api/health
```

### **Preview Deployment**

```bash
# Deploy preview for testing
vercel

# Test preview deployment
curl https://your-preview-url.vercel.app/api/health
```

### **Environment Management**

```bash
# List environment variables
vercel env ls

# Pull environment variables for local development
vercel env pull .env.local

# Remove environment variable
vercel env rm VARIABLE_NAME
```

---

## **📊 Performance Monitoring**

### **Core Web Vitals Targets**

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### **API Performance Targets**

- **Listings API**: < 500ms response time
- **Authentication**: < 200ms response time
- **File Upload**: < 5s for 5MB file
- **BGG Integration**: < 2s with caching

---

## **🔄 CI/CD Pipeline** (Optional)

### **GitHub Actions Workflow**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test # Add tests
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## **📱 Mobile App Considerations** (Future)

### **PWA Configuration**

- Service worker for offline functionality
- App manifest for install prompts
- Push notifications for new listings
- Background sync for form submissions

### **Native App Preparation**

- API-first architecture ready
- Authentication flow mobile-friendly
- Image optimization for mobile
- Offline-first data strategy

---

## **🆘 Emergency Contacts & Procedures**

### **Deployment Issues**

1. **Check Vercel Status**: status.vercel.com
2. **Check Supabase Status**: status.supabase.com
3. **Review Logs**: Vercel Functions logs
4. **Contact Support**: Vercel support if needed

### **Security Incidents**

1. **Immediate**: Take affected functionality offline
2. **Investigate**: Check security audit logs
3. **Communicate**: Notify users if data affected
4. **Fix**: Apply security patches
5. **Monitor**: Enhanced monitoring post-incident

---

## **📈 Post-Deployment Optimization**

### **Week 1: Monitoring**

- Monitor error rates and performance
- Check user feedback and support requests
- Verify all features working in production
- Monitor rate limiting effectiveness

### **Week 2-4: Optimization**

- Analyze performance metrics
- Optimize slow queries
- Adjust rate limits based on usage
- Implement user feedback

### **Monthly: Security Review**

- Review security audit logs
- Update dependencies
- Check for new vulnerabilities
- Performance optimization review

---

_Deployment Guide Version: 1.0_  
_Last Updated: December 2024_  
_Status: ✅ PRODUCTION READY_
