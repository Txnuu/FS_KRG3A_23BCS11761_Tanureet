// data_generator.ts
// @ts-check

import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Load environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing environment variables:', { supabaseUrl, supabaseKey });
      throw new Error('Missing Supabase environment variables');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate weather data with validation
    const weatherData = {
      temperature: Math.max(0, 20 + Math.random() * 15),
      humidity: Math.max(0, Math.min(100, 40 + Math.random() * 40)),
      wind_speed: Math.max(0, 10 + Math.random() * 30),
      wind_direction: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      pressure: Math.max(0, 1000 + Math.random() * 30),
      precipitation: Math.random() > 0.7 ? Math.max(0, Math.random() * 10) : 0,
      conditions: ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain', 'Thunderstorm'][Math.floor(Math.random() * 6)],
      timestamp: new Date().toISOString(),
    };

    // Insert weather data
    const { error: weatherError } = await supabase.from('weather_data').insert(weatherData);
    if (weatherError) {
      console.error('Weather insert error:', weatherError);
      throw new Error(`Weather insert error: ${weatherError.message}`);
    }

    // Generate traffic data
    const zones = ['Zone A', 'Zone B', 'Zone C'];
    const trafficDataArray = zones.map(zone => ({
      zone,
      congestion_level: Math.floor(Math.random() * 100),
      average_speed: Math.max(0, 20 + Math.random() * 60),
      vehicle_count: Math.floor(500 + Math.random() * 2000),
      incidents: Math.random() > 0.8 ? Math.floor(Math.random() * 3) : 0,
      timestamp: new Date().toISOString(),
    }));

    // Insert traffic data
    const { error: trafficError } = await supabase.from('traffic_data').insert(trafficDataArray);
    if (trafficError) {
      console.error('Traffic insert error:', trafficError);
      throw new Error(`Traffic insert error: ${trafficError.message}`);
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        weather: weatherData,
        traffic: trafficDataArray,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: unknown) {
    // Handle errors safely
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Caught error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});