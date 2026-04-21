// predictor.ts
// @ts-check

import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface PredictionFactors {
  temperature?: number;
  humidity?: number;
  wind_speed?: number;
  precipitation?: number;
  pressure?: number;
  congestion?: number;
  [key: string]: any;
}

function calculateFloodRisk(weather: any, traffic: any): any {
  if (!weather.precipitation || !weather.pressure || !traffic.congestion_level) {
    throw new Error('Missing required data for flood risk calculation');
  }
  const factors: PredictionFactors = {
    precipitation: weather.precipitation,
    temperature: weather.temperature,
    pressure: weather.pressure,
  };
  let probability = 0;
  if (weather.precipitation > 5) probability += 40;
  if (weather.pressure < 1005) probability += 25;
  if (traffic.congestion_level > 50) probability += 15;
  probability += Math.random() * 20;
  const severity = probability > 70 ? 'critical' : probability > 50 ? 'high' : probability > 30 ? 'moderate' : 'low';
  const confidence = 75 + Math.random() * 20;
  return { severity, probability: Math.min(100, probability), confidence, factors };
}

function calculateFireRisk(weather: any, traffic: any): any {
  if (!weather.temperature || !weather.humidity || !weather.wind_speed) {
    throw new Error('Missing required data for fire risk calculation');
  }
  const factors: PredictionFactors = {
    temperature: weather.temperature,
    humidity: weather.humidity,
    wind_speed: weather.wind_speed,
  };
  let probability = 0;
  if (weather.temperature > 30) probability += 35;
  if (weather.humidity < 30) probability += 30;
  if (weather.wind_speed > 25) probability += 20;
  probability += Math.random() * 15;
  const severity = probability > 70 ? 'critical' : probability > 50 ? 'high' : probability > 30 ? 'moderate' : 'low';
  const confidence = 80 + Math.random() * 15;
  return { severity, probability: Math.min(100, probability), confidence, factors };
}

function calculateWindstormRisk(weather: any, traffic: any): any {
  if (!weather.wind_speed || !weather.pressure) {
    throw new Error('Missing required data for windstorm risk calculation');
  }
  const factors: PredictionFactors = {
    wind_speed: weather.wind_speed,
    pressure: weather.pressure,
  };
  let probability = 0;
  if (weather.wind_speed > 30) probability += 45;
  if (weather.pressure < 1000) probability += 30;
  probability += Math.random() * 25;
  const severity = probability > 70 ? 'critical' : probability > 50 ? 'high' : probability > 30 ? 'moderate' : 'low';
  const confidence = 70 + Math.random() * 25;
  return { severity, probability: Math.min(100, probability), confidence, factors };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing environment variables:', { supabaseUrl, supabaseKey });
      throw new Error('Missing Supabase environment variables');
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: latestWeather, error: weatherError } = await supabase
      .from('weather_data')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();
    if (weatherError) {
      console.error('Weather fetch error:', weatherError);
      throw new Error(`Weather fetch error: ${weatherError.message}`);
    }

    const { data: latestTraffic, error: trafficError } = await supabase
      .from('traffic_data')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(3);
    if (trafficError) {
      console.error('Traffic fetch error:', trafficError);
      throw new Error(`Traffic fetch error: ${trafficError.message}`);
    }

    if (!latestWeather || !latestTraffic || latestTraffic.length === 0) {
      throw new Error('Insufficient data for predictions');
    }

    const zones = ['Zone A', 'Zone B', 'Zone C'];
    const horizons = ['30min', '1hour', '3hours'];
    const predictions = [];

    for (const zone of zones) {
      const zoneTraffic = latestTraffic.find(t => t.zone === zone) || latestTraffic[0];

      const floodRisk = calculateFloodRisk(latestWeather, zoneTraffic);
      predictions.push({
        hazard_type: 'flood',
        zone,
        predicted_severity: floodRisk.severity,
        confidence_score: floodRisk.confidence,
        probability: floodRisk.probability,
        prediction_horizon: horizons[Math.floor(Math.random() * horizons.length)],
        factors: floodRisk.factors,
        valid_until: new Date(Date.now() + 3600000).toISOString(),
      });

      const fireRisk = calculateFireRisk(latestWeather, zoneTraffic);
      predictions.push({
        hazard_type: 'fire',
        zone,
        predicted_severity: fireRisk.severity,
        confidence_score: fireRisk.confidence,
        probability: fireRisk.probability,
        prediction_horizon: horizons[Math.floor(Math.random() * horizons.length)],
        factors: fireRisk.factors,
        valid_until: new Date(Date.now() + 3600000).toISOString(),
      });

      if (Math.random() > 0.5) {
        const windstormRisk = calculateWindstormRisk(latestWeather, zoneTraffic);
        predictions.push({
          hazard_type: 'windstorm',
          zone,
          predicted_severity: windstormRisk.severity,
          confidence_score: windstormRisk.confidence,
          probability: windstormRisk.probability,
          prediction_horizon: horizons[Math.floor(Math.random() * horizons.length)],
          factors: windstormRisk.factors,
          valid_until: new Date(Date.now() + 3600000).toISOString(),
        });
      }
    }

    const { error: insertError } = await supabase.from('predictions').insert(predictions);
    if (insertError) {
      console.error('Prediction insert error:', insertError);
      throw new Error(`Prediction insert error: ${insertError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        predictions,
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