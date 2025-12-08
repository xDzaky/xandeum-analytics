/**
 * Global Distribution Map
 * Shows node distribution across continents with abstract map design
 */

import { MapPin } from 'lucide-react';

export default function GlobalDistributionMap() {
  return (
    <>
      <div className="p-4 absolute top-0 left-0 z-10 w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <h3 className="text-xs font-medium text-white tracking-widest uppercase">Global Distribution</h3>
        </div>
        <span className="text-[10px] font-mono text-muted bg-black/50 px-2 py-1 rounded border border-border">0 nodes offline</span>
      </div>
      
      {/* Map Visual (Abstract Dots) */}
      <div className="flex-1 bg-[#080808] relative">
        {/* Abstract World Map SVG */}
        <svg className="w-full h-full opacity-30" viewBox="0 0 400 200">
          {/* Rough continents via dots */}
          <g fill="#333">
            {/* North America */}
            <circle cx="60" cy="50" r="1.5" />
            <circle cx="70" cy="55" r="1.5" />
            <circle cx="80" cy="50" r="1.5" />
            <circle cx="65" cy="65" r="1.5" />
            <circle cx="75" cy="60" r="1.5" />
            <circle cx="90" cy="55" r="1.5" />
            {/* Europe */}
            <circle cx="190" cy="45" r="1.5" />
            <circle cx="200" cy="50" r="1.5" />
            <circle cx="210" cy="45" r="1.5" />
            <circle cx="195" cy="55" r="1.5" />
            <circle cx="205" cy="60" r="1.5" />
            {/* Asia */}
            <circle cx="260" cy="50" r="1.5" />
            <circle cx="280" cy="60" r="1.5" />
            <circle cx="300" cy="55" r="1.5" />
            <circle cx="270" cy="70" r="1.5" />
            <circle cx="290" cy="65" r="1.5" />
            <circle cx="310" cy="60" r="1.5" />
          </g>
          {/* Active Nodes (Animated) */}
          <g fill="#3b82f6">
            <circle cx="75" cy="60" className="map-dot" />
            <circle cx="200" cy="50" className="map-dot" style={{ animationDelay: '0.5s' }} />
            <circle cx="300" cy="55" className="map-dot" style={{ animationDelay: '1s' }} />
            <circle cx="290" cy="140" className="map-dot" style={{ animationDelay: '0.2s' }} /> {/* Australia */}
            <circle cx="130" cy="130" className="map-dot" style={{ animationDelay: '0.8s' }} /> {/* South America */}
          </g>
        </svg>
        
        {/* Overlay Text */}
        <div className="absolute bottom-6 w-full text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 border border-white/10 backdrop-blur-sm">
            <MapPin className="w-3 h-3 text-secondary" />
            <span className="text-[10px] text-muted">Unable to locate 2 nodes accurately</span>
          </div>
        </div>
      </div>
    </>
  );
}

