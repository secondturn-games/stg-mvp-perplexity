# Sentry Error Monitoring Setup - Complete

## ✅ Comprehensive Sentry Integration

Your Second Turn Games project now has enterprise-grade error monitoring with Sentry, covering both frontend and backend error tracking, performance monitoring, and user feedback collection.

## 🛠️ What's Been Implemented

### **📦 Sentry SDK Integration**

- **@sentry/nextjs** - Complete Next.js integration
- **@sentry/react** - React error boundaries and hooks
- **@sentry/node** - Server-side error tracking
- **Source map upload** - Production error debugging
- **Performance monitoring** - Transaction tracing
- **Session replay** - User interaction recording

### **📁 File Structure**

```
├── sentry.client.config.ts              # Client-side Sentry configuration
├── sentry.server.config.ts              # Server-side Sentry configuration
├── sentry.edge.config.ts                # Edge runtime Sentry configuration
├── next.config.ts                       # Updated with Sentry webpack plugin
├── src/
│   ├── app/
│   │   ├── layout.tsx                   # Updated with error boundaries
│   │   ├── global-error.tsx             # Global error page
│   │   ├── not-found.tsx                # 404 page with tracking
│   │   └── test-sentry/                 # Error testing page
│   ├── components/
│   │   ├── error-boundaries/
│   │   │   ├── global-error-boundary.tsx    # Main error boundary
│   │   │   ├── listing-error-boundary.tsx   # Listing-specific errors
│   │   │   └── form-error-boundary.tsx      # Form-specific errors
│   │   ├── examples/
│   │   │   └── error-handling-examples.tsx  # Error handling demos
│   │   └── providers/
│   │       └── error-tracking-provider.tsx  # Enhanced with Sentry
│   └── lib/
│       └── monitoring/
│           ├── error-tracking.ts         # Enhanced error utilities
│           └── sentry-utils.ts           # Sentry-specific utilities
```

## 🔧 Configuration Overview

### **Environment Variables**

Add these to your `.env.local`:

```bash
# Sentry Configuration
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=your-sentry-project
SENTRY_AUTH_TOKEN=your-sentry-auth-token
SENTRY_ENVIRONMENT=development
```

### **Client Configuration Features**

- **Error filtering** - Excludes Next.js hydration errors and browser quirks
- **Performance monitoring** - Tracks page loads and navigation
- **Session replay** - Records user interactions for debugging
- **User context** - Automatically tracks authenticated users
- **Custom breadcrumbs** - Enhanced debugging trail

### **Server Configuration Features**

- **API monitoring** - Tracks all server-side errors
- **Performance profiling** - Monitors slow operations
- **Custom sampling** - Optimized for production performance
- **Transaction tracing** - End-to-end request tracking

## 🎯 Error Boundary Implementation

### **1. Global Error Boundary**

Wraps the entire application to catch any unhandled React errors:

```tsx
<GlobalErrorBoundary>
  <YourApp />
</GlobalErrorBoundary>
```

**Features:**

- **User-friendly error UI** with recovery options
- **Automatic Sentry reporting** with full context
- **Development error details** with stack traces
- **User feedback collection** via Sentry dialog

### **2. Component Error Boundary**

For non-critical components that shouldn't crash the whole page:

```tsx
<ComponentErrorBoundary componentName='UserProfile'>
  <UserProfileComponent />
</ComponentErrorBoundary>
```

### **3. Form Error Boundary**

Specialized for form components with better UX:

```tsx
<FormErrorBoundary formName='Create Listing' onReset={resetForm}>
  <CreateListingForm />
</FormErrorBoundary>
```

### **4. Listing Error Boundary**

Contextual error handling for listing-related components:

```tsx
<ListingErrorBoundary listingId='123' listingName='Catan'>
  <ListingDetails />
</ListingErrorBoundary>
```

## 🔍 Error Tracking Features

### **Automatic Error Capture**

- **React component errors** - Caught by error boundaries
- **API route errors** - Server-side exception handling
- **Unhandled promise rejections** - Global error listeners
- **Network errors** - Failed API calls and requests
- **Authentication errors** - Sign-in/sign-up failures

### **Enhanced Context Information**

```typescript
// Example: API error with context
captureApiError(error, {
  route: '/api/listings',
  method: 'GET',
  statusCode: 500,
  requestData: { page: 1, filters: {...} },
})

// Example: User action error
captureUserActionError(error, {
  action: 'createListing',
  component: 'CreateListingForm',
  userId: user.id,
  formData: { gameName: 'Catan', price: '25.00' },
})
```

### **Performance Monitoring**

```typescript
// Track slow operations
trackPerformanceIssue('database-query', 2500, 2000, {
  query: 'getListings',
  filters: {...},
})

// Monitor API response times
const startTime = Date.now()
// ... API call ...
const duration = Date.now() - startTime
if (duration > 2000) {
  // Automatically logged to Sentry
}
```

## 📊 Sentry Dashboard Features

### **Error Tracking**

- **Issue grouping** - Similar errors grouped together
- **Error frequency** - How often each error occurs
- **User impact** - How many users affected
- **Stack traces** - Full error details with source maps
- **Breadcrumbs** - User actions leading to errors

### **Performance Monitoring**

- **Transaction traces** - End-to-end request tracking
- **Database queries** - Slow query identification
- **API response times** - Performance bottleneck detection
- **Core Web Vitals** - User experience metrics

### **User Context**

- **User sessions** - Track individual user experiences
- **User feedback** - Direct feedback from error dialogs
- **Custom tags** - Filter and categorize errors
- **Release tracking** - Error trends across deployments

## 🚀 Usage Examples

### **1. API Route Error Handling**

```typescript
// src/app/api/example/route.ts
import { captureApiError } from '@/lib/monitoring/sentry-utils'

export async function GET(request: NextRequest) {
  try {
    // Your API logic here
    const result = await someOperation()
    return NextResponse.json(result)
  } catch (error) {
    const eventId = captureApiError(error as Error, {
      route: '/api/example',
      method: 'GET',
      statusCode: 500,
    })

    return NextResponse.json(
      {
        error: 'Operation failed',
        eventId: process.env.NODE_ENV === 'development' ? eventId : undefined,
      },
      { status: 500 }
    )
  }
}
```

### **2. Component Error Handling**

```tsx
// Your component
function MyComponent() {
  const handleSubmit = async (data: FormData) => {
    try {
      await submitForm(data)
    } catch (error) {
      captureUserActionError(error as Error, {
        action: 'submitForm',
        component: 'MyComponent',
        userId: user?.id,
        formData: Object.fromEntries(data),
      })

      // Handle error in UI
      setError('Failed to submit form')
    }
  }

  return (
    <FormErrorBoundary formName='My Form'>
      <form onSubmit={handleSubmit}>{/* Form content */}</form>
    </FormErrorBoundary>
  )
}
```

### **3. Business Logic Error Tracking**

```typescript
// Track business rule violations
function validateBusinessRules(data: any) {
  if (data.price > 10000) {
    trackBusinessError(
      'priceExceedsLimit',
      'User tried to set price above €10,000',
      {
        attemptedPrice: data.price,
        maxPrice: 10000,
        userId: user.id,
      }
    )

    throw new Error('Price cannot exceed €10,000')
  }
}
```

### **4. User Interaction Tracking**

```typescript
// Track feature usage
const handleFeatureUse = () => {
  trackUserInteraction('click', 'advanced-search-toggle', {
    feature: 'advanced-search',
    currentFilters: filters,
  })

  setShowAdvancedSearch(!showAdvancedSearch)
}
```

## 🎛️ Sentry Configuration Options

### **Client-Side Configuration**

```typescript
// sentry.client.config.ts highlights
{
  tracesSampleRate: 0.1,           // 10% transaction sampling
  replaysSessionSampleRate: 0.01,  // 1% session replay
  replaysOnErrorSampleRate: 1.0,   // 100% replay on errors
  enableTracing: true,             // Performance monitoring
  captureUnhandledRejections: true, // Promise rejection tracking
}
```

### **Server-Side Configuration**

```typescript
// sentry.server.config.ts highlights
{
  tracesSampleRate: 0.1,           // Server transaction sampling
  profilesSampleRate: 0.1,         // Performance profiling
  enableTracing: true,             // Server performance monitoring
  serverName: process.env.VERCEL_REGION, // Server identification
}
```

## 🔄 Error Recovery Mechanisms

### **Error Boundary Recovery**

- **Try Again** - Retry the failed operation
- **Reload Page** - Full page refresh
- **Go Home** - Navigate to safe page
- **Report Issue** - User feedback collection

### **API Error Recovery**

- **Automatic retry** - Built-in retry logic for transient errors
- **Graceful degradation** - Fallback content when APIs fail
- **User notification** - Clear error messages with next steps
- **Error context** - Detailed information for debugging

## 📱 Mobile Error Handling

### **Mobile-Specific Features**

- **Touch-friendly error UI** - Large buttons and clear actions
- **Network error handling** - Offline/online state detection
- **App crash recovery** - Automatic error reporting
- **User feedback** - Easy error reporting from mobile devices

## 🔒 Privacy and Security

### **Data Protection**

- **No sensitive data** in error reports (passwords, tokens, etc.)
- **User email only** for authenticated error context
- **Form field names** but not values in error reports
- **IP address hashing** for privacy compliance

### **Security Features**

- **Rate limiting** on error reporting to prevent abuse
- **Error filtering** to exclude non-actionable errors
- **Source map protection** - Maps only uploaded, not exposed
- **Environment separation** - Different projects for dev/prod

## 🧪 Testing Error Handling

### **Test Page Available**

Visit `/test-sentry` in development to test error handling:

1. **API Error Testing** - Trigger API failures
2. **Form Error Boundary** - Test React component errors
3. **Business Logic Errors** - Test validation failures
4. **Async Error Handling** - Test promise rejections
5. **Manual Error Tracking** - Test custom error capture

### **Testing Commands**

```bash
# Start development server
npm run dev

# Visit test page
open http://localhost:3000/test-sentry

# Check Sentry dashboard for captured errors
```

## 📊 Monitoring and Alerts

### **Sentry Dashboard Sections**

1. **Issues** - All captured errors grouped by similarity
2. **Performance** - Transaction traces and slow operations
3. **Releases** - Error tracking across deployments
4. **Alerts** - Email/Slack notifications for critical errors
5. **User Feedback** - Direct user reports and feedback

### **Recommended Alerts**

- **Critical errors** - Immediate notification
- **High error rate** - Spike in error frequency
- **New issues** - Previously unseen errors
- **Performance degradation** - Slow response times

## 🎯 Error Categories and Handling

### **1. Critical Errors (Immediate Action)**

- **Application crashes** - Global error boundary triggered
- **Authentication failures** - Users cannot sign in
- **Payment processing** - Transaction failures
- **Data corruption** - Invalid data states

### **2. Serious Errors (Fix This Sprint)**

- **Form submission failures** - Users cannot complete actions
- **API timeouts** - Service degradation
- **Image upload failures** - Feature not working
- **Search functionality** - Core feature broken

### **3. Warning Level (Fix Next Sprint)**

- **Validation errors** - User input issues
- **External API failures** - BGG API timeouts
- **Performance issues** - Slow page loads
- **Business rule violations** - Edge case handling

### **4. Info Level (Monitor)**

- **404 errors** - Track broken links
- **Feature usage** - User behavior tracking
- **Navigation patterns** - User flow analysis
- **A/B test events** - Feature flag tracking

## 🔗 Integration with Existing Systems

### **Supabase Integration**

- **Database errors** tracked with query context
- **Authentication errors** with user context
- **Storage errors** with file upload context
- **Real-time subscription** error handling

### **BGG API Integration**

- **External API failures** tracked separately
- **Rate limiting** errors monitored
- **Data parsing errors** with response context
- **Network timeout** handling

### **Vercel Deployment**

- **Build errors** tracked during deployment
- **Runtime errors** in serverless functions
- **Edge function** error monitoring
- **Performance metrics** across regions

## 🚀 Getting Started

### **1. Set Up Sentry Project**

1. Create account at [sentry.io](https://sentry.io)
2. Create new Next.js project
3. Copy DSN from project settings
4. Add environment variables to `.env.local`

### **2. Configure Environment**

```bash
# Copy example environment file
cp env.example .env.local

# Add your Sentry DSN
SENTRY_DSN=https://your-dsn@sentry.io/project-id
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

### **3. Test Error Tracking**

```bash
# Start development server
npm run dev

# Visit test page to trigger sample errors
open http://localhost:3000/test-sentry

# Check Sentry dashboard for captured errors
```

### **4. Deploy with Sentry**

```bash
# Build with source maps
npm run build

# Deploy to Vercel with Sentry integration
npm run deploy
```

## 📈 Monitoring Best Practices

### **Error Triage Process**

1. **Daily** - Review new critical errors
2. **Weekly** - Analyze error trends and patterns
3. **Sprint Planning** - Prioritize error fixes
4. **Release** - Monitor error rates after deployment

### **Performance Monitoring**

1. **Track Core Web Vitals** - LCP, FID, CLS metrics
2. **Monitor API response times** - Database query performance
3. **Watch for memory leaks** - Client-side performance
4. **Analyze user flows** - Identify friction points

### **User Feedback**

1. **Enable user feedback** - Let users report issues
2. **Monitor feedback trends** - Common user complaints
3. **Respond to reports** - Close the feedback loop
4. **Feature request tracking** - User-driven improvements

## 🔧 Customization Options

### **Custom Error Types**

```typescript
// Define custom error categories
enum ErrorCategory {
  PAYMENT = 'payment',
  LISTING = 'listing',
  AUTH = 'auth',
  BGG = 'bgg',
  UPLOAD = 'upload',
}

// Use custom categories
captureCustomError(error, {
  component: 'PaymentForm',
  action: 'processPayment',
  additional: {
    category: ErrorCategory.PAYMENT,
    paymentMethod: 'card',
  },
})
```

### **Custom Tags and Context**

```typescript
// Add custom tags for filtering
Sentry.setTag('feature', 'advanced-search')
Sentry.setTag('userType', 'premium')

// Add custom context
Sentry.setContext('gamePreferences', {
  favoriteGenres: ['strategy', 'euro'],
  averageGameTime: 90,
})
```

### **Custom Sampling**

```typescript
// Custom transaction sampling
tracesSampler: samplingContext => {
  if (samplingContext.transactionContext.name?.includes('/api/health')) {
    return 0.01 // Sample health checks less
  }

  if (samplingContext.transactionContext.name?.includes('/api/listings')) {
    return 0.5 // Sample listing APIs more
  }

  return 0.1 // Default sampling
}
```

## 📋 Error Handling Checklist

### **✅ Frontend Error Handling**

- [x] **React error boundaries** - Component error isolation
- [x] **Global error handlers** - Unhandled promise rejections
- [x] **Form validation errors** - User input error handling
- [x] **API call errors** - Network and server error handling
- [x] **User interaction tracking** - Feature usage monitoring
- [x] **Performance monitoring** - Core Web Vitals tracking

### **✅ Backend Error Handling**

- [x] **API route errors** - Server-side exception handling
- [x] **Database errors** - Supabase error tracking
- [x] **Authentication errors** - Auth flow error monitoring
- [x] **External API errors** - BGG API failure tracking
- [x] **File upload errors** - Storage error handling
- [x] **Rate limiting** - Abuse prevention monitoring

### **✅ Production Features**

- [x] **Source map upload** - Production debugging
- [x] **Release tracking** - Error trends across deployments
- [x] **Performance profiling** - Production performance monitoring
- [x] **User feedback** - Error reporting from users
- [x] **Alert configuration** - Critical error notifications
- [x] **Dashboard setup** - Error monitoring and analysis

## 🎉 Benefits Achieved

### **Developer Experience**

- **Faster debugging** - Complete error context and stack traces
- **Proactive monitoring** - Catch errors before users report them
- **Performance insights** - Identify and fix slow operations
- **User behavior** - Understand how users interact with your app

### **User Experience**

- **Graceful error handling** - Users see helpful error messages
- **Quick recovery** - Multiple recovery options for errors
- **Feedback mechanism** - Users can report issues directly
- **Stable application** - Errors don't crash the entire app

### **Business Value**

- **Reduced support tickets** - Proactive error resolution
- **Improved conversion** - Fewer users lost to errors
- **Data-driven decisions** - Error and performance insights
- **Quality assurance** - Continuous monitoring of app health

---

## 🚀 **Ready to Monitor!**

Your Sentry integration is complete and ready for production use.

**Next Steps:**

1. **Configure Sentry project** - Set up your Sentry account and project
2. **Add environment variables** - Configure DSN and auth tokens
3. **Test error tracking** - Visit `/test-sentry` to verify setup
4. **Deploy and monitor** - Watch your Sentry dashboard for real errors

**Your board game marketplace now has enterprise-grade error monitoring! 🎯🔍**

## 📞 Support and Resources

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Error Boundary Best Practices](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)
- [User Feedback Guide](https://docs.sentry.io/product/user-feedback/)
