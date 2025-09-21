-- Add seller email to the active listings view
-- This allows us to show seller contact information on listing detail pages

-- Update the active_listings_with_users view to include seller email
CREATE OR REPLACE VIEW active_listings_with_users AS
SELECT 
  l.*,
  u.name as seller_name,
  u.city as seller_city,
  u.email as seller_email
FROM listings l
JOIN users u ON l.user_id = u.id
WHERE l.is_active = true;

-- Add comment to document the change
COMMENT ON VIEW active_listings_with_users IS 'Active listings with seller information including email for contact purposes';

