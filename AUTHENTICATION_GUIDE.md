# Authentication System Guide

This guide covers the complete authentication system built with Supabase Auth and Next.js App Router.

## Overview

The authentication system includes:

- ✅ **Sign up with email verification**
- ✅ **Sign in with email/password**
- ✅ **Password reset functionality**
- ✅ **Email verification**
- ✅ **Protected routes with middleware**
- ✅ **Server and client component support**
- ✅ **Comprehensive error handling**
- ✅ **TypeScript types throughout**

## File Structure

```
src/
├── lib/
│   ├── auth/
│   │   ├── actions.ts          # Server actions for auth
│   │   └── types.ts            # Auth types and validation
│   └── supabase/               # Supabase configuration
├── components/
│   └── auth/
│       ├── auth-form.tsx       # Reusable form components
│       ├── user-menu.tsx       # User dropdown menu
│       └── protected-route.tsx # Route protection components
├── app/
│   └── auth/
│       ├── sign-in/            # Sign in page
│       ├── sign-up/            # Sign up page
│       ├── forgot-password/    # Password reset request
│       ├── reset-password/     # Password reset form
│       ├── verify-email/       # Email verification
│       ├── callback/           # OAuth callback handler
│       └── auth-code-error/    # Error handling page
└── middleware.ts               # Route protection middleware
```

## Authentication Flows

### 1. Sign Up Flow

1. User fills out registration form
2. Server validates input and creates account
3. Supabase sends verification email
4. User clicks verification link
5. User is redirected to app with confirmed account

```typescript
// Usage in component
import { signUpAction } from '@/lib/supabase'

const result = await signUpAction(formData)
if (result.success) {
  // Handle success
} else {
  // Handle error: result.error
}
```

### 2. Sign In Flow

1. User enters email/password
2. Server validates credentials
3. User is redirected to requested page or home

```typescript
// Usage in component
import { signInAction } from '@/lib/supabase'

const result = await signInAction(formData)
if (result.success) {
  router.push('/')
}
```

### 3. Password Reset Flow

1. User requests password reset
2. Supabase sends reset email
3. User clicks reset link
4. User sets new password
5. User is redirected to sign in

```typescript
// Request reset
const result = await resetPasswordAction(formData)

// Update password (from reset link)
const result = await updatePasswordAction(formData)
```

## Components

### AuthForm Component

Reusable form wrapper with consistent styling and loading states.

```typescript
<AuthForm
  title="Sign in"
  subtitle="Welcome back!"
  onSubmit={handleSignIn}
  submitText="Sign in"
  loading={loading}
  footer={<AuthLink href="/auth/sign-up">Sign up</AuthLink>}
>
  <FormField
    label="Email"
    name="email"
    type="email"
    required
  />
</AuthForm>
```

### UserMenu Component

Dropdown menu showing user status and navigation.

```typescript
import { UserMenu } from '@/components/auth/user-menu'

// Shows sign in/up buttons when not authenticated
// Shows user dropdown with profile options when authenticated
<UserMenu />
```

### Protected Route Components

#### Server Component Protection

```typescript
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <h1>Protected Content</h1>
    </ProtectedRoute>
  )
}
```

#### Client Component Protection

```typescript
import { ClientProtectedRoute } from '@/components/auth/protected-route'

export default function ClientPage() {
  return (
    <ClientProtectedRoute>
      <h1>Protected Content</h1>
    </ClientProtectedRoute>
  )
}
```

## Middleware Protection

Routes are automatically protected via middleware:

```typescript
// Protected routes (require authentication)
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/listings/create',
  '/listings/edit',
  '/settings',
]

// Auth routes (redirect if already authenticated)
const authRoutes = ['/auth/sign-in', '/auth/sign-up', '/auth/forgot-password']
```

## Server Actions

All authentication logic uses Server Actions for security:

```typescript
// Server Actions available
signUpAction(formData) // Create new account
signInAction(formData) // Sign in user
signOutAction() // Sign out user
resetPasswordAction(formData) // Request password reset
updatePasswordAction(formData) // Update password
resendConfirmationAction(formData) // Resend verification email
```

## Client-Side Hooks

### useAuth Hook

Access current user state in client components:

```typescript
import { useAuth } from '@/lib/supabase'

function MyComponent() {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please sign in</div>

  return <div>Welcome, {user.email}!</div>
}
```

### useAuthActions Hook

Client-side authentication actions:

```typescript
import { useAuthActions } from '@/lib/supabase'

function AuthComponent() {
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithProvider,
    signOut,
    resetPassword,
  } = useAuthActions()

  // Use these for client-side auth flows
}
```

## Error Handling

Comprehensive error handling with user-friendly messages:

```typescript
import { getAuthErrorMessage, validateAuthForm } from '@/lib/supabase'

// Validate form data
const errors = validateAuthForm(data, isSignUp)
if (Object.keys(errors).length > 0) {
  // Handle validation errors
}

// Convert Supabase errors to user-friendly messages
const friendlyMessage = getAuthErrorMessage(supabaseError)
```

## TypeScript Types

Strong typing throughout the auth system:

```typescript
interface AuthFormData {
  email: string
  password: string
  name?: string
  confirmPassword?: string
}

interface AuthActionResult {
  success: boolean
  error?: string
  data?: any
}

interface ValidationErrors {
  email?: string
  password?: string
  confirmPassword?: string
  name?: string
}
```

## Environment Variables

Required environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # For redirects
```

## Supabase Configuration

### Email Settings

1. Go to **Authentication** > **Settings** in Supabase
2. Configure email templates for:
   - Welcome email
   - Password reset
   - Email confirmation
3. Set up SMTP or use Supabase's built-in email

### Redirect URLs

Add these URLs to your Supabase project:

**Development:**

- `http://localhost:3000/auth/callback`

**Production:**

- `https://yourdomain.com/auth/callback`

## Security Features

### Password Requirements

- Minimum 6 characters
- Validated on both client and server

### Email Verification

- Required for new accounts
- Prevents fake email registrations
- Configurable in Supabase settings

### Protected Routes

- Automatic middleware protection
- Server and client-side guards
- Redirect to sign-in with return URL

### CSRF Protection

- Server Actions provide built-in CSRF protection
- Secure by default with Next.js

## Testing Authentication

### Manual Testing Checklist

- [ ] Sign up with new email
- [ ] Verify email confirmation sent
- [ ] Click verification link
- [ ] Sign in with verified account
- [ ] Access protected routes
- [ ] Sign out functionality
- [ ] Password reset flow
- [ ] Error handling for invalid credentials
- [ ] Middleware redirects work correctly

### Common Issues

1. **Email not received**: Check spam folder, verify SMTP settings
2. **Redirect loops**: Check middleware configuration and protected routes
3. **Session not persisting**: Verify cookie settings and middleware setup
4. **TypeScript errors**: Ensure all types are properly imported

## Customization

### Custom Error Messages

Update `AUTH_ERROR_MESSAGES` in `src/lib/auth/types.ts`:

```typescript
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'Invalid login credentials': 'Invalid email or password',
  // Add your custom messages
}
```

### Custom Styling

Modify the form components in `src/components/auth/auth-form.tsx` to match your design system.

### Additional OAuth Providers

Add OAuth providers in the `useAuthActions` hook:

```typescript
const signInWithProvider = async (
  provider: 'google' | 'github' | 'discord'
) => {
  // OAuth implementation
}
```

## Production Checklist

- [ ] Configure production redirect URLs in Supabase
- [ ] Set up custom email templates
- [ ] Configure SMTP for email delivery
- [ ] Test all authentication flows in production
- [ ] Monitor error rates and user feedback
- [ ] Set up proper logging and monitoring

This authentication system provides a solid foundation for secure user management in your Next.js application!
