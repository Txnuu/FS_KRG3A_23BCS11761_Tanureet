import { useEffect, useState } from 'react';
import { TopBar } from './components/TopBar';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import MapView from './components/MapView';
import { BottomPanel } from './components/BottomPanel';
import { PredictionsPanel } from './components/PredictionsPanel';
import "leaflet/dist/leaflet.css";
import {
  supabase,
  Hazard,
  Alert,
  EvacuationRoute,
  Shelter,
  WeatherData,
  Prediction,
  ModelMetric,
  fetchRealtimeData,
  generatePredictions,
} from './lib/supabase';

function App() {
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [routes, setRoutes] = useState<EvacuationRoute[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [modelMetrics, setModelMetrics] = useState<ModelMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
    fetchRealtimeDataPeriodically();
    fetchPredictionsPeriodically();

    const dataInterval = setInterval(() => {
      simulateDataUpdates();
    }, 3000);

    const realtimeInterval = setInterval(() => {
      fetchRealtimeDataPeriodically();
    }, 60000);

    const predictionsInterval = setInterval(() => {
      fetchPredictionsPeriodically();
    }, 120000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(realtimeInterval);
      clearInterval(predictionsInterval);
    };
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [hazardsRes, alertsRes, routesRes, sheltersRes, metricsRes] = await Promise.all([
        supabase.from('hazards').select('*').order('created_at', { ascending: false }),
        supabase.from('alerts').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('evacuation_routes').select('*'),
        supabase.from('shelters').select('*'),
        supabase.from('model_metrics').select('*'),
      ]);

      if (hazardsRes.data) setHazards(hazardsRes.data as Hazard[]);
      if (alertsRes.data) setAlerts(alertsRes.data as Alert[]);
      if (routesRes.data) setRoutes(routesRes.data as EvacuationRoute[]);
      if (sheltersRes.data) setShelters(sheltersRes.data as Shelter[]);
      if (metricsRes.data) setModelMetrics(metricsRes.data as ModelMetric[]);
    } catch (error) {
      console.error('Initial data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRealtimeDataPeriodically = async () => {
    try {
      const response = await fetch('http://localhost:8000');
      const data = await response.json();
      if (data.success) {
        const newWeather = data.weather as WeatherData;
        setWeather(newWeather);

        const trafficHazards: Hazard[] = data.traffic.map((t: any) => ({
          id: `traffic-${t.zone}-${Date.now()}`,
          type: 'traffic',
          zone: t.zone,
          severity: t.congestion_level > 50 ? 'high' : 'moderate',
          risk_percentage: t.congestion_level,
          lat: 40.7128, // Default to NYC; adjust per zone if needed
          lng: -74.0060,
          radius: 1500,
          active: t.incidents > 0,
          created_at: t.timestamp,
          updated_at: data.timestamp,
        }));
        setHazards((prev) => [
          ...prev.filter((h) => h.type !== 'traffic' && h.type !== 'weather'),
          ...trafficHazards,
          {
            id: `weather-${Date.now()}`,
            type: 'weather',
            zone: 'Global',
            severity: newWeather.precipitation > 5 ? 'high' : 'moderate',
            risk_percentage: Math.min(100, newWeather.precipitation * 10),
            lat: 40.7128,
            lng: -74.0060,
            radius: 2000,
            active: newWeather.precipitation > 0,
            created_at: newWeather.timestamp,
            updated_at: data.timestamp,
          },
        ]);
      }
    } catch (error) {
      console.error('Realtime data fetch error:', error);
    }
  };

  const fetchPredictionsPeriodically = async () => {
    try {
      await generatePredictions();
      const { data: latestPredictions } = await supabase
        .from('predictions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (latestPredictions) setPredictions(latestPredictions as Prediction[]);
    } catch (error) {
      console.error('Failed to generate predictions:', error);
    }
  };

  const simulateDataUpdates = () => {
    setHazards((prev) =>
      prev.map((hazard) => ({
        ...hazard,
        risk_percentage: Math.max(
          10,
          Math.min(99, hazard.risk_percentage + (Math.random() - 0.5) * 10)
        ),
      }))
    );

    setRoutes((prev) =>
      prev.map((route) => ({
        ...route,
        congestion_level: Math.max(
          0,
          Math.min(100, route.congestion_level + (Math.random() - 0.5) * 15)
        ),
        evacuees_count: Math.max(
          0,
          route.evacuees_count + Math.floor((Math.random() - 0.4) * 20)
        ),
      }))
    );

    if (Math.random() > 0.7) {
      const newAlert: Alert = {
        id: `temp-${Date.now()}`,
        message: getRandomAlertMessage(),
        severity: ['info', 'warning', 'critical'][Math.floor(Math.random() * 3)] as any,
        zone: ['Zone A', 'Zone B', 'Zone C'][Math.floor(Math.random() * 3)],
        acknowledged: false,
        created_at: new Date().toISOString(),
      };
      setAlerts((prev) => [newAlert, ...prev.slice(0, 9)]);
    }
  };

  const getRandomAlertMessage = () => {
    const messages = [
      'Emergency services dispatched to affected area',
      'Traffic diverted on main highway',
      'Shelter capacity updated',
      'Weather conditions improving',
      'Evacuation route cleared',
      'New hazard zone identified',
      'Power restored to sector',
      'Medical teams on standby',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="h-screen bg-[#0B0F1A] text-white flex flex-col overflow-hidden">
      <TopBar emergencyMode={emergencyMode} onEmergencyToggle={() => setEmergencyMode(!emergencyMode)} />

      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar hazards={hazards} weather={weather} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <MapView hazards={hazards} shelters={shelters} />
          <BottomPanel routes={routes} />
        </div>

        <RightSidebar alerts={alerts} />
        <PredictionsPanel predictions={predictions} modelMetrics={modelMetrics} />
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <span className="text-white">Loading...</span>
        </div>
      )}
    </div>
  );
}

export default App;