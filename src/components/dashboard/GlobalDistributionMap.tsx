/**
 * Global Distribution
 * Shows node distribution by location in a simple, clear format
 */

import { MapPin, Globe2, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import type { PNode } from '../../types';

interface GlobalDistributionMapProps {
  nodes?: PNode[];
}

interface LocationStats {
  city: string;
  country: string;
  totalNodes: number;
  activeNodes: number;
  offlineNodes: number;
  percentage: number;
}

export default function GlobalDistributionMap({ nodes }: GlobalDistributionMapProps) {
  const totalNodes = nodes?.length || 0;

  // Group nodes by location
  const locationStats = useMemo(() => {
    if (!nodes) return [];
    
    const locationMap = new Map<string, LocationStats>();
    
    nodes.forEach(node => {
      if (node.location) {
        const key = `${node.location.city}, ${node.location.country}`;
        const existing = locationMap.get(key);
        
        if (existing) {
          existing.totalNodes++;
          if (node.status === 'active') {
            existing.activeNodes++;
          } else {
            existing.offlineNodes++;
          }
        } else {
          locationMap.set(key, {
            city: node.location.city,
            country: node.location.country,
            totalNodes: 1,
            activeNodes: node.status === 'active' ? 1 : 0,
            offlineNodes: node.status !== 'active' ? 1 : 0,
            percentage: 0,
          });
        }
      }
    });
    
    const locations = Array.from(locationMap.values());
    
    // Calculate percentages
    locations.forEach(loc => {
      loc.percentage = (loc.totalNodes / totalNodes) * 100;
    });
    
    // Sort by total nodes descending
    return locations.sort((a, b) => b.totalNodes - a.totalNodes);
  }, [nodes, totalNodes]);

  const totalLocations = locationStats.length;
  const activeCount = nodes?.filter(n => n.status === 'active').length || 0;
  const offlineCount = totalNodes - activeCount;

  return (
    <>
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-medium text-white tracking-widest uppercase">Global Distribution</h3>
          </div>
          <div className="text-[10px] text-muted">
            {totalLocations} {totalLocations === 1 ? 'location' : 'locations'}
          </div>
        </div>
      </div>

      {/* Location List */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {locationStats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <MapPin className="w-8 h-8 text-muted/30 mb-2" />
            <p className="text-xs text-muted">No location data available</p>
          </div>
        ) : (
          <div className="space-y-2">
            {locationStats.map((location, index) => (
              <div 
                key={`${location.city}-${location.country}`}
                className="group relative bg-surface/50 hover:bg-surface border border-border/30 hover:border-border-light rounded-lg p-3 transition-all cursor-pointer"
              >
                {/* Rank Badge */}
                <div className="absolute -left-1 -top-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[9px] font-bold text-black">
                  {index + 1}
                </div>

                <div className="flex items-start justify-between gap-3">
                  {/* Location Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-3 h-3 text-muted flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white truncate">
                          {location.city}
                        </div>
                        <div className="text-[10px] text-muted truncate">
                          {location.country}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] text-muted">Distribution</span>
                        <span className="text-[9px] text-white font-mono">
                          {location.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-border/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                          style={{ width: `${location.percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-3 mt-2 text-[10px]">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        <span className="text-green-500 font-mono">{location.activeNodes}</span>
                        <span className="text-muted">online</span>
                      </div>
                      {location.offlineNodes > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                          <span className="text-red-500 font-mono">{location.offlineNodes}</span>
                          <span className="text-muted">offline</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Node Count */}
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-2xl font-bold text-white font-mono">
                      {location.totalNodes}
                    </div>
                    <div className="text-[9px] text-muted uppercase">
                      {location.totalNodes === 1 ? 'node' : 'nodes'}
                    </div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="px-4 py-3 border-t border-border/50 bg-black/20">
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-muted">Online</span>
              <span className="text-green-500 font-mono font-medium">{activeCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-muted">Offline</span>
              <span className="text-red-500 font-mono font-medium">{offlineCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-muted">
            <TrendingUp className="w-3 h-3" />
            <span>{totalLocations} locations</span>
          </div>
        </div>
      </div>
    </>
  );
}
