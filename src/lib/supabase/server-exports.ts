// Server-only exports (includes server-side dependencies)

// Server exports  
export { createClient as createServerClient, createAdminClient } from './server'

// Storage server exports
export { uploadImageServer, deleteImageServer } from './storage-server'

// Auth exports (server-side)
export {
  getUser,
  getSession,
  signOut,
  isAuthenticated,
  requireAuth,
  getUserProfile,
  updateUserProfile,
  getUserListings,
  getUserActiveListings,
} from './auth'

// Listings exports (server-side)
export {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  toggleListingStatus,
  getListingsByCity,
  searchListings,
  getRecentListings,
  getListingsByBggId,
  getListingCities,
} from './listings'

// Auth action exports (server-side)
export {
  signUpAction,
  signInAction,
  signOutAction,
  resetPasswordAction,
  updatePasswordAction,
  resendConfirmationAction,
} from '../auth/actions'

// Profile action exports (server-side)
export { updateProfileAction, deleteAccountAction } from '../profile/actions'

// Re-export all client-safe exports
export * from './client-exports'

