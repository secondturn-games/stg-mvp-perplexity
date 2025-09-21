-- Secure email access and improve privacy protection
-- This migration addresses email privacy concerns and adds proper access controls

-- First, update the active_listings_with_users view to NOT expose seller email by default
CREATE OR REPLACE VIEW active_listings_with_users AS
SELECT 
  l.id,
  l.user_id,
  l.bgg_id,
  l.game_name,
  l.price,
  l.condition,
  l.description,
  l.images,
  l.city,
  l.is_active,
  l.created_at,
  l.updated_at,
  u.name as seller_name,
  u.city as seller_city
  -- Note: seller_email is NOT included for privacy
FROM listings l
JOIN users u ON l.user_id = u.id
WHERE l.is_active = true;

-- Create a separate secure view for authenticated access to seller contact info
-- This view includes email but requires authentication and proper access control
CREATE OR REPLACE VIEW secure_listing_contact AS
SELECT 
  l.id,
  l.user_id,
  l.game_name,
  l.price,
  u.name as seller_name,
  u.email as seller_email,
  u.city as seller_city
FROM listings l
JOIN users u ON l.user_id = u.id
WHERE l.is_active = true;

-- Enable RLS on the secure view
ALTER VIEW secure_listing_contact SET (security_invoker = on);

-- Create RLS policy for secure_listing_contact view
-- Only authenticated users can access seller contact information
CREATE POLICY "Authenticated users can view seller contact info" 
  ON listings FOR SELECT 
  USING (
    auth.role() = 'authenticated' 
    AND is_active = true
  );

-- Create a function to get seller contact info securely
-- This function ensures only authenticated users can access seller emails
CREATE OR REPLACE FUNCTION get_seller_contact_info(listing_id UUID)
RETURNS TABLE(
  seller_name TEXT,
  seller_email TEXT,
  seller_city TEXT
) AS $$
BEGIN
  -- Check if user is authenticated
  IF auth.role() != 'authenticated' THEN
    RAISE EXCEPTION 'Authentication required to access seller contact information';
  END IF;

  RETURN QUERY
  SELECT 
    u.name,
    u.email,
    u.city
  FROM listings l
  JOIN users u ON l.user_id = u.id
  WHERE l.id = listing_id 
    AND l.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users only
GRANT EXECUTE ON FUNCTION get_seller_contact_info(UUID) TO authenticated;

-- Create audit table for security monitoring
CREATE TABLE IF NOT EXISTS security_audit (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on audit table
ALTER TABLE security_audit ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs (service role)
CREATE POLICY "Only service role can access audit logs" 
  ON security_audit FOR ALL
  USING (auth.role() = 'service_role');

-- Create function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO security_audit (
    user_id,
    action,
    resource_type,
    resource_id,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id,
    p_ip_address,
    p_user_agent
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION log_security_event(TEXT, TEXT, TEXT, INET, TEXT) TO authenticated;

-- Add indexes for performance
CREATE INDEX idx_security_audit_user_id ON security_audit(user_id);
CREATE INDEX idx_security_audit_action ON security_audit(action);
CREATE INDEX idx_security_audit_created_at ON security_audit(created_at DESC);

-- Comments for documentation
COMMENT ON VIEW secure_listing_contact IS 'Secure view for accessing seller contact information - requires authentication';
COMMENT ON FUNCTION get_seller_contact_info(UUID) IS 'Securely retrieves seller contact information for authenticated users only';
COMMENT ON TABLE security_audit IS 'Security audit log for monitoring access to sensitive data';
COMMENT ON FUNCTION log_security_event(TEXT, TEXT, TEXT, INET, TEXT) IS 'Logs security-related events for monitoring and compliance';
