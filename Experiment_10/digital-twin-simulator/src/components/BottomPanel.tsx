import { Play, Pause, RotateCcw, TrendingUp } from 'lucide-react';
import { EvacuationRoute } from '../lib/supabase';
import { useState } from 'react';

interface BottomPanelProps {
  routes: EvacuationRoute[];
}

export function BottomPanel({ routes }: BottomPanelProps) {
  const [isSimulating, setIsSimulating] = useState(false);

  const totalEvacuees = routes.reduce((sum, r) => sum + r.evacuees_count, 0);
  const avgCongestion = routes.length > 0
    ? Math.round(routes.reduce((sum, r) => sum + r.congestion_level, 0) / routes.length)
    : 0;
  const openRoutes = routes.filter(r => r.status === 'open').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-[#06D6A0]';
      case 'congested':
        return 'bg-[#FFD60A]';
      case 'closed':
        return 'bg-[#EF233C]';
      default:
        return 'bg-[#1E293B]';
    }
  };

  return (
    <div className="h-48 bg-[#0B0F1A]/80 backdrop-blur-md border-t border-[#1E293B] p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#00B4D8] uppercase text-xs font-bold tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Evacuation 
        </h2>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3 glass-card p-4 rounded-xl">
          <div className="text-[#E0E0E0] text-xs mb-2">Total Evacuees</div>
          <div className="text-3xl font-bold text-white">{totalEvacuees.toLocaleString()}</div>
          <div className="text-[#06D6A0] text-xs mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+12% from last hour</span>
          </div>
        </div>

        <div className="col-span-3 glass-card p-4 rounded-xl">
          <div className="text-[#E0E0E0] text-xs mb-2">Avg Congestion</div>
          <div className={`text-3xl font-bold ${
            avgCongestion > 70 ? 'text-[#EF233C]' : avgCongestion > 40 ? 'text-[#FFD60A]' : 'text-[#06D6A0]'
          }`}>
            {avgCongestion}%
          </div>
          <div className="text-[#E0E0E0] text-xs mt-1">Across all routes</div>
        </div>

        <div className="col-span-3 glass-card p-4 rounded-xl">
          <div className="text-[#E0E0E0] text-xs mb-2">Open Routes</div>
          <div className="text-3xl font-bold text-[#06D6A0]">{openRoutes}/{routes.length}</div>
          <div className="text-[#E0E0E0] text-xs mt-1">Routes operational</div>
        </div>

        <div className="col-span-3 glass-card p-4 rounded-xl">
          <div className="text-[#E0E0E0] text-xs mb-2">Avg Time</div>
          <div className="text-3xl font-bold text-white">18m</div>
          <div className="text-[#E0E0E0] text-xs mt-1">Evacuation duration</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {routes.map((route) => (
          <div key={route.id} className="glass-card p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#E0E0E0] text-sm font-semibold">{route.name}</span>
              <div className={`w-2 h-2 rounded-full ${getStatusColor(route.status)}`} />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#E0E0E0]/60">Evacuees</span>
              <span className="text-[#E0E0E0] font-semibold">{route.evacuees_count}</span>
            </div>

            <div className="mt-2 h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  route.congestion_level > 70 ? 'bg-[#EF233C]' :
                  route.congestion_level > 40 ? 'bg-[#FFD60A]' : 'bg-[#06D6A0]'
                }`}
                style={{ width: `${route.congestion_level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
