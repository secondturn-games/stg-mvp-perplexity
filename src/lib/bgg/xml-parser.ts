import { parseString } from 'xml2js'
import type {
  BggSearchResult,
  BggGameDetails,
  BggXmlSearchItem,
  BggXmlGameItem,
} from './types'

/**
 * Parse XML string to JavaScript object
 */
export function parseXml(xmlString: string): Promise<any> {
  return new Promise((resolve, reject) => {
    parseString(xmlString, { explicitArray: true }, (err, result) => {
      if (err) {
        reject(new Error(`XML parsing failed: ${err.message}`))
      } else {
        resolve(result)
      }
    })
  })
}

/**
 * Extract search results from BGG search XML response
 */
export function parseSearchResults(xmlData: any, originalQuery?: string): BggSearchResult[] {
  try {
    const items = xmlData?.items?.item || []
    
    const results = items.map((item: BggXmlSearchItem) => {
      // Find the primary name (type="primary")
      const primaryName = item.name?.find(n => n.$.type === 'primary')
      const name = primaryName?.$.value || item.name?.[0]?.$.value || 'Unknown Game'
      
      // Extract year published
      const yearPublished = item.yearpublished?.[0]?.$.value 
        ? parseInt(item.yearpublished[0].$.value, 10) 
        : undefined

      return {
        id: parseInt(item.$.id, 10),
        name,
        yearPublished,
        type: item.$.type as 'boardgame' | 'boardgameexpansion' | 'boardgameaccessory',
      }
    })

    // Sort results to prioritize exact matches if original query is provided
    if (originalQuery) {
      return sortSearchResults(results, originalQuery)
    }

    return results
  } catch (error) {
    throw new Error(`Failed to parse search results: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Sort search results to prioritize exact matches
 */
export function sortSearchResults(results: BggSearchResult[], query: string): BggSearchResult[] {
  const normalizedQuery = query.toLowerCase().trim()
  
  return results.sort((a, b) => {
    const aName = a.name.toLowerCase()
    const bName = b.name.toLowerCase()
    
    // Exact match gets highest priority
    const aExactMatch = aName === normalizedQuery
    const bExactMatch = bName === normalizedQuery
    
    if (aExactMatch && !bExactMatch) return -1
    if (!aExactMatch && bExactMatch) return 1
    
    // Starts with query gets second priority
    const aStartsWith = aName.startsWith(normalizedQuery)
    const bStartsWith = bName.startsWith(normalizedQuery)
    
    if (aStartsWith && !bStartsWith) return -1
    if (!aStartsWith && bStartsWith) return 1
    
    // Contains query gets third priority
    const aContains = aName.includes(normalizedQuery)
    const bContains = bName.includes(normalizedQuery)
    
    if (aContains && !bContains) return -1
    if (!aContains && bContains) return 1
    
    // Finally sort by year (newer first) then alphabetically
    if (a.yearPublished && b.yearPublished && a.yearPublished !== b.yearPublished) {
      return b.yearPublished - a.yearPublished
    }
    
    return aName.localeCompare(bName)
  })
}

/**
 * Extract game details from BGG thing XML response
 */
export function parseGameDetails(xmlData: any): BggGameDetails | null {
  try {
    const item = xmlData?.items?.item?.[0]
    if (!item) {
      return null
    }

    const gameItem = item as BggXmlGameItem

    // Extract primary name
    const primaryName = gameItem.name?.find(n => n.$.type === 'primary')
    const name = primaryName?.$.value || gameItem.name?.[0]?.$.value || 'Unknown Game'

    // Extract description and clean HTML tags and entities
    const rawDescription = gameItem.description?.[0] || ''
    const description = cleanDescription(rawDescription)

    // Extract basic info
    const yearPublished = gameItem.yearpublished?.[0]?.$.value 
      ? parseInt(gameItem.yearpublished[0].$.value, 10) 
      : undefined

    const minPlayers = gameItem.minplayers?.[0]?.$.value 
      ? parseInt(gameItem.minplayers[0].$.value, 10) 
      : undefined

    const maxPlayers = gameItem.maxplayers?.[0]?.$.value 
      ? parseInt(gameItem.maxplayers[0].$.value, 10) 
      : undefined

    const playingTime = gameItem.playingtime?.[0]?.$.value 
      ? parseInt(gameItem.playingtime[0].$.value, 10) 
      : undefined

    const minPlayingTime = gameItem.minplaytime?.[0]?.$.value 
      ? parseInt(gameItem.minplaytime[0].$.value, 10) 
      : undefined

    const maxPlayingTime = gameItem.maxplaytime?.[0]?.$.value 
      ? parseInt(gameItem.maxplaytime[0].$.value, 10) 
      : undefined

    const minAge = gameItem.minage?.[0]?.$.value 
      ? parseInt(gameItem.minage[0].$.value, 10) 
      : undefined

    // Extract categories and mechanics
    const links = gameItem.link || []
    const categories = links
      .filter(link => link.$.type === 'boardgamecategory')
      .map(link => link.$.value)

    const mechanics = links
      .filter(link => link.$.type === 'boardgamemechanic')
      .map(link => link.$.value)

    const designers = links
      .filter(link => link.$.type === 'boardgamedesigner')
      .map(link => link.$.value)

    const publishers = links
      .filter(link => link.$.type === 'boardgamepublisher')
      .map(link => link.$.value)

    // Extract ratings
    const statistics = gameItem.statistics?.[0]?.ratings?.[0]
    const averageRating = statistics?.average?.[0]?.$.value 
      ? parseFloat(statistics.average[0].$.value) 
      : undefined

    const bggRating = statistics?.bayesaverage?.[0]?.$.value 
      ? parseFloat(statistics.bayesaverage[0].$.value) 
      : undefined

    const usersRated = statistics?.usersrated?.[0]?.$.value 
      ? parseInt(statistics.usersrated[0].$.value, 10) 
      : undefined

    // Extract rank (look for Board Game Rank)
    const ranks = statistics?.ranks?.[0]?.rank || []
    const boardGameRank = ranks.find(rank => rank.$.name === 'boardgame')
    const rank = boardGameRank?.$.value && boardGameRank.$.value !== 'Not Ranked'
      ? parseInt(boardGameRank.$.value, 10)
      : undefined

    return {
      id: parseInt(gameItem.$.id, 10),
      name,
      description,
      image: gameItem.image?.[0],
      thumbnail: gameItem.thumbnail?.[0],
      yearPublished,
      minPlayers,
      maxPlayers,
      playingTime,
      minPlayingTime,
      maxPlayingTime,
      minAge,
      categories: categories.length > 0 ? categories : undefined,
      mechanics: mechanics.length > 0 ? mechanics : undefined,
      designers: designers.length > 0 ? designers : undefined,
      publishers: publishers.length > 0 ? publishers : undefined,
      averageRating,
      bggRating,
      usersRated,
      rank,
    }
  } catch (error) {
    throw new Error(`Failed to parse game details: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Utility to safely extract string value from XML attribute
 */
export function extractXmlValue(obj: any, defaultValue = ''): string {
  if (!obj || !Array.isArray(obj) || obj.length === 0) {
    return defaultValue
  }
  return obj[0]?.$.value || obj[0] || defaultValue
}

/**
 * Utility to safely extract number value from XML attribute
 */
export function extractXmlNumber(obj: any, defaultValue?: number): number | undefined {
  const value = extractXmlValue(obj)
  if (!value) return defaultValue
  
  const parsed = parseFloat(value)
  return isNaN(parsed) ? defaultValue : parsed
}

/**
 * Clean and format game description by removing HTML tags and decoding entities
 */
export function cleanDescription(rawDescription: string): string {
  if (!rawDescription) return ''
  
  return rawDescription
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Decode common HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // Decode typographic quotes and symbols
    .replace(/&ldquo;/g, '"')     // Left double quotation mark
    .replace(/&rdquo;/g, '"')     // Right double quotation mark
    .replace(/&lsquo;/g, "'")     // Left single quotation mark
    .replace(/&rsquo;/g, "'")     // Right single quotation mark
    .replace(/&mdash;/g, '—')     // Em dash
    .replace(/&ndash;/g, '–')     // En dash
    .replace(/&hellip;/g, '...')  // Horizontal ellipsis
    .replace(/&bull;/g, '•')      // Bullet
    .replace(/&middot;/g, '·')    // Middle dot
    .replace(/&trade;/g, '™')     // Trademark symbol
    .replace(/&copy;/g, '©')      // Copyright symbol
    .replace(/&reg;/g, '®')       // Registered trademark
    .replace(/&deg;/g, '°')       // Degree symbol
    .replace(/&plusmn;/g, '±')    // Plus-minus sign
    .replace(/&times;/g, '×')     // Multiplication sign
    .replace(/&divide;/g, '÷')    // Division sign
    // Decode numeric HTML entities (like &#10; for line breaks)
    .replace(/&#(\d+);/g, (match, code) => {
      const charCode = parseInt(code, 10)
      // Convert line breaks and other whitespace to spaces
      if (charCode === 10 || charCode === 13 || charCode === 9) {
        return ' '
      }
      // Convert other valid character codes
      if (charCode >= 32 && charCode <= 126) {
        return String.fromCharCode(charCode)
      }
      // Convert common extended ASCII characters
      if (charCode >= 128 && charCode <= 255) {
        return String.fromCharCode(charCode)
      }
      // Remove invalid or problematic characters
      return ''
    })
    // Decode hexadecimal HTML entities (like &#x0A; for line breaks)
    .replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => {
      const charCode = parseInt(hex, 16)
      // Convert line breaks and other whitespace to spaces
      if (charCode === 10 || charCode === 13 || charCode === 9) {
        return ' '
      }
      // Convert other valid character codes
      if (charCode >= 32 && charCode <= 126) {
        return String.fromCharCode(charCode)
      }
      // Convert common extended ASCII characters
      if (charCode >= 128 && charCode <= 255) {
        return String.fromCharCode(charCode)
      }
      // Remove invalid or problematic characters
      return ''
    })
    // Clean up multiple spaces and line breaks
    .replace(/\s+/g, ' ')
    .trim()
}
