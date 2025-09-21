# BoardGameGeek API Integration Guide

This guide covers the BoardGameGeek XML API integration for searching games and fetching game details.

## Overview

The BGG integration provides:

- ✅ **Game search** with exact and fuzzy matching
- ✅ **Game details** with comprehensive information
- ✅ **XML parsing** for BGG's XML API responses
- ✅ **Error handling** for timeouts and API failures
- ✅ **Rate limiting** to respect BGG's API limits
- ✅ **TypeScript types** for all API responses
- ✅ **Utility functions** for formatting game data

## File Structure

```
src/lib/bgg/
├── api.ts           # Main API functions
├── xml-parser.ts    # XML parsing utilities
├── types.ts         # TypeScript type definitions
└── index.ts         # Exports and utility functions

src/components/bgg/
└── bgg-search-test.tsx  # Test component for BGG integration

src/app/bgg-test/
└── page.tsx         # Test page for BGG functionality
```

## API Functions

### searchGames()

Search for board games by name with intelligent result sorting.

```typescript
import { searchGames } from '@/lib/bgg'

const response = await searchGames({
  query: 'Gloomhaven',
  type: 'boardgame',
  exact: true,
})

if (response.success) {
  console.log(response.data) // BggSearchResult[] - sorted with exact matches first
} else {
  console.error(response.error)
}
```

**Parameters:**

- `query: string` - Search term (required)
- `type?: 'boardgame' | 'boardgameexpansion'` - Game type filter (default: 'boardgame')
- `exact?: boolean` - Exact name matching (default: false)

**Returns:** `BggApiResponse<BggSearchResult[]>`

**Result Sorting:**
Results are automatically sorted by relevance:

1. **Exact matches** - Games with names that exactly match the search query
2. **Starts with** - Games with names that start with the search query
3. **Contains** - Games with names that contain the search query
4. **Related** - Other games returned by BGG
5. **Secondary sort** - By publication year (newer first), then alphabetically

### getGameDetails()

Get detailed information for a specific game by BGG ID.

```typescript
import { getGameDetails } from '@/lib/bgg'

const response = await getGameDetails(174430) // Gloomhaven BGG ID

if (response.success) {
  console.log(response.data) // BggGameDetails
} else {
  console.error(response.error)
}
```

**Parameters:**

- `bggId: number` - BoardGameGeek game ID

**Returns:** `BggApiResponse<BggGameDetails>`

### getMultipleGames()

Fetch details for multiple games in a single request.

```typescript
import { getMultipleGames } from '@/lib/bgg'

const response = await getMultipleGames([174430, 161936, 167791])

if (response.success) {
  console.log(response.data) // BggGameDetails[]
}
```

### findGame()

Search for a game and return detailed information for the first match.

```typescript
import { findGame } from '@/lib/bgg'

const response = await findGame('Terraforming Mars')

if (response.success) {
  console.log(response.data) // BggGameDetails
}
```

### validateBggId()

Check if a BGG ID corresponds to a valid game.

```typescript
import { validateBggId } from '@/lib/bgg'

const isValid = await validateBggId(174430) // true
const isInvalid = await validateBggId(999999) // false
```

### getPopularGames()

Get a curated list of popular board games.

```typescript
import { getPopularGames } from '@/lib/bgg'

const response = await getPopularGames()
if (response.success) {
  console.log(response.data) // BggGameDetails[] - 10 popular games
}
```

## Data Types

### BggSearchResult

Basic game information from search results.

```typescript
interface BggSearchResult {
  id: number // BGG ID
  name: string // Game name
  yearPublished?: number // Year published
  type: 'boardgame' | 'boardgameexpansion' | 'boardgameaccessory'
}
```

### BggGameDetails

Comprehensive game information.

```typescript
interface BggGameDetails {
  id: number // BGG ID
  name: string // Game name
  description: string // Game description (HTML stripped)
  image?: string // Full-size image URL
  thumbnail?: string // Thumbnail image URL
  yearPublished?: number // Year published
  minPlayers?: number // Minimum players
  maxPlayers?: number // Maximum players
  playingTime?: number // Playing time in minutes
  minPlayingTime?: number // Minimum playing time
  maxPlayingTime?: number // Maximum playing time
  minAge?: number // Minimum age
  categories?: string[] // Game categories
  mechanics?: string[] // Game mechanics
  designers?: string[] // Game designers
  publishers?: string[] // Game publishers
  averageRating?: number // Average user rating (1-10)
  bggRating?: number // BGG rating (Geek Rating)
  usersRated?: number // Number of users who rated
  rank?: number // BGG rank
  complexity?: number // Complexity rating (1-5)
}
```

## Utility Functions

### formatGameTitle()

Format game name with year for display.

```typescript
import { formatGameTitle } from '@/lib/bgg'

const title = formatGameTitle(game) // "Gloomhaven (2017)"
```

### formatPlayingTime()

Format playing time for display.

```typescript
import { formatPlayingTime } from '@/lib/bgg'

const time = formatPlayingTime(game) // "60-120 min"
```

### formatPlayerCount()

Format player count for display.

```typescript
import { formatPlayerCount } from '@/lib/bgg'

const players = formatPlayerCount(game) // "1-4 players"
```

### getBggUrl()

Get the BoardGameGeek URL for a game.

```typescript
import { getBggUrl } from '@/lib/bgg'

const url = getBggUrl(174430) // "https://boardgamegeek.com/boardgame/174430"
```

### formatDescription()

Format game description with optional length limit and proper text cleaning.

```typescript
import { formatDescription } from '@/lib/bgg'

// Basic formatting (removes HTML entities)
const cleanDesc = formatDescription(game.description)

// With length limit
const shortDesc = formatDescription(game.description, 200) // Truncated to ~200 chars
```

### formatDescriptionWithLineBreaks()

Format description with preserved line breaks for better readability.

```typescript
import { formatDescriptionWithLineBreaks } from '@/lib/bgg'

const formattedDesc = formatDescriptionWithLineBreaks(game.description)
// Returns description with proper line breaks restored
```

## Error Handling

All API functions return a standardized response format:

```typescript
interface BggApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

### Common Error Types

1. **Network Errors**
   - Connection timeout (10 seconds)
   - BGG API unavailable
   - Network connectivity issues

2. **API Errors**
   - Invalid BGG ID
   - Game not found
   - BGG server errors

3. **Parsing Errors**
   - Malformed XML response
   - Unexpected data structure

### Error Handling Example

```typescript
const response = await searchGames({ query: 'Gloomhaven' })

if (!response.success) {
  switch (response.error) {
    case 'Request timed out. BGG API may be slow or unavailable.':
      // Handle timeout
      break
    case 'Search query cannot be empty':
      // Handle validation error
      break
    default:
      // Handle general error
      console.error('BGG API error:', response.error)
  }
  return
}

// Use response.data safely
const games = response.data || []
```

## Rate Limiting

The service includes automatic rate limiting:

- **1 second delay** between requests
- **Automatic throttling** to prevent API abuse
- **User-Agent header** identifying your application

## Usage in Components

### Search Component

```typescript
'use client'
import { useState } from 'react'
import { searchGames, type BggSearchResult } from '@/lib/bgg'

export function GameSearch() {
  const [results, setResults] = useState<BggSearchResult[]>([])

  const handleSearch = async (query: string) => {
    const response = await searchGames({ query })
    if (response.success) {
      setResults(response.data || [])
    }
  }

  return (
    <div>
      {/* Search UI */}
      {results.map(game => (
        <div key={game.id}>
          <h3>{game.name}</h3>
          <p>BGG ID: {game.id}</p>
        </div>
      ))}
    </div>
  )
}
```

### Game Details Component

```typescript
'use client'
import { useEffect, useState } from 'react'
import { getGameDetails, type BggGameDetails } from '@/lib/bgg'

interface GameDetailsProps {
  bggId: number
}

export function GameDetails({ bggId }: GameDetailsProps) {
  const [game, setGame] = useState<BggGameDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadGame() {
      const response = await getGameDetails(bggId)
      if (response.success) {
        setGame(response.data || null)
      }
      setLoading(false)
    }

    loadGame()
  }, [bggId])

  if (loading) return <div>Loading...</div>
  if (!game) return <div>Game not found</div>

  return (
    <div>
      <h1>{game.name}</h1>
      <img src={game.thumbnail} alt={game.name} />
      <p>{game.description}</p>
      <p>Players: {game.minPlayers}-{game.maxPlayers}</p>
      <p>Time: {game.playingTime} minutes</p>
      <p>Rating: {game.averageRating}/10</p>
    </div>
  )
}
```

## Server-Side Usage

For server components and API routes:

```typescript
import { searchGames, getGameDetails } from '@/lib/bgg'

// In a Server Component
export default async function GamesPage() {
  const popularGames = await getPopularGames()

  return (
    <div>
      {popularGames.success && popularGames.data?.map(game => (
        <div key={game.id}>
          <h2>{game.name}</h2>
          <p>{game.description}</p>
        </div>
      ))}
    </div>
  )
}

// In an API route
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return Response.json({ error: 'Query required' }, { status: 400 })
  }

  const response = await searchGames({ query })
  return Response.json(response)
}
```

## Testing

### Manual Testing

Visit `/bgg-test` to test the BGG integration with a simple search interface.

### Test Cases

1. **Search functionality**:
   - Search for "Gloomhaven"
   - Search for "Terraforming Mars"
   - Search with exact matching
   - Search with empty query (should show error)

2. **Game details**:
   - Get details for BGG ID 174430 (Gloomhaven)
   - Get details for invalid ID (should show error)
   - Check image loading
   - Verify description HTML stripping

3. **Error handling**:
   - Test with no internet connection
   - Test with invalid BGG IDs
   - Test API timeout scenarios

## Performance Considerations

### Rate Limiting

- BGG API has rate limits - the service respects these
- Automatic 1-second delay between requests
- Consider implementing request queuing for high-volume usage

### Caching Recommendations

For production use, consider adding caching:

```typescript
// Example: Cache game details for 24 hours
const cacheKey = `bgg-game-${bggId}`
const cached = await cache.get(cacheKey)
if (cached) return cached

const response = await getGameDetails(bggId)
if (response.success) {
  await cache.set(cacheKey, response.data, 24 * 60 * 60) // 24 hours
}
```

## BGG API Limits

- **Rate limiting**: ~1 request per second
- **Timeout**: 10 seconds per request
- **No authentication** required for public data
- **XML format only** (no JSON endpoint)

## Troubleshooting

### Common Issues

1. **Timeout errors**: BGG API can be slow, especially during peak hours
2. **XML parsing errors**: BGG sometimes returns malformed XML
3. **Missing data**: Not all games have complete information
4. **Rate limiting**: Too many requests will be rejected

### Debug Tips

```typescript
// Enable debug logging
console.log('BGG API request:', url)
console.log('BGG API response:', xmlResponse)

// Check raw XML response
const response = await fetch(bggUrl)
const xml = await response.text()
console.log('Raw XML:', xml)
```

## Integration with Marketplace

### Adding BGG Data to Listings

```typescript
// When creating a listing, optionally fetch BGG data
import { findGame } from '@/lib/bgg'

const bggData = await findGame(gameName)
if (bggData.success) {
  // Use BGG data to enhance listing
  const listing = {
    game_name: bggData.data.name,
    bgg_id: bggData.data.id,
    description: bggData.data.description,
    // ... other listing fields
  }
}
```

### Validating BGG IDs

```typescript
import { validateBggId } from '@/lib/bgg'

// In form validation
if (bggId && !(await validateBggId(bggId))) {
  errors.bgg_id = 'Invalid BoardGameGeek ID'
}
```

This BGG integration provides a solid foundation for enriching your board game marketplace with official game data from BoardGameGeek!
