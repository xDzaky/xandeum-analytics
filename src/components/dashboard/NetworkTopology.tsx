/**
 * Network Topology Visualization
 * Visual representation of node connections and distribution
 */

import { useMemo } from 'react';
import type { PNode } from '../../types';

interface NetworkTopologyProps {
  nodes?: PNode[];
}

export default function NetworkTopology({ nodes }: NetworkTopologyProps) {
  const topology = useMemo(() => {
    if (!nodes) return null;

    // Group nodes by location
    const locationGroups = nodes.reduce((acc, node) => {
      const location = node.location?.country || 'Unknown';
      if (!acc[location]) {
        acc[location] = [];
      }
      acc[location].push(node);
      return acc;
    }, {} as Record<string, PNode[]>);

    // Get top 8 locations
    const topLocations = Object.entries(locationGroups)
      .sort(([, a], [, b]) => b.length - a.length)
      .slice(0, 8);

    // Calculate positions in a circle
    const positions = topLocations.map(([country, locationNodes], index) => {
      const angle = (index / topLocations.length) * 2 * Math.PI - Math.PI / 2;
      const radius = 35; // percentage
      const x = 50 + radius * Math.cos(angle);
      const y = 50 + radius * Math.sin(angle);
      
      return {
        country,
        nodeCount: locationNodes.length,
        activeCount: locationNodes.filter(n => n.status === 'active').length,
        x,
        y,
        angle,
      };
    });

    return { positions, totalNodes: nodes.length };
  }, [nodes]);

  if (!topology) return null;

  const { positions, totalNodes } = topology;

  return (
    <div className="bg-surface border border-border rounded-xl p-5 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        <h3 className="text-xs font-medium text-white tracking-widest uppercase">
          Network Topology
        </h3>
      </div>

      {/* Visualization */}
      <div className="relative w-full aspect-square max-w-md mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Center node (Network Core) */}
          <g>
            <circle
              cx="50"
              cy="50"
              r="8"
              className="fill-primary/20 stroke-primary"
              strokeWidth="0.5"
            />
            <circle
              cx="50"
              cy="50"
              r="5"
              className="fill-primary animate-pulse"
            />
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white text-[3px] font-bold"
            >
              CORE
            </text>
          </g>

          {/* Connections from center to regions */}
          {positions.map((pos, index) => (
            <line
              key={`line-${index}`}
              x1="50"
              y1="50"
              x2={pos.x}
              y2={pos.y}
              className="stroke-border"
              strokeWidth="0.2"
              strokeDasharray="1,1"
              opacity="0.5"
            />
          ))}

          {/* Regional nodes */}
          {positions.map((pos, index) => {
            const size = Math.min(2 + (pos.nodeCount / totalNodes) * 10, 6);
            const health = pos.activeCount / pos.nodeCount;
            const color = health > 0.8 ? '#10b981' : health > 0.5 ? '#f59e0b' : '#ef4444';
            
            return (
              <g key={`node-${index}`}>
                {/* Outer ring (total nodes) */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={size + 1}
                  className="fill-none"
                  stroke={color}
                  strokeWidth="0.3"
                  opacity="0.3"
                />
                {/* Inner circle (active nodes) */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={size}
                  fill={color}
                  opacity="0.8"
                >
                  <animate
                    attributeName="opacity"
                    values="0.6;1;0.6"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
                {/* Node count */}
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-white text-[2px] font-bold"
                >
                  {pos.nodeCount}
                </text>
                {/* Country label */}
                <text
                  x={pos.x}
                  y={pos.y + size + 3}
                  textAnchor="middle"
                  className="fill-white text-[2.5px] font-medium"
                >
                  {pos.country}
                </text>
              </g>
            );
          })}

          {/* Animated pulse rings */}
          <circle
            cx="50"
            cy="50"
            r="15"
            className="fill-none stroke-primary/30"
            strokeWidth="0.2"
          >
            <animate
              attributeName="r"
              from="15"
              to="45"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from="0.5"
              to="0"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-[10px]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-muted">Healthy (&gt;80%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <span className="text-muted">Warning (50-80%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span className="text-muted">Critical (&lt;50%)</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-sm font-bold text-white">{positions.length}</div>
          <div className="text-[10px] text-muted">Regions</div>
        </div>
        <div>
          <div className="text-sm font-bold text-white">{totalNodes}</div>
          <div className="text-[10px] text-muted">Total Nodes</div>
        </div>
        <div>
          <div className="text-sm font-bold text-white">
            {Math.round((positions.reduce((sum, p) => sum + p.activeCount, 0) / totalNodes) * 100)}%
          </div>
          <div className="text-[10px] text-muted">Avg Health</div>
        </div>
      </div>
    </div>
  );
}
