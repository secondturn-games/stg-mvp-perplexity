import { BggSearchTest } from '@/components/bgg/bgg-search-test'

export default function BggTestPage() {
  return (
    <div className='py-8'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>
          BoardGameGeek API Integration Test
        </h1>
        <p className='mt-2 text-gray-600'>
          Test the BGG API integration by searching for board games
        </p>
      </div>
      
      <BggSearchTest />
    </div>
  )
}



