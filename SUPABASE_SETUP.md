# Supabase Setup Guide - Board Game Marketplace

This guide will help you set up Supabase authentication and database integration for the Second Turn Games board game marketplace project.

**Note**: This marketplace is designed for Latvia, with support for the following cities:

- Rīga
- Daugavpils
- Liepāja
- Jelgava
- Jūrmala
- Ventspils
- Rēzekne

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project in Supabase

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: Database URL for direct database access
DATABASE_URL=your_supabase_database_url
```

### How to find your Supabase credentials:

1. Go to your Supabase project dashboard
2. Navigate to **Settings** > **API**
3. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

## Database Schema

The database schema has been created for you in the `supabase/migrations/001_board_game_marketplace.sql` file.

To apply the schema to your Supabase project, you can either:

1. **Copy and run the SQL directly** in your Supabase SQL Editor
2. **Use the migration file** with Supabase CLI (recommended for production)

### Option 1: Direct SQL Execution

Copy the contents of `supabase/migrations/001_board_game_marketplace.sql` and run it in your Supabase SQL Editor.

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase in your project
supabase init

# Link to your remote project
supabase link --project-ref YOUR_PROJECT_ID

# Run migrations
supabase db push
```

### Schema Overview

The schema includes:

#### **Users Table**

- `id` (UUID, Primary Key, references auth.users)
- `email` (TEXT, NOT NULL, UNIQUE)
- `name` (TEXT, NOT NULL)
- `city` (TEXT, nullable)
- `created_at`, `updated_at` (TIMESTAMPTZ)

#### **Listings Table**

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to users)
- `bgg_id` (INTEGER, nullable - BoardGameGeek ID)
- `game_name` (TEXT, NOT NULL)
- `price` (DECIMAL, NOT NULL, >= 0)
- `condition` (TEXT, CHECK constraint for valid conditions)
- `description` (TEXT, nullable)
- `images` (TEXT[], array of image URLs)
- `city` (TEXT, nullable)
- `is_active` (BOOLEAN, default true)
- `created_at`, `updated_at` (TIMESTAMPTZ)

#### **Views**

- `active_listings_with_users` - Joins active listings with user data

#### **Indexes**

- Performance indexes on commonly queried fields
- Full-text search capabilities

#### **Row Level Security (RLS)**

- Users can read all profiles, manage only their own
- Users can view active listings, manage only their own listings
- Comprehensive security policies

## Authentication Setup

### Enable Authentication Providers

1. Go to **Authentication** > **Providers** in your Supabase dashboard
2. Enable the providers you want to use (Email, Google, GitHub, Discord, etc.)
3. Configure OAuth providers with your app credentials

### Configure Auth Settings

1. Go to **Authentication** > **Settings**
2. Set your **Site URL** to `http://localhost:3000` (for development)
3. Add `http://localhost:3000/auth/callback` to **Redirect URLs**
4. For production, add your production URLs

## Usage Examples

### Server Components

```typescript
import { getUser, getListings } from '@/lib/supabase'

export default async function ServerPage() {
  const user = await getUser()

  if (!user) {
    return <div>Please log in</div>
  }

  const { data: listings } = await getListings({ limit: 10 })

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <div className="grid gap-4">
        {listings.map(listing => (
          <div key={listing.id} className="border p-4 rounded">
            <h3>{listing.game_name}</h3>
            <p>${listing.price}</p>
            <p>Condition: {listing.condition}</p>
            <p>Seller: {listing.seller_name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Client Components

```typescript
'use client'
import { useAuth, useAuthActions } from '@/lib/supabase'

export default function ClientPage() {
  const { user, loading } = useAuth()
  const { signOut } = useAuthActions()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please log in</div>

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### Server Actions

```typescript
'use server'
import { requireAuth, createListing } from '@/lib/supabase'
import type { GameCondition } from '@/lib/supabase/types'

export async function createListingAction(formData: FormData) {
  const user = await requireAuth()

  const listing = await createListing({
    user_id: user.id,
    game_name: formData.get('game_name') as string,
    price: parseFloat(formData.get('price') as string),
    condition: formData.get('condition') as GameCondition,
    description: formData.get('description') as string,
    city: formData.get('city') as string,
  })

  return listing
}
```

### Marketplace-Specific Examples

#### Get Listings with Filters

```typescript
import { getListings } from '@/lib/supabase'

// Get listings in a specific city with price range
const { data: listings } = await getListings({
  filters: {
    city: 'Rīga',
    minPrice: 20,
    maxPrice: 100,
    condition: ['new', 'like_new', 'very_good'],
  },
  sortBy: 'price',
  sortOrder: 'asc',
})
```

#### Search Listings

```typescript
import { searchListings } from '@/lib/supabase'

// Search for specific games
const listings = await searchListings('Gloomhaven')
```

#### Get User's Listings

```typescript
import { getUserActiveListings } from '@/lib/supabase'

// Get current user's active listings
const myListings = await getUserActiveListings()
```

#### City Management

```typescript
import {
  LATVIAN_CITIES,
  getCityOptions,
  isValidLatvianCity,
} from '@/lib/supabase'

// Get all supported cities
console.log(LATVIAN_CITIES) // ['Rīga', 'Daugavpils', 'Liepāja', ...]

// Get city options for dropdowns
const cityOptions = getCityOptions()
// Returns: [{ value: 'Rīga', label: 'Rīga' }, ...]

// Validate a city
if (isValidLatvianCity(userCity)) {
  // City is valid
}
```

## Type Generation

To generate TypeScript types from your database schema:

1. Install the Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Generate types: `supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > src/lib/supabase/types.ts`

## Security Notes

- Never expose your `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- Use Row Level Security (RLS) policies to secure your data
- The service role key bypasses RLS - use it carefully for admin operations only
- Always validate user input in Server Actions and API routes

## Troubleshooting

1. **Auth not working**: Check that your redirect URLs are correctly configured
2. **Database errors**: Verify your RLS policies allow the operations you're trying to perform
3. **Type errors**: Make sure your types are up to date with your database schema
4. **Environment variables**: Ensure all required environment variables are set correctly
