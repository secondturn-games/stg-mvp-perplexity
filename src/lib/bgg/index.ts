// Main BGG API exports
export {
  searchGames,
  getGameDetails,
  getMultipleGames,
  findGame,
  validateBggId,
  getPopularGames,
} from './api'

// Type exports
export type {
  BggSearchResult,
  BggGameDetails,
  BggSearchParams,
  BggApiResponse,
  BggApiError,
} from './types'

// Utility exports
export {
  parseXml,
  parseSearchResults,
  parseGameDetails,
  sortSearchResults,
  extractXmlValue,
  extractXmlNumber,
  cleanDescription,
} from './xml-parser'

// Utility functions for working with BGG data
export function formatGameTitle(game: any): string {
  if (game.yearPublished) {
    return `${game.name} (${game.yearPublished})`
  }
  return game.name
}

export function formatPlayingTime(game: any): string {
  if (game.minPlayingTime && game.maxPlayingTime && game.minPlayingTime !== game.maxPlayingTime) {
    return `${game.minPlayingTime}-${game.maxPlayingTime} min`
  }
  if (game.playingTime) {
    return `${game.playingTime} min`
  }
  if (game.minPlayingTime) {
    return `${game.minPlayingTime}+ min`
  }
  return 'Unknown'
}

export function formatPlayerCount(game: any): string {
  if (game.minPlayers && game.maxPlayers && game.minPlayers !== game.maxPlayers) {
    return `${game.minPlayers}-${game.maxPlayers} players`
  }
  if (game.minPlayers) {
    return `${game.minPlayers}+ players`
  }
  return 'Unknown'
}

export function formatRating(rating?: number): string {
  if (!rating || rating === 0) return 'Not rated'
  return rating.toFixed(1)
}

export function getBggUrl(bggId: number): string {
  return `https://boardgamegeek.com/boardgame/${bggId}`
}

export function isValidBggId(bggId: any): bggId is number {
  return typeof bggId === 'number' && bggId > 0 && Number.isInteger(bggId)
}

export function formatDescription(description: string, maxLength?: number): string {
  if (!description) return 'No description available'
  
  // Description is already cleaned by cleanDescription function
  let formatted = description
  
  // Truncate if maxLength is specified
  if (maxLength && formatted.length > maxLength) {
    formatted = formatted.substring(0, maxLength).trim()
    // Don't cut off in the middle of a word
    const lastSpace = formatted.lastIndexOf(' ')
    if (lastSpace > maxLength * 0.8) {
      formatted = formatted.substring(0, lastSpace)
    }
    formatted += '...'
  }
  
  return formatted
}

export function formatDescriptionWithLineBreaks(description: string): string {
  if (!description) return 'No description available'
  
  // For display purposes, we can add back some structure
  return description
    // Add line breaks after sentences ending with periods
    .replace(/\.\s+/g, '.\n\n')
    // Add line breaks after colons (often used for lists in BGG)
    .replace(/:\s+/g, ':\n')
    // Clean up any excessive line breaks
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
