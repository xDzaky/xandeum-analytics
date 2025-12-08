import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { TrendData } from '../../types';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: TrendData;
  color?: 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'info',
  className,
}: StatsCardProps) {
  const colorClasses = {
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    info: 'bg-info/10 text-info',
  };

  return (
    <div
      className={cn(
        'bg-card rounded-lg border border-gray-800 p-6 hover:border-gray-700 transition-colors',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          
          {trend && (
            <div className="mt-2 flex items-center space-x-1">
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.direction === 'up' ? 'text-success' : 
                  trend.direction === 'down' ? 'text-error' : 
                  'text-gray-400'
                )}
              >
                {trend.direction === 'up' && '↑'}
                {trend.direction === 'down' && '↓'}
                {trend.direction === 'stable' && '→'}
                {trend.percentage !== undefined && ` ${trend.percentage.toFixed(1)}%`}
              </span>
              <span className="text-xs text-gray-500">vs last update</span>
            </div>
          )}
        </div>

        <div className={cn('p-3 rounded-lg', colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
