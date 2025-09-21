'use client'

import { useState } from 'react'
import {
  Heading,
  Paragraph,
  Text,
  Link,
  Label,
  Price,
  Timestamp,
  StatusText
} from '@/components/ui/typography'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter
} from '@/components/ui/card'
import {
  PrimaryButton,
  SecondaryButton
} from '@/components/ui/button'
import {
  SuccessBadge,
  WarningBadge,
  InfoBadge
} from '@/components/ui/badge'
import { 
  Star,
  MapPin,
  User,
  Calendar,
  Package,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
  Clock
} from 'lucide-react'

/**
 * Typography Examples
 * Comprehensive showcase of text color utilities and typography components
 */
export function TypographyExamples() {
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark'>('light')

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="text-center">
        <Heading level={1} variant="brand" className="mb-4">
          Typography & Text Colors
        </Heading>
        <Paragraph variant="secondary" size="lg">
          Comprehensive text utilities using brand colors with consistent hierarchy
        </Paragraph>
      </div>

      {/* Basic Text Colors */}
      <section className="space-y-6">
        <Heading level={2} variant="primary">Text Color Utilities</Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Primary Text Colors */}
          <Card>
            <CardHeader>
              <Heading level={3} variant="primary">Primary Colors</Heading>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="text-primary">Primary text (#1B1B1B)</div>
              <div className="text-secondary">Secondary text (#6B7280)</div>
              <div className="text-muted">Muted text (#9CA3AF)</div>
              
              <div className="border-t border-border-light pt-3 mt-4">
                <Text variant="primary" className="block mb-2">With hover effects:</Text>
                <div className="text-primary-hover">Primary hover → Dark Green</div>
                <div className="text-secondary-hover">Secondary hover → Primary</div>
                <div className="text-muted-hover">Muted hover → Secondary</div>
              </div>
            </CardBody>
          </Card>

          {/* Brand Colors */}
          <Card>
            <CardHeader>
              <Heading level={3} variant="primary">Brand Colors</Heading>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="text-brand-primary">Brand Primary (Dark Green)</div>
              <div className="text-brand-accent">Brand Accent (Vibrant Orange)</div>
              <div className="text-brand-success">Success (Teal)</div>
              <div className="text-brand-warning">Warning (Warm Yellow)</div>
              <div className="text-brand-error">Error (Coral)</div>
              <div className="text-brand-info">Info (Lavender)</div>
            </CardBody>
          </Card>

          {/* Interactive Colors */}
          <Card>
            <CardHeader>
              <Heading level={3} variant="primary">Interactive Colors</Heading>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="text-interactive">Interactive text</div>
              <div className="text-interactive-secondary">Interactive secondary</div>
              <div className="text-link">Standard link</div>
              <div className="text-link-subtle">Subtle link</div>
              <div className="text-focus tabindex-0">Focus state (tab here)</div>
              <div className="text-active">Active state</div>
              <div className="text-disabled">Disabled state</div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Typography Components */}
      <section className="space-y-6">
        <Heading level={2} variant="primary">Typography Components</Heading>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Headings */}
          <Card>
            <CardHeader>
              <Heading level={3} variant="primary">Heading Components</Heading>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-3">
                <Heading level={1} variant="primary">Heading 1 - Primary</Heading>
                <Heading level={2} variant="secondary">Heading 2 - Secondary</Heading>
                <Heading level={3} variant="brand">Heading 3 - Brand</Heading>
                <Heading level={4} variant="accent">Heading 4 - Accent</Heading>
                <Heading level={5} variant="primary">Heading 5 - Primary</Heading>
                <Heading level={6} variant="muted">Heading 6 - Muted</Heading>
              </div>
              
              <div className="border-t border-border-light pt-4">
                <Text variant="secondary" className="block mb-3">Custom sizes:</Text>
                <Heading level={3} size="sm" variant="primary" className="mb-2">Small H3</Heading>
                <Heading level={4} size="xl" variant="brand" className="mb-2">Large H4</Heading>
                <Heading level={2} size="4xl" variant="accent">XL H2</Heading>
              </div>
            </CardBody>
          </Card>

          {/* Paragraphs */}
          <Card>
            <CardHeader>
              <Heading level={3} variant="primary">Paragraph Components</Heading>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-3">
                <Paragraph variant="primary">
                  Primary paragraph text with standard styling and good readability for main content.
                </Paragraph>
                
                <Paragraph variant="secondary">
                  Secondary paragraph text, perfect for supporting information and descriptions.
                </Paragraph>
                
                <Paragraph variant="muted">
                  Muted paragraph text for less important information, captions, and metadata.
                </Paragraph>
                
                <Paragraph variant="small">
                  Small paragraph text for fine print, terms, and compact layouts.
                </Paragraph>
                
                <Paragraph variant="caption">
                  Caption text for image descriptions and minimal text elements.
                </Paragraph>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Semantic Text Classes */}
      <section className="space-y-6">
        <Heading level={2} variant="primary">Semantic Text Classes</Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Board Game Listing Example */}
          <Card>
            <CardHeader>
              <Heading level={3} variant="primary">Game Listing</Heading>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="text-game-title">Catan: Cities & Knights</div>
              <div className="text-game-subtitle">Strategy • 3-4 Players • 90 min</div>
              <div className="text-price-large">€45.00</div>
              <div className="text-condition">Like New</div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4 text-textMuted" />
                  <span className="text-seller">John Doe</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-textMuted" />
                  <span className="text-location">Riga</span>
                </div>
              </div>
              
              <div className="text-timestamp">Posted 2 days ago</div>
            </CardBody>
          </Card>

          {/* Status Examples */}
          <Card>
            <CardHeader>
              <Heading level={3} variant="primary">Status Indicators</Heading>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-brand-success" />
                  <StatusText status="success">Order Completed</StatusText>
                </div>
                
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-brand-warning" />
                  <StatusText status="warning">Payment Pending</StatusText>
                </div>
                
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-brand-error" />
                  <StatusText status="error">Listing Expired</StatusText>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4 text-brand-info" />
                  <StatusText status="info">New Message</StatusText>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-textSecondary" />
                  <StatusText status="neutral">In Review</StatusText>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Links and Interactions */}
          <Card>
            <CardHeader>
              <Heading level={3} variant="primary">Links & Interactions</Heading>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Link href="/listings" variant="default">
                    Standard Link
                  </Link>
                </div>
                
                <div>
                  <Link href="/about" variant="subtle">
                    Subtle Link
                  </Link>
                </div>
                
                <div>
                  <Link href="/contact" variant="brand">
                    Brand Link
                  </Link>
                </div>
                
                <div>
                  <Link href="https://boardgamegeek.com" variant="default" external>
                    External Link
                  </Link>
                </div>
              </div>
              
              <div className="border-t border-border-light pt-3">
                <Text variant="secondary" className="block mb-2">Interactive text:</Text>
                <div className="space-y-2">
                  <Text variant="interactive" as="button" className="block">
                    Clickable text
                  </Text>
                  <Text variant="interactive" hover as="span" className="block">
                    Hoverable text
                  </Text>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Typography in Context */}
      <section className="space-y-6">
        <Heading level={2} variant="primary">Typography in Context</Heading>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Article Layout */}
          <Card>
            <CardHeader>
              <Heading level={3} variant="brand">Article Layout</Heading>
            </CardHeader>
            <CardBody className="space-y-4">
              <article className="space-y-4">
                <header>
                  <Heading level={1} size="2xl" variant="primary" className="mb-2">
                    The Rise of Modern Board Games
                  </Heading>
                  <div className="flex items-center space-x-4 text-secondary text-sm">
                    <span>By Game Expert</span>
                    <Timestamp date="2024-01-15" format="absolute" />
                    <span>5 min read</span>
                  </div>
                </header>
                
                <Paragraph variant="primary" size="lg" className="lead">
                  Board games have experienced a renaissance in recent years, with innovative mechanics and themes capturing players worldwide.
                </Paragraph>
                
                <Paragraph variant="primary">
                  The modern board game movement began in the 1990s with games like Settlers of Catan, which introduced Euro-style mechanics focusing on strategy over luck.
                </Paragraph>
                
                <Paragraph variant="secondary">
                  Today's designers continue to push boundaries, creating experiences that rival digital entertainment while maintaining the social aspect that makes board games special.
                </Paragraph>
                
                <div className="flex items-center space-x-4 pt-4 border-t border-border-light">
                  <SuccessBadge>Featured</SuccessBadge>
                  <Link href="#read-more" variant="subtle">Read More</Link>
                </div>
              </article>
            </CardBody>
          </Card>

          {/* User Profile */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Heading level={3} variant="primary">User Profile</Heading>
                <WarningBadge>Verified Seller</WarningBadge>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-darkGreen/10 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-darkGreen" />
                </div>
                <div className="flex-1 space-y-2">
                  <Heading level={4} variant="primary">John Doe</Heading>
                  <Text variant="secondary">Board Game Enthusiast</Text>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-textMuted" />
                    <Text variant="muted" size="sm">Riga, Latvia</Text>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-border-light">
                <div className="text-center">
                  <Text variant="primary" weight="bold" size="lg" className="block">24</Text>
                  <Text variant="muted" size="sm">Listings</Text>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Text variant="primary" weight="bold" size="lg">4.8</Text>
                    <Star className="w-4 h-4 text-warmYellow fill-current" />
                  </div>
                  <Text variant="muted" size="sm">Rating</Text>
                </div>
                <div className="text-center">
                  <Text variant="primary" weight="bold" size="lg" className="block">156</Text>
                  <Text variant="muted" size="sm">Sales</Text>
                </div>
              </div>
              
              <Paragraph variant="secondary" size="sm">
                Passionate collector with over 10 years of experience. Specializes in strategy games and maintains excellent condition standards.
              </Paragraph>
              
              <div className="flex items-center space-x-2">
                <Text variant="muted" size="sm">Member since</Text>
                <Timestamp date="2020-03-15" format="short" />
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Form Typography */}
      <section className="space-y-6">
        <Heading level={2} variant="primary">Form Typography</Heading>
        
        <Card>
          <CardHeader>
            <Heading level={3} variant="primary">Contact Form Example</Heading>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" required>Your Name</Label>
                  <Text variant="muted" size="xs" className="block mt-1">
                    This will be shared with the seller
                  </Text>
                </div>
                
                <div>
                  <Label htmlFor="email" required variant="primary">Email Address</Label>
                  <Text variant="muted" size="xs" className="block mt-1">
                    We'll use this to send you updates
                  </Text>
                </div>
                
                <div>
                  <Label htmlFor="message" required>Message</Label>
                  <Text variant="success" size="xs" className="block mt-1">
                    ✓ Valid message format
                  </Text>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Text variant="primary" weight="medium" className="block">Validation States:</Text>
                  <Text variant="success" size="sm" className="block">✓ Email format is correct</Text>
                  <Text variant="warning" size="sm" className="block">⚠ Message may be too short</Text>
                  <Text variant="error" size="sm" className="block">✗ Name is required</Text>
                  <Text variant="info" size="sm" className="block">ℹ Additional information available</Text>
                </div>
                
                <div className="space-y-2">
                  <Text variant="primary" weight="medium" className="block">Helper Text:</Text>
                  <Text variant="muted" size="xs" className="block">Use clear, helpful messages</Text>
                  <Text variant="muted" size="xs" className="block">Keep instructions concise</Text>
                  <Text variant="muted" size="xs" className="block">Provide context when needed</Text>
                </div>
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <div className="flex justify-between items-center w-full">
              <Text variant="muted" size="xs">
                All fields marked with * are required
              </Text>
              <div className="space-x-3">
                <SecondaryButton>Cancel</SecondaryButton>
                <PrimaryButton>Send Message</PrimaryButton>
              </div>
            </div>
          </CardFooter>
        </Card>
      </section>

      {/* Direct CSS Usage */}
      <section className="space-y-6">
        <Heading level={2} variant="primary">Direct CSS Class Usage</Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Text Hierarchy */}
          <Card>
            <CardHeader>
              <h3 className="text-heading-primary">Text Hierarchy</h3>
            </CardHeader>
            <CardBody className="space-y-2">
              <div className="text-heading-primary">Heading Primary</div>
              <div className="text-heading-secondary">Heading Secondary</div>
              <div className="text-heading-tertiary">Heading Tertiary</div>
              <div className="text-subheading">Subheading</div>
              <div className="text-body-primary">Body Primary</div>
              <div className="text-body-secondary">Body Secondary</div>
              <div className="text-body-small">Body Small</div>
              <div className="text-caption">Caption Text</div>
              <div className="text-caption-small">Caption Small</div>
            </CardBody>
          </Card>

          {/* Semantic Classes */}
          <Card>
            <CardHeader>
              <h3 className="text-heading-primary">Semantic Classes</h3>
            </CardHeader>
            <CardBody className="space-y-2">
              <div className="text-price">€25.00</div>
              <div className="text-price-large">€125.00</div>
              <div className="text-seller">John Doe</div>
              <div className="text-location">Riga, Latvia</div>
              <div className="text-timestamp">2 hours ago</div>
              <div className="text-condition">Like New</div>
              <div className="text-game-title">Wingspan</div>
              <div className="text-game-subtitle">Strategy Game</div>
            </CardBody>
          </Card>

          {/* State Classes */}
          <Card>
            <CardHeader>
              <h3 className="text-heading-primary">State Classes</h3>
            </CardHeader>
            <CardBody className="space-y-2">
              <div className="text-success">Success message</div>
              <div className="text-warning">Warning message</div>
              <div className="text-error">Error message</div>
              <div className="text-info">Info message</div>
              <div className="text-focus tabindex-0">Focus state</div>
              <div className="text-active">Active state</div>
              <div className="text-disabled">Disabled state</div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* CSS Classes Reference */}
      <section className="space-y-6">
        <Heading level={2} variant="primary">CSS Classes Reference</Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Basic Colors */}
          <Card>
            <CardHeader>
              <Heading level={4} variant="primary">Basic Colors</Heading>
            </CardHeader>
            <CardBody>
              <div className="space-y-1 text-xs font-mono">
                <div><code>.text-primary</code></div>
                <div><code>.text-secondary</code></div>
                <div><code>.text-muted</code></div>
                <div><code>.text-primary-hover</code></div>
                <div><code>.text-secondary-hover</code></div>
                <div><code>.text-muted-hover</code></div>
              </div>
            </CardBody>
          </Card>

          {/* Interactive */}
          <Card>
            <CardHeader>
              <Heading level={4} variant="primary">Interactive</Heading>
            </CardHeader>
            <CardBody>
              <div className="space-y-1 text-xs font-mono">
                <div><code>.text-interactive</code></div>
                <div><code>.text-interactive-secondary</code></div>
                <div><code>.text-link</code></div>
                <div><code>.text-link-subtle</code></div>
                <div><code>.text-focus</code></div>
                <div><code>.text-active</code></div>
              </div>
            </CardBody>
          </Card>

          {/* Brand Colors */}
          <Card>
            <CardHeader>
              <Heading level={4} variant="primary">Brand Colors</Heading>
            </CardHeader>
            <CardBody>
              <div className="space-y-1 text-xs font-mono">
                <div><code>.text-brand-primary</code></div>
                <div><code>.text-brand-accent</code></div>
                <div><code>.text-brand-success</code></div>
                <div><code>.text-brand-warning</code></div>
                <div><code>.text-brand-error</code></div>
                <div><code>.text-brand-info</code></div>
              </div>
            </CardBody>
          </Card>

          {/* Semantic */}
          <Card>
            <CardHeader>
              <Heading level={4} variant="primary">Semantic</Heading>
            </CardHeader>
            <CardBody>
              <div className="space-y-1 text-xs font-mono">
                <div><code>.text-price</code></div>
                <div><code>.text-seller</code></div>
                <div><code>.text-location</code></div>
                <div><code>.text-timestamp</code></div>
                <div><code>.text-game-title</code></div>
                <div><code>.text-condition</code></div>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Quick Copy Examples */}
      <section className="space-y-6">
        <Heading level={2} variant="primary">Quick Copy Examples</Heading>
        
        <Card>
          <CardHeader>
            <Heading level={3} variant="primary">Ready-to-Use Code</Heading>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Text variant="secondary" weight="medium" className="block">HTML with Classes:</Text>
                <div className="bg-surface-100 p-4 rounded-lg text-xs font-mono space-y-1">
                  <div>{`<h1 class="text-heading-primary">Page Title</h1>`}</div>
                  <div>{`<p class="text-body-primary">Main content</p>`}</div>
                  <div>{`<p class="text-body-secondary">Supporting text</p>`}</div>
                  <div>{`<span class="text-price-large">€45.00</span>`}</div>
                  <div>{`<a href="#" class="text-link">Learn more</a>`}</div>
                  <div>{`<span class="text-timestamp">2 days ago</span>`}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Text variant="secondary" weight="medium" className="block">React Components:</Text>
                <div className="bg-surface-100 p-4 rounded-lg text-xs font-mono space-y-1">
                  <div>{`<Heading level={1} variant="primary">Title</Heading>`}</div>
                  <div>{`<Paragraph variant="primary">Content</Paragraph>`}</div>
                  <div>{`<Text variant="secondary">Supporting text</Text>`}</div>
                  <div>{`<Price amount="45.00" size="lg" />`}</div>
                  <div>{`<Link href="#" variant="default">Link</Link>`}</div>
                  <div>{`<Timestamp date="2024-01-15" />`}</div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  )
}
