'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { searchGames, getGameDetails, formatGameTitle, type BggSearchResult, type BggGameDetails } from '@/lib/bgg'
import { cn } from '@/lib/utils'
import { retry, bggShouldRetry, RetryError } from '@/lib/utils/retry'
import { Spinner } from '@/components/ui/loading-states'
import { RetryButton } from '@/components/ui/error-states'

interface BggGameSelectorProps {
  onGameSelect: (game: BggGameDetails) => void
  selectedGame?: BggGameDetails | null
  error?: string
}

export function BggGameSelector({ onGameSelect, selectedGame, error }: BggGameSelectorProps) {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<BggSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSearchResults([])
      return
    }

    const timeoutId = setTimeout(async () => {
      await handleSearch(query.trim())
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [query])

  const handleSearch = async (searchQuery: string, isRetry: boolean = false) => {
    if (!searchQuery) return

    setLoading(true)
    if (!isRetry) {
      setSearchError('')
      setRetryCount(0)
    }

    try {
      const response = await retry(
        () => searchGames({ 
          query: searchQuery,
          type: 'boardgame'
        }),
        {
          maxAttempts: 3,
          baseDelay: 1000,
          shouldRetry: bggShouldRetry
        }
      )

      if (response.success && response.data) {
        setSearchResults(response.data.slice(0, 8)) // Limit to 8 results
        setIsOpen(true)
        setSearchError('')
      } else {
        setSearchError(response.error || 'Search failed')
        setSearchResults([])
      }
    } catch (err) {
      if (err instanceof RetryError) {
        setSearchError(err.lastError.message)
        setRetryCount(err.attempts)
      } else {
        setSearchError('An error occurred while searching')
      }
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleGameSelect = async (gameResult: BggSearchResult) => {
    setLoading(true)
    setSearchError('')
    setIsOpen(false)

    try {
      const response = await retry(
        () => getGameDetails(gameResult.id),
        {
          maxAttempts: 3,
          baseDelay: 1000,
          shouldRetry: bggShouldRetry
        }
      )

      if (response.success && response.data) {
        onGameSelect(response.data)
        setQuery(formatGameTitle(response.data))
        setSearchResults([])
        setSearchError('')
      } else {
        setSearchError(response.error || 'Failed to get game details')
      }
    } catch (err) {
      if (err instanceof RetryError) {
        setSearchError(err.lastError.message)
      } else {
        setSearchError('An error occurred while fetching game details')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClearSelection = () => {
    setQuery('')
    setSearchResults([])
    setIsOpen(false)
    setSearchError('')
    onGameSelect(null as any) // Clear selection
  }

  const handleRetry = () => {
    if (query.trim()) {
      handleSearch(query.trim(), true)
    }
  }

  return (
    <div className='space-y-2'>
      <label 
        htmlFor='bgg-search-input'
        className='block text-sm font-medium text-gray-900 mb-1'
      >
        Board Game
        <span className='text-red-600 ml-1' aria-label='required'>*</span>
      </label>
      
      {selectedGame ? (
        // Show selected game
        <div data-testid="selected-game" className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <div className='flex items-start gap-3'>
            {selectedGame.thumbnail && (
              <div className='relative w-16 h-16 rounded overflow-hidden'>
                <Image
                  src={selectedGame.thumbnail}
                  alt={selectedGame.name}
                  fill
                  className='object-cover'
                  sizes='64px'
                  priority
                />
              </div>
            )}
            <div className='flex-1 min-w-0'>
              <h4 className='font-medium text-gray-900 truncate'>
                {formatGameTitle(selectedGame)}
              </h4>
              <p className='text-sm text-gray-600'>
                BGG ID: {selectedGame.id}
              </p>
              {selectedGame.minPlayers && (
                <p className='text-sm text-gray-600'>
                  {selectedGame.minPlayers}-{selectedGame.maxPlayers} players • {selectedGame.playingTime} min
                </p>
              )}
            </div>
            <button
              type='button'
              onClick={handleClearSelection}
              className='text-gray-400 hover:text-red-500 transition-colors'
              title='Remove selection'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        // Show search input
        <div className='relative'>
          <input
            id='bgg-search-input'
            data-testid="bgg-search-input"
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search for a board game...'
            aria-describedby={error ? 'bgg-error' : 'bgg-help'}
            aria-invalid={error ? 'true' : 'false'}
            aria-autocomplete='list'
            aria-expanded={isOpen}
            role='combobox'
            className={cn(
              'w-full px-3 py-2 border rounded-md transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              'hover:border-gray-400',
              error 
                ? 'border-red-300 bg-red-50 text-red-900' 
                : 'border-gray-300 bg-white text-gray-900'
            )}
            onFocus={() => {
              if (searchResults.length > 0) setIsOpen(true)
            }}
          />
          <div id='bgg-help' className='mt-1 text-xs text-gray-600'>
            Type at least 2 characters to search BoardGameGeek database
          </div>
          
          {loading && (
            <div className='absolute right-3 top-2.5'>
              <Spinner size="sm" />
            </div>
          )}

          {/* Search Results Dropdown */}
          {isOpen && searchResults.length > 0 && (
            <>
              <div
                className='fixed inset-0 z-10'
                onClick={() => setIsOpen(false)}
              />
              <div data-testid="bgg-search-results" className='absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-auto'>
                <div className='py-1'>
                  {searchResults.map((game) => {
                    // Determine match type for visual indicator
                    const normalizedQuery = query.toLowerCase().trim()
                    const normalizedName = game.name.toLowerCase()
                    
                    let matchBadgeColor = 'bg-gray-100 text-gray-800'
                    if (normalizedName === normalizedQuery) {
                      matchBadgeColor = 'bg-green-100 text-green-800'
                    } else if (normalizedName.startsWith(normalizedQuery)) {
                      matchBadgeColor = 'bg-blue-100 text-blue-800'
                    } else if (normalizedName.includes(normalizedQuery)) {
                      matchBadgeColor = 'bg-yellow-100 text-yellow-800'
                    }

                    return (
                      <button
                        key={game.id}
                        data-testid="bgg-game-option"
                        type='button'
                        onClick={() => handleGameSelect(game)}
                        className='w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors'
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex-1 min-w-0'>
                            <p className='font-medium text-gray-900 truncate'>
                              {formatGameTitle(game)}
                            </p>
                            <p className='text-sm text-gray-600'>
                              BGG ID: {game.id} • {game.type.replace('boardgame', 'Board Game')}
                            </p>
                          </div>
                          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${matchBadgeColor}`}>
                            {normalizedName === normalizedQuery ? 'Exact' : 
                             normalizedName.startsWith(normalizedQuery) ? 'Match' : 'Related'}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Error messages */}
      {(error || searchError) && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
          <div className='flex items-start'>
            <div className='flex-shrink-0'>
              <svg className='h-4 w-4 text-red-400' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
              </svg>
            </div>
            <div className='ml-2 flex-1'>
              <p className='text-sm text-red-800'>
                {error || searchError}
              </p>
              {searchError && retryCount > 0 && (
                <div className='mt-2'>
                  <RetryButton 
                    onRetry={handleRetry}
                    loading={loading}
                    className='text-xs px-3 py-1'
                  >
                    Retry Search
                  </RetryButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Help text */}
      {!selectedGame && !error && !searchError && (
        <p className='text-sm text-gray-500'>
          Start typing to search BoardGameGeek for your game
        </p>
      )}
    </div>
  )
}



