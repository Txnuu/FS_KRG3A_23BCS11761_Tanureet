import { Cloud, Wind, Droplets, TrendingUp, Thermometer } from 'lucide-react';
import { Hazard, WeatherData } from '../lib/supabase';

interface LeftSidebarProps {
  hazards: Hazard[];
  weather: WeatherData | null;
}

export function LeftSidebar({ hazards, weather }: LeftSidebarProps) {
  const activeHazards = hazards.filter(h => h.active);
  const avgRisk =
    activeHazards.length > 0
      ? Math.round(activeHazards.reduce((sum, h) => sum + h.risk_percentage, 0) / activeHazards.length)
      : 0;

  const affectedCitizens = activeHazards.length * 1247;

  return (
    <div className="w-80 bg-[#0B0F1A]/80 backdrop-blur-md border-r border-[#1E293B] p-4 space-y-4 overflow-y-auto">
      {/* City Overview */}
      <div className="glass-card p-4 rounded-xl">
        <h2 className="text-[#00B4D8] uppercase text-xs font-bold tracking-wider mb-4">
          City Overview
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[#E0E0E0] text-sm">Hazard Index</span>
            <span
              className={`text-lg font-bold ${
                avgRisk > 70 ? 'text-[#EF233C]' : avgRisk > 40 ? 'text-[#FFD60A]' : 'text-[#06D6A0]'
              }`}
            >
              {avgRisk}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#E0E0E0] text-sm">Affected Citizens</span>
            <span className="text-[#E0E0E0] text-lg font-bold">{affectedCitizens.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#E0E0E0] text-sm">Active Hazards</span>
            <span className="text-[#FFD60A] text-lg font-bold">{activeHazards.length}</span>
          </div>
        </div>
      </div>

      {/* Real-Time Weather */}
      <div className="glass-card p-4 rounded-xl">
        <h2 className="text-[#00B4D8] uppercase text-xs font-bold tracking-wider mb-4">Real-Time Weather</h2>

        {weather ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Cloud className="w-5 h-5 text-[#00B4D8]" />
              <div className="flex-1">
                <div className="text-[#E0E0E0] text-sm">Conditions</div>
                <div className="text-white font-semibold">{weather.conditions}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-[#00B4D8]" />
              <div className="flex-1">
                <div className="text-[#E0E0E0] text-sm">Temperature</div>
                <div className="text-white font-semibold">{Math.round(weather.temperature)}°C</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Wind className="w-5 h-5 text-[#00B4D8]" />
              <div className="flex-1">
                <div className="text-[#E0E0E0] text-sm">Wind Speed</div>
                <div className="text-white font-semibold">
                  {Math.round(weather.wind_speed)} km/h {weather.wind_direction}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Droplets className="w-5 h-5 text-[#00B4D8]" />
              <div className="flex-1">
                <div className="text-[#E0E0E0] text-sm">Humidity</div>
                <div className="text-white font-semibold">{Math.round(weather.humidity)}%</div>
              </div>
            </div>

            {weather.precipitation > 0 && (
              <div className="p-2 bg-[#00B4D8]/10 border border-[#00B4D8]/30 rounded-lg">
                <div className="text-[#00B4D8] text-xs font-semibold">
                  Precipitation: {weather.precipitation.toFixed(1)} mm
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-[#E0E0E0]/60 text-sm">Loading weather data...</div>
        )}
      </div>

      {/* ML Predictions */}
      <div className="glass-card p-4 rounded-xl">
        <h2 className="text-[#00B4D8] uppercase text-xs font-bold tracking-wider mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          ML Predictions
        </h2>

        <div className="space-y-4">
          {activeHazards.slice(0, 3).map((hazard) => (
            <div key={hazard.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#E0E0E0] text-sm capitalize">
                  {hazard.type} Risk ({hazard.zone})
                </span>
                <span
                  className={`text-sm font-bold ${
                    hazard.risk_percentage > 70
                      ? 'text-[#EF233C]'
                      : hazard.risk_percentage > 40
                      ? 'text-[#FFD60A]'
                      : 'text-[#06D6A0]'
                  }`}
                >
                  {hazard.risk_percentage}%
                </span>
              </div>

              <div className="h-2 bg-[#1E293B] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    hazard.risk_percentage > 70
                      ? 'bg-[#EF233C]'
                      : hazard.risk_percentage > 40
                      ? 'bg-[#FFD60A]'
                      : 'bg-[#06D6A0]'
                  }`}
                  style={{ width: `${hazard.risk_percentage}%` }}
                />
              </div>

              <div className="text-xs text-[#E0E0E0]/60">
                Confidence: {Math.round(85 + Math.random() * 10)}%
              </div>
            </div>
          ))}

          <div className="mt-4 p-3 bg-[#FFD60A]/10 border border-[#FFD60A]/30 rounded-lg">
            <div className="text-[#FFD60A] text-xs font-semibold mb-1">FORECAST</div>
            <div className="text-[#E0E0E0] text-sm">Expected wind surge: 20 km/h in 30 min</div>
          </div>
        </div>
      </div>
    </div>
  );
}
