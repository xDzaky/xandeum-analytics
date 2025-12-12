/**
 * Real-time Network Activity Monitor
 * Shows live network activity derived from actual API data (nodes + network stats)
 */

import { useState, useEffect, useRef } from 'react';
import { Activity, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import type { PNode, NetworkStats } from '../../types';

interface NetworkEvent {
  id: string;
  type: 'node_join' | 'node_leave' | 'health_change' | 'data_sync';
  message: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'success';
}

interface NetworkActivityProps {
  nodes?: PNode[];
  stats?: NetworkStats;
}

export default function NetworkActivity({ nodes, stats }: NetworkActivityProps) {
  const [events, setEvents] = useState<NetworkEvent[]>([]);
  const [activityLevel, setActivityLevel] = useState(0);
  const [isLive, setIsLive] = useState(true);
  const prevNodesRef = useRef<PNode[] | undefined>(undefined);
  const prevStatsRef = useRef<NetworkStats | undefined>(undefined);

  useEffect(() => {
    if (!isLive || !nodes || nodes.length === 0) return;

    const prevNodes = prevNodesRef.current;
    const prevStats = prevStatsRef.current;
    const now = new Date();
    const newEvents: NetworkEvent[] = [];

    // Detect node joins and returns
    if (prevNodes) {
      const prevMap = new Map(prevNodes.map((n) => [n.id, n]));
      const currentMap = new Map(nodes.map((n) => [n.id, n]));

      nodes.forEach((node) => {
        if (!prevMap.has(node.id)) {
          newEvents.push({
            id: `${node.id}-join-${now.getTime()}`,
            type: 'node_join',
            message: `Node ${node.id.slice(0, 10)}... joined the network`,
            timestamp: now,
            severity: 'success',
          });
        } else {
          const prev = prevMap.get(node.id)!;
          if (prev.status !== node.status && node.status === 'active') {
            newEvents.push({
              id: `${node.id}-back-${now.getTime()}`,
              type: 'node_join',
              message: `Node ${node.id.slice(0, 10)}... came back online`,
              timestamp: now,
              severity: 'success',
            });
          }
        }
      });

      prevNodes.forEach((node) => {
        const current = currentMap.get(node.id);
        if (!current) {
          newEvents.push({
            id: `${node.id}-left-${now.getTime()}`,
            type: 'node_leave',
            message: `Node ${node.id.slice(0, 10)}... left the network`,
            timestamp: now,
            severity: 'warning',
          });
        } else if (node.status === 'active' && current.status !== 'active') {
          newEvents.push({
            id: `${node.id}-offline-${now.getTime()}`,
            type: 'node_leave',
            message: `Node ${node.id.slice(0, 10)}... went offline`,
            timestamp: now,
            severity: 'warning',
          });
        }
      });
    }

    // Detect health changes
    if (stats && prevStats) {
      const delta = stats.networkHealth - prevStats.networkHealth;
      if (Math.abs(delta) >= 0.5) {
        newEvents.push({
          id: `health-${now.getTime()}`,
          type: 'health_change',
          message: `Network health ${delta >= 0 ? 'improved' : 'degraded'} to ${stats.networkHealth.toFixed(1)}% (Δ${delta.toFixed(1)})`,
          timestamp: now,
          severity: delta >= 0 ? 'success' : 'warning',
        });
      }
    }

    if (newEvents.length > 0) {
      setEvents((prev) => [...newEvents, ...prev].slice(0, 50));
      const joinCount = newEvents.filter((e) => e.type === 'node_join').length;
      const leaveCount = newEvents.filter((e) => e.type === 'node_leave').length;
      const healthCount = newEvents.filter((e) => e.type === 'health_change').length;
      const base = stats ? (stats.activeNodes / Math.max(1, stats.totalNodes)) * 70 : 40;
      setActivityLevel(Math.min(100, base + (joinCount + leaveCount) * 8 + healthCount * 5));
    }

    prevNodesRef.current = nodes;
    prevStatsRef.current = stats;
  }, [nodes, stats, isLive]);

  const getEventIcon = (type: NetworkEvent['type']) => {
    switch (type) {
      case 'node_join':
        return <TrendingUp className="w-3 h-3" />;
      case 'node_leave':
        return <TrendingDown className="w-3 h-3" />;
      case 'health_change':
        return <Activity className="w-3 h-3" />;
      case 'data_sync':
        return <Zap className="w-3 h-3" />;
    }
  };

  const getEventColor = (severity: NetworkEvent['severity']) => {
    switch (severity) {
      case 'success':
        return 'text-green-500 border-green-500/20 bg-green-500/5';
      case 'warning':
        return 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5';
      default:
        return 'text-blue-500 border-blue-500/20 bg-blue-500/5';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-muted'}`}></div>
          <h3 className="text-xs font-medium text-white tracking-widest uppercase">
            {isLive ? 'LIVE' : 'PAUSED'} Activity
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEvents([])}
            className="px-2 py-1 rounded text-xs transition-colors bg-white/5 text-muted hover:bg-white/10 hover:text-white"
            title="Clear events"
          >
            Clear
          </button>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              isLive
                ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
            }`}
            title={isLive ? 'Pause monitoring' : 'Resume monitoring'}
          >
            {isLive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      {/* Activity Meter */}
      <div className="mb-4 shrink-0">
        <div className="flex items-center justify-between text-[10px] text-muted mb-1">
          <span>Network Activity Level</span>
          <span>{activityLevel.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-500"
            style={{ width: `${activityLevel}%` }}
          />
        </div>
      </div>

      {/* Event Stream - Fixed height with scroll */}
      <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar flex-1">
        {events.length === 0 && (
          <div className="text-center py-8 text-muted text-xs">
            {isLive ? 'Monitoring network activity...' : 'Activity monitoring paused'}
          </div>
        )}

        {events.map((event) => (
          <div
            key={event.id}
            className={`flex gap-3 p-2.5 rounded-lg border transition-all animate-fadeIn ${getEventColor(
              event.severity
            )}`}
          >
            <div className="shrink-0 mt-0.5">{getEventIcon(event.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white leading-relaxed">{event.message}</p>
              <p className="text-[10px] text-muted mt-0.5">
                {event.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="mt-4 pt-4 border-t border-border grid grid-cols-4 gap-2 text-center shrink-0">
        <div>
          <div className="text-xs font-bold text-green-500">
            {events.filter(e => e.type === 'node_join').length}
          </div>
          <div className="text-[9px] text-muted">Joins</div>
        </div>
        <div>
          <div className="text-xs font-bold text-yellow-500">
            {events.filter(e => e.type === 'node_leave').length}
          </div>
          <div className="text-[9px] text-muted">Leaves</div>
        </div>
        <div>
          <div className="text-xs font-bold text-blue-500">
            {events.filter(e => e.type === 'health_change').length}
          </div>
          <div className="text-[9px] text-muted">Health</div>
        </div>
        <div>
          <div className="text-xs font-bold text-purple-500">
            {events.filter(e => e.type === 'data_sync').length}
          </div>
          <div className="text-[9px] text-muted">Syncs</div>
        </div>
      </div>
    </div>
  );
}
