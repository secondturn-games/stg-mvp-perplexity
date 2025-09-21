'use client'

import { useState } from 'react'
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter,
  ListingCard,
  StatsCard,
  FeatureCard
} from '@/components/ui/card'
import { 
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ConfirmationModal,
  FormModal
} from '@/components/ui/modal'
import { 
  Input,
  Textarea,
  Select,
  FormGroup
} from '@/components/ui/input'
import { 
  PrimaryButton, 
  SecondaryButton, 
  OutlineButton,
  GhostButton,
  ButtonGroup
} from '@/components/ui/button'
import { 
  WarningBadge,
  SuccessBadge,
  InfoBadge
} from '@/components/ui/badge'
import { 
  ShoppingCart, 
  Heart, 
  Share, 
  Edit,
  Trash2,
  Plus,
  TrendingUp,
  Users,
  Package,
  Star,
  Shield,
  Zap,
  Globe
} from 'lucide-react'

/**
 * Card, Modal, and Input Surface Examples
 * Demonstrates the usage of custom Tailwind utility classes
 */
export function CardModalInputExamples() {
  const [showModal, setShowModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAsyncAction = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-4">
          Cards, Modals & Input Surfaces
        </h1>
        <p className="text-text-secondary">
          Comprehensive component examples using surface colors and brand styling
        </p>
      </div>

      {/* Card Variants */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-primary">Card Variants</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Default Card */}
          <Card>
            <CardHeader>
              <h3 className="text-text-primary font-semibold">Default Card</h3>
            </CardHeader>
            <CardBody>
              <p className="text-text-secondary">
                Standard card with subtle shadow and hover effects.
              </p>
            </CardBody>
            <CardFooter>
              <PrimaryButton size="sm">Action</PrimaryButton>
            </CardFooter>
          </Card>

          {/* Elevated Card */}
          <Card variant="elevated">
            <CardHeader>
              <h3 className="text-text-primary font-semibold">Elevated Card</h3>
            </CardHeader>
            <CardBody>
              <p className="text-text-secondary">
                Enhanced card with more prominent shadow and elevation.
              </p>
            </CardBody>
            <CardFooter>
              <SecondaryButton size="sm">Action</SecondaryButton>
            </CardFooter>
          </Card>

          {/* Interactive Card */}
          <Card variant="interactive" onClick={() => setShowModal(true)}>
            <CardHeader>
              <h3 className="text-text-primary font-semibold">Interactive Card</h3>
            </CardHeader>
            <CardBody>
              <p className="text-text-secondary">
                Clickable card with hover effects and focus states.
              </p>
            </CardBody>
            <CardFooter>
              <span className="text-sm text-text-muted">Click to open modal</span>
            </CardFooter>
          </Card>

          {/* Flat Card */}
          <Card variant="flat">
            <CardHeader clean>
              <h3 className="text-text-primary font-semibold">Flat Card</h3>
            </CardHeader>
            <CardBody>
              <p className="text-text-secondary">
                Minimal card design with subtle borders.
              </p>
            </CardBody>
          </Card>

          {/* Accent Card */}
          <Card variant="accent">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-text-primary font-semibold">Accent Card</h3>
                <WarningBadge>Featured</WarningBadge>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-text-secondary">
                Card with vibrant orange accent border for highlighting.
              </p>
            </CardBody>
          </Card>

          {/* Stats Card */}
          <StatsCard
            title="Total Listings"
            value="1,234"
            change="+12.5%"
            changeType="positive"
            icon={<Package className="w-8 h-8" />}
          />
        </div>
      </section>

      {/* Listing Cards */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-primary">Board Game Listing Cards</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ListingCard
            title="Catan"
            price="€25.00"
            condition="Like New"
            seller="John Doe"
            city="Riga"
            featured={true}
            onClick={() => console.log('Clicked Catan listing')}
          />
          
          <ListingCard
            title="Wingspan"
            price="€45.00"
            condition="Very Good"
            seller="Jane Smith"
            city="Daugavpils"
            onClick={() => console.log('Clicked Wingspan listing')}
          />
          
          <ListingCard
            title="Ticket to Ride: Europe"
            price="€35.00"
            condition="Good"
            seller="Board Game Enthusiast"
            onClick={() => console.log('Clicked Ticket to Ride listing')}
          />
        </div>
      </section>

      {/* Feature Cards */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-primary">Feature Showcase Cards</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            title="BoardGameGeek Integration"
            description="Automatic game data sync with the world's largest board game database"
            icon={<Globe className="w-6 h-6" />}
            featured={true}
          />
          
          <FeatureCard
            title="Secure Transactions"
            description="Safe and secure communication between buyers and sellers"
            icon={<Shield className="w-6 h-6" />}
          />
          
          <FeatureCard
            title="Fast Performance"
            description="Optimized for speed with modern web technologies"
            icon={<Zap className="w-6 h-6" />}
          />
        </div>
      </section>

      {/* Input Surfaces */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-primary">Input Surface Examples</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Standard Form */}
          <Card>
            <CardHeader>
              <h3 className="text-text-primary font-semibold">Contact Form</h3>
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Input
                  name="contact-name"
                  label="Your Name"
                  placeholder="Enter your full name"
                  required
                  helperText="This will be shared with the seller"
                />
                
                <Input
                  name="contact-email"
                  label="Email Address"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                  variant="elevated"
                />
                
                <Select
                  name="inquiry-type"
                  label="Inquiry Type"
                  required
                  helperText="Select the type of your inquiry"
                >
                  <option value="">Select an option...</option>
                  <option value="purchase">Purchase Inquiry</option>
                  <option value="condition">Condition Question</option>
                  <option value="shipping">Shipping Information</option>
                  <option value="other">Other</option>
                </Select>
                
                <Textarea
                  name="contact-message"
                  label="Message"
                  placeholder="Hi! I'm interested in your board game..."
                  required
                  helperText="Describe your interest or ask questions"
                  rows={4}
                />
              </FormGroup>
            </CardBody>
            <CardFooter>
              <ButtonGroup>
                <PrimaryButton>Send Message</PrimaryButton>
                <GhostButton>Cancel</GhostButton>
              </ButtonGroup>
            </CardFooter>
          </Card>

          {/* Form with Validation States */}
          <Card>
            <CardHeader>
              <h3 className="text-text-primary font-semibold">Validation Examples</h3>
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Input
                  name="valid-email"
                  label="Valid Input"
                  value="john.doe@example.com"
                  state="success"
                  helperText="Email format is correct"
                  readOnly
                />
                
                <Input
                  name="warning-email"
                  label="Warning Input"
                  value="john@"
                  state="warning"
                  helperText="Email format may be incomplete"
                  readOnly
                />
                
                <Input
                  name="error-email"
                  label="Error Input"
                  value="invalid-email"
                  state="error"
                  errorText="Please enter a valid email address"
                  readOnly
                />
                
                <Input
                  name="flat-input"
                  label="Flat Input Style"
                  variant="flat"
                  placeholder="Alternative input style"
                />
                
                <Input
                  name="underlined-input"
                  label="Underlined Input"
                  variant="underlined"
                  placeholder="Minimal underlined style"
                />
              </FormGroup>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Modal Triggers */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-primary">Modal Examples</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="interactive" onClick={() => setShowModal(true)}>
            <CardBody className="text-center">
              <h3 className="text-text-primary font-semibold mb-2">Basic Modal</h3>
              <p className="text-text-secondary text-sm">Click to open a standard modal</p>
            </CardBody>
          </Card>

          <Card variant="interactive" onClick={() => setShowConfirmModal(true)}>
            <CardBody className="text-center">
              <h3 className="text-text-primary font-semibold mb-2">Confirmation Modal</h3>
              <p className="text-text-secondary text-sm">Click to open confirmation dialog</p>
            </CardBody>
          </Card>

          <Card variant="interactive" onClick={() => setShowFormModal(true)}>
            <CardBody className="text-center">
              <h3 className="text-text-primary font-semibold mb-2">Form Modal</h3>
              <p className="text-text-secondary text-sm">Click to open form in modal</p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Surface Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-primary">Surface Utility Classes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="surface-default surface-bordered surface-rounded p-4">
            <h4 className="font-medium text-text-primary mb-2">Default Surface</h4>
            <p className="text-text-secondary text-sm">Standard surface with border</p>
          </div>

          <div className="surface-subtle surface-bordered surface-rounded p-4">
            <h4 className="font-medium text-text-primary mb-2">Subtle Surface</h4>
            <p className="text-text-secondary text-sm">Hover to see surface-100 effect</p>
          </div>

          <div className="surface-raised surface-rounded p-4">
            <h4 className="font-medium text-text-primary mb-2">Raised Surface</h4>
            <p className="text-text-secondary text-sm">Surface with shadow elevation</p>
          </div>

          <div className="surface-elevated surface-rounded p-4">
            <h4 className="font-medium text-text-primary mb-2">Elevated Surface</h4>
            <p className="text-text-secondary text-sm">Higher shadow elevation</p>
          </div>
        </div>
      </section>

      {/* CSS Classes Reference */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-primary">CSS Classes Reference</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Classes */}
          <Card>
            <CardHeader>
              <h3 className="text-text-primary font-semibold">Card Classes</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-2 text-sm">
                <div><code className="bg-surface-100 px-1 rounded">.card</code> - Standard card</div>
                <div><code className="bg-surface-100 px-1 rounded">.card-elevated</code> - Enhanced shadow</div>
                <div><code className="bg-surface-100 px-1 rounded">.card-interactive</code> - Clickable card</div>
                <div><code className="bg-surface-100 px-1 rounded">.card-flat</code> - Minimal card</div>
                <div><code className="bg-surface-100 px-1 rounded">.card-accent</code> - Orange accent border</div>
                <div><code className="bg-surface-100 px-1 rounded">.card-header</code> - Card header section</div>
                <div><code className="bg-surface-100 px-1 rounded">.card-body</code> - Card content area</div>
                <div><code className="bg-surface-100 px-1 rounded">.card-footer</code> - Card footer section</div>
              </div>
            </CardBody>
          </Card>

          {/* Modal Classes */}
          <Card>
            <CardHeader>
              <h3 className="text-text-primary font-semibold">Modal Classes</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-2 text-sm">
                <div><code className="bg-surface-100 px-1 rounded">.modal-overlay</code> - Modal backdrop</div>
                <div><code className="bg-surface-100 px-1 rounded">.modal</code> - Modal container</div>
                <div><code className="bg-surface-100 px-1 rounded">.modal-lg</code> - Large modal</div>
                <div><code className="bg-surface-100 px-1 rounded">.modal-xl</code> - Extra large modal</div>
                <div><code className="bg-surface-100 px-1 rounded">.modal-header</code> - Modal header</div>
                <div><code className="bg-surface-100 px-1 rounded">.modal-body</code> - Modal content</div>
                <div><code className="bg-surface-100 px-1 rounded">.modal-footer</code> - Modal footer</div>
              </div>
            </CardBody>
          </Card>

          {/* Input Classes */}
          <Card>
            <CardHeader>
              <h3 className="text-text-primary font-semibold">Input Classes</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-2 text-sm">
                <div><code className="bg-surface-100 px-1 rounded">.input-surface</code> - Standard input</div>
                <div><code className="bg-surface-100 px-1 rounded">.input-elevated</code> - Input with shadow</div>
                <div><code className="bg-surface-100 px-1 rounded">.input-flat</code> - Borderless input</div>
                <div><code className="bg-surface-100 px-1 rounded">.input-underlined</code> - Underlined input</div>
                <div><code className="bg-surface-100 px-1 rounded">.input-success</code> - Success state</div>
                <div><code className="bg-surface-100 px-1 rounded">.input-warning</code> - Warning state</div>
                <div><code className="bg-surface-100 px-1 rounded">.input-error</code> - Error state</div>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Stats Dashboard */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-primary">Stats Dashboard Example</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Active Users"
            value="2,847"
            change="+12.3%"
            changeType="positive"
            icon={<Users className="w-6 h-6" />}
          />
          
          <StatsCard
            title="Total Listings"
            value="1,234"
            change="+5.7%"
            changeType="positive"
            icon={<Package className="w-6 h-6" />}
          />
          
          <StatsCard
            title="Conversion Rate"
            value="8.2%"
            change="-2.1%"
            changeType="negative"
            icon={<TrendingUp className="w-6 h-6" />}
          />
          
          <StatsCard
            title="Avg. Rating"
            value="4.8"
            change="Stable"
            changeType="neutral"
            icon={<Star className="w-6 h-6" />}
          />
        </div>
      </section>

      {/* Modals */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalHeader onClose={() => setShowModal(false)}>
          <h3 className="text-lg font-semibold text-text-primary">
            Basic Modal Example
          </h3>
        </ModalHeader>
        
        <ModalBody>
          <div className="space-y-4">
            <p className="text-text-secondary">
              This is a standard modal using the custom utility classes. It includes:
            </p>
            <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm">
              <li>Surface background with proper borders</li>
              <li>Backdrop blur overlay</li>
              <li>Smooth animations</li>
              <li>Keyboard navigation support</li>
              <li>Focus management</li>
            </ul>
            
            <div className="alert-info">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm">Modal uses surface colors and responds to theme changes.</p>
              </div>
            </div>
          </div>
        </ModalBody>
        
        <ModalFooter>
          <OutlineButton onClick={() => setShowModal(false)}>
            Close
          </OutlineButton>
          <PrimaryButton onClick={() => setShowModal(false)}>
            Understood
          </PrimaryButton>
        </ModalFooter>
      </Modal>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => console.log('Confirmed!')}
        title="Delete Listing"
        message="Are you sure you want to delete this listing? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      <FormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title="Create New Listing"
        onSubmit={handleAsyncAction}
        loading={loading}
        size="lg"
      >
        <FormGroup>
          <Input
            name="game-name"
            label="Game Name"
            placeholder="Enter board game name"
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="game-price"
              label="Price (EUR)"
              type="number"
              placeholder="0.00"
              required
            />
            
            <Select name="game-condition" label="Condition" required>
              <option value="">Select condition...</option>
              <option value="new">New</option>
              <option value="like-new">Like New</option>
              <option value="very-good">Very Good</option>
              <option value="good">Good</option>
              <option value="acceptable">Acceptable</option>
            </Select>
          </div>
          
          <Textarea
            name="game-description"
            label="Description"
            placeholder="Describe the game condition and any included components..."
            rows={3}
            helperText="Provide details to help buyers make informed decisions"
          />
        </FormGroup>
      </FormModal>

      {/* Action Buttons for Modals */}
      <div className="flex justify-center">
        <ButtonGroup>
          <PrimaryButton onClick={() => setShowModal(true)}>
            Open Modal
          </PrimaryButton>
          <SecondaryButton onClick={() => setShowConfirmModal(true)}>
            Show Confirmation
          </SecondaryButton>
          <OutlineButton onClick={() => setShowFormModal(true)}>
            Open Form Modal
          </OutlineButton>
        </ButtonGroup>
      </div>
    </div>
  )
}

/**
 * Simple Card Usage Examples
 */
export function SimpleCardExamples() {
  return (
    <div className="space-y-6 p-6">
      <h3 className="text-xl font-semibold">Quick Copy-Paste Examples</h3>
      
      {/* Direct class usage */}
      <div className="space-y-4">
        <div className="card">
          <div className="card-header">
            <h4>Standard Card</h4>
          </div>
          <div className="card-body">
            <p>Card content goes here</p>
          </div>
        </div>

        <div className="card-interactive">
          <div className="card-body">
            <p>Interactive card with hover effects</p>
          </div>
        </div>

        <input className="input-surface" placeholder="Surface input..." />
        <input className="input-elevated" placeholder="Elevated input..." />
        
        <span className="badge-warning">Warning Badge</span>
        <span className="badge-success">Success Badge</span>
      </div>
    </div>
  )
}
