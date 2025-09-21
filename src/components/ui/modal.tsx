import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

/**
 * Modal Component System
 * Uses the custom Tailwind utility classes defined in globals.css
 */

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'
  children: React.ReactNode
  className?: string
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

/**
 * Base Modal Component
 */
export function Modal({
  isOpen,
  onClose,
  size = 'md',
  children,
  className,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps) {
  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, closeOnEscape])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const modalClasses = getModalClasses(size)

  return createPortal(
    <div className="modal-overlay" onClick={closeOnOverlayClick ? onClose : undefined}>
      <div
        className={cn(modalClasses, className)}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

/**
 * Modal Header Component
 */
export interface ModalHeaderProps {
  children: React.ReactNode
  className?: string
  clean?: boolean
  onClose?: () => void
  showCloseButton?: boolean
}

export function ModalHeader({ 
  children, 
  className, 
  clean = false, 
  onClose,
  showCloseButton = true 
}: ModalHeaderProps) {
  return (
    <div className={cn(clean ? 'modal-header-clean' : 'modal-header', className)}>
      <div className="flex-1">
        {children}
      </div>
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="modal-close"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

/**
 * Modal Body Component
 */
export interface ModalBodyProps {
  children: React.ReactNode
  className?: string
  scrollable?: boolean
}

export function ModalBody({ children, className, scrollable = false }: ModalBodyProps) {
  return (
    <div className={cn(scrollable ? 'modal-body-scrollable' : 'modal-body', className)}>
      {children}
    </div>
  )
}

/**
 * Modal Footer Component
 */
export interface ModalFooterProps {
  children: React.ReactNode
  className?: string
  clean?: boolean
}

export function ModalFooter({ children, className, clean = false }: ModalFooterProps) {
  return (
    <div className={cn(clean ? 'modal-footer-clean' : 'modal-footer', className)}>
      {children}
    </div>
  )
}

/**
 * Get modal classes based on size
 */
function getModalClasses(size: ModalProps['size']): string {
  const sizeClasses = {
    sm: 'modal max-w-sm',
    md: 'modal',
    lg: 'modal modal-lg',
    xl: 'modal modal-xl',
    fullscreen: 'modal modal-fullscreen',
  }

  return sizeClasses[size || 'md']
}

/**
 * Confirmation Modal Component
 */
export interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'danger'
  loading?: boolean
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm()
    if (!loading) {
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalHeader onClose={onClose}>
        <h3 className="text-lg font-semibold text-text-primary">
          {title}
        </h3>
      </ModalHeader>
      
      <ModalBody>
        <p className="text-text-secondary">
          {message}
        </p>
      </ModalBody>
      
      <ModalFooter>
        <button
          onClick={onClose}
          disabled={loading}
          className="btn-ghost"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className={variant === 'danger' ? 'btn-danger' : 'btn-primary'}
        >
          {loading ? 'Processing...' : confirmText}
        </button>
      </ModalFooter>
    </Modal>
  )
}

/**
 * Form Modal Component
 */
export interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onSubmit?: () => void
  submitText?: string
  cancelText?: string
  loading?: boolean
  size?: ModalProps['size']
}

export function FormModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = 'Submit',
  cancelText = 'Cancel',
  loading = false,
  size = 'md'
}: FormModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <ModalHeader onClose={onClose}>
        <h3 className="text-lg font-semibold text-text-primary">
          {title}
        </h3>
      </ModalHeader>
      
      <ModalBody scrollable>
        {children}
      </ModalBody>
      
      {onSubmit && (
        <ModalFooter>
          <button
            onClick={onClose}
            disabled={loading}
            className="btn-ghost"
          >
            {cancelText}
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Processing...' : submitText}
          </button>
        </ModalFooter>
      )}
    </Modal>
  )
}
