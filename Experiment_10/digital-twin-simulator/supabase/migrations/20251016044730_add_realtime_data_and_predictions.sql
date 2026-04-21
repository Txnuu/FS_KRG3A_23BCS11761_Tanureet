/*
  # Add Real-Time Data and Prediction Model Tables

  1. New Tables
    - `weather_data`
      - `id` (uuid, primary key)
      - `temperature` (decimal) - in Celsius
      - `humidity` (decimal) - percentage
      - `wind_speed` (decimal) - km/h
      - `wind_direction` (text) - cardinal direction
      - `pressure` (decimal) - hPa
      - `precipitation` (decimal) - mm
      - `conditions` (text) - weather description
      - `timestamp` (timestamptz)
    
    - `traffic_data`
      - `id` (uuid, primary key)
      - `zone` (text) - zone identifier
      - `congestion_level` (integer) - 0-100
      - `average_speed` (decimal) - km/h
      - `vehicle_count` (integer)
      - `incidents` (integer) - number of incidents
      - `timestamp` (timestamptz)
    
    - `predictions`
      - `id` (uuid, primary key)
      - `hazard_type` (text) - flood, fire, earthquake, windstorm
      - `zone` (text) - affected zone
      - `predicted_severity` (text) - low, moderate, high, critical
      - `confidence_score` (decimal) - 0-100
      - `probability` (decimal) - 0-100
      - `prediction_horizon` (text) - 30min, 1hour, 3hours, 6hours
      - `factors` (jsonb) - contributing factors
      - `created_at` (timestamptz)
      - `valid_until` (timestamptz)
    
    - `historical_events`
      - `id` (uuid, primary key)
      - `hazard_type` (text)
      - `zone` (text)
      - `severity` (text)
      - `duration_minutes` (integer)
      - `affected_population` (integer)
      - `damage_cost` (decimal)
      - `weather_conditions` (jsonb)
      - `occurred_at` (timestamptz)
    
    - `model_metrics`
      - `id` (uuid, primary key)
      - `model_name` (text)
      - `accuracy` (decimal)
      - `precision` (decimal)
      - `recall` (decimal)
      - `f1_score` (decimal)
      - `last_trained` (timestamptz)
      - `training_samples` (integer)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Restrict write operations to authenticated users

  3. Important Notes
    - Weather data updates every 10 minutes
    - Predictions are generated based on current conditions
    - Historical events feed the ML model
    - Model metrics track prediction accuracy
*/

CREATE TABLE IF NOT EXISTS weather_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temperature decimal(5, 2) NOT NULL,
  humidity decimal(5, 2) NOT NULL,
  wind_speed decimal(5, 2) NOT NULL,
  wind_direction text NOT NULL,
  pressure decimal(6, 2) NOT NULL,
  precipitation decimal(5, 2) DEFAULT 0,
  conditions text NOT NULL,
  timestamp timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS traffic_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone text NOT NULL,
  congestion_level integer NOT NULL DEFAULT 0,
  average_speed decimal(5, 2) NOT NULL,
  vehicle_count integer DEFAULT 0,
  incidents integer DEFAULT 0,
  timestamp timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hazard_type text NOT NULL,
  zone text NOT NULL,
  predicted_severity text NOT NULL,
  confidence_score decimal(5, 2) NOT NULL,
  probability decimal(5, 2) NOT NULL,
  prediction_horizon text NOT NULL,
  factors jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  valid_until timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS historical_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hazard_type text NOT NULL,
  zone text NOT NULL,
  severity text NOT NULL,
  duration_minutes integer NOT NULL,
  affected_population integer DEFAULT 0,
  damage_cost decimal(12, 2) DEFAULT 0,
  weather_conditions jsonb DEFAULT '{}',
  occurred_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS model_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name text NOT NULL UNIQUE,
  accuracy decimal(5, 2) NOT NULL,
  precision decimal(5, 2) NOT NULL,
  recall decimal(5, 2) NOT NULL,
  f1_score decimal(5, 2) NOT NULL,
  last_trained timestamptz DEFAULT now(),
  training_samples integer DEFAULT 0
);

ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view weather data"
  ON weather_data FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view traffic data"
  ON traffic_data FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view predictions"
  ON predictions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view historical events"
  ON historical_events FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view model metrics"
  ON model_metrics FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert weather data"
  ON weather_data FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert traffic data"
  ON traffic_data FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert predictions"
  ON predictions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert historical events"
  ON historical_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update model metrics"
  ON model_metrics FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_weather_timestamp ON weather_data(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_traffic_zone ON traffic_data(zone);
CREATE INDEX IF NOT EXISTS idx_traffic_timestamp ON traffic_data(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_zone ON predictions(zone);
CREATE INDEX IF NOT EXISTS idx_predictions_created ON predictions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_valid ON predictions(valid_until);
CREATE INDEX IF NOT EXISTS idx_historical_hazard ON historical_events(hazard_type);
CREATE INDEX IF NOT EXISTS idx_historical_zone ON historical_events(zone);

INSERT INTO weather_data (temperature, humidity, wind_speed, wind_direction, pressure, precipitation, conditions)
VALUES 
  (22.5, 65.0, 18.0, 'NE', 1013.25, 0.0, 'Partly Cloudy'),
  (21.8, 68.0, 22.0, 'NE', 1012.80, 2.5, 'Light Rain');

INSERT INTO traffic_data (zone, congestion_level, average_speed, vehicle_count, incidents)
VALUES 
  ('Zone A', 35, 45.5, 1240, 0),
  ('Zone B', 75, 22.3, 2850, 2),
  ('Zone C', 20, 58.7, 890, 0);

INSERT INTO predictions (hazard_type, zone, predicted_severity, confidence_score, probability, prediction_horizon, factors, valid_until)
VALUES 
  ('flood', 'Zone A', 'high', 87.5, 85.0, '1hour', 
   '{"rainfall": "heavy", "drainage": "poor", "elevation": "low"}', 
   now() + interval '1 hour'),
  ('fire', 'Zone B', 'critical', 92.3, 95.0, '30min', 
   '{"temperature": "high", "humidity": "low", "wind": "strong"}', 
   now() + interval '30 minutes'),
  ('windstorm', 'Zone C', 'moderate', 73.2, 45.0, '3hours', 
   '{"pressure": "dropping", "wind_speed": "increasing"}', 
   now() + interval '3 hours');

INSERT INTO historical_events (hazard_type, zone, severity, duration_minutes, affected_population, damage_cost, weather_conditions)
VALUES 
  ('flood', 'Zone A', 'high', 180, 5200, 2500000.00, 
   '{"rainfall": 45, "wind_speed": 25, "temperature": 18}'),
  ('fire', 'Zone B', 'critical', 240, 3800, 4200000.00, 
   '{"temperature": 32, "humidity": 15, "wind_speed": 35}'),
  ('earthquake', 'Zone C', 'moderate', 15, 12000, 8500000.00, 
   '{"magnitude": 4.5, "depth": 10}');

INSERT INTO model_metrics (model_name, accuracy, precision, recall, f1_score, training_samples)
VALUES 
  ('FloodPredictionModel', 89.5, 87.2, 91.3, 89.2, 15000),
  ('FireRiskModel', 92.1, 90.5, 93.8, 92.1, 12500),
  ('EarthquakeForecastModel', 78.3, 75.8, 80.2, 77.9, 8000),
  ('WindstormPredictionModel', 85.7, 83.4, 87.9, 85.6, 10500);