import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Navigation } from '@/components/navigation'
import { ErrorTrackingProvider } from '@/components/providers/error-tracking-provider'
import { GlobalErrorBoundary } from '@/components/error-boundaries/global-error-boundary'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | Second Turn Games',
    default: 'Second Turn Games - Latvia\'s Premier Board Game Marketplace'
  },
  description: 'Buy, sell, and discover amazing board games in Latvia. Find strategic board games, connect with fellow gamers, and trade your collection on Latvia\'s premier board game marketplace.',
  keywords: ['board games', 'Latvia', 'marketplace', 'buy', 'sell', 'trade', 'strategic games', 'tabletop', 'BoardGameGeek'],
  authors: [{ name: 'Second Turn Games' }],
  creator: 'Second Turn Games',
  publisher: 'Second Turn Games',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://secondturngames.lv',
    siteName: 'Second Turn Games',
    title: 'Second Turn Games - Latvia\'s Premier Board Game Marketplace',
    description: 'Buy, sell, and discover amazing board games in Latvia. Find strategic board games, connect with fellow gamers, and trade your collection.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Second Turn Games - Board Game Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Second Turn Games - Latvia\'s Premier Board Game Marketplace',
    description: 'Buy, sell, and discover amazing board games in Latvia.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gray-50 antialiased`}
      >
        <GlobalErrorBoundary>
          <ErrorTrackingProvider>
            <Navigation />
            <main className='mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8'>
              {children}
            </main>
          </ErrorTrackingProvider>
        </GlobalErrorBoundary>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
