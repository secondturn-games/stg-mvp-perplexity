'use client'

import { useState } from 'react'
import { searchGames, getGameDetails, formatGameTitle, formatDescription, type BggSearchResult, type BggGameDetails } from '@/lib/bgg'

export function BggSearchTest() {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<BggSearchResult[]>([])
  const [gameDetails, setGameDetails] = useState<BggGameDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError('')
    setSearchResults([])
    setGameDetails(null)

    try {
      const response = await searchGames({ query: query.trim() })
      
      if (response.success && response.data) {
        setSearchResults(response.data.slice(0, 10)) // Limit to 10 results
      } else {
        setError(response.error || 'Search failed')
      }
    } catch (err) {
      setError('An error occurred while searching')
    } finally {
      setLoading(false)
    }
  }

  const handleGetDetails = async (bggId: number) => {
    setLoading(true)
    setError('')
    setGameDetails(null)

    try {
      const response = await getGameDetails(bggId)
      
      if (response.success && response.data) {
        setGameDetails(response.data)
      } else {
        setError(response.error || 'Failed to get game details')
      }
    } catch (err) {
      setError('An error occurred while fetching game details')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-4xl mx-auto p-6 space-y-6'>
      <div className='bg-white rounded-lg border border-gray-200 p-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
          BGG API Test
        </h2>
        
        <div className='flex gap-3 mb-4'>
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search for a board game...'
            className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 rounded-md p-3 mb-4'>
            <p className='text-red-800'>{error}</p>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className='mb-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              Search Results ({searchResults.length} found)
            </h3>
            <div className='space-y-2'>
              {searchResults.map((game, index) => {
                // Determine match type for visual indicator
                const normalizedQuery = query.toLowerCase().trim()
                const normalizedName = game.name.toLowerCase()
                
                let matchType = ''
                let matchBadgeColor = ''
                
                if (normalizedName === normalizedQuery) {
                  matchType = 'Exact Match'
                  matchBadgeColor = 'bg-green-100 text-green-800'
                } else if (normalizedName.startsWith(normalizedQuery)) {
                  matchType = 'Starts With'
                  matchBadgeColor = 'bg-blue-100 text-blue-800'
                } else if (normalizedName.includes(normalizedQuery)) {
                  matchType = 'Contains'
                  matchBadgeColor = 'bg-yellow-100 text-yellow-800'
                } else {
                  matchType = 'Related'
                  matchBadgeColor = 'bg-gray-100 text-gray-800'
                }

                return (
                  <div
                    key={game.id}
                    className='flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition-colors'
                    onClick={() => handleGetDetails(game.id)}
                  >
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-1'>
                        <p className='font-medium text-gray-900'>
                          {formatGameTitle(game)}
                        </p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${matchBadgeColor}`}>
                          {matchType}
                        </span>
                        {index === 0 && matchType === 'Exact Match' && (
                          <span className='px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800'>
                            Best Match
                          </span>
                        )}
                      </div>
                      <p className='text-sm text-gray-600'>
                        BGG ID: {game.id} • Type: {game.type.replace('boardgame', 'Board Game')}
                      </p>
                    </div>
                    <button className='text-blue-600 hover:text-blue-700 text-sm font-medium'>
                      View Details →
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Game Details */}
        {gameDetails && (
          <div className='border-t border-gray-200 pt-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              Game Details
            </h3>
            <div className='bg-gray-50 rounded-lg p-4'>
              <div className='flex gap-4'>
                {gameDetails.thumbnail && (
                  <img
                    src={gameDetails.thumbnail}
                    alt={gameDetails.name}
                    className='w-20 h-20 object-cover rounded'
                  />
                )}
                <div className='flex-1'>
                  <h4 className='text-xl font-bold text-gray-900'>
                    {formatGameTitle(gameDetails)}
                  </h4>
                  <div className='grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600'>
                    {gameDetails.minPlayers && (
                      <p>Players: {gameDetails.minPlayers}-{gameDetails.maxPlayers}</p>
                    )}
                    {gameDetails.playingTime && (
                      <p>Time: {gameDetails.playingTime} min</p>
                    )}
                    {gameDetails.minAge && (
                      <p>Age: {gameDetails.minAge}+</p>
                    )}
                    {gameDetails.averageRating && (
                      <p>Rating: {gameDetails.averageRating.toFixed(1)}/10</p>
                    )}
                  </div>
                  {gameDetails.description && (
                    <div className='mt-3 text-sm text-gray-700'>
                      <p className='whitespace-pre-line'>
                        {formatDescription(gameDetails.description, 400)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
