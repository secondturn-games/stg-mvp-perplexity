// Client-safe exports (no server-side dependencies)

// Client exports
export { createClient as createBrowserClient, supabase } from './client'

// Storage exports (client-side only - excluding server functions)
export {
  uploadImage,
  uploadImages,
  deleteImage,
  deleteImages,
  extractStoragePath,
  validateImageFile,
  validateImageFiles,
  STORAGE_CONFIG
} from './storage-client'

// Middleware exports (can be used in both client and server)
export { updateSession } from './middleware'

// Hook exports (client-side only)
export { useAuth, useAuthActions } from '../hooks/use-auth'

// Type exports (safe for both client and server)
export type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
  Views,
  User,
  Listing,
  ActiveListingWithUser,
  ListingWithUser,
  UserInsert,
  ListingInsert,
  UserUpdate,
  ListingUpdate,
  UserProfile,
  ListingFormData,
  ListingFilters,
  ListingSearchParams,
  GameCondition,
} from './types'

// Auth type exports (safe for both client and server)
export type {
  AuthFormData,
  AuthActionResult,
  AuthState,
  ValidationErrors,
} from '../auth/types'

export {
  getAuthErrorMessage,
  validateAuthForm,
  AUTH_ERROR_MESSAGES,
} from '../auth/types'

// Profile validation exports (safe for both client and server)
export type { ProfileFormData, ProfileValidationErrors } from '../profile/validation'
export { validateProfileForm } from '../profile/validation'

// Constants exports (safe for both client and server)
export { LATVIAN_CITIES, isValidLatvianCity, getCityOptions } from '../constants/cities'
export type { LatvianCity } from '../constants/cities'

