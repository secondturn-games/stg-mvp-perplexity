/**
 * Database types for Board Game Marketplace
 * 
 * To generate these types automatically:
 * 1. Install the Supabase CLI: npm install -g supabase
 * 2. Login: supabase login
 * 3. Generate types: supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > src/lib/supabase/types.ts
 * 
 * Current schema includes users and listings tables for board game marketplace
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type GameCondition = 'new' | 'like_new' | 'very_good' | 'good' | 'acceptable' | 'poor'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          city: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          city?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          city?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      listings: {
        Row: {
          id: string
          user_id: string
          bgg_id: number | null
          game_name: string
          price: number
          condition: GameCondition
          description: string | null
          images: string[]
          city: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bgg_id?: number | null
          game_name: string
          price: number
          condition: GameCondition
          description?: string | null
          images?: string[]
          city?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bgg_id?: number | null
          game_name?: string
          price?: number
          condition?: GameCondition
          description?: string | null
          images?: string[]
          city?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'listings_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      active_listings_with_users: {
        Row: {
          id: string
          user_id: string
          bgg_id: number | null
          game_name: string
          price: number
          condition: GameCondition
          description: string | null
          images: string[]
          city: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          seller_name: string
          seller_city: string | null
          seller_email: string
        }
        Relationships: [
          {
            foreignKeyName: 'listings_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      game_condition: GameCondition
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// Views
export type Views<T extends keyof Database['public']['Views']> =
  Database['public']['Views'][T]['Row']

// Specific table types
export type User = Tables<'users'>
export type Listing = Tables<'listings'>

// View types
export type ActiveListingWithUser = Views<'active_listings_with_users'>

// Insert types
export type UserInsert = TablesInsert<'users'>
export type ListingInsert = TablesInsert<'listings'>

// Update types
export type UserUpdate = TablesUpdate<'users'>
export type ListingUpdate = TablesUpdate<'listings'>

// Additional utility types
export type ListingWithUser = Listing & {
  seller: User
}

export type ListingFormData = Omit<ListingInsert, 'id' | 'user_id' | 'created_at' | 'updated_at'>

export type UserProfile = User

// Search and filter types
export interface ListingFilters {
  city?: string
  minPrice?: number
  maxPrice?: number
  condition?: GameCondition[]
  search?: string
  bggId?: number
}

export interface ListingSearchParams {
  page?: number
  limit?: number
  sortBy?: 'created_at' | 'price' | 'game_name'
  sortOrder?: 'asc' | 'desc'
  filters?: ListingFilters
}
