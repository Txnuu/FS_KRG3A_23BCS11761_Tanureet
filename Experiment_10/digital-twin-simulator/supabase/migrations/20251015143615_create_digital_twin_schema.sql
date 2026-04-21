/*
  # Digital Twin Multi-Hazard City Simulator Schema

  1. New Tables
    - `hazards`
      - `id` (uuid, primary key)
      - `type` (text) - flood, fire, earthquake, windstorm
      - `zone` (text) - affected zone identifier
      - `severity` (text) - low, moderate, high, critical
      - `risk_percentage` (integer) - 0-100
      - `lat` (decimal) - latitude coordinate
      - `lng` (decimal) - longitude coordinate
      - `radius` (integer) - affected radius in meters
      - `active` (boolean) - whether hazard is currently active
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `alerts`
      - `id` (uuid, primary key)
      - `message` (text) - alert message content
      - `severity` (text) - info, warning, critical
      - `zone` (text) - affected zone
      - `acknowledged` (boolean) - whether alert has been acknowledged
      - `created_at` (timestamptz)
    
    - `evacuation_routes`
      - `id` (uuid, primary key)
      - `name` (text) - route identifier
      - `start_lat` (decimal)
      - `start_lng` (decimal)
      - `end_lat` (decimal)
      - `end_lng` (decimal)
      - `status` (text) - open, congested, closed
      - `congestion_level` (integer) - 0-100
      - `evacuees_count` (integer) - current number of evacuees
      - `updated_at` (timestamptz)
    
    - `shelters`
      - `id` (uuid, primary key)
      - `name` (text)
      - `lat` (decimal)
      - `lng` (decimal)
      - `capacity` (integer)
      - `current_occupancy` (integer)
      - `type` (text) - shelter, hospital, safe_zone
      - `status` (text) - available, full, closed

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (public simulator interface)
    - Restrict write operations to authenticated users only

  3. Important Notes
    - All coordinates use standard lat/lng decimal format
    - Timestamps use timestamptz for timezone awareness
    - Default values ensure data integrity
    - Indexes added for frequently queried columns
*/

-- Create hazards table
CREATE TABLE IF NOT EXISTS hazards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  zone text NOT NULL,
  severity text NOT NULL DEFAULT 'moderate',
  risk_percentage integer NOT NULL DEFAULT 50,
  lat decimal(10, 8) NOT NULL,
  lng decimal(11, 8) NOT NULL,
  radius integer NOT NULL DEFAULT 1000,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  severity text NOT NULL DEFAULT 'info',
  zone text NOT NULL,
  acknowledged boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create evacuation_routes table
CREATE TABLE IF NOT EXISTS evacuation_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_lat decimal(10, 8) NOT NULL,
  start_lng decimal(11, 8) NOT NULL,
  end_lat decimal(10, 8) NOT NULL,
  end_lng decimal(11, 8) NOT NULL,
  status text NOT NULL DEFAULT 'open',
  congestion_level integer DEFAULT 0,
  evacuees_count integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Create shelters table
CREATE TABLE IF NOT EXISTS shelters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  lat decimal(10, 8) NOT NULL,
  lng decimal(11, 8) NOT NULL,
  capacity integer NOT NULL DEFAULT 100,
  current_occupancy integer DEFAULT 0,
  type text NOT NULL DEFAULT 'shelter',
  status text NOT NULL DEFAULT 'available'
);

-- Enable RLS
ALTER TABLE hazards ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE evacuation_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shelters ENABLE ROW LEVEL SECURITY;

-- Public read policies (simulator is public-facing)
CREATE POLICY "Anyone can view hazards"
  ON hazards FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view alerts"
  ON alerts FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view evacuation routes"
  ON evacuation_routes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view shelters"
  ON shelters FOR SELECT
  USING (true);

-- Authenticated users can insert/update (for simulation control)
CREATE POLICY "Authenticated users can insert hazards"
  ON hazards FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update hazards"
  ON hazards FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert alerts"
  ON alerts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update alerts"
  ON alerts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update routes"
  ON evacuation_routes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update shelters"
  ON shelters FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_hazards_active ON hazards(active);
CREATE INDEX IF NOT EXISTS idx_hazards_zone ON hazards(zone);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_routes_status ON evacuation_routes(status);

-- Insert sample data for demonstration
INSERT INTO hazards (type, zone, severity, risk_percentage, lat, lng, radius, active)
VALUES 
  ('flood', 'Zone A', 'high', 85, 40.7128, -74.0060, 2000, true),
  ('fire', 'Zone B', 'critical', 95, 40.7580, -73.9855, 1500, true),
  ('earthquake', 'Zone C', 'moderate', 45, 40.7489, -73.9680, 3000, false);

INSERT INTO alerts (message, severity, zone, acknowledged)
VALUES 
  ('Bridge 3 closed due to rising water', 'critical', 'Zone A', false),
  ('Evacuation recommended for Sector C', 'warning', 'Zone C', false),
  ('Fire department en route to Zone B', 'info', 'Zone B', false);

INSERT INTO evacuation_routes (name, start_lat, start_lng, end_lat, end_lng, status, congestion_level, evacuees_count)
VALUES 
  ('Route Alpha', 40.7128, -74.0060, 40.7589, -73.9851, 'open', 35, 120),
  ('Route Beta', 40.7580, -73.9855, 40.7828, -73.9653, 'congested', 75, 240),
  ('Route Gamma', 40.7489, -73.9680, 40.7794, -73.9632, 'open', 20, 80);

INSERT INTO shelters (name, lat, lng, capacity, current_occupancy, type, status)
VALUES 
  ('Central Shelter', 40.7589, -73.9851, 500, 120, 'shelter', 'available'),
  ('City Hospital', 40.7828, -73.9653, 200, 180, 'hospital', 'available'),
  ('North Safe Zone', 40.7794, -73.9632, 1000, 85, 'safe_zone', 'available');