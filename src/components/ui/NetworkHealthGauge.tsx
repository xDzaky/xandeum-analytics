import { useEffect, useState } from 'react';

interface NetworkHealthGaugeProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export default function NetworkHealthGauge({
  value,
  size = 'md',
  showLabel = true,
  animated = true,
}: NetworkHealthGaugeProps) {
  const [displayValue, setDisplayValue] = useState(animated ? 0 : value);

  useEffect(() => {
    if (animated) {
      // Animate from current to target value
      let current = 0;
      const increment = value / 50; // 50 steps
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(current);
        }
      }, 20);
      return () => clearInterval(timer);
    }
    // For non-animated, update directly
    return undefined;
  }, [value, animated]);

  // Size configurations
  const sizes = {
    sm: { width: 120, height: 120, strokeWidth: 8, fontSize: 'text-xl' },
    md: { width: 180, height: 180, strokeWidth: 12, fontSize: 'text-3xl' },
    lg: { width: 240, height: 240, strokeWidth: 16, fontSize: 'text-4xl' },
  };

  const { width, height, strokeWidth, fontSize } = sizes[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayValue / 100) * circumference;

  // Color based on health score
  const getColor = (score: number) => {
    if (score >= 80) return { primary: '#10b981', label: 'Excellent' };
    if (score >= 60) return { primary: '#3b82f6', label: 'Good' };
    if (score >= 40) return { primary: '#f59e0b', label: 'Fair' };
    return { primary: '#ef4444', label: 'Poor' };
  };

  const { primary, label } = getColor(displayValue);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width, height }}>
        {/* Background Circle */}
        <svg className="transform -rotate-90" width={width} height={height}>
          {/* Background track */}
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            fill="none"
            stroke="rgba(75, 85, 99, 0.3)"
            strokeWidth={strokeWidth}
          />
          
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primary} stopOpacity={1} />
              <stop offset="100%" stopColor={primary} stopOpacity={0.6} />
            </linearGradient>
          </defs>
          
          {/* Progress circle */}
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
            style={{ filter: 'drop-shadow(0 0 8px ' + primary + ')' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`font-bold ${fontSize}`} style={{ color: primary }}>
            {Math.round(displayValue)}
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">Health</div>
        </div>

        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-20 animate-pulse"
          style={{ backgroundColor: primary }}
        />
      </div>

      {showLabel && (
        <div className="text-center">
          <div className="text-sm font-medium" style={{ color: primary }}>
            {label}
          </div>
          <div className="text-xs text-gray-500 mt-1">Network Status</div>
        </div>
      )}
    </div>
  );
}
