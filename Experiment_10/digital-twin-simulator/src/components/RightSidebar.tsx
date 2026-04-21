import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Alert } from '../lib/supabase';

interface RightSidebarProps {
  alerts: Alert[];
}

export function RightSidebar({ alerts }: RightSidebarProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-[#EF233C] bg-[#EF233C]/10 text-[#EF233C]';
      case 'warning':
        return 'border-[#FFD60A] bg-[#FFD60A]/10 text-[#FFD60A]';
      default:
        return 'border-[#06D6A0] bg-[#06D6A0]/10 text-[#06D6A0]';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="w-80 bg-[#0B0F1A]/80 backdrop-blur-md border-l border-[#1E293B] p-4 space-y-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#00B4D8] uppercase text-xs font-bold tracking-wider">
          Live Alert Feed
        </h2>
        <div className="flex gap-2">
          <button className="p-1.5 rounded bg-[#1E293B] hover:bg-[#00B4D8]/20 transition-colors">
            <div className="w-2 h-2 rounded-full bg-[#EF233C]" />
          </button>
          <button className="p-1.5 rounded bg-[#1E293B] hover:bg-[#00B4D8]/20 transition-colors">
            <div className="w-2 h-2 rounded-full bg-[#FFD60A]" />
          </button>
          <button className="p-1.5 rounded bg-[#1E293B] hover:bg-[#00B4D8]/20 transition-colors">
            <div className="w-2 h-2 rounded-full bg-[#06D6A0]" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`glass-card p-4 rounded-xl border ${getSeverityColor(alert.severity)} transition-all hover:scale-[1.02]`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {getSeverityIcon(alert.severity)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {alert.severity}
                  </span>
                  <span className="text-xs opacity-60">
                    {getTimeAgo(alert.created_at)}
                  </span>
                </div>

                <p className="text-sm text-[#E0E0E0] mb-2">
                  {alert.message}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs opacity-60">
                    {alert.zone}
                  </span>

                  {alert.acknowledged ? (
                    <div className="flex items-center gap-1 text-xs text-[#06D6A0]">
                      <CheckCircle className="w-3 h-3" />
                      <span>Acknowledged</span>
                    </div>
                  ) : (
                    <button className="text-xs text-[#00B4D8] hover:text-[#00B4D8]/80 transition-colors">
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
