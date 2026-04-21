import { Brain, TrendingUp, Clock, Target } from 'lucide-react';
import { Prediction, ModelMetric } from '../lib/supabase';

interface PredictionsPanelProps {
  predictions: Prediction[];
  modelMetrics: ModelMetric[];
}

export function PredictionsPanel({ predictions, modelMetrics }: PredictionsPanelProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-[#EF233C] bg-[#EF233C]/10 border-[#EF233C]';
      case 'high':
        return 'text-[#FF6B6B] bg-[#FF6B6B]/10 border-[#FF6B6B]';
      case 'moderate':
        return 'text-[#FFD60A] bg-[#FFD60A]/10 border-[#FFD60A]';
      default:
        return 'text-[#06D6A0] bg-[#06D6A0]/10 border-[#06D6A0]';
    }
  };

  const getHorizonLabel = (horizon: string) => {
    switch (horizon) {
      case '30min':
        return '30 minutes';
      case '1hour':
        return '1 hour';
      case '3hours':
        return '3 hours';
      case '6hours':
        return '6 hours';
      default:
        return horizon;
    }
  };

  const sortedPredictions = [...predictions].sort((a, b) => b.probability - a.probability);
  const topPredictions = sortedPredictions.slice(0, 6);

  return (
    <div className="w-96 bg-[#0B0F1A]/80 backdrop-blur-md border-l border-[#1E293B] p-4 space-y-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#00B4D8] uppercase text-xs font-bold tracking-wider flex items-center gap-2">
          <Brain className="w-4 h-4" />
          AI Predictions
        </h2>
        <div className="flex items-center gap-1 text-xs text-[#06D6A0]">
          <div className="w-2 h-2 rounded-full bg-[#06D6A0] animate-pulse" />
          <span>Live</span>
        </div>
      </div>

      <div className="glass-card p-4 rounded-xl">
        <h3 className="text-[#E0E0E0] text-sm font-semibold mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-[#00B4D8]" />
          Model Performance
        </h3>
        <div className="space-y-3">
          {modelMetrics.slice(0, 4).map((metric) => (
            <div key={metric.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#E0E0E0]">{metric.model_name.replace('Model', '')}</span>
                <span className="text-xs font-bold text-[#06D6A0]">
                  {metric.accuracy.toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#06D6A0] transition-all duration-500"
                  style={{ width: `${metric.accuracy}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[#E0E0E0] text-sm font-semibold flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#FFD60A]" />
          High-Risk Forecasts
        </h3>

        {topPredictions.map((prediction) => (
          <div
            key={prediction.id}
            className={`glass-card p-4 rounded-xl border ${getSeverityColor(prediction.predicted_severity)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold uppercase">
                    {prediction.hazard_type}
                  </span>
                  <span className="text-xs opacity-60">
                    {prediction.zone}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs opacity-80 mb-2">
                  <Clock className="w-3 h-3" />
                  <span>{getHorizonLabel(prediction.prediction_horizon)}</span>
                </div>

                <div className="space-y-1 mb-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="opacity-60">Probability</span>
                    <span className="font-bold">{Math.round(prediction.probability)}%</span>
                  </div>
                  <div className="h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-current transition-all duration-500"
                      style={{ width: `${prediction.probability}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-60">Confidence</span>
                  <span className="font-bold">{Math.round(prediction.confidence_score)}%</span>
                </div>
              </div>
            </div>

            {prediction.factors && Object.keys(prediction.factors).length > 0 && (
              <div className="mt-3 pt-3 border-t border-current/20">
                <div className="text-xs opacity-60 mb-2">Contributing Factors:</div>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(prediction.factors).slice(0, 3).map(([key, value]) => (
                    <span
                      key={key}
                      className="px-2 py-1 rounded bg-current/10 text-xs"
                    >
                      {key}: {typeof value === 'number' ? value.toFixed(1) : value}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="glass-card p-4 rounded-xl border border-[#00B4D8]/30">
        <div className="text-[#00B4D8] text-xs font-semibold mb-2">SYSTEM STATUS</div>
        <div className="space-y-2 text-xs text-[#E0E0E0]">
          <div className="flex items-center justify-between">
            <span>Active Predictions</span>
            <span className="font-bold text-white">{predictions.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Models Running</span>
            <span className="font-bold text-white">{modelMetrics.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Avg Confidence</span>
            <span className="font-bold text-[#06D6A0]">
              {predictions.length > 0
                ? Math.round(
                    predictions.reduce((sum, p) => sum + p.confidence_score, 0) / predictions.length
                  )
                : 0}
              %
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
