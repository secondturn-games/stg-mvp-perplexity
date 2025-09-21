'use client'

import { lazy, Suspense } from 'react'
import { SectionLoading } from './loading-states'

// Lazy load heavy components for better performance
export const LazyMarketplaceFilters = lazy(() => 
  import('../listings/marketplace-filters').then(module => ({ 
    default: module.MarketplaceFilters 
  }))
)

export const LazyBggGameSelector = lazy(() => 
  import('../listings/bgg-game-selector').then(module => ({ 
    default: module.BggGameSelector 
  }))
)

export const LazyImageUpload = lazy(() => 
  import('../listings/image-upload').then(module => ({ 
    default: module.ImageUpload 
  }))
)

export const LazyCreateListingForm = lazy(() => 
  import('../listings/create-listing-form').then(module => ({ 
    default: module.CreateListingForm 
  }))
)

export const LazyProfileEdit = lazy(() => 
  import('../profile/profile-edit').then(module => ({ 
    default: module.ProfileEdit 
  }))
)

// Wrapper components with Suspense
export function MarketplaceFiltersLazy(props: any) {
  return (
    <Suspense fallback={<SectionLoading message="Loading filters..." size="sm" />}>
      <LazyMarketplaceFilters {...props} />
    </Suspense>
  )
}

export function BggGameSelectorLazy(props: any) {
  return (
    <Suspense fallback={<SectionLoading message="Loading game selector..." size="sm" />}>
      <LazyBggGameSelector {...props} />
    </Suspense>
  )
}

export function ImageUploadLazy(props: any) {
  return (
    <Suspense fallback={<SectionLoading message="Loading image uploader..." size="sm" />}>
      <LazyImageUpload {...props} />
    </Suspense>
  )
}

export function CreateListingFormLazy(props: any) {
  return (
    <Suspense fallback={<SectionLoading message="Loading form..." />}>
      <LazyCreateListingForm {...props} />
    </Suspense>
  )
}

export function ProfileEditLazy(props: any) {
  return (
    <Suspense fallback={<SectionLoading message="Loading profile editor..." />}>
      <LazyProfileEdit {...props} />
    </Suspense>
  )
}
