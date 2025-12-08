/**
 * Version Distribution Chart
 * Shows node version distribution with donut chart
 */

import { useState } from 'react';

interface VersionData {
  version: string;
  count: number;
  percentage: number;
  color: string;
  [key: string]: string | number;
}

export default function VersionDistribution() {
  const [versionData] = useState<VersionData[]>(() => [
    { version: '2.2.0 (current)', count: 21, percentage: 100, color: '#3b82f6' },
  ]);

  const totalNodes = versionData.reduce((sum, v) => sum + v.count, 0);

  return (
    <div className="bg-surface border border-border rounded-xl p-5 flex items-center gap-4 h-full">
      <div className="relative w-20 h-20 shrink-0">
        <svg className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r="32" stroke="#1F1F1F" strokeWidth="8" fill="none" />
          <circle cx="40" cy="40" r="32" stroke="#3b82f6" strokeWidth="8" fill="none" strokeDasharray="200" strokeDashoffset="0" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-xl font-bold text-white">{totalNodes}</span>
          <span className="text-[8px] uppercase text-muted">Nodes</span>
        </div>
      </div>
      <div>
        <h4 className="text-xs font-medium text-white mb-1">Version Distribution</h4>
        <div className="flex items-center gap-2 text-[10px] text-muted">
          <span className="w-2 h-2 rounded-full bg-secondary"></span>
          2.2.0 (current)
        </div>
        <div className="text-[10px] text-muted pl-4">21 (100%)</div>
      </div>
    </div>
  );
}
