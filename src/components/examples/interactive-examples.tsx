'use client'

import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter
} from '@/components/ui/card'
import {
  Heading,
  Paragraph,
  Text
} from '@/components/ui/typography'
import {
  PrimaryButton,
  SecondaryButton
} from '@/components/ui/button'
import {
  SuccessBadge,
  WarningBadge,
  ErrorBadge,
  InfoBadge
} from '@/components/ui/badge'
import { 
  Play,
  Pause,
  Heart,
  Star,
  Share2,
  Bookmark,
  Download,
  ExternalLink,
  ShoppingCart,
  Eye,
  MessageCircle,
  ThumbsUp,
  MoreHorizontal,
  Settings,
  Filter,
  Search,
  Bell,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Zap,
  Sparkles,
  TrendingUp,
  Award,
  Target,
  Layers,
  Globe,
  Shield
} from 'lucide-react'

/**
 * Interactive Color Examples
 * Comprehensive showcase of responsive and hover/focus states with transition effects
 */
export function InteractiveExamples() {
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set())
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState('buttons')
  const [playingStates, setPlayingStates] = useState<Set<string>>(new Set())

  const toggleLike = (id: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const toggleBookmark = (id: string) => {
    setBookmarkedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const togglePlay = (id: string) => {
    setPlayingStates(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="text-center">
        <Heading level={1} variant="brand" className="mb-4">
          Interactive Color Utilities
        </Heading>
        <Paragraph variant="secondary" size="lg">
          Responsive and hover/focus states with smooth transition effects
        </Paragraph>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { id: 'buttons', label: 'Interactive Buttons' },
          { id: 'links', label: 'Smart Links' },
          { id: 'cards', label: 'Dynamic Cards' },
          { id: 'forms', label: 'Form Elements' },
          { id: 'states', label: 'State Examples' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
              ${activeTab === tab.id
                ? 'bg-interactive-accent text-white shadow-md'
                : 'bg-interactive-surface text-textPrimary hover:bg-surface-50'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Interactive Buttons Section */}
      {activeTab === 'buttons' && (
        <section className="space-y-8">
          <Heading level={2} variant="primary">Interactive Button Examples</Heading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Primary Interactive Buttons */}
            <Card>
              <CardHeader>
                <Heading level={3} variant="primary">Primary Buttons</Heading>
                <Paragraph variant="secondary" size="sm">
                  Complete interactive states with smooth transitions
                </Paragraph>
              </CardHeader>
              <CardBody className="space-y-4">
                <button className="interactive-button w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Interactive Button
                </button>
                
                <button className="bg-interactive-primary text-white w-full px-4 py-2 rounded-lg">
                  <Star className="w-4 h-4 mr-2" />
                  Primary Interactive
                </button>
                
                <button className="bg-interactive-success text-white w-full px-4 py-2 rounded-lg">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Success Action
                </button>
                
                <button className="bg-interactive-warning text-white w-full px-4 py-2 rounded-lg">
                  <Bell className="w-4 h-4 mr-2" />
                  Warning Action
                </button>
                
                <button className="bg-interactive-error text-white w-full px-4 py-2 rounded-lg">
                  <Heart className="w-4 h-4 mr-2" />
                  Error Action
                </button>
              </CardBody>
            </Card>

            {/* Gradient Buttons */}
            <Card>
              <CardHeader>
                <Heading level={3} variant="primary">Gradient Buttons</Heading>
                <Paragraph variant="secondary" size="sm">
                  Animated gradients with hover effects
                </Paragraph>
              </CardHeader>
              <CardBody className="space-y-4">
                <button className="gradient-primary text-white w-full px-4 py-3 rounded-lg font-medium">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Primary Gradient
                </button>
                
                <button className="gradient-accent text-white w-full px-4 py-3 rounded-lg font-medium">
                  <Zap className="w-4 h-4 mr-2" />
                  Accent Gradient
                </button>
                
                <button className="gradient-success text-white w-full px-4 py-3 rounded-lg font-medium">
                  <Award className="w-4 h-4 mr-2" />
                  Success Gradient
                </button>
                
                <button className="gradient-surface text-textPrimary w-full px-4 py-3 rounded-lg font-medium border border-borderLight">
                  <Layers className="w-4 h-4 mr-2" />
                  Surface Gradient
                </button>
              </CardBody>
            </Card>

            {/* Hover Effect Buttons */}
            <Card>
              <CardHeader>
                <Heading level={3} variant="primary">Hover Effects</Heading>
                <Paragraph variant="secondary" size="sm">
                  Various hover animations and transformations
                </Paragraph>
              </CardHeader>
              <CardBody className="space-y-4">
                <button className="hover-lift w-full px-4 py-3 rounded-lg border border-borderPrimary bg-surface text-textPrimary">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Lift Effect
                </button>
                
                <button className="hover-glow w-full px-4 py-3 rounded-lg border border-borderLight bg-surface text-textPrimary">
                  <Globe className="w-4 h-4 mr-2" />
                  Glow Effect
                </button>
                
                <button className="hover-scale w-full px-4 py-3 rounded-lg border border-borderPrimary bg-surface text-textPrimary">
                  <Target className="w-4 h-4 mr-2" />
                  Scale Effect
                </button>
                
                <button className="hover-fade w-full px-4 py-3 rounded-lg bg-vibrantOrange text-white">
                  <Settings className="w-4 h-4 mr-2" />
                  Fade Effect
                </button>
              </CardBody>
            </Card>
          </div>

          {/* Action Button Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { id: 'play-1', icon: Play, label: 'Play', action: () => togglePlay('play-1') },
              { id: 'like-1', icon: Heart, label: 'Like', action: () => toggleLike('like-1') },
              { id: 'bookmark-1', icon: Bookmark, label: 'Save', action: () => toggleBookmark('bookmark-1') },
              { id: 'share-1', icon: Share2, label: 'Share', action: () => {} },
              { id: 'download-1', icon: Download, label: 'Download', action: () => {} },
              { id: 'more-1', icon: MoreHorizontal, label: 'More', action: () => {} }
            ].map(({ id, icon: Icon, label, action }) => (
              <button
                key={id}
                onClick={action}
                className={`
                  interactive-card p-4 flex flex-col items-center space-y-2 text-center
                  ${likedItems.has(id) || bookmarkedItems.has(id) || playingStates.has(id)
                    ? 'bg-vibrantOrange/10 border-vibrantOrange text-vibrantOrange'
                    : 'text-textSecondary'
                  }
                `}
              >
                <Icon className={`w-6 h-6 ${playingStates.has(id) ? 'animate-pulse' : ''}`} />
                <Text variant="secondary" size="xs">{label}</Text>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Smart Links Section */}
      {activeTab === 'links' && (
        <section className="space-y-8">
          <Heading level={2} variant="primary">Smart Link Examples</Heading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <Heading level={3} variant="primary">Interactive Links</Heading>
                <Paragraph variant="secondary" size="sm">
                  Links with smooth color transitions and hover effects
                </Paragraph>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="space-y-3">
                  <a href="#" className="interactive-link block">
                    Standard Interactive Link
                  </a>
                  
                  <a href="#" className="text-interactive-primary block">
                    Primary Text Interactive
                  </a>
                  
                  <a href="#" className="text-interactive-accent block">
                    Accent Text Interactive
                  </a>
                  
                  <a href="#" className="text-interactive-brand block">
                    Brand Text Interactive
                  </a>
                  
                  <a href="#" className="text-interactive-muted block">
                    Muted Text Interactive
                  </a>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Heading level={3} variant="primary">Link with Icons</Heading>
                <Paragraph variant="secondary" size="sm">
                  Enhanced links with icons and external indicators
                </Paragraph>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="space-y-3">
                  <a href="#" className="interactive-link flex items-center">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    External Link
                  </a>
                  
                  <a href="#" className="text-interactive-accent flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Download Resource
                  </a>
                  
                  <a href="#" className="text-interactive-primary flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </a>
                  
                  <a href="#" className="text-interactive-brand flex items-center">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share This Page
                  </a>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Navigation Link Examples */}
          <Card>
            <CardHeader>
              <Heading level={3} variant="primary">Navigation Links</Heading>
              <Paragraph variant="secondary" size="sm">
                Navigation-style links with active states
              </Paragraph>
            </CardHeader>
            <CardBody>
              <nav className="flex flex-wrap gap-6">
                {[
                  { href: '#home', label: 'Home', active: true },
                  { href: '#games', label: 'Board Games', active: false },
                  { href: '#marketplace', label: 'Marketplace', active: false },
                  { href: '#community', label: 'Community', active: false },
                  { href: '#about', label: 'About Us', active: false }
                ].map(({ href, label, active }) => (
                  <a
                    key={href}
                    href={href}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
                      ${active
                        ? 'text-vibrantOrange bg-vibrantOrange/10 border-b-2 border-vibrantOrange'
                        : 'text-interactive-muted hover:text-vibrantOrange hover:bg-vibrantOrange/5'
                      }
                    `}
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </CardBody>
          </Card>
        </section>
      )}

      {/* Dynamic Cards Section */}
      {activeTab === 'cards' && (
        <section className="space-y-8">
          <Heading level={2} variant="primary">Dynamic Card Examples</Heading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Interactive Card Examples */}
            {[
              {
                id: 'game-1',
                title: 'Catan: Cities & Knights',
                price: '€45.00',
                condition: 'Like New',
                seller: 'John Doe',
                city: 'Riga',
                likes: 12,
                views: 156
              },
              {
                id: 'game-2',
                title: 'Wingspan European Expansion',
                price: '€35.00',
                condition: 'Very Good',
                seller: 'Jane Smith',
                city: 'Daugavpils',
                likes: 8,
                views: 89
              },
              {
                id: 'game-3',
                title: 'Ticket to Ride: Europe',
                price: '€28.00',
                condition: 'Good',
                seller: 'Board Game Fan',
                city: 'Liepāja',
                likes: 15,
                views: 203
              }
            ].map((game) => (
              <div key={game.id} className="interactive-card">
                {/* Image Placeholder */}
                <div className="aspect-[4/3] bg-gradient-surface rounded-t-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-vibrantOrange/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Layers className="w-8 h-8 text-vibrantOrange" />
                    </div>
                    <Text variant="muted" size="sm">Board Game Image</Text>
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Heading level={4} variant="primary" className="flex-1 mr-2 text-base">
                      {game.title}
                    </Heading>
                    <SuccessBadge>{game.condition}</SuccessBadge>
                  </div>
                  
                  <div className="text-2xl font-bold text-textPrimary mb-3">
                    {game.price}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-textSecondary mb-3">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{game.seller}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{game.city}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-textMuted">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{game.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart 
                          className={`w-4 h-4 cursor-pointer transition-colors duration-200 ${
                            likedItems.has(game.id) ? 'text-coral fill-coral' : 'text-textMuted hover:text-coral'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleLike(game.id)
                          }}
                        />
                        <span>{game.likes + (likedItems.has(game.id) ? 1 : 0)}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleBookmark(game.id)
                      }}
                      className={`
                        p-2 rounded-lg transition-all duration-200 ease-in-out
                        ${bookmarkedItems.has(game.id)
                          ? 'text-vibrantOrange bg-vibrantOrange/10'
                          : 'text-textMuted hover:text-vibrantOrange hover:bg-vibrantOrange/5'
                        }
                      `}
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarkedItems.has(game.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="hover-lift p-6 rounded-lg border border-borderLight bg-surface">
              <div className="text-center">
                <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-teal" />
                </div>
                <Heading level={4} variant="primary" className="mb-2">
                  Verified Games
                </Heading>
                <Paragraph variant="secondary" size="sm">
                  All games verified through BoardGameGeek database
                </Paragraph>
              </div>
            </div>

            <div className="hover-glow p-6 rounded-lg border border-borderLight bg-surface">
              <div className="text-center">
                <div className="w-12 h-12 bg-vibrantOrange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-vibrantOrange" />
                </div>
                <Heading level={4} variant="primary" className="mb-2">
                  Secure Trading
                </Heading>
                <Paragraph variant="secondary" size="sm">
                  Safe and secure communication between buyers and sellers
                </Paragraph>
              </div>
            </div>

            <div className="hover-scale p-6 rounded-lg border border-borderLight bg-surface">
              <div className="text-center">
                <div className="w-12 h-12 bg-darkGreen/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-darkGreen" />
                </div>
                <Heading level={4} variant="primary" className="mb-2">
                  Growing Community
                </Heading>
                <Paragraph variant="secondary" size="sm">
                  Join thousands of board game enthusiasts in Latvia
                </Paragraph>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Form Elements Section */}
      {activeTab === 'forms' && (
        <section className="space-y-8">
          <Heading level={2} variant="primary">Interactive Form Elements</Heading>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <Heading level={3} variant="primary">Interactive Inputs</Heading>
                <Paragraph variant="secondary" size="sm">
                  Form elements with smooth transitions and focus states
                </Paragraph>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-textPrimary mb-1">
                    Search Games
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-textMuted" />
                    <input
                      className="interactive-input w-full pl-10"
                      placeholder="Search board games..."
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-textPrimary mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-textMuted" />
                    <input
                      className="interactive-input w-full pl-10"
                      type="email"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-textPrimary mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-textMuted" />
                    <input
                      className="interactive-input w-full pl-10"
                      type="tel"
                      placeholder="+371 12345678"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-textPrimary mb-1">
                    Message
                  </label>
                  <textarea
                    className="interactive-input w-full resize-none"
                    rows={4}
                    placeholder="Tell us about your board game..."
                  />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Heading level={3} variant="primary">Interactive Controls</Heading>
                <Paragraph variant="secondary" size="sm">
                  Buttons, toggles, and selection controls
                </Paragraph>
              </CardHeader>
              <CardBody className="space-y-6">
                <div>
                  <Text variant="primary" weight="medium" className="block mb-3">
                    Filter Options
                  </Text>
                  <div className="flex flex-wrap gap-2">
                    {['Strategy', 'Family', 'Party', 'Cooperative', 'Euro'].map((category) => (
                      <button
                        key={category}
                        className="
                          px-3 py-1 rounded-full text-sm border transition-all duration-200 ease-in-out
                          border-interactive-light text-textSecondary
                          hover:border-borderAccent hover:text-vibrantOrange hover:bg-vibrantOrange/5
                          focus:border-borderAccent focus:text-vibrantOrange focus:outline-none focus:ring-2 focus:ring-vibrantOrange/20
                        "
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Text variant="primary" weight="medium" className="block mb-3">
                    Price Range
                  </Text>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="50"
                      className="w-full accent-vibrantOrange"
                    />
                    <div className="flex justify-between text-sm text-textMuted">
                      <span>€0</span>
                      <span>€100+</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Text variant="primary" weight="medium" className="block mb-3">
                    Preferences
                  </Text>
                  <div className="space-y-3">
                    {[
                      { id: 'verified', label: 'BGG Verified Only' },
                      { id: 'local', label: 'Local Sellers Only' },
                      { id: 'new', label: 'New Listings First' }
                    ].map(({ id, label }) => (
                      <div key={id} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={id}
                          className="w-4 h-4 text-vibrantOrange border-borderPrimary rounded focus:ring-vibrantOrange/20"
                        />
                        <label htmlFor={id} className="text-sm text-textPrimary cursor-pointer">
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </section>
      )}

      {/* State Examples Section */}
      {activeTab === 'states' && (
        <section className="space-y-8">
          <Heading level={2} variant="primary">State-based Color Examples</Heading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <Heading level={3} variant="primary">Component States</Heading>
                <Paragraph variant="secondary" size="sm">
                  Different states with consistent color schemes
                </Paragraph>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="state-default p-4 rounded-lg cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5" />
                    <div>
                      <Text variant="primary" weight="medium">Default State</Text>
                      <Text variant="secondary" size="sm">Standard interactive element</Text>
                    </div>
                  </div>
                </div>
                
                <div className="state-success p-4 rounded-lg cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <ThumbsUp className="w-5 h-5" />
                    <div>
                      <Text weight="medium">Success State</Text>
                      <Text size="sm">Action completed successfully</Text>
                    </div>
                  </div>
                </div>
                
                <div className="state-warning p-4 rounded-lg cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5" />
                    <div>
                      <Text weight="medium">Warning State</Text>
                      <Text size="sm">Attention required</Text>
                    </div>
                  </div>
                </div>
                
                <div className="state-error p-4 rounded-lg cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5" />
                    <div>
                      <Text weight="medium">Error State</Text>
                      <Text size="sm">Something went wrong</Text>
                    </div>
                  </div>
                </div>
                
                <div className="state-info p-4 rounded-lg cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5" />
                    <div>
                      <Text weight="medium">Info State</Text>
                      <Text size="sm">Additional information</Text>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Heading level={3} variant="primary">Responsive Examples</Heading>
                <Paragraph variant="secondary" size="sm">
                  Colors that adapt to screen size (resize to see changes)
                </Paragraph>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="bg-responsive-surface p-4 rounded-lg border border-borderLight">
                  <Text variant="primary" weight="medium">Responsive Surface</Text>
                  <Text variant="secondary" size="sm">
                    Background changes across breakpoints
                  </Text>
                </div>
                
                <div className="bg-responsive-accent p-4 rounded-lg">
                  <Text variant="primary" weight="medium">Responsive Accent</Text>
                  <Text variant="secondary" size="sm">
                    Opacity increases with screen size
                  </Text>
                </div>
                
                <div className="p-4 rounded-lg border border-borderLight bg-surface">
                  <Text className="text-responsive-primary" weight="medium">
                    Responsive Text Primary
                  </Text>
                  <Text className="text-responsive-accent" size="sm">
                    Responsive Text Accent
                  </Text>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Animation Examples */}
          <Card>
            <CardHeader>
              <Heading level={3} variant="primary">Animation Examples</Heading>
              <Paragraph variant="secondary" size="sm">
                Smooth animations and transitions
              </Paragraph>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="animate-fade-in p-4 bg-teal/10 rounded-lg text-center">
                  <div className="w-8 h-8 bg-teal rounded-full mx-auto mb-2"></div>
                  <Text variant="primary" size="sm">Fade In</Text>
                </div>
                
                <div className="animate-slide-up p-4 bg-vibrantOrange/10 rounded-lg text-center">
                  <div className="w-8 h-8 bg-vibrantOrange rounded-full mx-auto mb-2"></div>
                  <Text variant="primary" size="sm">Slide Up</Text>
                </div>
                
                <div className="animate-scale-in p-4 bg-darkGreen/10 rounded-lg text-center">
                  <div className="w-8 h-8 bg-darkGreen rounded-full mx-auto mb-2"></div>
                  <Text variant="primary" size="sm">Scale In</Text>
                </div>
                
                <div className="animate-bounce-subtle p-4 bg-coral/10 rounded-lg text-center">
                  <div className="w-8 h-8 bg-coral rounded-full mx-auto mb-2"></div>
                  <Text variant="primary" size="sm">Pulse</Text>
                </div>
              </div>
            </CardBody>
          </Card>
        </section>
      )}

      {/* CSS Classes Reference */}
      <section className="space-y-6">
        <Heading level={2} variant="primary">CSS Classes Reference</Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Heading level={4} variant="primary">Interactive Backgrounds</Heading>
            </CardHeader>
            <CardBody>
              <div className="space-y-1 text-xs font-mono">
                <div><code>.bg-interactive-surface</code></div>
                <div><code>.bg-interactive-accent</code></div>
                <div><code>.bg-interactive-primary</code></div>
                <div><code>.bg-interactive-success</code></div>
                <div><code>.bg-interactive-warning</code></div>
                <div><code>.bg-interactive-error</code></div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading level={4} variant="primary">Interactive Text</Heading>
            </CardHeader>
            <CardBody>
              <div className="space-y-1 text-xs font-mono">
                <div><code>.text-interactive-primary</code></div>
                <div><code>.text-interactive-accent</code></div>
                <div><code>.text-interactive-brand</code></div>
                <div><code>.text-interactive-muted</code></div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading level={4} variant="primary">Hover Effects</Heading>
            </CardHeader>
            <CardBody>
              <div className="space-y-1 text-xs font-mono">
                <div><code>.hover-lift</code></div>
                <div><code>.hover-glow</code></div>
                <div><code>.hover-scale</code></div>
                <div><code>.hover-fade</code></div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading level={4} variant="primary">Complete Components</Heading>
            </CardHeader>
            <CardBody>
              <div className="space-y-1 text-xs font-mono">
                <div><code>.interactive-card</code></div>
                <div><code>.interactive-button</code></div>
                <div><code>.interactive-link</code></div>
                <div><code>.interactive-input</code></div>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Quick Implementation Guide */}
      <Card>
        <CardHeader>
          <Heading level={3} variant="primary">Quick Implementation Guide</Heading>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Text variant="secondary" weight="medium" className="block mb-3">
                Interactive Button:
              </Text>
              <div className="bg-surface-100 p-4 rounded-lg text-xs font-mono">
                <div>{`<button className="interactive-button">`}</div>
                <div>{`  <Icon className="w-4 h-4 mr-2" />`}</div>
                <div>{`  Button Text`}</div>
                <div>{`</button>`}</div>
              </div>
            </div>
            
            <div>
              <Text variant="secondary" weight="medium" className="block mb-3">
                Interactive Card:
              </Text>
              <div className="bg-surface-100 p-4 rounded-lg text-xs font-mono">
                <div>{`<div className="interactive-card p-6">`}</div>
                <div>{`  <h3>Card Title</h3>`}</div>
                <div>{`  <p>Card content...</p>`}</div>
                <div>{`</div>`}</div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
