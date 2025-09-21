-- Board Game Marketplace Database Schema
-- This migration creates the core tables for a board game marketplace

-- First, drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS game_players CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing functions and triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Enable required extensions (using built-in gen_random_uuid instead of uuid-ossp)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create listings table
CREATE TABLE listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  bgg_id INTEGER, -- BoardGameGeek ID for the game
  game_name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  condition TEXT NOT NULL CHECK (condition IN ('new', 'like_new', 'very_good', 'good', 'acceptable', 'poor')),
  description TEXT,
  images TEXT[] DEFAULT '{}', -- Array of image URLs
  city TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_listings_user_id ON listings(user_id);
CREATE INDEX idx_listings_bgg_id ON listings(bgg_id);
CREATE INDEX idx_listings_game_name ON listings(game_name);
CREATE INDEX idx_listings_city ON listings(city);
CREATE INDEX idx_listings_is_active ON listings(is_active);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_users_city ON users(city);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at 
  BEFORE UPDATE ON listings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- Users can read all user profiles (for marketplace browsing)
CREATE POLICY "Users are viewable by everyone" 
  ON users FOR SELECT 
  USING (true);

-- Users can only insert their own profile
CREATE POLICY "Users can insert own profile" 
  ON users FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- Users can only delete their own profile
CREATE POLICY "Users can delete own profile" 
  ON users FOR DELETE 
  USING (auth.uid() = id);

-- RLS Policies for listings table
-- Everyone can view active listings
CREATE POLICY "Active listings are viewable by everyone" 
  ON listings FOR SELECT 
  USING (is_active = true OR auth.uid() = user_id);

-- Users can create their own listings
CREATE POLICY "Users can create own listings" 
  ON listings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own listings
CREATE POLICY "Users can update own listings" 
  ON listings FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own listings
CREATE POLICY "Users can delete own listings" 
  ON listings FOR DELETE 
  USING (auth.uid() = user_id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create some useful views
CREATE OR REPLACE VIEW active_listings_with_users AS
SELECT 
  l.*,
  u.name as seller_name,
  u.city as seller_city
FROM listings l
JOIN users u ON l.user_id = u.id
WHERE l.is_active = true;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Comments for documentation
COMMENT ON TABLE users IS 'User profiles for the board game marketplace';
COMMENT ON TABLE listings IS 'Board game listings created by users';
COMMENT ON COLUMN listings.bgg_id IS 'BoardGameGeek ID for the game (optional)';
COMMENT ON COLUMN listings.condition IS 'Condition of the game: new, like_new, very_good, good, acceptable, poor';
COMMENT ON COLUMN listings.images IS 'Array of image URLs for the listing';
COMMENT ON COLUMN listings.is_active IS 'Whether the listing is currently active and visible';

-- Insert some sample data for testing (optional)
-- This will only work after you have created some auth users
-- INSERT INTO users (id, email, name, city) VALUES 
--   ('sample-uuid-1', 'test@example.com', 'Test User', 'Rīga'),
--   ('sample-uuid-2', 'seller@example.com', 'Board Game Seller', 'Liepāja');

-- INSERT INTO listings (user_id, bgg_id, game_name, price, condition, description, city, images) VALUES
--   ('sample-uuid-1', 174430, 'Gloomhaven', 89.99, 'very_good', 'Great condition, all components included', 'Rīga', ARRAY['https://example.com/image1.jpg']),
--   ('sample-uuid-2', 161936, 'Pandemic Legacy: Season 1', 45.00, 'good', 'Played through about half the campaign', 'Liepāja', ARRAY['https://example.com/image2.jpg', 'https://example.com/image3.jpg']);
