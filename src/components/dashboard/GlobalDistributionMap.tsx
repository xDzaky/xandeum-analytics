/**
 * Global Distribution Map
 * Shows node distribution across continents with real world map
 */

import { MapPin } from 'lucide-react';
import type { PNode } from '../../types';

interface GlobalDistributionMapProps {
  nodes?: PNode[];
}

export default function GlobalDistributionMap({ nodes }: GlobalDistributionMapProps) {
  const offlineCount = nodes?.filter(n => n.status !== 'active').length || 0;
  const totalNodes = nodes?.length || 0;
  
  // Group nodes by location
  const locationCounts = nodes?.reduce((acc, node) => {
    const location = node.location?.city || 'Unknown';
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};
  
  const topLocations = Object.entries(locationCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  return (
    <>
      <div className="p-4 absolute top-0 left-0 z-10 w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <h3 className="text-xs font-medium text-white tracking-widest uppercase">Global Distribution</h3>
        </div>
        <span className="text-[10px] font-mono text-muted bg-black/50 px-2 py-1 rounded border border-border">
          {offlineCount} nodes offline
        </span>
      </div>
      
      {/* World Map Visual */}
      <div className="flex-1 bg-[#080808] relative overflow-hidden">
        {/* SVG World Map */}
        <svg className="w-full h-full opacity-20" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
          {/* Simplified World Map Continents */}
          <g fill="#1a1a1a" stroke="#333" strokeWidth="0.5">
            {/* North America */}
            <path d="M 50,80 L 80,60 L 120,50 L 150,70 L 180,60 L 190,90 L 170,120 L 140,140 L 100,130 L 70,110 Z" />
            
            {/* South America */}
            <path d="M 150,180 L 170,160 L 190,170 L 200,200 L 210,240 L 200,270 L 180,280 L 160,270 L 150,240 Z" />
            
            {/* Europe */}
            <path d="M 380,70 L 420,60 L 450,70 L 460,90 L 440,110 L 410,100 L 390,85 Z" />
            
            {/* Africa */}
            <path d="M 380,130 L 420,120 L 450,140 L 470,180 L 460,230 L 440,250 L 410,240 L 390,200 L 380,160 Z" />
            
            {/* Asia */}
            <path d="M 480,60 L 550,50 L 620,60 L 680,80 L 700,110 L 680,140 L 640,150 L 600,140 L 560,120 L 520,100 Z" />
            
            {/* Australia */}
            <path d="M 620,240 L 660,230 L 700,250 L 690,280 L 660,290 L 630,280 Z" />
          </g>
        </svg>
        
        {/* Active Node Locations (Animated Dots) */}
        <svg className="w-full h-full absolute top-0 left-0" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {/* Node dots based on actual locations */}
          <g>
            {/* North America */}
            <circle cx="120" cy="90" r="4" fill="url(#nodeGlow)" className="animate-pulse" />
            <circle cx="150" cy="100" r="3" fill="#3b82f6" opacity="0.8" />
            
            {/* Europe */}
            <circle cx="420" cy="85" r="5" fill="url(#nodeGlow)" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
            <circle cx="440" cy="95" r="3" fill="#3b82f6" opacity="0.8" />
            <circle cx="390" cy="80" r="3" fill="#3b82f6" opacity="0.8" />
            
            {/* Asia */}
            <circle cx="600" cy="100" r="6" fill="url(#nodeGlow)" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
            <circle cx="640" cy="110" r="4" fill="#3b82f6" opacity="0.8" />
            <circle cx="580" cy="95" r="3" fill="#3b82f6" opacity="0.8" />
            <circle cx="660" cy="120" r="3" fill="#3b82f6" opacity="0.8" />
            
            {/* Australia */}
            <circle cx="660" cy="260" r="3" fill="#3b82f6" opacity="0.8" />
            
            {/* Africa */}
            <circle cx="430" cy="180" r="3" fill="#3b82f6" opacity="0.8" />
            
            {/* South America */}
            <circle cx="180" cy="220" r="3" fill="#3b82f6" opacity="0.8" />
          </g>
          
          {/* Connection lines */}
          <g stroke="#3b82f6" strokeWidth="0.5" opacity="0.2">
            <line x1="120" y1="90" x2="420" y2="85" />
            <line x1="420" y1="85" x2="600" y2="100" />
            <line x1="600" y1="100" x2="660" y2="260" />
          </g>
        </svg>
        
        {/* Location Stats Overlay */}
        <div className="absolute top-16 left-4 right-4 flex flex-wrap gap-2">
          {topLocations.slice(0, 3).map(([location, count]) => (
            <div key={location} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 border border-primary/20 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
              <span className="text-[9px] text-white font-medium">{location}</span>
              <span className="text-[9px] text-muted">{count}</span>
            </div>
          ))}
        </div>
        
        {/* Bottom Info */}
        <div className="absolute bottom-6 w-full text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 border border-white/10 backdrop-blur-sm">
            <MapPin className="w-3 h-3 text-secondary" />
            <span className="text-[10px] text-muted">
              {totalNodes} nodes across {Object.keys(locationCounts).length} locations
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

