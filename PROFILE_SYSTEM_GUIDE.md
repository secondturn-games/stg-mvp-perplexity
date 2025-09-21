# User Profile System Guide

This guide covers the complete user profile management system for viewing and editing user information with Latvian city selection.

## Overview

The profile system includes:

- ✅ **Profile viewing** with read-only display
- ✅ **Profile editing** with form validation
- ✅ **Latvian city dropdown** with all major cities
- ✅ **Server-side validation** and updates
- ✅ **Real-time form feedback** and error handling
- ✅ **Protected routes** with authentication
- ✅ **TypeScript types** throughout

## File Structure

```
src/
├── lib/
│   └── profile/
│       └── actions.ts              # Server actions for profile updates
├── components/
│   ├── profile/
│   │   ├── profile-view.tsx        # Read-only profile display
│   │   └── profile-edit.tsx        # Profile editing form
│   └── ui/
│       └── city-select.tsx         # Latvian cities dropdown
└── app/
    └── profile/
        ├── page.tsx                # Main profile page (server component)
        └── profile-page-content.tsx # Client-side profile content
```

## Features

### Profile Information

- **Full Name** - Required field, 2-100 characters
- **Email Address** - Read-only, managed through authentication
- **City** - Optional dropdown with Latvian cities
- **Member Since** - Automatically set from account creation

### Latvian Cities Support

The system includes a dropdown with all major Latvian cities:

- Rīga
- Daugavpils
- Liepāja
- Jelgava
- Jūrmala
- Ventspils
- Rēzekne

## Components

### ProfileView Component

Read-only display of user profile information with edit button.

```typescript
import { ProfileView } from '@/components/profile/profile-view'

<ProfileView
  user={userProfile}
  onEdit={() => setIsEditing(true)}
/>
```

**Props:**

- `user: User` - User profile data
- `onEdit: () => void` - Callback when edit button is clicked

### ProfileEdit Component

Editable form for updating profile information.

```typescript
import { ProfileEdit } from '@/components/profile/profile-edit'

<ProfileEdit
  user={userProfile}
  onCancel={() => setIsEditing(false)}
  onSuccess={() => handleEditSuccess()}
/>
```

**Props:**

- `user: User` - User profile data
- `onCancel: () => void` - Callback when cancel button is clicked
- `onSuccess: () => void` - Callback when profile is successfully updated

### CitySelect Component

Dropdown component for selecting Latvian cities.

```typescript
import { CitySelect } from '@/components/ui/city-select'

<CitySelect
  name="city"
  label="City"
  value={selectedCity}
  onChange={setSelectedCity}
  placeholder="Select your city (optional)"
/>
```

**Props:**

- `name: string` - Form field name
- `value?: string` - Currently selected city
- `onChange?: (value: string) => void` - Callback when selection changes
- `error?: string` - Validation error message
- `required?: boolean` - Whether field is required
- `placeholder?: string` - Placeholder text
- `label?: string` - Field label

## Server Actions

### updateProfileAction

Updates user profile information with validation.

```typescript
import { updateProfileAction } from '@/lib/supabase'

const result = await updateProfileAction(formData)
if (result.success) {
  // Profile updated successfully
  console.log(result.data.message)
} else {
  // Handle error
  console.error(result.error)
}
```

**FormData fields:**

- `name: string` - User's full name (required)
- `city: string` - Selected city (optional)

**Returns:** `AuthActionResult`

- `success: boolean` - Whether update succeeded
- `error?: string` - Error message if failed
- `data?.message: string` - Success message
- `data?.profile: User` - Updated profile data

## Validation

### Client-Side Validation

The `CitySelect` component validates that selected cities are from the approved list.

### Server-Side Validation

The `validateProfileForm` function provides comprehensive validation:

```typescript
import { validateProfileForm } from '@/lib/supabase'

const errors = validateProfileForm({
  name: 'John Doe',
  city: 'Rīga',
})

// Returns ProfileValidationErrors
interface ProfileValidationErrors {
  name?: string
  city?: string
}
```

**Name Validation:**

- Required field
- Minimum 2 characters
- Maximum 100 characters
- Trimmed of whitespace

**City Validation:**

- Optional field
- Must be from approved Latvian cities list if provided
- Validated against `LATVIAN_CITIES` constant

## Usage Examples

### Basic Profile Page

```typescript
// Server Component
import { getUser, getUserProfile } from '@/lib/supabase'
import { ProfilePageContent } from './profile-page-content'

export default async function ProfilePage() {
  const user = await getUser()
  if (!user) redirect('/auth/sign-in')

  const profile = await getUserProfile()

  return (
    <div>
      <h1>My Profile</h1>
      <ProfilePageContent profile={profile} />
    </div>
  )
}
```

### Client-Side Profile Management

```typescript
'use client'
import { useState } from 'react'
import { ProfileView, ProfileEdit } from '@/components/profile'

export function ProfilePageContent({ profile }) {
  const [isEditing, setIsEditing] = useState(false)
  const [currentProfile, setCurrentProfile] = useState(profile)

  const handleEditSuccess = async () => {
    setIsEditing(false)
    // Reload profile data
    const updated = await getUserProfile()
    setCurrentProfile(updated)
  }

  return isEditing ? (
    <ProfileEdit
      user={currentProfile}
      onCancel={() => setIsEditing(false)}
      onSuccess={handleEditSuccess}
    />
  ) : (
    <ProfileView
      user={currentProfile}
      onEdit={() => setIsEditing(true)}
    />
  )
}
```

### Custom City Handling

```typescript
import { LATVIAN_CITIES, isValidLatvianCity } from '@/lib/supabase'

// Get all cities
const allCities = LATVIAN_CITIES
// ['Rīga', 'Daugavpils', 'Liepāja', ...]

// Validate a city
const isValid = isValidLatvianCity('Rīga') // true
const isInvalid = isValidLatvianCity('New York') // false

// Get options for select component
const cityOptions = LATVIAN_CITIES.map(city => ({
  value: city,
  label: city,
}))
```

## Styling and UI

### Design System

The profile components follow the established design system:

- **Colors:** Blue primary (#2563eb), Gray text, Red errors
- **Typography:** Clear hierarchy with proper font weights
- **Spacing:** Consistent padding and margins
- **Interactive:** Hover states and focus rings
- **Responsive:** Mobile-first approach

### Profile Avatar

Automatic avatar generation based on user's name or email:

```typescript
// Avatar shows first letter of name or email
const avatarLetter =
  user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'
```

### Form States

- **Loading:** Disabled inputs with loading spinner
- **Success:** Green success message with auto-redirect
- **Error:** Red error messages with clear descriptions
- **Validation:** Real-time validation feedback

## Error Handling

### Common Errors

1. **Validation Errors**
   - Name too short/long
   - Invalid city selection
   - Missing required fields

2. **Network Errors**
   - Connection timeout
   - Server unavailable
   - Authentication expired

3. **Permission Errors**
   - User not authenticated
   - Profile not found
   - Update not allowed

### Error Display

```typescript
// Server action error handling
const result = await updateProfileAction(formData)
if (!result.success) {
  setError(result.error) // Display user-friendly error
}

// Validation error display
const errors = validateProfileForm(data)
if (errors.name) {
  // Show inline error for name field
}
```

## Security

### Authentication Required

All profile operations require authentication:

```typescript
// Server-side protection
const user = await requireAuth() // Throws if not authenticated

// Client-side protection (automatic via middleware)
// Routes starting with /profile are protected
```

### Data Validation

- **Server-side validation** prevents malicious data
- **Input sanitization** with trimming and length limits
- **City validation** against approved list only
- **SQL injection protection** via Supabase client

## Performance

### Server Components

The main profile page uses server components for:

- **Better SEO** with server-rendered content
- **Faster initial load** with pre-fetched data
- **Reduced JavaScript** bundle size

### Client Components

Interactive features use client components for:

- **Form interactions** and real-time validation
- **State management** for edit/view modes
- **Dynamic updates** without page refresh

## Testing

### Manual Testing Checklist

- [ ] View profile information correctly
- [ ] Edit profile with valid data
- [ ] Form validation for invalid data
- [ ] City dropdown shows all Latvian cities
- [ ] City selection updates correctly
- [ ] Cancel editing returns to view mode
- [ ] Success message shows after update
- [ ] Error handling for network issues
- [ ] Authentication protection works
- [ ] Mobile responsive design

### Edge Cases

- [ ] Empty profile data
- [ ] Very long names (100+ characters)
- [ ] Special characters in names
- [ ] Network disconnection during update
- [ ] Concurrent updates from multiple tabs
- [ ] Invalid city values from external sources

## Customization

### Adding New Cities

To add new cities to the dropdown:

```typescript
// In src/lib/constants/cities.ts
export const LATVIAN_CITIES = [
  'Rīga',
  'Daugavpils',
  'Liepāja',
  'Jelgava',
  'Jūrmala',
  'Ventspils',
  'Rēzekne',
  'YourNewCity', // Add here
] as const
```

### Custom Validation

Extend validation rules in `validateProfileForm`:

```typescript
// Add custom validation rules
if (data.name.includes('admin')) {
  errors.name = 'Name cannot contain "admin"'
}
```

### Styling Customization

Update component styles by modifying the Tailwind classes in the respective components.

## Future Enhancements

Potential improvements for the profile system:

- [ ] **Profile pictures** with image upload
- [ ] **Additional fields** (phone, bio, preferences)
- [ ] **Privacy settings** for public/private profiles
- [ ] **Profile completion** progress indicator
- [ ] **Social media** links integration
- [ ] **Email preferences** management
- [ ] **Account deletion** functionality
- [ ] **Profile export** feature

This profile system provides a solid foundation for user account management with room for future expansion!
