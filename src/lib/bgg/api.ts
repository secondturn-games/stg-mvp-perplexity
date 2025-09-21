import { parseXml, parseSearchResults, parseGameDetails } from './xml-parser'
import { bggCache, createSearchCacheKey, createGameCacheKey, createMultiGameCacheKey } from './cache'
import { bggApiLimiter, bggRateLimiter, RATE_LIMITS } from '@/lib/security/rate-limiting'
import type {
  BggSearchResult,
  BggGameDetails,
  BggSearchParams,
  BggApiResponse,
  BggApiError,
} from './types'

// BGG API Configuration
const BGG_BASE_URL = 'https://api.geekdo.com/xmlapi2'
const DEFAULT_TIMEOUT = 10000 // 10 seconds
const RATE_LIMIT_DELAY = 1000 // 1 second between requests

// Simple rate limiting
let lastRequestTime = 0

/**
 * Add delay between requests to respect BGG rate limits
 */
async function rateLimitDelay(): Promise<void> {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    const delay = RATE_LIMIT_DELAY - timeSinceLastRequest
    await new Promise(resolve => setTimeout(resolve, delay))
  }
  
  lastRequestTime = Date.now()
}

/**
 * Make HTTP request with timeout and error handling
 */
async function makeRequest(url: string): Promise<string> {
  await rateLimitDelay()
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'SecondTurnGames/1.0 (Board Game Marketplace)',
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`BGG API returned ${response.status}: ${response.statusText}`)
    }

    const text = await response.text()
    
    // Check for BGG error responses
    if (text.includes('<error>')) {
      throw new Error('BGG API returned an error response')
    }

    return text
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. BGG API may be slow or unavailable.')
      }
      throw error
    }
    
    throw new Error('Unknown error occurred while fetching data from BGG')
  }
}

/**
 * Search for board games on BoardGameGeek
 */
export async function searchGames({
  query,
  type = 'boardgame',
  exact = false,
}: BggSearchParams): Promise<BggApiResponse<BggSearchResult[]>> {
  try {
    if (!query || query.trim().length === 0) {
      return {
        success: false,
        error: 'Search query cannot be empty',
      }
    }

    const cacheKey = createSearchCacheKey(query.trim(), type)
    
    return await bggCache.getOrFetch(cacheKey, async () => {
      // Apply rate limiting for BGG API calls
      return await bggApiLimiter.execute(async () => {
        const encodedQuery = encodeURIComponent(query.trim())
        const exactParam = exact ? '&exact=1' : ''
        const url = `${BGG_BASE_URL}/search?query=${encodedQuery}&type=${type}${exactParam}`

        const xmlResponse = await makeRequest(url)
        const parsedData = await parseXml(xmlResponse)
        const results = parseSearchResults(parsedData, query.trim())

        return {
          success: true,
          data: results,
        }
      }, 'anonymous') // Use anonymous user ID for public searches
    })
  } catch (error) {
    console.error('BGG search error:', error)
    
    // Return user-friendly error messages
    let errorMessage = 'Failed to search games'
    if (error instanceof Error) {
      if (error.message.includes('Rate limit exceeded')) {
        errorMessage = error.message
      } else if (error.message.includes('timed out')) {
        errorMessage = 'Search timed out. BoardGameGeek might be experiencing high traffic. Please try again.'
      } else if (error.message.includes('BGG API returned an error response')) {
        errorMessage = 'BoardGameGeek is temporarily unavailable. Please try again in a moment.'
      } else if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
        errorMessage = 'BoardGameGeek server error. Please try again later.'
      } else if (error.message.includes('fetch') || error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.'
      }
    }
    
    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Get detailed information for a specific game by BGG ID
 */
export async function getGameDetails(bggId: number): Promise<BggApiResponse<BggGameDetails>> {
  try {
    if (!bggId || bggId <= 0) {
      return {
        success: false,
        error: 'Invalid BGG ID provided',
      }
    }

    const cacheKey = createGameCacheKey(bggId)
    
    return await bggCache.getOrFetch(cacheKey, async () => {
      const url = `${BGG_BASE_URL}/thing?id=${bggId}&stats=1`
      
      const xmlResponse = await makeRequest(url)
      const parsedData = await parseXml(xmlResponse)
      const gameDetails = parseGameDetails(parsedData)

      if (!gameDetails) {
        return {
          success: false,
          error: 'Game not found or no data available',
        }
      }

      return {
        success: true,
        data: gameDetails,
      }
    })
  } catch (error) {
    console.error('BGG game details error:', error)
    
    // Return user-friendly error messages
    let errorMessage = 'Failed to fetch game details'
    if (error instanceof Error) {
      if (error.message.includes('timed out')) {
        errorMessage = 'Request timed out. BoardGameGeek might be slow. Please try again.'
      } else if (error.message.includes('BGG API returned an error response')) {
        errorMessage = 'Game details temporarily unavailable. Please try again in a moment.'
      } else if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
        errorMessage = 'BoardGameGeek server error. Please try again later.'
      } else if (error.message.includes('fetch') || error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.'
      }
    }
    
    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Get multiple games by their BGG IDs
 */
export async function getMultipleGames(bggIds: number[]): Promise<BggApiResponse<BggGameDetails[]>> {
  try {
    if (!bggIds || bggIds.length === 0) {
      return {
        success: false,
        error: 'No BGG IDs provided',
      }
    }

    // Filter out invalid IDs
    const validIds = bggIds.filter(id => id && id > 0)
    if (validIds.length === 0) {
      return {
        success: false,
        error: 'No valid BGG IDs provided',
      }
    }

    const idsString = validIds.join(',')
    const url = `${BGG_BASE_URL}/thing?id=${idsString}&stats=1`

    const xmlResponse = await makeRequest(url)
    const parsedData = await parseXml(xmlResponse)
    
    const items = parsedData?.items?.item || []
    const games: BggGameDetails[] = []

    // Handle both single item and array responses
    const itemsArray = Array.isArray(items) ? items : [items]
    
    for (const item of itemsArray) {
      try {
        const gameDetails = parseGameDetails({ items: { item: [item] } })
        if (gameDetails) {
          games.push(gameDetails)
        }
      } catch (error) {
        console.warn(`Failed to parse game ${item.$.id}:`, error)
        // Continue with other games
      }
    }

    return {
      success: true,
      data: games,
    }
  } catch (error) {
    console.error('BGG multiple games error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch multiple games',
    }
  }
}

/**
 * Search for a game and return the first exact match
 */
export async function findGame(gameName: string): Promise<BggApiResponse<BggGameDetails>> {
  try {
    // First, search for the game
    const searchResponse = await searchGames({ 
      query: gameName, 
      exact: true 
    })

    if (!searchResponse.success || !searchResponse.data || searchResponse.data.length === 0) {
      // Try non-exact search if exact search fails
      const fallbackSearch = await searchGames({ 
        query: gameName, 
        exact: false 
      })
      
      if (!fallbackSearch.success || !fallbackSearch.data || fallbackSearch.data.length === 0) {
        return {
          success: false,
          error: 'No games found matching the search query',
        }
      }
      
      // Use the first result from fallback search
      const firstResult = fallbackSearch.data[0]
      if (!firstResult) {
        return {
          success: false,
          error: 'No games found matching the search query',
        }
      }
      return await getGameDetails(firstResult.id)
    }

    // Use the first exact match
    const firstResult = searchResponse.data[0]
    if (!firstResult) {
      return {
        success: false,
        error: 'No games found matching the search query',
      }
    }
    return await getGameDetails(firstResult.id)
  } catch (error) {
    console.error('BGG find game error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to find game',
    }
  }
}

/**
 * Validate BGG ID by checking if game exists
 */
export async function validateBggId(bggId: number): Promise<boolean> {
  try {
    const response = await getGameDetails(bggId)
    return response.success && !!response.data
  } catch (error) {
    return false
  }
}

/**
 * Get popular games (uses BGG's hot games list)
 * Note: This is a simplified version - BGG doesn't have a direct "popular games" endpoint
 * In practice, you might want to maintain a curated list of popular game IDs
 */
export async function getPopularGames(): Promise<BggApiResponse<BggGameDetails[]>> {
  // Popular game IDs (manually curated list of well-known games)
  const popularGameIds = [
    174430, // Gloomhaven
    161936, // Pandemic Legacy: Season 1
    167791, // Terraforming Mars
    224517, // Brass: Birmingham
    220308, // Gaia Project
    182028, // Through the Ages: A New Story of Civilization
    173346, // 7 Wonders Duel
    169786, // Scythe
    120677, // Terra Mystica
    148228, // Splendor
  ]

  return await getMultipleGames(popularGameIds)
}
