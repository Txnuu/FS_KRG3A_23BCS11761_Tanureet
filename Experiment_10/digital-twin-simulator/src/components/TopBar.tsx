import { Clock, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TopBarProps {
  emergencyMode: boolean;
  onEmergencyToggle: () => void;
}

export function TopBar({ emergencyMode, onEmergencyToggle }: TopBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-16 bg-[#0B0F1A] border-b border-[#1E293B] px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-[#00B4D8] uppercase tracking-wider">
          Smart Evac
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-[#E0E0E0]">
          <Clock className="w-4 h-4" />
          <span className="font-mono text-sm">
            {currentTime.toLocaleTimeString()}
          </span>
        </div>

        <select className="bg-[#1E293B] text-[#E0E0E0] px-4 py-2 rounded-lg border border-[#00B4D8]/30 focus:outline-none focus:border-[#00B4D8]">
          <option>New York City</option>
          <option>Los Angeles</option>
          <option>Chicago</option>
        </select>

        <button
          onClick={onEmergencyToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
            emergencyMode
              ? 'bg-[#EF233C] text-white shadow-[0_0_20px_rgba(239,35,60,0.5)] animate-pulse'
              : 'bg-[#1E293B] text-[#E0E0E0] border border-[#1E293B]'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span className="uppercase text-xs tracking-wider">Emergency Mode</span>
        </button>
      </div>
    </div>
  );
}
