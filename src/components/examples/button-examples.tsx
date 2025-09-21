'use client'

import { useState } from 'react'
import { 
  Button, 
  PrimaryButton, 
  SecondaryButton, 
  OutlineButton, 
  GhostButton, 
  DangerButton,
  ButtonGroup,
  IconButton
} from '@/components/ui/button'
import { 
  Badge, 
  WarningBadge, 
  SuccessBadge, 
  ErrorBadge, 
  InfoBadge, 
  NeutralBadge,
  StatusBadge,
  ConditionBadge
} from '@/components/ui/badge'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Share, 
  Heart,
  ShoppingCart,
  User,
  Settings
} from 'lucide-react'

/**
 * Button and Badge Examples
 * Demonstrates the usage of custom Tailwind utility classes
 */
export function ButtonAndBadgeExamples() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleAsyncAction = async (buttonId: string) => {
    setLoading(buttonId)
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(null)
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-4">
          Second Turn Games - Component Examples
        </h1>
        <p className="text-text-secondary">
          Demonstrating custom Tailwind utility classes for buttons and badges
        </p>
      </div>

      {/* Button Variants */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-primary">Button Variants</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-text-secondary mb-3">Primary Buttons (Dark Green)</h3>
            <ButtonGroup>
              <PrimaryButton size="sm">Small Primary</PrimaryButton>
              <PrimaryButton>Medium Primary</PrimaryButton>
              <PrimaryButton size="lg">Large Primary</PrimaryButton>
              <PrimaryButton 
                loading={loading === 'primary-loading'}
                onClick={() => handleAsyncAction('primary-loading')}
              >
                Loading Example
              </PrimaryButton>
              <PrimaryButton disabled>Disabled</PrimaryButton>
            </ButtonGroup>
          </div>

          <div>
            <h3 className="text-lg font-medium text-text-secondary mb-3">Secondary Buttons (Vibrant Orange)</h3>
            <ButtonGroup>
              <SecondaryButton size="sm">Small Secondary</SecondaryButton>
              <SecondaryButton>Medium Secondary</SecondaryButton>
              <SecondaryButton size="lg">Large Secondary</SecondaryButton>
              <SecondaryButton 
                loading={loading === 'secondary-loading'}
                onClick={() => handleAsyncAction('secondary-loading')}
              >
                Loading Example
              </SecondaryButton>
              <SecondaryButton disabled>Disabled</SecondaryButton>
            </ButtonGroup>
          </div>

          <div>
            <h3 className="text-lg font-medium text-text-secondary mb-3">Other Button Variants</h3>
            <ButtonGroup>
              <OutlineButton>Outline Button</OutlineButton>
              <GhostButton>Ghost Button</GhostButton>
              <DangerButton>Danger Button</DangerButton>
            </ButtonGroup>
          </div>
        </div>
      </section>

      {/* Icon Buttons */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-primary">Icon Buttons</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-text-secondary mb-3">Icon Button Variants</h3>
            <ButtonGroup>
              <IconButton 
                variant="primary" 
                icon={<Plus className="w-4 h-4" />}
                aria-label="Add new item"
              />
              <IconButton 
                variant="secondary" 
                icon={<Edit className="w-4 h-4" />}
                aria-label="Edit item"
              />
              <IconButton 
                variant="outline" 
                icon={<Share className="w-4 h-4" />}
                aria-label="Share item"
              />
              <IconButton 
                variant="ghost" 
                icon={<Heart className="w-4 h-4" />}
                aria-label="Add to favorites"
              />
              <IconButton 
                variant="danger" 
                icon={<Trash2 className="w-4 h-4" />}
                aria-label="Delete item"
              />
            </ButtonGroup>
          </div>

          <div>
            <h3 className="text-lg font-medium text-text-secondary mb-3">Icon Button Sizes</h3>
            <ButtonGroup>
              <IconButton 
                size="sm"
                icon={<Settings className="w-3 h-3" />}
                aria-label="Settings"
              />
              <IconButton 
                size="md"
                icon={<User className="w-4 h-4" />}
                aria-label="User profile"
              />
              <IconButton 
                size="lg"
                icon={<ShoppingCart className="w-5 h-5" />}
                aria-label="Shopping cart"
              />
            </ButtonGroup>
          </div>
        </div>
      </section>

      {/* Badge Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-primary">Badge Components</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-text-secondary mb-3">Status Badges</h3>
            <div className="flex flex-wrap gap-2">
              <SuccessBadge>Success</SuccessBadge>
              <WarningBadge>Warning</WarningBadge>
              <ErrorBadge>Error</ErrorBadge>
              <InfoBadge>Info</InfoBadge>
              <NeutralBadge>Neutral</NeutralBadge>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-text-secondary mb-3">Badge Sizes</h3>
            <div className="flex flex-wrap items-center gap-3">
              <WarningBadge size="sm">Small</WarningBadge>
              <WarningBadge size="md">Medium</WarningBadge>
              <WarningBadge size="lg">Large</WarningBadge>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-text-secondary mb-3">Status Badges with Icons</h3>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="online" />
              <StatusBadge status="offline" />
              <StatusBadge status="pending" />
              <StatusBadge status="active" />
              <StatusBadge status="inactive" />
              <StatusBadge status="new" />
              <StatusBadge status="featured" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-text-secondary mb-3">Game Condition Badges</h3>
            <div className="flex flex-wrap gap-2">
              <ConditionBadge condition="new" />
              <ConditionBadge condition="like-new" />
              <ConditionBadge condition="very-good" />
              <ConditionBadge condition="good" />
              <ConditionBadge condition="acceptable" />
              <ConditionBadge condition="poor" />
            </div>
          </div>
        </div>
      </section>

      {/* Real-world Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-primary">Real-world Usage Examples</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Listing Card Example */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="text-text-primary font-semibold">Catan Board Game</h3>
                <ConditionBadge condition="very-good" />
              </div>
            </div>
            <div className="card-body">
              <p className="text-text-secondary mb-4">
                Classic strategy game in excellent condition. All pieces included.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-text-primary">€25.00</span>
                <div className="flex gap-2">
                  <StatusBadge status="featured" size="sm" />
                  <SuccessBadge size="sm">Available</SuccessBadge>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <ButtonGroup>
                <PrimaryButton className="flex-1">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Contact Seller
                </PrimaryButton>
                <IconButton 
                  variant="outline"
                  icon={<Heart className="w-4 h-4" />}
                  aria-label="Add to favorites"
                />
                <IconButton 
                  variant="ghost"
                  icon={<Share className="w-4 h-4" />}
                  aria-label="Share listing"
                />
              </ButtonGroup>
            </div>
          </div>

          {/* User Profile Example */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="text-text-primary font-semibold">User Profile</h3>
                <StatusBadge status="online" />
              </div>
            </div>
            <div className="card-body">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-darkGreen rounded-full flex items-center justify-center text-white font-semibold">
                  JD
                </div>
                <div>
                  <p className="text-text-primary font-medium">John Doe</p>
                  <p className="text-text-secondary text-sm">Board game enthusiast</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <InfoBadge size="sm">Verified Seller</InfoBadge>
                <SuccessBadge size="sm">5.0 Rating</SuccessBadge>
                <NeutralBadge size="sm">25 Sales</NeutralBadge>
              </div>
            </div>
            <div className="card-footer">
              <ButtonGroup>
                <SecondaryButton className="flex-1">
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </SecondaryButton>
                <OutlineButton>
                  Message
                </OutlineButton>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </section>

      {/* Alert Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-primary">Alert Components</h2>
        
        <div className="space-y-4">
          <div className="alert-success">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-medium">Listing Created Successfully!</h4>
              <p className="text-sm mt-1">Your board game listing has been published to the marketplace.</p>
            </div>
          </div>

          <div className="alert-warning">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-medium">Image Upload Warning</h4>
              <p className="text-sm mt-1">Some images were compressed to reduce file size. Quality may be affected.</p>
            </div>
          </div>

          <div className="alert-error">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-medium">Upload Failed</h4>
              <p className="text-sm mt-1">Failed to upload images. Please check your connection and try again.</p>
            </div>
          </div>

          <div className="alert-info">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-medium">BGG Integration Active</h4>
              <p className="text-sm mt-1">Board game data is automatically synced with BoardGameGeek for accuracy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-primary">Interactive Examples</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Listing Example */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-text-primary font-semibold">Create New Listing</h3>
            </div>
            <div className="card-body space-y-4">
              <input 
                className="input-primary" 
                placeholder="Game name..."
                defaultValue="Wingspan"
              />
              <input 
                className="input-primary" 
                placeholder="Price in EUR..."
                defaultValue="45.00"
              />
              <div className="flex items-center space-x-2">
                <span className="text-text-secondary text-sm">Condition:</span>
                <ConditionBadge condition="like-new" />
              </div>
            </div>
            <div className="card-footer">
              <ButtonGroup>
                <PrimaryButton className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Listing
                </PrimaryButton>
                <GhostButton>Cancel</GhostButton>
              </ButtonGroup>
            </div>
          </div>

          {/* User Actions Example */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="text-text-primary font-semibold">User Actions</h3>
                <div className="flex gap-1">
                  <StatusBadge status="new" size="sm" />
                  <InfoBadge size="sm">Pro</InfoBadge>
                </div>
              </div>
            </div>
            <div className="card-body space-y-3">
              <p className="text-text-secondary">
                Manage your account and listings with these quick actions.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 hover:bg-surface-50 rounded">
                  <span className="text-text-primary">Profile Settings</span>
                  <IconButton 
                    size="sm"
                    variant="ghost"
                    icon={<Settings className="w-3 h-3" />}
                    aria-label="Open profile settings"
                  />
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-surface-50 rounded">
                  <span className="text-text-primary">Download Data</span>
                  <IconButton 
                    size="sm"
                    variant="ghost"
                    icon={<Download className="w-3 h-3" />}
                    aria-label="Download user data"
                  />
                </div>
              </div>
            </div>
            <div className="card-footer">
              <ButtonGroup orientation="vertical" className="w-full">
                <SecondaryButton className="w-full">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </SecondaryButton>
                <OutlineButton className="w-full">
                  View Public Profile
                </OutlineButton>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </section>

      {/* Form Example */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-primary">Form Components</h2>
        
        <div className="card max-w-md mx-auto">
          <div className="card-header">
            <h3 className="text-text-primary font-semibold">Contact Seller</h3>
          </div>
          <div className="card-body space-y-4">
            <div>
              <label className="block text-text-primary font-medium mb-1">
                Your Message
              </label>
              <textarea 
                className="input-primary resize-none h-24"
                placeholder="Hi! I'm interested in your board game..."
              />
            </div>
            
            <div className="alert-info">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm">Your contact information will be shared with the seller.</p>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <ButtonGroup className="w-full">
              <PrimaryButton 
                className="flex-1"
                loading={loading === 'contact-loading'}
                onClick={() => handleAsyncAction('contact-loading')}
              >
                Send Message
              </PrimaryButton>
              <GhostButton>Cancel</GhostButton>
            </ButtonGroup>
          </div>
        </div>
      </section>

      {/* CSS Classes Reference */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-primary">CSS Classes Reference</h2>
        
        <div className="bg-surface-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">Available Utility Classes</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-text-primary mb-2">Button Classes:</h4>
              <ul className="space-y-1 text-text-secondary">
                <li><code className="bg-surface px-1 rounded">.btn-primary</code> - Dark green primary button</li>
                <li><code className="bg-surface px-1 rounded">.btn-secondary</code> - Vibrant orange secondary button</li>
                <li><code className="bg-surface px-1 rounded">.btn-outline</code> - Outlined button variant</li>
                <li><code className="bg-surface px-1 rounded">.btn-ghost</code> - Transparent button variant</li>
                <li><code className="bg-surface px-1 rounded">.btn-danger</code> - Coral danger button</li>
                <li><code className="bg-surface px-1 rounded">.btn-*-sm</code> - Small button variants</li>
                <li><code className="bg-surface px-1 rounded">.btn-*-lg</code> - Large button variants</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-text-primary mb-2">Badge Classes:</h4>
              <ul className="space-y-1 text-text-secondary">
                <li><code className="bg-surface px-1 rounded">.badge-warning</code> - Warm yellow warning badge</li>
                <li><code className="bg-surface px-1 rounded">.badge-success</code> - Teal success badge</li>
                <li><code className="bg-surface px-1 rounded">.badge-error</code> - Coral error badge</li>
                <li><code className="bg-surface px-1 rounded">.badge-info</code> - Lavender info badge</li>
                <li><code className="bg-surface px-1 rounded">.badge-neutral</code> - Gray neutral badge</li>
                <li><code className="bg-surface px-1 rounded">.badge-lg</code> - Large badge modifier</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/**
 * Simple usage examples for copy-paste
 */
export function SimpleButtonExamples() {
  return (
    <div className="space-y-4 p-6">
      <h3 className="text-xl font-semibold">Quick Copy-Paste Examples</h3>
      
      {/* Direct class usage */}
      <div className="space-y-2">
        <button className="btn-primary">Primary Button</button>
        <button className="btn-secondary">Secondary Button</button>
        <button className="btn-outline">Outline Button</button>
        <span className="badge-warning">Warning Badge</span>
        <span className="badge-success">Success Badge</span>
      </div>
    </div>
  )
}
