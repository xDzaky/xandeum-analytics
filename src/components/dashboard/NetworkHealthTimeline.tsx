/**
 * Network Health Overtime Chart
 * Shows network health degradation over time with clickable time periods
 */

import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { historicalDataService } from '../../services/historicalData';

type TimePeriod = '1h' | '6h' | '24h' | '7d';

interface ChartDataPoint {
  time: string;
  health: number;
  timestamp: number;
}

export default function NetworkHealthTimeline() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('24h');

  // Get historical data based on selected period
  const { chartData, stats } = useMemo(() => {
    const hours = selectedPeriod === '1h' ? 1 : 
                  selectedPeriod === '6h' ? 6 : 
                  selectedPeriod === '24h' ? 24 : 
                  168; // 7 days

    const snapshots = historicalDataService.getSnapshots(hours);
    const periodStats = historicalDataService.getStats(hours);

    // Transform snapshots to chart data
    const data: ChartDataPoint[] = snapshots.map(snapshot => {
      const date = new Date(snapshot.timestamp);
      let timeFormat = '';

      if (selectedPeriod === '1h') {
        // Show minutes for 1 hour
        timeFormat = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      } else if (selectedPeriod === '6h') {
        // Show hours for 6 hours
        timeFormat = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      } else if (selectedPeriod === '24h') {
        // Show hours for 24 hours
        timeFormat = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      } else {
        // Show day and hour for 7 days
        timeFormat = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit' });
      }

      return {
        time: timeFormat,
        health: snapshot.health,
        timestamp: snapshot.timestamp,
      };
    });

    return {
      chartData: data,
      stats: periodStats,
    };
  }, [selectedPeriod]);

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
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.3} />
          <XAxis 
            dataKey="time" 
            stroke="#737373" 
            style={{ fontSize: '10px' }}
            tick={{ fill: '#737373' }}
            interval={selectedPeriod === '1h' ? 4 : selectedPeriod === '6h' ? 5 : 7}
          />
          <YAxis 
            stroke="#737373" 
            style={{ fontSize: '10px' }}
            domain={[60, 100]}
            tick={{ fill: '#737373' }}
            ticks={[60, 70, 80, 90, 100]}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: '#0A0A0A', 
              border: '1px solid #1F1F1F', 
              borderRadius: '8px',
              fontSize: '12px',
              color: '#e5e5e5'
            }}
            labelStyle={{ color: '#737373' }}
            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Health']}
          />
          <Area 
            type="monotone" 
            dataKey="health" 
            stroke="#3b82f6" 
            strokeWidth={2}
            fill="url(#healthGradient)" 
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border/50 text-xs font-mono text-muted">
        <div>Avg: <span className="text-white">{stats.avg > 0 ? Math.round(stats.avg) : '--'}</span></div>
        <div>Min: <span className="text-white">{stats.min > 0 ? Math.round(stats.min) : '--'}</span></div>
        <div>Max: <span className="text-white">{stats.max > 0 ? Math.round(stats.max) : '--'}</span></div>
        <div className="flex-1 text-right text-muted/50">{chartData.length} data points</div>
      </div>
    </div>
  );
}
