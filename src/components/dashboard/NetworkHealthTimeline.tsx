/**
 * Network Health Overtime Chart
 * Shows network health degradation over time with clickable time periods
 */

import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';
import { historicalDataService } from '../../services/historicalData';

type TimePeriod = '1h' | '6h' | '24h' | '7d';

// Warning threshold - health below this value will trigger warning
const WARNING_THRESHOLD = 75;

interface ChartDataPoint {
  health: number;
  timestamp: number;
}

export default function NetworkHealthTimeline() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('24h');

  // Get historical data based on selected period
  const { chartData, stats, hours } = useMemo(() => {
    const hours = selectedPeriod === '1h' ? 1 : 
                  selectedPeriod === '6h' ? 6 : 
                  selectedPeriod === '24h' ? 24 : 
                  168; // 7 days

    const snapshots = historicalDataService.getSnapshots(hours);
    const stats = historicalDataService.getStatsFromSnapshots(snapshots);

    // Keep charts readable by limiting points while preserving the latest point
    const maxPoints = selectedPeriod === '1h' ? 120 : selectedPeriod === '6h' ? 160 : selectedPeriod === '24h' ? 200 : 240;
    const downsampled = historicalDataService.downsample(snapshots, maxPoints);

    const data: ChartDataPoint[] = downsampled.map(snapshot => ({
      timestamp: snapshot.timestamp,
      health: snapshot.health,
    }));

    return {
      chartData: data,
      stats,
      hours,
    };
  }, [selectedPeriod]);

  // Check if current health is below warning threshold
  const isWarning = chartData.length > 0 && chartData[chartData.length - 1].health < WARNING_THRESHOLD;

  // Dynamic Y axis for better readability with padding
  const paddedMin = Math.max(0, Math.floor((stats.min || 60) - 5));
  const paddedMax = Math.min(100, Math.ceil((stats.max || 100) + 5));
  const yDomain: [number, number] = [Math.min(60, paddedMin), Math.max(80, paddedMax)];

  const formatTick = (value: number) => {
    const date = new Date(value);
    if (selectedPeriod === '7d') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    if (selectedPeriod === '24h') {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    }
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (!active || !payload || !payload.length) return null;

    const health = payload[0].value as number;
    const delta = health - WARNING_THRESHOLD;
    const status = health < WARNING_THRESHOLD ? 'Below threshold' : 'Above threshold';
    const date = new Date(payload[0].payload.timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <div className="rounded-lg border border-border bg-surface/80 px-3 py-2 shadow-lg backdrop-blur">
        <div className="text-[11px] text-muted">{date}</div>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-white">{health.toFixed(1)}%</span>
          <span className={`text-[11px] ${delta < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {delta >= 0 ? '+' : ''}
            {delta.toFixed(1)} vs {WARNING_THRESHOLD}%
          </span>
        </div>
        <div className="text-[11px] text-muted mt-0.5">{status}</div>
      </div>
    );
  };

  const periods: { value: TimePeriod; label: string }[] = [
    { value: '1h', label: '1h' },
    { value: '6h', label: '6h' },
    { value: '24h', label: '24h' },
    { value: '7d', label: '7d' },
  ];

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-sm font-medium text-white flex items-center gap-2">
            Network Health Over Time 
            <span className="bg-error/10 text-error border border-error/20 text-[10px] px-1.5 py-0.5 rounded font-mono">
              {stats.avg > 0 ? `${(stats.max - stats.min).toFixed(0)} pts` : 'Loading...'}
            </span>
          </h2>
        </div>
        <div className="flex bg-black/40 rounded-lg p-0.5 border border-border/50">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`px-3 py-1 text-[10px] font-medium rounded transition-colors ${
                selectedPeriod === period.value
                  ? 'bg-white/10 text-white shadow-sm border border-white/5'
                  : 'hover:bg-white/5 text-muted hover:text-white'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 5, right: 12, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="warningGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <ReferenceArea
            y1={0}
            y2={WARNING_THRESHOLD}
            fill="#ef4444"
            fillOpacity={0.04}
            strokeOpacity={0}
          />
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.35} vertical={false} />
          <XAxis
            dataKey="timestamp"
            type="number"
            stroke="#737373"
            style={{ fontSize: '10px' }}
            tick={{ fill: '#737373' }}
            tickFormatter={formatTick}
            domain={['dataMin', 'dataMax']}
            tickLine={false}
            axisLine={{ stroke: '#2a2a2a' }}
            minTickGap={16}
          />
          <YAxis
            stroke="#737373"
            style={{ fontSize: '10px' }}
            domain={yDomain}
            tick={{ fill: '#737373' }}
            ticks={[60, 70, 80, 90, 100].filter((t) => t >= yDomain[0] && t <= yDomain[1])}
            tickLine={false}
            axisLine={{ stroke: '#2a2a2a' }}
          />
          {/* Warning threshold line */}
          <ReferenceLine 
            y={WARNING_THRESHOLD} 
            stroke="#ef4444" 
            strokeDasharray="5 5" 
            strokeWidth={2}
            label={{ 
              value: `Warning Threshold (${WARNING_THRESHOLD})`, 
              position: 'insideTopRight',
              fill: '#ef4444',
              fontSize: 10,
              offset: 10
            }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: '#ffffff', strokeWidth: 0.5, strokeDasharray: '4 4', opacity: 0.3 }}
          />
          <Area 
            type="monotone" 
            dataKey="health" 
            stroke={isWarning ? "#ef4444" : "#3b82f6"} 
            strokeWidth={2}
            fill={isWarning ? "url(#warningGradient)" : "url(#healthGradient)"} 
            animationDuration={800}
            dot={chartData.length < 80 ? { r: 2.5, strokeWidth: 1, stroke: '#0f172a', fill: isWarning ? '#f87171' : '#60a5fa' } : false}
            activeDot={{ r: 4, strokeWidth: 0, fill: '#ffffff', stroke: isWarning ? '#f87171' : '#60a5fa' }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border/50 text-xs font-mono text-muted">
        <div>Avg: <span className="text-white">{stats.avg > 0 ? Math.round(stats.avg) : '--'}</span></div>
        <div>Min: <span className={stats.min < WARNING_THRESHOLD ? "text-red-500" : "text-white"}>{stats.min > 0 ? Math.round(stats.min) : '--'}</span></div>
        <div>Max: <span className="text-white">{stats.max > 0 ? Math.round(stats.max) : '--'}</span></div>
        {isWarning && (
          <div className="flex items-center gap-1.5 text-red-500">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            <span>Below threshold</span>
          </div>
        )}
        <div className="flex-1 text-right text-muted/50">
          {chartData.length} pts · last {hours >= 24 ? `${Math.round(hours / 24)}d` : `${hours}h`}
        </div>
      </div>
    </div>
  );
}
