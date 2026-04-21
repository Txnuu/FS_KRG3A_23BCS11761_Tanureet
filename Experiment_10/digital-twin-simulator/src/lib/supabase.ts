import { createClient } from '@supabase/supabase-js';

// ✅ Use Vite environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

// ✅ Log for debugging (you can remove later)
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseAnonKey ? 'Loaded ✅' : 'Missing ❌');

// ✅ Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key. Check your .env file!');
}

// ✅ Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* -------------------------------------------------------------------------- */
/*                              Type Definitions                              */
/* -------------------------------------------------------------------------- */

export interface Hazard {
  id: string;
  type: string;
  zone: string;
  severity: string;
  risk_percentage: number;
  lat: number;
  lng: number;
  radius: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type Alert = {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  zone: string;
  acknowledged: boolean;
  created_at: string;
};

export type EvacuationRoute = {
  id: string;
  name: string;
  start_lat: number;
  start_lng: number;
  end_lat: number;
  end_lng: number;
  status: 'open' | 'congested' | 'closed';
  congestion_level: number;
  evacuees_count: number;
  updated_at: string;
};

export type Shelter = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  current_occupancy: number;
  type: 'shelter' | 'hospital' | 'safe_zone';
  status: 'available' | 'full' | 'closed';
};

export type WeatherData = {
  id: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  wind_direction: string;
  pressure: number;
  precipitation: number;
  conditions: string;
  timestamp: string;
};

export type TrafficData = {
  id: string;
  zone: string;
  congestion_level: number;
  average_speed: number;
  vehicle_count: number;
  incidents: number;
  timestamp: string;
};

export type Prediction = {
  id: string;
  hazard_type: 'flood' | 'fire' | 'earthquake' | 'windstorm';
  zone: string;
  predicted_severity: 'low' | 'moderate' | 'high' | 'critical';
  confidence_score: number;
  probability: number;
  prediction_horizon: '30min' | '1hour' | '3hours' | '6hours';
  factors: Record<string, any>;
  created_at: string;
  valid_until: string;
};

export type ModelMetric = {
  id: string;
  model_name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  last_trained: string;
  training_samples: number;
};

/* -------------------------------------------------------------------------- */
/*                              Helper Functions                              */
/* -------------------------------------------------------------------------- */

// ✅ Fetch real-time weather/traffic data from a local API or mock
export async function fetchRealtimeData(): Promise<{
  success: boolean;
  weather?: WeatherData;
  traffic?: TrafficData[];
  error?: string;
}> {
  const apiUrl = 'http://localhost:8000'; // local backend or mock server
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch real-time data:', error);
    return { success: false, error: (error as Error).message };
  }
}

// ✅ Generate predictions using a Supabase Edge Function or REST endpoint
export async function generatePredictions(): Promise<any> {
  const apiUrl = `${supabaseUrl}/functions/v1/generate-predictions`;
  const headers = {
    Authorization: `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(apiUrl, { headers });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to generate predictions:', error);
    return { success: false, error: (error as Error).message };
  }
}
