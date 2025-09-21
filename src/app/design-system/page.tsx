import { ButtonAndBadgeExamples } from '@/components/examples/button-examples'
import { CardModalInputExamples } from '@/components/examples/card-modal-examples'
import { TypographyExamples } from '@/components/examples/typography-examples'
import { BorderExamples } from '@/components/examples/border-examples'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Design System - Components',
  description: 'Second Turn Games design system showcase with buttons, badges, and utility classes',
  robots: {
    index: false,
    follow: false,
  },
}

/**
 * Design System Showcase Page
 * Demonstrates the complete component library and utility classes
 */
export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-surface-background">
      <div className="bg-surface border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-text-primary mb-2">
              Second Turn Games Design System
            </h1>
            <p className="text-text-secondary text-lg">
              Complete component library with brand colors and utility classes
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-16">
          <ButtonAndBadgeExamples />
          <CardModalInputExamples />
          <TypographyExamples />
          <BorderExamples />
        </div>
      </div>

      {/* Quick Reference Footer */}
      <footer className="bg-surface border-t border-border-light mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-text-muted text-sm">
            <p>
              Design System Implementation • 
              <span className="mx-2">•</span>
              <a 
                href="/TAILWIND_COLOR_SYSTEM.md" 
                className="text-vibrantOrange hover:text-brand-orange"
                target="_blank"
                rel="noopener noreferrer"
              >
                Tailwind Color Guide
              </a>
              <span className="mx-2">•</span>
              <a 
                href="/CSS_VARIABLES_GUIDE.md" 
                className="text-vibrantOrange hover:text-brand-orange"
                target="_blank"
                rel="noopener noreferrer"
              >
                CSS Variables Guide
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
