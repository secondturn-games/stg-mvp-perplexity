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
  Text,
  Label
} from '@/components/ui/typography'
import {
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
  GhostButton
} from '@/components/ui/button'
import {
  SuccessBadge,
  WarningBadge,
  ErrorBadge,
  InfoBadge
} from '@/components/ui/badge'
import { 
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Search,
  Filter,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  Star,
  Heart,
  Bookmark,
  Settings,
  Bell,
  Shield
} from 'lucide-react'

/**
 * Border Utilities and Focus Ring Examples
 * Comprehensive showcase of border colors, focus rings, and form field examples
 */
export function BorderExamples() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    message: '',
    newsletter: false,
    terms: false
  })
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [validationState, setValidationState] = useState({
    name: 'default',
    email: 'default',
    phone: 'default',
    message: 'default'
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Simple validation for demo
    if (typeof value === 'string' && value.length > 0) {
      if (field === 'email' && !value.includes('@')) {
        setValidationState(prev => ({ ...prev, [field]: 'error' }))
      } else if (field === 'phone' && value.length < 8) {
        setValidationState(prev => ({ ...prev, [field]: 'warning' }))
      } else {
        setValidationState(prev => ({ ...prev, [field]: 'success' }))
      }
    } else {
      setValidationState(prev => ({ ...prev, [field]: 'default' }))
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="text-center">
        <Heading level={1} variant="brand" className="mb-4">
          Border Utilities & Focus Rings
        </Heading>
        <Paragraph variant="secondary" size="lg">
          Comprehensive border colors, focus rings, and form field examples using brand colors
        </Paragraph>
      </div>

      {/* Basic Border Colors */}
      <section className="space-y-6">
        <Heading level={2} variant="primary">Border Color Utilities</Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Primary Borders */}
          <Card>
            <CardHeader>
              <Heading level={3} variant="primary">Primary Borders</Heading>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="border-primary p-3 rounded-lg">
                <Text variant="primary">Primary border (#E5E7EB)</Text>
              </div>
              
              <div className="border-light p-3 rounded-lg">
                <Text variant="primary">Light border (#F3F4F6)</Text>
              </div>
              
              <div className="border-accent p-3 rounded-lg">
                <Text variant="primary">Accent border (#D95323)</Text>
              </div>
              
              <div className="border-primary-2 p-3 rounded-lg">
                <Text variant="primary">Primary border 2px</Text>
              </div>
              
              <div className="border-accent-4 p-3 rounded-lg">
                <Text variant="primary">Accent border 4px</Text>
              </div>
            </CardBody>
          </Card>

          {/* Brand Borders */}
          <Card>
            <CardHeader>
              <Heading level={3} variant="primary">Brand Borders</Heading>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="border-brand-primary p-3 rounded-lg">
                <Text variant="primary">Brand Primary (Dark Green)</Text>
              </div>
              
              <div className="border-brand-accent p-3 rounded-lg">
                <Text variant="primary">Brand Accent (Orange)</Text>
              </div>
              
              <div className="border-brand-success p-3 rounded-lg">
                <Text variant="primary">Success (Teal)</Text>
              </div>
              
              <div className="border-brand-warning p-3 rounded-lg">
                <Text variant="primary">Warning (Yellow)</Text>
              </div>
              
              <div className="border-brand-error p-3 rounded-lg">
                <Text variant="primary">Error (Coral)</Text>
              </div>
            </CardBody>
          </Card>

          {/* Interactive Borders */}
          <Card>
            <CardHeader>
              <Heading level={3} variant="primary">Interactive Borders</Heading>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="border-hover-primary p-3 rounded-lg cursor-pointer">
                <Text variant="primary">Hover for primary</Text>
              </div>
              
              <div className="border-hover-accent p-3 rounded-lg cursor-pointer">
                <Text variant="primary">Hover for accent</Text>
              </div>
              
              <div className="border-interactive p-3 rounded-lg cursor-pointer">
                <Text variant="primary">Interactive border</Text>
              </div>
              
              <div className="border-interactive-light p-3 rounded-lg cursor-pointer">
                <Text variant="primary">Interactive light</Text>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Directional Borders */}
      <section className="space-y-6">
        <Heading level={2} variant="primary">Directional Borders</Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border-t-accent-4 p-4 bg-surface rounded-lg">
            <Text variant="primary" className="block text-center">Top Accent</Text>
          </div>
          
          <div className="border-b-accent-4 p-4 bg-surface rounded-lg">
            <Text variant="primary" className="block text-center">Bottom Accent</Text>
          </div>
          
          <div className="border-l-accent-4 p-4 bg-surface rounded-lg">
            <Text variant="primary" className="block text-center">Left Accent</Text>
          </div>
          
          <div className="border-r-accent-4 p-4 bg-surface rounded-lg">
            <Text variant="primary" className="block text-center">Right Accent</Text>
          </div>
        </div>
      </section>

      {/* Focus Ring Examples */}
      <section className="space-y-6">
        <Heading level={2} variant="primary">Focus Ring Utilities</Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Heading level={3} variant="primary">Standard Focus Rings</Heading>
            </CardHeader>
            <CardBody className="space-y-4">
              <button className="focus-ring w-full p-3 border border-primary rounded-lg text-left">
                <Text variant="primary">Standard focus ring</Text>
              </button>
              
              <button className="focus-ring-accent w-full p-3 border border-primary rounded-lg text-left">
                <Text variant="primary">Accent focus ring</Text>
              </button>
              
              <button className="focus-ring-primary w-full p-3 border border-primary rounded-lg text-left">
                <Text variant="primary">Primary focus ring</Text>
              </button>
              
              <button className="focus-ring-thick w-full p-3 border border-primary rounded-lg text-left">
                <Text variant="primary">Thick focus ring</Text>
              </button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading level={3} variant="primary">State Focus Rings</Heading>
            </CardHeader>
            <CardBody className="space-y-4">
              <button className="focus-ring-success w-full p-3 border border-brand-success rounded-lg text-left">
                <Text variant="primary">Success focus</Text>
              </button>
              
              <button className="focus-ring-warning w-full p-3 border border-brand-warning rounded-lg text-left">
                <Text variant="primary">Warning focus</Text>
              </button>
              
              <button className="focus-ring-error w-full p-3 border border-brand-error rounded-lg text-left">
                <Text variant="primary">Error focus</Text>
              </button>
              
              <button className="focus-ring-inset w-full p-3 border border-primary rounded-lg text-left">
                <Text variant="primary">Inset focus ring</Text>
              </button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading level={3} variant="primary">Focus with Border</Heading>
            </CardHeader>
            <CardBody className="space-y-4">
              <button className="focus-border-accent w-full p-3 border border-light rounded-lg text-left">
                <Text variant="primary">Focus changes border</Text>
              </button>
              
              <button className="focus-border-primary w-full p-3 border border-light rounded-lg text-left">
                <Text variant="primary">Primary border focus</Text>
              </button>
              
              <div className="focus-ring-tight tabindex-0 p-3 border border-primary rounded-lg cursor-pointer" tabIndex={0}>
                <Text variant="primary">Tight focus ring</Text>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Form Field Examples */}
      <section className="space-y-6">
        <Heading level={2} variant="primary">Form Field Examples</Heading>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="form-card-border">
            <CardHeader>
              <Heading level={3} variant="primary">Contact Information</Heading>
              <Paragraph variant="secondary" size="sm">
                All fields use focus rings with borderAccent color
              </Paragraph>
            </CardHeader>
            <CardBody className="space-y-6">
              {/* Name Field */}
              <div>
                <Label htmlFor="name" required>Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-textMuted" />
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your full name"
                    className={`
                      w-full pl-10 pr-3 py-3 text-primary placeholder-textMuted
                      ${validationState.name === 'success' ? 'form-border-success' : 
                        validationState.name === 'error' ? 'form-border-error' : 
                        'form-border'}
                    `}
                  />
                </div>
                {focusedField === 'name' && (
                  <Text variant="muted" size="xs" className="block mt-1">
                    Enter your first and last name
                  </Text>
                )}
                {validationState.name === 'success' && (
                  <Text variant="success" size="xs" className="block mt-1">
                    ✓ Name looks good
                  </Text>
                )}
              </div>

              {/* Email Field */}
              <div>
                <Label htmlFor="email" required>Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-textMuted" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="your.email@example.com"
                    className={`
                      w-full pl-10 pr-3 py-3 text-primary placeholder-textMuted
                      ${validationState.email === 'success' ? 'form-border-success' : 
                        validationState.email === 'error' ? 'form-border-error' : 
                        'form-border'}
                    `}
                  />
                </div>
                {focusedField === 'email' && (
                  <Text variant="muted" size="xs" className="block mt-1">
                    We'll use this to contact you about your listing
                  </Text>
                )}
                {validationState.email === 'error' && (
                  <Text variant="error" size="xs" className="block mt-1">
                    ✗ Please enter a valid email address
                  </Text>
                )}
                {validationState.email === 'success' && (
                  <Text variant="success" size="xs" className="block mt-1">
                    ✓ Email format is correct
                  </Text>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-textMuted" />
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="+371 12345678"
                    className={`
                      w-full pl-10 pr-3 py-3 text-primary placeholder-textMuted
                      ${validationState.phone === 'success' ? 'form-border-success' : 
                        validationState.phone === 'warning' ? 'form-border-warning' : 
                        'form-border-light'}
                    `}
                  />
                </div>
                {focusedField === 'phone' && (
                  <Text variant="muted" size="xs" className="block mt-1">
                    Optional - for faster communication
                  </Text>
                )}
                {validationState.phone === 'warning' && (
                  <Text variant="warning" size="xs" className="block mt-1">
                    ⚠ Phone number seems short
                  </Text>
                )}
                {validationState.phone === 'success' && (
                  <Text variant="success" size="xs" className="block mt-1">
                    ✓ Phone number looks valid
                  </Text>
                )}
              </div>

              {/* City Select */}
              <div>
                <Label htmlFor="city">City</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-textMuted" />
                  <select
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    onFocus={() => setFocusedField('city')}
                    onBlur={() => setFocusedField(null)}
                    className="form-border w-full pl-10 pr-8 py-3 text-primary bg-surface appearance-none cursor-pointer"
                  >
                    <option value="">Select your city</option>
                    <option value="riga">Riga</option>
                    <option value="daugavpils">Daugavpils</option>
                    <option value="liepaja">Liepāja</option>
                    <option value="jelgava">Jelgava</option>
                    <option value="jurmala">Jūrmala</option>
                  </select>
                  <div className="absolute right-3 top-3 pointer-events-none">
                    <svg className="w-4 h-4 text-textMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {focusedField === 'city' && (
                  <Text variant="muted" size="xs" className="block mt-1">
                    Help buyers find local listings
                  </Text>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Advanced Form Fields */}
          <Card className="form-card-border">
            <CardHeader>
              <Heading level={3} variant="primary">Advanced Form Elements</Heading>
              <Paragraph variant="secondary" size="sm">
                Various input types with focus rings and validation states
              </Paragraph>
            </CardHeader>
            <CardBody className="space-y-6">
              {/* Search Field */}
              <div>
                <Label htmlFor="search">Search Games</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-textMuted" />
                  <input
                    id="search"
                    type="search"
                    placeholder="Search board games..."
                    onFocus={() => setFocusedField('search')}
                    onBlur={() => setFocusedField(null)}
                    className="form-border w-full pl-10 pr-10 py-3 text-primary placeholder-textMuted"
                  />
                  <Filter className="absolute right-3 top-3 w-4 h-4 text-textMuted cursor-pointer hover:text-vibrantOrange transition-colors" />
                </div>
                {focusedField === 'search' && (
                  <Text variant="muted" size="xs" className="block mt-1">
                    Search by game name, publisher, or category
                  </Text>
                )}
              </div>

              {/* Password Field */}
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 w-4 h-4 text-textMuted" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter secure password"
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="form-border w-full pl-10 pr-10 py-3 text-primary placeholder-textMuted"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-textMuted hover:text-vibrantOrange transition-colors focus-ring-tight"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {focusedField === 'password' && (
                  <Text variant="muted" size="xs" className="block mt-1">
                    Use at least 8 characters with letters and numbers
                  </Text>
                )}
              </div>

              {/* Date Field */}
              <div>
                <Label htmlFor="date">Availability Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-textMuted" />
                  <input
                    id="date"
                    type="date"
                    onFocus={() => setFocusedField('date')}
                    onBlur={() => setFocusedField(null)}
                    className="form-border w-full pl-10 pr-3 py-3 text-primary"
                  />
                </div>
              </div>

              {/* Textarea */}
              <div>
                <Label htmlFor="message">Message</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-textMuted" />
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Tell us about your board game..."
                    rows={4}
                    className={`
                      w-full pl-10 pr-3 py-3 text-primary placeholder-textMuted resize-none
                      ${validationState.message === 'success' ? 'form-border-success' : 'form-border'}
                    `}
                  />
                </div>
                {focusedField === 'message' && (
                  <Text variant="muted" size="xs" className="block mt-1">
                    Describe the game condition, included components, etc.
                  </Text>
                )}
                {validationState.message === 'success' && (
                  <Text variant="success" size="xs" className="block mt-1">
                    ✓ Great description!
                  </Text>
                )}
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <input
                    id="newsletter"
                    type="checkbox"
                    checked={formData.newsletter}
                    onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                    className="mt-1 w-4 h-4 text-vibrantOrange border-borderPrimary rounded focus-ring-accent"
                  />
                  <div className="flex-1">
                    <Label htmlFor="newsletter" className="text-sm cursor-pointer">
                      Subscribe to newsletter
                    </Label>
                    <Text variant="muted" size="xs" className="block">
                      Get updates about new games and special offers
                    </Text>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={formData.terms}
                    onChange={(e) => handleInputChange('terms', e.target.checked)}
                    className="mt-1 w-4 h-4 text-vibrantOrange border-borderPrimary rounded focus-ring-accent"
                  />
                  <div className="flex-1">
                    <Label htmlFor="terms" className="text-sm cursor-pointer" required>
                      Accept Terms of Service
                    </Label>
                    <Text variant="muted" size="xs" className="block">
                      Required to create your listing
                    </Text>
                  </div>
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <div className="flex justify-between items-center w-full">
                <Text variant="muted" size="xs">
                  All required fields must be completed
                </Text>
                <div className="space-x-3">
                  <SecondaryButton>Cancel</SecondaryButton>
                  <PrimaryButton disabled={!formData.terms}>
                    Submit Form
                  </PrimaryButton>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Component Border Examples */}
      <section className="space-y-6">
        <Heading level={2} variant="primary">Component Border Examples</Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card Borders */}
          <Card className="card-border">
            <CardHeader>
              <Heading level={4} variant="primary">Card Border</Heading>
            </CardHeader>
            <CardBody>
              <Paragraph variant="secondary" size="sm">
                Standard card with interactive border that changes on hover.
              </Paragraph>
            </CardBody>
          </Card>

          <Card className="card-border-light">
            <CardHeader>
              <Heading level={4} variant="primary">Light Card Border</Heading>
            </CardHeader>
            <CardBody>
              <Paragraph variant="secondary" size="sm">
                Light border that strengthens on hover.
              </Paragraph>
            </CardBody>
          </Card>

          <Card className="card-border-accent">
            <CardHeader>
              <Heading level={4} variant="primary">Accent Card Border</Heading>
            </CardHeader>
            <CardBody>
              <Paragraph variant="secondary" size="sm">
                Card with vibrant orange accent border on the left.
              </Paragraph>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Status and Divider Examples */}
      <section className="space-y-6">
        <Heading level={2} variant="primary">Status & Divider Borders</Heading>
        
        <div className="space-y-6">
          {/* Status Borders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="status-border-success bg-surface p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <SuccessBadge>Success</SuccessBadge>
                  <Text variant="primary" weight="medium">Order Completed</Text>
                </div>
                <Text variant="secondary" size="sm">
                  Your board game has been successfully listed on the marketplace.
                </Text>
              </div>

              <div className="status-border-warning bg-surface p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <WarningBadge>Warning</WarningBadge>
                  <Text variant="primary" weight="medium">Payment Pending</Text>
                </div>
                <Text variant="secondary" size="sm">
                  Please complete your payment to activate the premium features.
                </Text>
              </div>
            </div>

            <div className="space-y-4">
              <div className="status-border-error bg-surface p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <ErrorBadge>Error</ErrorBadge>
                  <Text variant="primary" weight="medium">Listing Expired</Text>
                </div>
                <Text variant="secondary" size="sm">
                  Your listing has expired. Please renew to keep it active.
                </Text>
              </div>

              <div className="status-border-info bg-surface p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <InfoBadge>Info</InfoBadge>
                  <Text variant="primary" weight="medium">New Feature</Text>
                </div>
                <Text variant="secondary" size="sm">
                  Check out our new game condition verification system.
                </Text>
              </div>
            </div>
          </div>

          {/* Dividers */}
          <div className="space-y-6">
            <div>
              <Text variant="primary" weight="medium" className="block mb-3">Light Divider</Text>
              <div className="divider-light"></div>
            </div>

            <div>
              <Text variant="primary" weight="medium" className="block mb-3">Primary Divider</Text>
              <div className="divider-primary"></div>
            </div>

            <div>
              <Text variant="primary" weight="medium" className="block mb-3">Accent Divider</Text>
              <div className="divider-accent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CSS Classes Reference */}
      <section className="space-y-6">
        <Heading level={2} variant="primary">CSS Classes Reference</Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Border Colors */}
          <Card>
            <CardHeader>
              <Heading level={4} variant="primary">Border Colors</Heading>
            </CardHeader>
            <CardBody>
              <div className="space-y-1 text-xs font-mono">
                <div><code>.border-primary</code></div>
                <div><code>.border-light</code></div>
                <div><code>.border-accent</code></div>
                <div><code>.border-primary-2</code></div>
                <div><code>.border-accent-4</code></div>
                <div><code>.border-brand-primary</code></div>
                <div><code>.border-brand-success</code></div>
              </div>
            </CardBody>
          </Card>

          {/* Focus Rings */}
          <Card>
            <CardHeader>
              <Heading level={4} variant="primary">Focus Rings</Heading>
            </CardHeader>
            <CardBody>
              <div className="space-y-1 text-xs font-mono">
                <div><code>.focus-ring</code></div>
                <div><code>.focus-ring-accent</code></div>
                <div><code>.focus-ring-primary</code></div>
                <div><code>.focus-ring-thick</code></div>
                <div><code>.focus-ring-inset</code></div>
                <div><code>.focus-border-accent</code></div>
              </div>
            </CardBody>
          </Card>

          {/* Form Borders */}
          <Card>
            <CardHeader>
              <Heading level={4} variant="primary">Form Borders</Heading>
            </CardHeader>
            <CardBody>
              <div className="space-y-1 text-xs font-mono">
                <div><code>.form-border</code></div>
                <div><code>.form-border-light</code></div>
                <div><code>.form-border-success</code></div>
                <div><code>.form-border-warning</code></div>
                <div><code>.form-border-error</code></div>
                <div><code>.form-card-border</code></div>
              </div>
            </CardBody>
          </Card>

          {/* Component Borders */}
          <Card>
            <CardHeader>
              <Heading level={4} variant="primary">Component Borders</Heading>
            </CardHeader>
            <CardBody>
              <div className="space-y-1 text-xs font-mono">
                <div><code>.card-border</code></div>
                <div><code>.btn-border-primary</code></div>
                <div><code>.status-border-success</code></div>
                <div><code>.divider-primary</code></div>
                <div><code>.nav-border-active</code></div>
                <div><code>.img-border-accent</code></div>
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
                <Text variant="secondary" weight="medium" className="block">Form Input with Focus:</Text>
                <div className="bg-surface-100 p-4 rounded-lg text-xs font-mono space-y-1">
                  <div>{`<input`}</div>
                  <div>{`  className="form-border w-full px-3 py-3"`}</div>
                  <div>{`  placeholder="Enter text..."`}</div>
                  <div>{`/>`}</div>
                </div>
                
                <Text variant="secondary" weight="medium" className="block">Button with Focus Ring:</Text>
                <div className="bg-surface-100 p-4 rounded-lg text-xs font-mono space-y-1">
                  <div>{`<button className="focus-ring-accent">`}</div>
                  <div>{`  Click me`}</div>
                  <div>{`</button>`}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Text variant="secondary" weight="medium" className="block">Card with Accent Border:</Text>
                <div className="bg-surface-100 p-4 rounded-lg text-xs font-mono space-y-1">
                  <div>{`<div className="card-border-accent p-4">`}</div>
                  <div>{`  Content with accent border`}</div>
                  <div>{`</div>`}</div>
                </div>
                
                <Text variant="secondary" weight="medium" className="block">Status with Border:</Text>
                <div className="bg-surface-100 p-4 rounded-lg text-xs font-mono space-y-1">
                  <div>{`<div className="status-border-success p-4">`}</div>
                  <div>{`  Success message`}</div>
                  <div>{`</div>`}</div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  )
}
