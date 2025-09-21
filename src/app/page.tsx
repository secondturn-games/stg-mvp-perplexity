import Link from 'next/link'

export default function Home() {
  return (
    <div className='space-y-12'>
      <section className='text-center px-4'>
        <h1 className='text-3xl font-bold text-gray-900 sm:text-4xl lg:text-6xl leading-tight'>
          Welcome to Second Turn Games
        </h1>
        <p className='mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-gray-600'>
          Latvia&apos;s premier marketplace for board game enthusiasts. Buy, sell, and discover amazing board games from fellow gamers across the country.
        </p>
      </section>

      <section className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
        <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
          <h3 className='mb-2 text-lg font-semibold text-gray-900'>
            Strategic Gameplay
          </h3>
          <p className='text-gray-600'>
            Every move matters in our carefully designed games that emphasize
            strategy over luck.
          </p>
        </div>

        <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
          <h3 className='mb-2 text-lg font-semibold text-gray-900'>
            Turn-Based Fun
          </h3>
          <p className='text-gray-600'>
            Take your time to plan the perfect move in games designed for
            thoughtful play.
          </p>
        </div>

        <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
          <h3 className='mb-2 text-lg font-semibold text-gray-900'>
            Community Focused
          </h3>
          <p className='text-gray-600'>
            Connect with fellow strategists and build lasting gaming
            relationships.
          </p>
        </div>
      </section>

      <section className='text-center'>
        <div className='rounded-lg bg-blue-50 p-8'>
          <h2 className='mb-4 text-2xl font-bold text-gray-900'>
            Ready to Start Trading?
          </h2>
          <p className='mb-6 text-gray-600'>
            Join our community of board game enthusiasts and discover your next favorite game or find a new home for your collection.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center max-w-sm sm:max-w-none mx-auto'>
            <Link
              href='/listings'
              className='rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 text-center'
            >
              Browse Games
            </Link>
            <Link
              href='/listings/create'
              className='rounded-lg bg-white px-6 py-3 font-medium text-blue-600 border border-blue-600 transition-colors hover:bg-blue-50 text-center'
            >
              Sell Your Games
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
