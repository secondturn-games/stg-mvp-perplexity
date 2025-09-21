/**
 * BoardGameGeek API Types
 * Based on BGG XML API v2 responses
 */

export interface BggSearchResult {
  id: number
  name: string
  yearPublished?: number
  type: 'boardgame' | 'boardgameexpansion' | 'boardgameaccessory'
}

export interface BggGameDetails {
  id: number
  name: string
  description: string
  image?: string
  thumbnail?: string
  yearPublished?: number
  minPlayers?: number
  maxPlayers?: number
  playingTime?: number
  minPlayingTime?: number
  maxPlayingTime?: number
  minAge?: number
  categories?: string[]
  mechanics?: string[]
  designers?: string[]
  publishers?: string[]
  averageRating?: number
  bggRating?: number
  usersRated?: number
  rank?: number
  complexity?: number
}

export interface BggSearchParams {
  query: string
  type?: 'boardgame' | 'boardgameexpansion'
  exact?: boolean
}

export interface BggApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface BggApiError {
  message: string
  status?: number
  code?: string
}

// XML parsing types (internal)
export interface BggXmlSearchItem {
  $: {
    type: string
    id: string
  }
  name: Array<{
    $: {
      type: string
      value: string
    }
  }>
  yearpublished?: Array<{
    $: {
      value: string
    }
  }>
}

export interface BggXmlGameItem {
  $: {
    type: string
    id: string
  }
  name: Array<{
    $: {
      type: string
      value: string
    }
  }>
  description?: string[]
  image?: string[]
  thumbnail?: string[]
  yearpublished?: Array<{
    $: {
      value: string
    }
  }>
  minplayers?: Array<{
    $: {
      value: string
    }
  }>
  maxplayers?: Array<{
    $: {
      value: string
    }
  }>
  playingtime?: Array<{
    $: {
      value: string
    }
  }>
  minplaytime?: Array<{
    $: {
      value: string
    }
  }>
  maxplaytime?: Array<{
    $: {
      value: string
    }
  }>
  minage?: Array<{
    $: {
      value: string
    }
  }>
  link?: Array<{
    $: {
      type: string
      id: string
      value: string
    }
  }>
  statistics?: Array<{
    ratings: Array<{
      average: Array<{
        $: {
          value: string
        }
      }>
      bayesaverage: Array<{
        $: {
          value: string
        }
      }>
      usersrated: Array<{
        $: {
          value: string
        }
      }>
      ranks: Array<{
        rank: Array<{
          $: {
            type: string
            id: string
            name: string
            friendlyname: string
            value: string
            bayesaverage: string
          }
        }>
      }>
    }>
  }>
}



